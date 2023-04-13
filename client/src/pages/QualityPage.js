import React, { Component } from 'react';
import USAMap from "react-usa-map";
import { Form, FormInput, FormGroup, Button, } from "shards-react";
import {
  Table,
  Pagination,
  Select,
  Row
} from 'antd'

import MenuBar from '../components/MenuBar';
import { stateNames } from '../components/StateNameArray';
import { getCountiesFromStateName, getCountyMapLink, getCountyMortalityResults1, getCountyMortalityResults2, getCountyMortalityResults3} from '../fetcher'
const { Column, ColumnGroup } = Table;
const { Option } = Select;


// COLUMNS FOR COUNTY DISPLAY
const countyColumns = [
    {
        title: 'County Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Numeric Code',
        dataIndex: 'fips',
        key: 'fips'
      },
];

// COLUMNS FOR MORTALITY RATE COUNTY DISPLAY
// TO DO
const countyMortalityColumns1 = [
    {
        title: 'County Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Neonatal Disorders',
        dataIndex: 'MRNN',
        key: 'MRNN',
        sorter: (a, b) => a.MRNN - b.MRNN
      },
      {
        title: 'HIV/AIDS and Tuberculosis',
        dataIndex: 'MRHIV',
        key: 'MRHIV',
        sorter: (a, b) => a.MRHIV - b.MRHIV
      },
      {
        title: 'Musculoskeletal Disorders',
        dataIndex: 'MRMUS',
        key: 'MRMUS',
        sorter: (a, b) => a.MRMUS - b.MRMUS
      }
]; 

const countyMortalityColumns2 = [
    {
        title: 'County Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Digestive Diseases',
        dataIndex: 'MRDIG',
        key: 'MRDIG',
        sorter: (a, b) => a.MRDIG - b.MRDIG
      },
      {
        title: 'Chronic Respiratory Diseases',
        dataIndex: 'MRRESP',
        key: 'MRRESP',
        sorter: (a, b) => a.MRRESP - b.MRRESP
      },
      {
        title: 'Diabetes, Urogenital, Blood, and Endocrine Diseases',
        dataIndex: 'MRDIA',
        key: 'MRDIA',
        sorter: (a, b) => a.MRDIA - b.MRDIA
      },
      
]; 

const countyMortalityColumns3 = [
    {
        title: 'County Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Neurological Diseases',
        dataIndex: 'MRNUER',
        key: 'MRNUER',
        sorter: (a, b) => a.MRNUER - b.MRNUER
      },
      {
        title: 'Cirrhosis and Other Chronic Liver Diseases',
        dataIndex: 'MRLIV',
        key: 'MRLIV',
        sorter: (a, b) => a.MRLIV - b.MRLIV
      },
      {
        title: 'Cardiovasculur Diseases',
        dataIndex: 'MRCARD',
        key: 'MRCARD',
        sorter: (a, b) => a.MRCARD - b.MRCARD
      },
      {
        title: 'Maternal Disorders',
        dataIndex: 'MRMAT',
        key: 'MRMAT',
        sorter: (a, b) => a.MRMAT - b.MRMAT
      }
      
]; 

class QualityPage extends React.Component {
    // CLASS CONSTRUCTOR
    constructor(props) {
        super(props)

        this.state = {
            selectedState: "",
            countyMapLink: "",
            countyResults: [],
            countyMortalityResults1: [],
            countyMortalityResults2: [],
            countyMortalityResults3: []
        }

        this.handleStateSelected = this.handleStateSelected.bind(this)
        //this.setStateRankingMethod = this.setStateRankingMethod.bind(this)
        //this.mapHandler = this.mapHandler.bind(this)
        //this.statesCustomConfig = this.statesCustomConfig.bind(this)
    }

    // HANDLE STATE BEING SELECTED, GET DATA
    handleStateSelected(value) {
        // set state 
        this.setState({ selectedState: value });

        // call function to get county map link 
        getCountyMapLink(value).then(res => {
            this.setState({countyMapLink: res.results[0].Link })
        });

        // call function to get list of all counties 
        getCountiesFromStateName(value).then(res => {
            this.setState({ countyResults: res.results });
        });
        
        // call function to get data for all county mortality results
        getCountyMortalityResults1(value).then(res => {
            this.setState({ countyMortalityResults1: res.results});
        });

        getCountyMortalityResults2(value).then(res => {
            this.setState({ countyMortalityResults2: res.results});
        });

        getCountyMortalityResults3(value).then(res => {
            this.setState({ countyMortalityResults3: res.results});
        });

        
    }

    /*
    // SET STATE RANKING METHOD FROM DROPDOWN
    setStateRankingMethod(value) {
        // set state ranking method internally 
        this.setState({ stateRankingMethod: value })

        // call function to get values and change colors accordingly 
        if (value == "HealthCareAccess") {
            getAccessRankings().then(res => {
                this.setState({ stateCodeToNumericRanking: res.results })
            });
        } else if (value == "Overall") {
            getCodeToNumericRanking().then(res => {
                this.setState({ stateCodeToNumericRanking: res.results })
            });
        } else if (value == "HealthCareQuality") {
            getQualityRankings().then(res => {
                this.setState({ stateCodeToNumericRanking: res.results })
            });
        } else if (value == "PublicHealth") {
            getPublicHealthRankings().then(res => {
                this.setState({ stateCodeToNumericRanking: res.results })
            });
        }
    }  
    */

    componentDidMount() {
        /*
        // when component originally mounts, set overall rankings
         getCodeToNumericRanking().then(res => {
            this.setState({ stateCodeToNumericRanking: res.results })
        }); 
        */
    } 

  render() {

    return (
        <div className="App">
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <h3> Quality of Healthcare by State</h3>
                <p> On this page, you can select a state and see its rankings and data about the quality of healthcare within each 
                    county. These metrics are determined based on: TODO. Select a state to start. 
                </p>
            </Row>
            <Row>
                <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label><strong>Select a state.&nbsp;&nbsp;</strong></label>
                    <Select defaultValue="Select" style={{ width: 170 }} onChange={this.handleStateSelected}>
                    {stateNames.map((item, index) => {
                      return (<Option key={item} value={item}>{item}</Option>)
                    })}
                    </Select>
                </FormGroup>
              </Row>
              <Row>
                <div><img src={this.state.countyMapLink}></img></div>
              </Row>
              <Row>
                <Table dataSource={this.state.countyResults} columns={countyColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
              </Row>
              <Row>
                <label><strong>County morality rate for selected conditions, compiled by JAMA, as of 2014.</strong></label>
              </Row>
              <Row>
              <Table dataSource={this.state.countyMortalityResults1} columns={countyMortalityColumns1} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
              </Row>
              <Row>
              <Table dataSource={this.state.countyMortalityResults2} columns={countyMortalityColumns2} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
              </Row>
              <Row>
              <Table dataSource={this.state.countyMortalityResults3} columns={countyMortalityColumns3} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
              </Row>
        </Form>
        </div>
      );
  }
}

export default QualityPage