import React, { Component } from 'react'
import { HashRouter, BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css'
import BarChart from './components/BarChart'
import Post1Tree from './posts/Post1Tree'
import Post2Tree from './posts/Post2Tree'
import Post2Map from './posts/Post2Map'
import Post2Table from './posts/Post2Table'
import Post3Table from './posts/Post3Table'
import Post3Map from './posts/Post3Map'
import Post4DistrictMap from './posts/Post4DistrictMap'
import Post4Map from './posts/Post4Map'
import Post4Table from './posts/Post4Table'
import Post5Table from './posts/Post5Table'
import Post5Map from './posts/Post5Map'


class App extends Component {


  render() {

    return (
      <HashRouter basename="/">
        <main>
            <Switch>
              <Route exact path="/" component={Post1Tree}  />
              <Route exact path="/Post1Tree" component={Post1Tree}  />
              <Route exact path="/Post2Tree" component={Post2Tree}  />
              <Route exact path="/Post2Map" component={Post2Map}  />
              <Route exact path="/Post2Table" component={Post2Table}  />
              <Route exact path="/Post3Table" component={Post3Table}  />
              <Route exact path="/Post3Map" component={Post3Map}  />
              <Route exact path="/Post4Map" component={Post4Map}  />
              <Route exact path="/Post4DistrictMap" component={Post4DistrictMap}  />
              <Route exact path="/Post4Table" component={Post4Table}  />
              <Route exact path="/Post5Table" component={Post5Table}  />
              <Route exact path="/Post5Map" component={Post5Map}  />
            </Switch>
        </main>
      </HashRouter>
    )
  }
}

export default App
