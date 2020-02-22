import React, { Component } from 'react'
import '../App.css'
import mapboxgl from 'mapbox-gl'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;


class Post4Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -109.3297,
      lat: 54.8017,
      zoom: 2
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
      map.addLayer({
        'id': 'district-data',
        'type': 'line',
        'source': 'districts',
        'source-layer': 'schooldistrict_sy1819_tl19-1lm5et',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#ff69b4',
          'line-width': 1
        }
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
        <ChartHeader title="Title I funding per low-income child in 2016 by state" />
        <div ref={el => this.mapContainer = el}  className="mapContainer" />
      </div>
    )
  }
}

export default Post4Map
