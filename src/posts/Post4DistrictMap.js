import React, { Component } from 'react'
import '../App.css'
import mapboxgl from 'mapbox-gl'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;


class Post4Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 5,
      lat: 34,
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
