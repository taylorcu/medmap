import React from 'react';
import { Form, FormInput, FormGroup, Button, } from "shards-react";
import {
  Table,
  Pagination,
  Select,
  Row
} from 'antd'

import MenuBar from '../components/MenuBar';
const { Column, ColumnGroup } = Table;
const { Option } = Select;

var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

mapboxgl.accessToken = 'pk.eyJ1IjoidGF5bG9yY3UiLCJhIjoiY2xiYm93Znh1MDBvbDNwb280ODhhMHJhbyJ9.0N14a-R8mihTSAG4NTvGlw';


class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
    }

  }

  componentDidMount() {
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
    });
  }

 
  


  render() {

    return (
      <html>
      <head>
      </head>
      <body>
      <div>
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
          <Row>
          <h3> Welcome to 'MedMap' Application! </h3>
          </Row>
          <Row>
          <div id="map" style={{position: "absolute", top: "0", bottom: "0", width: "100%" }}></div>
          </Row>
        
        </Form>
      </div>
     
      </body>
      </html>
    )
  }
}

export default HomePage

