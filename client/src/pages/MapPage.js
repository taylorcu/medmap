import React, { Component } from 'react';
import USAMap from "react-usa-map";
import { Form, Button, FormGroup, CardTitle, Card, CardBody, CardSubtitle } from "shards-react";
import {
  Table,
  Pagination,
  Select,
  Row,
  Col
} from 'antd'

import MenuBar from '../components/MenuBar';
import { getNewsRankings, getNameFromCode, getCountiesFromState, getCodeToNumericRanking, getAccessRankings, 
    getQualityRankings, getPublicHealthRankings, getRankingsList } from '../fetcher'
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


// COLUMNS FOR RANKING DISPLAY
const rankingColumns = [
    {
        title: 'State',
        dataIndex: 'Name',
        key: 'Name',
        sorter: (a, b) => a.Name.localeCompare(b.Name)
      },
      {
        title: 'Ranking',
        dataIndex: 'Ranking',
        key: 'Ranking',
        sorter: (a, b) => a.Ranking - b.Ranking
      }
]

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
            stateNameToNumericRanking: []
        }

        this.handleStateSelected = this.handleStateSelected.bind(this)
        this.setStateRankingMethod = this.setStateRankingMethod.bind(this)
        this.mapHandler = this.mapHandler.bind(this)
        this.statesCustomConfig = this.statesCustomConfig.bind(this)
        this.doNothing = this.doNothing.bind(this)
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
                // sort by 
                if (stateRanking <= 30) {
                    color = "#b9d2f0"
                } else if (stateRanking <= 60) {
                    color = "#7fb7fa"
                } else if (stateRanking <= 90) {
                    color = "#559cf2"
                } else if (stateRanking <= 120) {
                    color = "#1762bd"
                } else {
                    color = "#033f87"
                }
            }

            // if looking at other rankings 
            else {
                // sort by 
                if (stateRanking <= 10) {
                    color = "#b9d2f0"
                } else if (stateRanking <= 20) {
                    color = "#7fb7fa"
                } else if (stateRanking <= 30) {
                    color = "#559cf2"
                } else if (stateRanking <= 40) {
                    color = "#1762bd"
                } else {
                    color = "#033f87"
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

        // call function to get full list
        getRankingsList(value).then(res => {
            this.setState({ stateNameToNumericRanking: res.results })
        });
    }  

    componentDidMount() {
        // when component originally mounts, set overall rankings
         getCodeToNumericRanking().then(res => {
            this.setState({ stateCodeToNumericRanking: res.results })
        }); 

         // call function to get full list
         getRankingsList("Overall").then(res => {
            this.setState({ stateNameToNumericRanking: res.results })
        });


    } 

    // DO NOTHING -- legend button workaround 
    doNothing() {
    
    }

    

  render() {

    return (
        <div className="App">
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <h3> Welcome to the Map Page</h3>
                <p> Displayed below is the US map, color-coded with a ranking system. This ranking system is based on a 1st to 50th ranking by state in three categories: healthcare access, healthcare quality,
                    and public health. Click on a state to see more information about its ratings below. Scroll to view a table of all rankings by selected category. This data is compiled by US News, as of 2022. 
                </p>
            </Row>
            <Row>
                <Col span={14}><FormGroup style={{ width: '40vw', margin: '0 auto' }}>
                    <Card><CardSubtitle>Select Ranking Method</CardSubtitle><CardBody>
            <Select defaultValue="Overall" style={{ width: 170 }} onChange={this.setStateRankingMethod}>
                                <Option value="Overall">Overall</Option>
                                <Option value="HealthCareAccess">Healthcare Access</Option>
                                <Option value="HealthCareQuality">Healthcare Quality</Option>
                                <Option value="PublicHealth">Public Health</Option>
                            </Select></CardBody></Card></FormGroup>
            
            </Col>

            <Col span={10}>
            {this.state.stateRankingMethod !== "Overall" && <Card style={{marginTop: '2vh'}}>
                <CardSubtitle>Map Legend (State Ranking)</CardSubtitle>
                <CardBody>
                    <p style={{color:"#b9d2f0"}}> 1st to 10th</p>
                    <p style={{color:"#7fb7fa"}}> 11th to 20th</p>
                    <p style={{color:"#559cf2"}}> 21st to 30th</p>
                    <p style={{color:"#1762bd"}}> 31st to 40th</p>
                    <p style={{color:"#033f87"}}> 41st to 50th</p>
                </CardBody>
                
            </Card>}
            {this.state.stateRankingMethod === "Overall" && <Card>
                <CardSubtitle>Map Legend (Aggregate Score)</CardSubtitle>
                <CardBody>
                    <p style={{color:"#b9d2f0"}}> 1 to 30</p>
                    <p style={{color:"#7fb7fa"}}> 31 to 60</p>
                    <p style={{color:"#559cf2"}}> 61 to 90</p>
                    <p style={{color:"#1762bd"}}> 91 to 120</p>
                    <p style={{color:"#033f87"}}> 121 to 150</p>
                </CardBody>
                
            </Card>}</Col>
            </Row>

            <Card style={{marginTop: '2vh'}}>
            <Row> 
            <USAMap customize={this.statesCustomConfig()} onClick={this.mapHandler} />
            </Row>
            </Card>

            

            {(this.state.stateResults.length !== 0) && <Card style={{marginTop: '2vh'}}><CardBody><div>
                <Row>
                    <label><strong>Selected State: {this.state.selectedState} </strong></label>
                </Row>
                <Row>
                    <Table dataSource={this.state.stateResults} columns={stateColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row></div></CardBody></Card>}

            <Card style={{marginTop: '2vh'}}>
                <CardTitle>State Rankings by {this.state.stateRankingMethod}</CardTitle>
                <CardBody><Table dataSource={this.state.stateNameToNumericRanking} columns={rankingColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
            </CardBody></Card>
        </Form>
        </div>
      );
  }
}

export default MapPage