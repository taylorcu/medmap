import React, { Component } from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle } from "shards-react";
import {
  Table,
  Pagination,
  Select,
  Row,
  Col
} from 'antd'

import { RadarChart } from 'react-vis';
import { format } from 'd3-format';


import CanvasJSReact from '../canvas/canvasjs.react';
import MenuBar from '../components/MenuBar';
import { stateNames } from '../components/StateNameArray';
import { getCountiesFromStateName, getCountyNamesFromStateName, getCountyLengthQualityRank, getCountyMortalityRates, 
    getNumberDoctorsByCounty, getPercentUninsuredByCounty, getCountyClinicalAndHealthRank} from '../fetcher'
const { Column, ColumnGroup } = Table;
const { Option } = Select;
const wideFormat = format('.3r');


var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class ComparePage extends React.Component {
    // CLASS CONSTRUCTOR
    constructor(props) {
        super(props)

        this.state = {
            // GENERAL
            selectedState1: "",
            selectedState2: "",
            countiesList1: [],
            countiesList2: [],
            selectedCounty1: "",
            selectedCounty2: "",
            numCounties1: "",
            numCounties2: "",

            // RANKING OF LENGTH AND QUALITY OF LIFE 
            lengthRank1: "",
            lengthRank2: "",
            qualityRank1: "",
            qualityRank2: "",

            // RANKING OF OUTCOMES AND CLINICAL
            healthRank1: "",
            healthRank2: "",
            clinicalRank1: "",
            clinicalRank2: "",

            // MORTALITY RATES 
            mortalityRates1: [],
            mortalityRates2: [],

            // NUMBER OF DOCTORS
            numPrimaryCare1: "",
            numPrimaryCare2: "",
            numDentists1: "",
            numDentists2: "",
            numMentalHealth1: "",
            numMentalHealth2: "",

            // UNINSURED RESIDENTS 
            percentUninsured1: "",
            percentUninsured2: ""

            
        }

        this.handleStateSelected1 = this.handleStateSelected1.bind(this)
        this.handleStateSelected2 = this.handleStateSelected2.bind(this)
        this.handleCountySelected1 = this.handleCountySelected1.bind(this)
        this.handleCountySelected2 = this.handleCountySelected2.bind(this)
        this.processMortalityDataPoints = this.processMortalityDataPoints.bind(this)

        this.generateComparison = this.generateComparison.bind(this)
    }

    // HANDLE FIRST STATE BEING SELECTED 
    handleStateSelected1(value) {
        // set state 
        this.setState({ selectedState1: value });

        // call functions to get list of counties 
        getCountyNamesFromStateName(value).then(res => {
            // parse into list 
            let temp = []
            res.results.forEach((item) => temp.push(item.name))
            this.setState({ countiesList1: temp })
            this.setState({ numCounties1: temp.length })
        });
    }

    // HANDLE SECOND STATE BEING SELECTED 
    handleStateSelected2(value) {
        // set state 
        this.setState({ selectedState2: value });

        // call functions to get list of counties 
        getCountiesFromStateName(value).then(res => {
            // parse into list 
            let temp = []
            res.results.forEach((item) => temp.push(item.name))
            this.setState({ countiesList2: temp })
            this.setState({ numCounties2: temp.length })
        });
    }

    // HANDLE FIRST COUNTY BEING SELECTED 
    handleCountySelected1(value) {
        // set state 
        this.setState({ selectedCounty1: value });
    }

    // HANDLE SECOND COUNTY BEING SELECTED 
    handleCountySelected2(value) {
        // set state 
        this.setState({ selectedCounty2: value });
    }

    // GENERATE COMPARISON OF TWO COUNTIES
    generateComparison() {
        // check that both counties have been filled in
        if (!(this.state.selectedCounty1 == "" || this.state.selectedCounty2 == "")) {
            // get ranking of quality and length of life for each county 
            getCountyLengthQualityRank(this.state.selectedCounty1, this.state.selectedState1).then(res => {
                this.setState({ lengthRank1: res.results[0].LengthRank });
                this.setState({ qualityRank1: res.results[0].QualRank })
            });

            getCountyLengthQualityRank(this.state.selectedCounty2, this.state.selectedState2).then(res => {
                this.setState({ lengthRank2: res.results[0].LengthRank });
                this.setState({ qualityRank2: res.results[0].QualRank })
            });

            // get ranking of health outcomes and clinical care for each county
            getCountyClinicalAndHealthRank(this.state.selectedCounty1, this.state.selectedState1).then(res => {
                this.setState({ healthRank1: res.results[0].OutcomesRank });
                this.setState({ clinicalRank1: res.results[0].ClinicalRank })
            });

            getCountyClinicalAndHealthRank(this.state.selectedCounty2, this.state.selectedState2).then(res => {
                this.setState({ healthRank2: res.results[0].OutcomesRank });
                this.setState({ clinicalRank2: res.results[0].ClinicalRank })
            });

            // get mortality rates for each county
            getCountyMortalityRates(this.state.selectedCounty1, this.state.selectedState1).then(res => {
                // parse results into object
                this.processMortalityDataPoints(res.results, "one");
            });

            getCountyMortalityRates(this.state.selectedCounty2, this.state.selectedState2).then(res => {
                // parse results into object
                this.processMortalityDataPoints(res.results, "two");
                /*
                // parse results into object
                let temp = []
                res.results.forEach((item) => {
                    if (item.Category == "Neonatal disorders") {
                        temp.NNMR = item.MR
                    } else if (item.Category == "HIV/AIDS and tuberculosis") {
                        temp.HIVMR = item.MR
                    } else if (item.Category == "Musculoskeletal disorders") {
                        temp.MUSMR = item.MR
                    } else if (item.Category == "Digestive diseases") {
                        temp.DIGMR = item.MR
                    } else if (item.Category == "Chronic respiratory diseases") {
                        temp.RESPMR = item.MR
                    } else if (item.Category == "Diabetes; urogenital; blood; and endocrine diseases") {
                        temp.DIAMR = item.MR
                    } else if (item.Category == "Neurological disorders") {
                        temp.NUERMR = item.MR
                    } else if (item.Category == "Cirrhosis and other chronic liver diseases") {
                        temp.LIVMR = item.MR
                    } else if (item.Category == "Cardiovascular diseases") {
                        temp.CARDMR = item.MR
                    } else if (item.Category == "Maternal disorders") {
                        temp.MATMR = item.MR
                    } 
                })*/

            });

            // get number of doctors by selected county
            getNumberDoctorsByCounty(this.state.selectedCounty1, this.state.selectedState1).then(res => {
                this.setState({ numPrimaryCare1: res.results[0].NumPrimaryCare })
                this.setState({ numDentists1: res.results[0].NumDentists })
                this.setState({ numMentalHealth1: res.results[0].NumMentalHealth})
            });

            getNumberDoctorsByCounty(this.state.selectedCounty2, this.state.selectedState2).then(res => {
                this.setState({ numPrimaryCare2: res.results[0].NumPrimaryCare })
                this.setState({ numDentists2: res.results[0].NumDentists })
                this.setState({ numMentalHealth2: res.results[0].NumMentalHealth})
            });

            // get percentage of uninsured residents by selected county
            getPercentUninsuredByCounty(this.state.selectedCounty1, this.state.selectedState1).then(res => {
                this.setState({ percentUninsured1: res.results[0].PercentUninsured })
            });

            getPercentUninsuredByCounty(this.state.selectedCounty2, this.state.selectedState2).then(res => {
                this.setState({ percentUninsured2: res.results[0].PercentUninsured })
            });
        }
    }

    processMortalityDataPoints(results, oneOrTwo) {
        console.log('processing')
        // clear current data points 
        if (oneOrTwo == "one") {
          this.setState({ mortalityRates1: [] })
        } else {
          this.setState({ mortalityRates2: [] })
        }

        var temp = []
        results.forEach((item) => {
            // check that its one of the mortality rates we care about 
            if (item.Category == "Neonatal disorders" || item.Category == "HIV/AIDS and tuberculosis" || 
                item.Category == "Musculoskeletal disorders" || item.Category =="Chronic respiratory diseases"
                || item.Category == "Digestive diseases" || item.Category == "Diabetes; urogenital; blood; and endocrine diseases" ||
                item.Category == "Neurological disorders" || item.Category == "Cirrhosis and other chronic liver diseases" ||
                item.Category == "Cardiovascular diseases" || item.Category == "Maternal disorders") {
                // create dictionary object
                var dict = {}
                dict['label'] = item.Category
                dict['y'] = item.MR

                // push into temp
                temp.push(dict);
            }
            
            
        })
        // set back current data points
        if (oneOrTwo == "one") {
          this.setState({ mortalityRates1: temp })
        } else {
          this.setState({ mortalityRates2: temp })
        }

        console.log(temp)
        
      }


    componentDidMount() {
    } 

  render() {
    const primaryCareChartOptions = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Primary Care Physicians Comparison",
            fontSize: 20
        },
        axisX: {
            title: "County",
        },
        axisY: {
            title: "Number of Primary Care Physicians",
            includeZero: true,
            labelFormatter: this.addSymbols
        },
        data: [{
            type: "column",
            dataPoints: [
                { y:  this.state.numPrimaryCare1, label: this.state.selectedCounty1 },
                { y:  this.state.numPrimaryCare2, label: this.state.selectedCounty2 }
            ]
        }]
    }

    const dentistsChartOptions = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Dentists Comparison",
            fontSize: 20
        },
        axisX: {
            title: "County",
        },
        axisY: {
            title: "Number of Dentists",
            includeZero: true,
            labelFormatter: this.addSymbols
        },
        data: [{
            type: "column",
            dataPoints: [
                { y:  this.state.numDentists1, label: this.state.selectedCounty1 },
                { y:  this.state.numDentists2, label: this.state.selectedCounty2 }
            ]
        }]
    }

    const mentalHealthChartOptions = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Mental Health Providers Comparison",
            fontSize: 20
        },
        axisX: {
            title: "County",
        },
        axisY: {
            title: "Number of Mental Health Providers",
            includeZero: true,
            labelFormatter: this.addSymbols
        },
        data: [{
            type: "column",
            dataPoints: [
                { y:  this.state.numMentalHealth1, label: this.state.selectedCounty1 },
                { y:  this.state.numMentalHealth2, label: this.state.selectedCounty2 }
            ]
        }]
    }

    const percentUninsuredChartOptions = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Percent of Residents Uninsured Comparison",
            fontSize: 20
        },
        axisX: {
            title: "County",
        },
        axisY: {
            title: "Percent Uninsured",
            includeZero: true,
            labelFormatter: this.addSymbols
        },
        data: [{
            type: "column",
            dataPoints: [
                { y:  this.state.percentUninsured1, label: this.state.selectedCounty1 },
                { y:  this.state.percentUninsured2, label: this.state.selectedCounty2 }
            ]
        }]
    }

    const mortalityRateChartOptions = {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: "Mortality Rates Comparison",
            fontSize: 20
        },
        axisX: {
            labelFontSize: 10,
            minimum: 0
        },
        axisY: {
            title: "Rate Per 100,000",
            labelFontSize: 5,
            includeZero: true,
            labelFormatter: this.addSymbols
        },
        data: [{
            type: "bar",
            showInLegend: true,
            legendText: this.state.selectedCounty1,
            dataPoints: this.state.mortalityRates1
        }, {
            type: "bar",
            showInLegend: true,
            legendText: this.state.selectedCounty2,
            dataPoints: this.state.mortalityRates2
        }
    ]
    }

    return (
        <div className="App">
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <h3> Comparitive Analysis of Counties</h3>
                <p> On this page, you can select two counties and see side by side comparisons of data on the quality and access 
                    to care in each county. 
                </p>
            </Row>


            <Row>
                <Col flex={2}><FormGroup style={{ width: '40vw', margin: '0 auto' }}>
                    <label><strong>Select the first state.&nbsp;&nbsp;</strong></label>
                    <Select defaultValue="Select" style={{ width: 170 }} onChange={this.handleStateSelected1}>
                    {stateNames.map((item, index) => {
                      return (<Option key={item} value={item}>{item}</Option>)
                    })}
                    </Select>
                </FormGroup>
                <FormGroup style={{ width: '40vw', margin: '0 auto' }}>
                    <label><strong>Select the first county.&nbsp;&nbsp;</strong></label>
                    <Select defaultValue="Select" style={{ width: 300 }} onChange={this.handleCountySelected1}>
                    {this.state.countiesList1.map((item, index) => {
                      return (<Option key={item} value={item}>{item}</Option>)
                    })}
                    </Select>
                </FormGroup>
                </Col>
                <Col flex={2}><FormGroup style={{ width: '40vw', margin: '0 auto' }}>
                    <label><strong>Select the second state.&nbsp;&nbsp;</strong></label>
                    <Select defaultValue="Select" style={{ width: 170 }} onChange={this.handleStateSelected2}>
                    {stateNames.map((item, index) => {
                      return (<Option key={item} value={item}>{item}</Option>)
                    })}
                    </Select>
                </FormGroup>
                <FormGroup style={{ width: '40vw', margin: '0 auto' }}>
                    <label><strong>Select the second county.&nbsp;&nbsp;</strong></label>
                    <Select defaultValue="Select" style={{ width: 300 }} onChange={this.handleCountySelected2}>
                    {this.state.countiesList2.map((item, index) => {
                      return (<Option key={item} value={item}>{item}</Option>)
                    })}
                    </Select>
                </FormGroup>
                </Col>
              </Row>


              <Row>
              <FormGroup style={{ width: '10vw' }}>
                          <Button style={{ marginTop: '4vh' }} onClick={this.generateComparison}>Generate Comparison</Button>
                        </FormGroup>
            </Row>


            {(this.state.lengthRank1 !== "") && <Card style={{marginTop: '2vh'}}><CardBody>
            <CardTitle>Length and Quality of Life Rankings</CardTitle>
            <Row>
                 <div>
                <FormGroup style={{ width: '100vw' }}>
                    <p style={{color:"black"}} >Out of {this.state.numCounties1} counties in {this.state.selectedState1}, {this.state.selectedCounty1} is ranked {this.state.lengthRank1} for length of life and {this.state.qualityRank1} for quality of life.</p>
                    <p style={{color:"black"}} >Out of {this.state.numCounties2} counties in {this.state.selectedState2}, {this.state.selectedCounty2} is ranked {this.state.lengthRank2} for length of life and {this.state.qualityRank2} for quality of life.</p>
                </FormGroup>
                </div>
            </Row>
            </CardBody></Card>}

            
            {(this.state.healthRank1 !== "") && <Card style={{marginTop: '2vh'}}><CardBody>
            <CardTitle>Health Outcomes and Clinical Care Rankings</CardTitle>
            <Row>
                 <div>
                <FormGroup style={{ width: '100vw' }}>
                    <p style={{color:"black"}} >Out of {this.state.numCounties1} counties in {this.state.selectedState1}, {this.state.selectedCounty1} is ranked {this.state.healthRank1} for health outcomes and {this.state.clinicalRank1} for clinical care.</p>
                    <p style={{color:"black"}} >Out of {this.state.numCounties2} counties in {this.state.selectedState2}, {this.state.selectedCounty2} is ranked {this.state.healthRank2} for health outcomes and {this.state.clinicalRank2} for clinical care.</p>
                </FormGroup>
                </div>
            </Row>
            </CardBody></Card>}

            {this.state.mortalityRates1.length !== 0 && <Card style={{marginTop: '2vh'}}><CardBody><Row gutter='30' align='middle' justify='center'>
                <CanvasJSChart options= {mortalityRateChartOptions}/>
            </Row></CardBody></Card>}

            {(this.state.numPrimaryCare1 !== "") && <Card style={{marginTop: '2vh'}}><CardBody><Row>
            <Col flex={3}>
                <div>
                <CanvasJSChart options = {primaryCareChartOptions}
                /></div>
            </Col>
            <Col flex={3}>
                {(this.state.numDentists1 !== "") && <div>
                <CanvasJSChart options = {dentistsChartOptions}
                /></div>}
            </Col>
            <Col flex={3}>
                {(this.state.numMentalHealth1 !== "") && <div>
                <CanvasJSChart options = {mentalHealthChartOptions}
                /></div>}
            </Col>
        </Row></CardBody></Card>}

        {(this.state.percentUninsured1 !== "") && <Card style={{marginTop: '2vh'}}><CardBody><Row>
            <Col flex={3}>
                <p></p><p></p><p></p>
                 <div>
                    <CanvasJSChart options= {percentUninsuredChartOptions}/>
                </div>
            </Col>
        </Row></CardBody></Card>}
		

        </Form>
        </div>
      );
  }
}

export default ComparePage