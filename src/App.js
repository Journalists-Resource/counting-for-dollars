import React, { Component } from 'react'
import { HashRouter, BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css'
import BarChart from './components/BarChart'
import Post1Tree from './posts/Post1Tree'
import Post2Tree from './posts/Post2Tree'
import Post2Map from './posts/Post2Map'
import Post2Table from './posts/Post2Table'
import Post3Map from './posts/Post3Map'
import Post4Map from './posts/Post4Map'


class App extends Component {


  render() {

    return (
      <HashRouter basename="/">
        <main>
            <Switch>
              <Route exact path="/" component={Post1Tree}  />
              <Route path="/Post1Tree" component={Post1Tree}  />
              <Route path="/Post2Tree" component={Post2Tree}  />
              <Route path="/Post2Map" component={Post2Map}  />
              <Route path="/Post2Table" component={Post2Table}  />
              <Route path="/Post3Map" component={Post3Map}  />
              <Route path="/Post4Map" component={Post4Map}  />
            </Switch>
        </main>
      </HashRouter>
    )
  }
}

export default App
