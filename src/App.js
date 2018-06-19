import React, { Component } from 'react'
import { Router, Route } from 'react-router-dom'
import history from './history'

import AppHome from './views/Home'
import AppList from './views/List'
import AppNotFound from './views/404'

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <Route exact path="/" component={AppHome} />
          <Route exact path="/list" component={AppList} />
          <Route exact path="/404" component={AppNotFound} />
        </div>
      </Router>
    )
  }
}
export default App
