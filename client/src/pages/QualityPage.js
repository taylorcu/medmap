import React, { Component } from 'react';
import { Form, FormGroup, Button, Card, CardBody, CardTitle, CardSubtitle } from "shards-react";
import {
  Table,
  Pagination,
  Select,
  Row
} from 'antd'

import MenuBar from '../components/MenuBar';
import ReactSwitch from 'react-switch';
import { stateNames } from '../components/StateNameArray';
import { mortalityCategories } from '../components/MortalityCategoriesArray';
import { getCountiesFromStateName, getCountyMapLink, getCountyMortalityResults1, getCountyMortalityResults2, getCountyMortalityResults3, 
  getMaxMortality, getMinMortality, getAvgMortality, getQualAndLengthResults, getQualAndLengthFirstQuartile, 
  getQualAndLengthFourthQuartile, getClinicalAndHealthResults, getClinicalAndHealthFirstQuartile, getClinicalAndHealthFourthQuartile } from '../fetcher'
const { Option } = Select;

// COLUMNS FOR LENGTH AND QUALITY OF LIFE DISPLAY
const lengthAndQualityColumns = [
  {
      title: 'County Name',
      dataIndex: 'CountyName',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Length of Life Rank',
      dataIndex: 'LengthRank',
      key: 'LengthRank',
      sorter: (a, b) => a.LengthRank - b.LengthRank
    },
    {
      title: 'Length of Life Quartile',
      dataIndex: 'LengthQuartile',
      key: 'LengthQuartile',
      sorter: (a, b) => a.LengthQuartile - b.LengthQuartile
    },
    {
      title: 'Quality of Life Rank',
      dataIndex: 'QualRank',
      key: 'QualRank',
      sorter: (a, b) => a.QualRank - b.QualRank
    },
    {
      title: 'Quality of Life Quartile',
      dataIndex: 'QualQuartile',
      key: 'QualQuartile',
      sorter: (a, b) => a.QualQuartile - b.QualQuartile
    }
]; 

// COLUMNS FOR FIRST QUARTILE LENGTH AND QUALITY DISPLAY
const firstQuartileLengthAndQualityColumns = [
  {
      title: 'County Name',
      dataIndex: 'CountyName',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Length of Life Rank',
      dataIndex: 'LengthRank',
      key: 'LengthRank',
      sorter: (a, b) => a.LengthRank - b.LengthRank
    },
    {
      title: 'Quality of Life Rank',
      dataIndex: 'QualRank',
      key: 'QualRank',
      sorter: (a, b) => a.QualRank - b.QualRank
    },
]; 

// COLUMNS FOR FOURTH QUARTILE LENGTH AND QUALITY DISPLAY
const fourthQuartileLengthAndQualityColumns = [
  {
      title: 'County Name',
      dataIndex: 'CountyName',
      key: 'CountyName',
      sorter: (a, b) => a.CountyName.localeCompare(b.CountyName)
    },
    {
      title: 'Length of Life Rank',
      dataIndex: 'LengthRank',
      key: 'LengthRank',
      sorter: (a, b) => a.LengthRank - b.LengthRank
    },
    {
      title: 'Quality of Life Rank',
      dataIndex: 'QualRank',
      key: 'QualRank',
      sorter: (a, b) => a.QualRank - b.QualRank
    },
]; 

// COLUMNS FOR CLINICAL AND HEALTH DISPLAY
const clinicalAndHealthColumns = [
  {
      title: 'County Name',
      dataIndex: 'County',
      key: 'County',
      sorter: (a, b) => a.County.localeCompare(b.County)
    },
    {
      title: 'Healthcare Outcome Rank',
      dataIndex: 'OutcomesRank',
      key: 'OutcomesRank',
      sorter: (a, b) => a.OutcomesRank - b.OutcomesRank
    },
    {
      title: 'Healthcare Outcome Quartile',
      dataIndex: 'OutcomeQuartile',
      key: 'OutcomeQuartile',
      sorter: (a, b) => a.OutcomeQuartile - b.OutcomeQuartile
    },
    {
      title: 'Clinical Care Rank',
      dataIndex: 'ClinicalRank',
      key: 'ClinicalRank',
      sorter: (a, b) => a.ClinicalRank - b.ClinicalRank
    },
    {
      title: 'Clinical Care Quartile',
      dataIndex: 'ClinicalQuartile',
      key: 'ClinicalQuartile',
      sorter: (a, b) => a.ClinicalQuartile - b.ClinicalQuartile
    }
]; 

// COLUMNS FOR FIRST QUARTILE CLINICAL AND HEALTH DISPLAY
const firstQuartileClinicalAndHealthColumns = [
  {
      title: 'County Name',
      dataIndex: 'County',
      key: 'County',
      sorter: (a, b) => a.County.localeCompare(b.County)
    },
    {
      title: 'Healthcare Outcome Rank',
      dataIndex: 'OutcomesRank',
      key: 'OutcomesRank',
      sorter: (a, b) => a.OutcomesRank - b.OutcomesRank
    },
    {
      title: 'Clinical Care Rank',
      dataIndex: 'ClinicalRank',
      key: 'ClinicalRank',
      sorter: (a, b) => a.ClinicalRank - b.ClinicalRank
    }
]; 

// COLUMNS FOR FOURTH QUARTILE CLINICAL AND HEALTH DISPLAY
const fourthQuartileClinicalAndHealthColumns = [
  {
      title: 'County Name',
      dataIndex: 'County',
      key: 'County',
      sorter: (a, b) => a.County.localeCompare(b.County)
    },
    {
      title: 'Healthcare Outcome Rank',
      dataIndex: 'OutcomesRank',
      key: 'OutcomesRank',
      sorter: (a, b) => a.OutcomesRank - b.OutcomesRank
    },
    {
      title: 'Clinical Care Rank',
      dataIndex: 'ClinicalRank',
      key: 'ClinicalRank',
      sorter: (a, b) => a.ClinicalRank - b.ClinicalRank
    }
]; 

// COLUMNS FOR MORTALITY RATE COUNTY DISPLAY
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
        title: 'Average',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Neurological Disorders',
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
            // GENERAL
            selectedState: "",
            countyMapLink: "",
            countyResults: [],
            displayImage: false,

            // QUAL AND LENGTH
            countyQualAndLengthResults: [],
            numCounties: "",
            qualAndLengthFirstQuartileResults: [],
            qualAndLengthFourthQuartileResults: [],
            displayQuartileQualAndLength: false,

            // CLINICAL AND HEALTH
            clinicalAndHealthResults: [],
            clinicalAndHealthFirstQuartileResults: [],
            clinicalAndHealthFourthQuartileResults: [],
            displayQuartileClinicalAndHealth: false,

            // MORTALITY
            displayMortality: false,
            countyMortalityResults1: [],
            countyMortalityResults2: [],
            countyMortalityResults3: [],
            loadingMessage1: "",
            loadingMessage2: "",
            loadingMessage3: "",
            selectedMoralityCategory: "",
            mortMax: "",
            mortMaxName: "",
            mortMin: "",
            mortMinName: "",
            mortAvg: ""
        }

        this.handleStateSelected = this.handleStateSelected.bind(this)
        this.handleMortalityCategorySelected = this.handleMortalityCategorySelected.bind(this)
        this.handleMapDisplaySwitch = this.handleMapDisplaySwitch.bind(this)
        this.handleToggleQualAndLength = this.handleToggleQualAndLength.bind(this)
        this.handleToggleClinicalAndHealth = this.handleToggleClinicalAndHealth.bind(this)
    }

    // HANDLE STATE BEING SELECTED, GET DATA
    handleStateSelected(value) {
        // set state 
        this.setState({ selectedState: value });

        // reset all mortality results
        this.setState({ countyMortalityResults1: [] })
        this.setState({ countyMortalityResults2: [] })
        this.setState({ countyMortalityResults3: [] })
        this.setState({ mortMax: "" })
        this.setState({ mortMaxName: ""})
        this.setState({mortMin: ""})
        this.setState({mortMinName: ""})
        this.setState({mortAvg: ""})

        // call function to get county map link 
        getCountyMapLink(value).then(res => {
            this.setState({countyMapLink: res.results[0].Link })
        });

        // call function to get list of all counties 
        getCountiesFromStateName(value).then(res => {
            this.setState({ countyResults: res.results });
        });

        // call function to get quality and length of life results 
        getQualAndLengthResults(value).then(res => {
          this.setState({ countyQualAndLengthResults: res.results });
          this.setState({ numCounties: res.results[0].NumCounties });
        });

        // call function to get first and fourth quartile quality and length of life counties 
        getQualAndLengthFirstQuartile(value).then(res => {
          this.setState({ qualAndLengthFirstQuartileResults: res.results });
        });

        getQualAndLengthFourthQuartile(value).then(res => {
          this.setState({ qualAndLengthFourthQuartileResults: res.results });
        });

        // call function to get clinical care and health outcomes results 
        getClinicalAndHealthResults(value).then(res => {
          this.setState({ clinicalAndHealthResults: res.results })
        });

        // call function to get first and fourth quartile clinical caree and health outcomes counties 
        getClinicalAndHealthFirstQuartile(value).then(res => {
          this.setState({ clinicalAndHealthFirstQuartileResults: res.results });
        });

        getClinicalAndHealthFourthQuartile(value).then(res => {
          this.setState({ clinicalAndHealthFourthQuartileResults: res.results });
        });

        // display mortality
        this.setState({ displayMortality: true })
        
        // call function to get data for all county mortality results
        this.setState({ loadingMessage1: "Loading..."});
        getCountyMortalityResults1(value).then(res => {
            this.setState({ countyMortalityResults1: res.results});
            this.setState({ loadingMessage1: ""});
        });

        this.setState({ loadingMessage2: "Loading..."});
        getCountyMortalityResults2(value).then(res => {
            this.setState({ countyMortalityResults2: res.results});
            this.setState({ loadingMessage2: ""});
        });

        this.setState({ loadingMessage3: "Loading..."});
        getCountyMortalityResults3(value).then(res => {
          this.setState({ loadingMessage3: ""});
            this.setState({ countyMortalityResults3: res.results});
        });
    }

    // HANDLE MORTALITY CATEGORY SELECTED
    handleMortalityCategorySelected(value) {
      // set mortality category selected 
      this.setState({ selectedMoralityCategory: value })

      // get and set max min and average 
      getMaxMortality(value, this.state.selectedState).then(res => {
        this.setState({ mortMax: res.results[0].MR})
        this.setState({ mortMaxName: res.results[0].name})
      });

      getMinMortality(value, this.state.selectedState).then(res => {
        this.setState({ mortMin: res.results[0].MR})
        this.setState({ mortMinName: res.results[0].name})
      });

      getAvgMortality(value, this.state.selectedState).then(res => {
        this.setState({ mortAvg: res.results[0].MR})
      });
    }

    // HANDLE MAP DISPLAY BEING SWITCHED
    handleMapDisplaySwitch() {
      let temp = this.state.displayImage
      this.setState({ displayImage: !temp })
    }

    // HANDLE DISPLAY OF LENGTH AND QUALITY BEING SWITCHED 
    handleToggleQualAndLength() {
      let temp = this.state.displayQuartileQualAndLength
      console.log(!temp)
      this.setState({ displayQuartileQualAndLength: !temp })
    }

    // HANDLE DISPLAY OF CLINICAL AND HEALTH BEING SWITCHED 
    handleToggleClinicalAndHealth() {
      let temp = this.state.displayQuartileClinicalAndHealth
      console.log(!temp)
      this.setState({ displayQuartileClinicalAndHealth: !temp })
    }

    componentDidMount() {
    } 

  render() {

    return (
        <div className="App">
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <h3> Quality of Healthcare by County</h3>
                <p> On this page, you can select a state and see its rankings and data about the quality of healthcare within each 
                    county. Select a state to begin.

                    All table columns are clickable for sorting, either in ascending or descending order.
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

              {this.state.selectedState !== "" && <Card style={{marginTop: '2vh' }}>
                <CardTitle>County Map of {this.state.selectedState}</CardTitle>
                <CardBody><FormGroup style={{ width: '10vw' }} alignItems="center">
                          <Button style={{ marginTop: '4vh' }} onClick={this.handleMapDisplaySwitch}>Toggle Map Display</Button>
                        </FormGroup>
              {this.state.displayImage &&<div align="center"><img src={this.state.countyMapLink}></img></div>}</CardBody></Card>}


              {(this.state.countyQualAndLengthResults.length !== 0) && <Card style={{marginTop: '2vh'}}><div>
                <CardTitle>Ranking and Quartile for Length and Quality of Life</CardTitle>
                
                <CardBody>
                  <Row>
                  <p>This section provides the ranking and quartile (1 - 4) of length of life and quality of life for each county within the state. This data is analyzed and compiled by 
                    the Wisconsin Institute of Health, as of 2022. Toggle the button below to see the counties (and their ranks) that have both length and quality of life 
                    in the first or fourth quartile.  </p>
                  </Row>
                  <Row>
                  <label>Ranking out of {this.state.numCounties} counties in the state.</label>
                  </Row>
                  <Row>
                  <Table dataSource={this.state.countyQualAndLengthResults} columns={lengthAndQualityColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                <FormGroup style={{ width: '100vw' }} alignItems="center">
                          <Button style={{ marginTop: '4vh' }} onClick={this.handleToggleQualAndLength}>Toggle Display of Top and Bottom Quartile Tables</Button>
                        </FormGroup>
                </CardBody>
              </div></Card>}

              {(this.state.displayQuartileQualAndLength) && <Card style={{marginTop: '2vh'}}><div>
                <CardTitle>Counties in the 1st Quartile for Quality of Life and Length of Life</CardTitle>
                <CardBody>
                <Row>
                  <label>Ranking out of {this.state.numCounties} counties in the state.</label>
                  </Row>
                <Row>
                  <Table dataSource={this.state.qualAndLengthFirstQuartileResults} columns={firstQuartileLengthAndQualityColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                </CardBody>
              </div></Card>}

              {(this.state.displayQuartileQualAndLength) && <Card style={{marginTop: '2vh'}}><div>
                <CardTitle>Counties in the 4th Quartile for Quality of Life and Length of Life</CardTitle>
                <CardBody>
                <Row>
                  <label>Ranking out of {this.state.numCounties} counties in the state.</label>
                  </Row>
                <Row>
                  <Table dataSource={this.state.qualAndLengthFourthQuartileResults} columns={fourthQuartileLengthAndQualityColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                </CardBody>
              </div></Card>}

              {(this.state.clinicalAndHealthResults.length !== 0) && <Card style={{marginTop: '2vh'}}><div>
                <CardTitle>Ranking and Quartile for Health Outcomes and Clinical Care</CardTitle>
                <CardBody>
                <Row>
                  <p>This section provides the ranking and quartile (1 - 4) of clinical care and health outcomes for each county within the state. This data is analyzed and compiled by 
                    the Wisconsin Institute of Health, as of 2022. Toggle the button below to see the counties (and their ranks) that have both length and quality of life 
                    in the first or fourth quartile.  </p>
                  </Row>
                  <Row>
                  <label>Ranking out of {this.state.numCounties} counties in the state.</label>
                  </Row>
                  <Row>
                  <Table dataSource={this.state.clinicalAndHealthResults} columns={clinicalAndHealthColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                <FormGroup style={{ width: '100vw' }} alignItems="center">
                          <Button style={{ marginTop: '4vh' }} onClick={this.handleToggleClinicalAndHealth}>Toggle Display of Top and Bottom Quartile Tables</Button>
                        </FormGroup>
                </CardBody>
              </div></Card>}

              
              {(this.state.displayQuartileClinicalAndHealth) && <Card style={{marginTop: '2vh'}}><div>
                <CardTitle>Counties in the 1st Quartile for Health Outcomes and Clinical Care</CardTitle>
                <CardBody>
                <Row>
                  <label>Ranking out of {this.state.numCounties} counties in the state.</label>
                  </Row>
                <Row>
                  <Table dataSource={this.state.clinicalAndHealthFirstQuartileResults} columns={firstQuartileClinicalAndHealthColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                </CardBody>
              </div></Card>}

              {(this.state.displayQuartileClinicalAndHealth) && <Card style={{marginTop: '2vh'}}><div>
                <CardTitle>Counties in the 4th Quartile for Health Outcomes and Clinical Care</CardTitle>
                <CardBody>
                <Row>
                  <label>Ranking out of {this.state.numCounties} counties in the state.</label>
                  </Row>
                <Row>
                  <Table dataSource={this.state.clinicalAndHealthFourthQuartileResults} columns={fourthQuartileClinicalAndHealthColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                </CardBody>
              </div></Card>}

                  
              {(this.state.displayMortality) && <Card style={{marginTop: '2vh'}}><div>
                  <CardTitle>County Mortality Rates</CardTitle>
                  <CardBody>
                    <Row>
                      <p>This section provides mortality rates across 10 different categories. Rates displayed are out of 100,000 people. Below, you can select a mortality rate category 
                    to see the maximum, minimum, and average rate in the state. This data is compiled by JAMA, as of 2014.</p>
                    </Row>
                <Row>
                <FormGroup style={{ width: '10vw' }}>
                    <p style={{color:"red"}} >{this.state.loadingMessage1}</p>
                </FormGroup>
                </Row>
                <Row>
                  <label>Mortality Rates by County: First 3 Categories</label>
                </Row>
                <Row>
                <Table dataSource={this.state.countyMortalityResults1} columns={countyMortalityColumns1} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                <Row>
                <FormGroup style={{ width: '10vw' }}>
                    <p style={{color:"red"}} >{this.state.loadingMessage2}</p>
                </FormGroup>
                </Row>
                <Row>
                  <label>Mortality Rates by County: Second 3 Categories</label>
                </Row>
                <Row>
                <Table dataSource={this.state.countyMortalityResults2} columns={countyMortalityColumns2} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                <Row>
                <FormGroup style={{ width: '10vw' }}>
                    <p style={{color:"red"}} >{this.state.loadingMessage3}</p>
                </FormGroup>
                </Row>
                <Row>
                  <label>Mortality Rates by County: Final 4 Categories</label>
                </Row>
                <Row>
                <Table dataSource={this.state.countyMortalityResults3} columns={countyMortalityColumns3} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row></CardBody>
              </div></Card>}

              {(this.state.displayMortality) && <Card style={{marginTop: '2vh'}}><div>
                <CardTitle>Mortality Category Statistics</CardTitle>
                <CardBody>
              <Row>
                <p>Select a category to see the maximum, minimum, and average data over counties in this state.</p>
                </Row>
                <Row>
                  <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                      <label><strong>Select a category.&nbsp;&nbsp;</strong></label>
                      <Select defaultValue="Select" style={{ width: 400 }} onChange={this.handleMortalityCategorySelected}>
                      {mortalityCategories.map((item, index) => {
                        return (<Option key={item} value={item}>{item}</Option>)
                      })}
                      </Select>
                  </FormGroup>
                </Row>
                <Row>
                {this.state.mortMax !== "" && <FormGroup style={{ width: '100vw' }}>
                    <p style={{color:"red"}} >Maximum: {this.state.mortMax} per 100,000 in {this.state.mortMaxName}</p>
                    <p style={{color:"green"}} >Minimum: {this.state.mortMin} per 100,000 in {this.state.mortMinName}</p>
                    <p style={{color:"black"}} >Average: {this.state.mortAvg} per 100,000</p>
                </FormGroup>}
                </Row></CardBody>
              </div></Card>}

        </Form>
        </div>
      );
  }
}

export default QualityPage