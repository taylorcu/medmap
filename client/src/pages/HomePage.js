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
            <p>Visit the <strong>'Map'</strong> page for a visual representation of the United States, displaying rankings of the states'
            overall rankings for healthcare quality, healthcare access, and public health.</p>
          </Row>
          <Row>
            <p>Visit the <strong>'Quality'</strong> page to see county by county information related to healthcare quality.</p>
          </Row>
          <Row>
            <p>Visit the <strong>'Access'</strong> page to see county by county information related to healthcare access.</p>
          </Row>
          <Row>
            <p>Visit the <strong>'Compare'</strong> page to compare data about all of the above between two counties..</p>
          </Row>
        
        </Form>
      </div>
     
      </body>
      </html>
    )
  }
}

export default HomePage

