import React, { Component } from 'react'
import { HashRouter, BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css'
import WorldMap from './components/WorldMap'
import BarChart from './components/BarChart'
import stateborderdata from './components/usstates'
import Post1Tree from './posts/Post1Tree'
import PostBarChart from './posts/PostBarChart'
import { range } from 'd3-array'
import { scaleThreshold } from 'd3-scale'
import { geoCentroid } from 'd3-geo'


class App extends Component {


  render() {

    return (
      <HashRouter basename="/">
        <main>
            <Switch>
              <Route exact path="/" component={Post1Tree}  />
              <Route path="/Post1Tree" component={Post1Tree}  />
              <Route path="/PostBarChart" component={PostBarChart}  />
            </Switch>
        </main>
      </HashRouter>
    )
  }
}

export default App
