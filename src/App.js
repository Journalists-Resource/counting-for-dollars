import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css'
import WorldMap from './components/WorldMap'
import BarChart from './components/BarChart'
import stateborderdata from './components/usstates'
import Post1 from './posts/Post1'
import { range } from 'd3-array'
import { scaleThreshold } from 'd3-scale'
import { geoCentroid } from 'd3-geo'


class App extends Component {


  render() {

    return (
      <main>
            <Switch>
              <Route path="/treemap" component={Post1} exact />
            </Switch>
        </main>
    )
  }
}

export default App
