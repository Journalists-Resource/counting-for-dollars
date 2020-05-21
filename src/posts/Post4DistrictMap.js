import React, { Component } from 'react'
import '../App.css'
import mapboxgl from 'mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '../css/mapbox-gl-geocoder.css'
import { csv, json } from 'd3-fetch'
import { min } from 'd3-array'
import formatMoney from '../components/FormatMoney'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { ChartHeader, ChartFooter } from '../components/ChartMeta'
import { bucketScale } from '../components/ColorSchemes'


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
const colorScale = bucketScale
const levels = ["fiscal_cost_low_risk", "fiscal_cost_med_risk", "fiscal_cost_high_risk"]
const avg = 1546.48
const width = min([900, window.innerWidth]);


class Post4DistrictMap extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            slice: "Title I funds per low-income child",
            data: [],
            lng: -98.58,
            lat: 39.83,
            zoom: 3,
            scale: colorScale
        };
    }

    handleClick(e) {
        var actives = document.getElementsByClassName("active");
        for(var i = 0; i < actives.length; i++) {
            actives[i].classList.add("inactive");
            actives[i].classList.remove("active");
        }
        for(var ll = 0; ll < levels.length; ll++) {
            this.state.map.setLayoutProperty('district-data-' + levels[ll], 'visibility', 'none');
        }
        document.getElementById("button_" + e).classList.add("active");
        this.setState({
            slice: e
        })
        this.state.map.setLayoutProperty('district-data-' + e, 'visibility', 'visible');
    }

    componentWillMount() {
        // csv("datasets/map-and-table-title-i-grants-per-state-per-child.csv").then(data => {
        //   this.setState({data: data});
        // });
    }

    componentDidMount() {
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/light-v10',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        this.setState({
            map: map
        })

        map.on('load', () => {

            map.addSource('districts', {
                type: 'vector',
                url: 'mapbox://tylermachado.9ifw2bln'
            });

            map.addSource('statelines', {
                type: 'vector',
                url: 'mapbox://tylermachado.d9wh29pp'
            });

            csv("datasets/joined_school_dist_2018_update.csv")
            .then(dataset => {
                var expression = [
                    'match',
                    ['get', 'GEOID']
                ];

                colorScale.domain(dataset.map(function(row,i) {
                    return parseFloat(row["Title I funds per low-income child"])
                }, this))

                dataset.map(function(row,i) {
                    let id = ""

                    if (row["LEA_id"].length === 6) {
                        id = "0".concat(row["LEA_id"])
                    } else {
                        id = row["LEA_id"]
                    }

                    let number = parseFloat(row["Title I funds per low-income child"]) ;
                    expression.push(id, ((isNaN(number) || number == 0) ? 'gainsboro' : colorScale(number)))
                }, this)

                expression.push('gainsboro')

                map.addLayer({
                    'id': 'district-data',
                    'type': 'fill',
                    'source': 'districts',
                    'source-layer': 'edge_04p-37il12',
                    'paint': {
                        'fill-color': expression,
                        'fill-opacity': 0.9,
                        'fill-outline-color': '#aaa'
                    },
                    'layout': {
                        'visibility': 'none'
                    }
                });

                map.addLayer({
                    'id': 'statelines-data',
                    'type': 'line',
                    'source': 'statelines',
                    'source-layer': 'states_21basic-bmxanm',
                    'paint': {
                        'line-width': 1,
                        'line-color': '#222222'
                    }
                });

                map.on('click', 'district-data', function(e) {
                    let districtdata = dataset.filter(d => {
                        if (e.features[0].properties.GEOID.substr(0,1) == 0) {
                            return d.LEA_id == e.features[0].properties.GEOID.substr(1,7)
                        } else {
                            return d.LEA_id == e.features[0].properties.GEOID
                        }
                    })[0]

                    let anchor = null;
                    if (e.point.x > (width/2)) {
                        anchor = "right"
                    }

                    new mapboxgl.Popup({anchor: anchor})
                    .setMaxWidth("400px")
                    .setLngLat(e.lngLat)
                    .setHTML(
                        "<h3>" + districtdata["School district"] + ", " + districtdata["State"] + "</h3>" +
                        "<br/>Title I funding to district: <b>" + formatMoney(districtdata["Title I funding in FY2018"]) +
                        "<br/></b>Title I funding per low-income child: <b>" + formatMoney(districtdata["Title I funds per low-income child"]) +
                        "</b>"
                    )
                    .addTo(map);
                });

                map.setLayoutProperty('district-data', 'visibility', 'visible');

                map.addControl(
                    new MapboxGeocoder({
                        accessToken: mapboxgl.accessToken,
                        mapboxgl: mapboxgl,
                        types: 'region',
                        countries: 'us',
                        marker: false,
                        placeholder: 'Search your state'
                    })
                );

                map.addControl(new mapboxgl.NavigationControl({
                    showCompass: false,
                    showZoom: true
                }));

                this.setState({
                    data: dataset,
                    scale: colorScale
                })
            });

        });

        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        });
    }

    render() {
        const legmargin = {
            vertical: 0,
            textoffset: 48,
            height: 18
        }

        let domain = []

        if (this.state.scale.domain()) {
            domain = this.state.scale.domain()
        }

        const legend = (
            <svg className="districtlegend" width={350} height={50} transform={"translate(0,0)"}>
            <g>

            <text
            y={legmargin.textoffset}
            x={5} fontSize="0.65rem" textAnchor="middle"
            >
            {}
            </text>
            <rect
            width={65} height={legmargin.height} x={0} y={legmargin.height}
            style={{fill: this.state.scale.range()[0]}}
            ></rect>


            <text
            y={legmargin.textoffset}
            x={65} fontSize="0.65rem" textAnchor="middle"
            >
            {"-" + formatMoney(domain[(Math.round(domain.length * 0.2))], "rounded")}
            </text>
            <rect
            width={65} height={legmargin.height} x={70} y={legmargin.height}
            style={{fill: this.state.scale.range()[1]}}
            ></rect>

            <text
            y={legmargin.textoffset}
            x={135} fontSize="0.65rem" textAnchor="middle"
            >
            {formatMoney(domain[(Math.round(domain.length * 0.4))], "rounded")}
            </text>
            <rect
            width={65} height={legmargin.height} x={140} y={legmargin.height}
            style={{fill: this.state.scale.range()[2]}}
            ></rect>

            <text
            y={legmargin.textoffset}
            x={205} fontSize="0.65rem" textAnchor="middle"
            >
            {formatMoney(domain[(Math.round(domain.length * 0.6))], "rounded")}
            </text>
            <rect
            width={65} height={legmargin.height} x={210} y={legmargin.height}
            style={{fill: this.state.scale.range()[3]}}
            ></rect>

            <text
            y={legmargin.textoffset}
            x={280} fontSize="0.65rem" textAnchor="middle"
            >
            {formatMoney(domain[(Math.round(domain.length * 0.8))], "rounded") + "+"}
            </text>
            <rect
            width={65} height={legmargin.height} x={280} y={legmargin.height}
            style={{fill: this.state.scale.range()[4]}}
            ></rect>

            </g>
            </svg>
        )

        return (
            <div className="App">
            <ChartHeader
            title="Title I funds per low-income child by school district in 2018"
            />
            <div ref={el => this.mapContainer = el}  className="mapContainer" />
            {(domain.length > 0) ? legend : ''}
            <ChartFooter credit={<span>Sources: <a href="https://gwipp.gwu.edu/counting-dollars-2020-role-decennial-census-geographic-distribution-federal-funds">“Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds,”</a> U.S. Census Bureau’s SAIPE; Dept. of Education; Mapbox</span>} downloaddata={this.state.data} downloadfilename={"Title I funds per low-income child by school district in 2018"}  />
            </div>
        )
    }
}

export default Post4DistrictMap
