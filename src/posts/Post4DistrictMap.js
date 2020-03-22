import React, { Component } from 'react'
import '../App.css'
import mapboxgl from 'mapbox-gl'
import { csv, json } from 'd3-fetch'
import formatMoney from '../components/FormatMoney'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { ChartHeader, ChartFooter } from '../components/ChartMeta'
import { bucketScale } from '../components/ColorSchemes'


mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const colorScale = bucketScale

const levels = ["fiscal_cost_low_risk", "fiscal_cost_med_risk", "fiscal_cost_high_risk"]


class Post4DistrictMap extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      slice: "fiscal_cost_low_risk",
      data: [],
      lng: -71.22,
      lat: 42.37,
      zoom: 5,
      minZoom: 5,
      maxZoom: 5
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
           url: 'mapbox://tylermachado.789m0h8h'
         });

         csv("datasets/joined_school_dist_scores_final.csv")
         .then(dataset => {

            this.setState({
               data: dataset
            })

            for (var ll=0; ll<levels.length; ll++) {
               var expression = [
                 'match',
                 ['get', 'GEOID']
               ];

               colorScale.domain(dataset.map(function(row,i) {
                return parseFloat(row[levels[ll]])
               }, this))

               dataset.map(function(row,i) {
                  let number = parseFloat(row[levels[ll]])
                  expression.push(row["LEA_id"], (isNaN(number) ? 'gainsboro' : colorScale(number)))
               }, this)

               expression.push('gainsboro')

               map.addLayer({
                 'id': 'district-data-' + levels[ll],
                 'type': 'fill',
                 'source': 'districts',
                 'source-layer': 'schooldistrict_sy1819_tl19_ma-219voa',
                 'paint': {
                    'fill-color': expression,
                    'fill-opacity': 0.7
                 },
                 'layout': {
                    'visibility': 'none'
                 }
               });

               map.on('click', 'district-data-' + levels[ll], function(e) {
                  let districtdata = dataset.filter(d => {return d.LEA_id === e.features[0].properties.GEOID})[0]
                  new mapboxgl.Popup()
                     .setLngLat(e.lngLat)
                     .setHTML("<b>" + districtdata.name + "</b>" +
                        "<br/>Funding change in low risk miscount: " + formatMoney(districtdata["fiscal_cost_low_risk"], "posneg") +
                        "<br/>Funding change in medium risk miscount: " + formatMoney(districtdata["fiscal_cost_med_risk"], "posneg") +
                        "<br/>Funding change in high risk miscount: " + formatMoney(districtdata["fiscal_cost_high_risk"], "posneg")
                     )
                     .addTo(map);
               });
            } // end for loop to load three levels of data

            map.setLayoutProperty('district-data-fiscal_cost_low_risk', 'visibility', 'visible');


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
    return (
      <div className="App">
        <ChartHeader
          title="Title I funds by school district in 2016 plus potential funding lost under 2020 census undercount scenarios"
        />
        <ButtonGroup id="toggles" aria-label="outlined button group">
          <Button id={"button_" + "fiscal_cost_low_risk"} className="active" onClick={this.handleClick.bind(this, "fiscal_cost_low_risk")}>Low Risk</Button>
          <Button id={"button_" + "fiscal_cost_med_risk"} className="inactive" onClick={this.handleClick.bind(this, "fiscal_cost_med_risk")}>Medium Risk</Button>
          <Button id={"button_" + "fiscal_cost_high_risk"} className="inactive" onClick={this.handleClick.bind(this, "fiscal_cost_high_risk")}>High Risk</Button>
        </ButtonGroup>
        <div ref={el => this.mapContainer = el}  className="mapContainer" />
        <ChartFooter credit="Sources: U.S. Census Bureau’s SAIPE; Dept. of Education; Mapbox" downloaddata={this.state.data} downloadfilename={"Title I funds by school district in 2016 plus potential funding lost under 2020 census undercount scenarios"}  />
      </div>
    )
  }
}

export default Post4DistrictMap
