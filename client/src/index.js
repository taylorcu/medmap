import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import QualityPage from './pages/QualityPage';
import AccessPage from './pages/AccessPage';
import ComparePage from './pages/CompagePage';
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

ReactDOM.render(
  <div>
    <Router>
      <Switch>
        <Route exact
							path="/"
							render={() => (
								<HomePage />
							)}/>
		<Route exact
							path="/map"
							render={() => (
								<MapPage />
							)}/>
		<Route exact
							path="/quality"
							render={() => (
								<QualityPage />
							)}/>
		<Route exact
							path="/access"
							render={() => (
								<AccessPage />
							)}/>
		<Route exact
							path="/compare"
							render={() => (
								<ComparePage />
							)}/>
      </Switch>
    </Router>
  </div>,
  document.getElementById('root')
);

