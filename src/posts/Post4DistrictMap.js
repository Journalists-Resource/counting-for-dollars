import React, { Component } from 'react'
import '../App.css'
import mapboxgl from 'mapbox-gl'
import { csv, json } from 'd3-fetch'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'
import { bucketScale } from '../components/ColorSchemes'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const colorScale = bucketScale


class Post4Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -71.22,
      lat: 42.37,
      zoom: 6
    };
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

    map.on('load', function() {
      map.addSource('districts', {
        type: 'vector',
        url: 'mapbox://tylermachado.1hv3eju0'
      });

      var expression = [
        'match',
        ['get', 'GEOID']
      ];

      csv("datasets/joined_school_dist_scores_final.csv")
      .then(dataset => {
        colorScale.domain(dataset.map(function(row,i) {
          return parseFloat(row['fiscal_cost_low_risk'])
        }))
        dataset.map(function(row,i) {
          let number = parseFloat(row['fiscal_cost_low_risk'])
          expression.push(row["LEA_id"], (isNaN(number) ? 'gainsboro' : colorScale(number)))
      })

        expression.push('gainsboro')

        map.addLayer({
          'id': 'district-data',
          'type': 'fill',
          'source': 'districts',
          'source-layer': 'schooldistrict_sy1819_tl19-1lm5et',
          // 'paint': {
          //   'fill-color': '#ff69b4',
          //   'fill-opacity': 0.5
          // }
          'paint': {
            'fill-color': expression,
            'fill-opacity': 0.7
          }

        });
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
          subhed="Estimating the amount of Title I funding school districts could lose under 2020 low-, medium- and high-risk miscount scenarios projected by the Urban Institute"
        />
        <div ref={el => this.mapContainer = el}  className="mapContainer" />
        <ChartFooter credit="Urban Institute" />
      </div>
    )
  }
}

export default Post4Map
