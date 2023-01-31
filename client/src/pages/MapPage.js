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
import { getNewsRankings, getNameFromCode, getCountiesFromState, getCodeToNumericRanking, getAccessRankings, getQualityRankings, getPublicHealthRankings } from '../fetcher'
const { Column, ColumnGroup } = Table;
const { Option } = Select;

// COLUMNS FOR STATE DISPLAY
const stateColumns = [
    {
      title: 'State',
      dataIndex: 'Name',
      key: 'Name'
    },
    {
      title: 'Code',
      dataIndex: 'Code',
      key: 'Code'
    },
    {
      title: 'Health Care Access Ranking',
      dataIndex: 'HealthCareAccessRanking',
      key: 'HealthCareAccessRanking'
      
    },
    {
      title: 'Health Care Quality Ranking',
      dataIndex: 'HealthCareQualityRanking',
      key: 'HealthCareQualityRanking'
    },
    {
        title: 'Public Health Ranking',
        dataIndex: 'PublicHealthRanking',
        key: 'PublicHealthRanking'
    },
    {
        title: 'Composite Ranking',
        dataIndex: 'CompositeRanking',
        key: 'CompositeRanking'
    }
];


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

class MapPage extends React.Component {
    // CLASS CONSTRUCTOR
    constructor(props) {
        super(props)

        this.state = {
            selectedState: "",
            stateRankingMethod: "Overall",
            stateResults: [],
            countyResults: [],
            stateCodeToNumericRanking: [], 
        }

        this.handleStateSelected = this.handleStateSelected.bind(this)
        this.setStateRankingMethod = this.setStateRankingMethod.bind(this)
        this.mapHandler = this.mapHandler.bind(this)
        this.statesCustomConfig = this.statesCustomConfig.bind(this)
    }

    // MAP HANDLER FROM API 
    mapHandler = (event) => {
        this.handleStateSelected(event.target.dataset.name)
    };

    // CONFIGURATION FOR STATE COLORING
    statesCustomConfig = () => {
        // initialize ranking data
        var rankingData = {}

        // mapping of states to rankings 
        this.state.stateCodeToNumericRanking.map((name, index) => {
            // initialize variables
            var stateCode = name.Code
            var stateRanking = name.Ranking
            var color = ""

            // if looking at overall rankings 
            if (this.state.stateRankingMethod == "Overall") {
                console.log('setting overall rankings')
                // sort by 
                if (stateRanking <= 30) {
                    color = "green"
                } else if (stateRanking <= 110) {
                    color = "yellow"
                } else {
                    color = "red"
                }
            }

            // if looking at other rankings 
            else {
                console.log('setting other rankings')
                // sort by 
                if (stateRanking <= 15) {
                    color = "green"
                } else if (stateRanking <= 35) {
                    color = "yellow"
                } else {
                    color = "red"
                }
            }
            

            // fill in object data
            var stateCodeFill = {}
            stateCodeFill["fill"] =  color
            rankingData[stateCode] = stateCodeFill
        });

        return rankingData;
    };

    // HANDLE STATE BEING SELECTED, GET DATA
    handleStateSelected(stateCode) {
        // call function to get state name from code 
        getNameFromCode(stateCode).then(res => {
            this.setState({ selectedState: res.results[0].Name })
        });

        // call function to get rankings
        getNewsRankings(stateCode).then(res => {
            this.setState({ stateResults: res.results })
        });

        // call function to get list of all counties 
        getCountiesFromState(stateCode).then(res => {
            this.setState({ countyResults: res.results })
        });
    }

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

    componentDidMount() {
        // when component originally mounts, set overall rankings
         getCodeToNumericRanking().then(res => {
            this.setState({ stateCodeToNumericRanking: res.results })
        }); 
    } 

  render() {

    return (
        <div className="App">
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <h3> Welcome to MedMap main interface!</h3>
                <p> This ranking system is based on a 1st to 50th ranking by state in three categories: healthcare access, healthcare quality,
                    and public health. For ranking selection in each of these categories, a 'green' state is ranked between 1st and 15th, a 'yellow' state 
                    is ranked between 16th and 35th, and a 'red' state is ranked between 36th and 50th.  For the overall ranking selection, a 'green' state has a composite score (added) of 3 to 30, a 'yellow' 
                    state has a score of 31 to 110, and a 'red' state has a score of 111 to 150. 
                </p>
            </Row>
            <Row>
            <Select defaultValue="Overall" style={{ width: 170 }} onChange={this.setStateRankingMethod}>
                                <Option value="Overall">Overall</Option>
                                <Option value="HealthCareAccess">Healthcare Access</Option>
                                <Option value="HealthCareQuality">Healthcare Quality</Option>
                                <Option value="PublicHealth">Public Health</Option>
                            </Select> 
            </Row>
          <Row> 
            <USAMap customize={this.statesCustomConfig()} onClick={this.mapHandler} />
          </Row>
          <Row>
            <label><strong>Selected State: {this.state.selectedState} </strong></label>
        </Row><Row>
            <Table dataSource={this.state.stateResults} columns={stateColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
          </Row>
          <Row>
          <Table dataSource={this.state.countyResults} columns={countyColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
          </Row>
        
        </Form>
        </div>
      );
  }
}

export default MapPage