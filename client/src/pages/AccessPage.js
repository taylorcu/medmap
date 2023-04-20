import React, { Component } from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle } from "shards-react";
import {
  Table,
  Pagination,
  Select,
  Row
} from 'antd'

import MenuBar from '../components/MenuBar';
import { stateNames } from '../components/StateNameArray';
import { getCountiesFromStateName, getCountyMapLink, getNumDoctorsResults, getNumUninsuredResults, 
  getMaxUninsuredResults, getMinUninsuredResults, getAvgUninsuredResults, getNumDoctorsFirstQuartile,
  getNumDoctorsFourthQuartile} from '../fetcher'
const { Option } = Select;

// COLUMNS FOR NUM DOCTORS DISPLAY
const numPrimaryCareColumns = [
    {
        title: 'County Name',
        dataIndex: 'County',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Number of Primary Care Physicians',
        dataIndex: 'NumPrimaryCare',
        key: 'NumPrimaryCare',
        sorter: (a, b) => a.NumPrimaryCare - b.NumPrimaryCare
      },
      {
        title: 'Ratio of Residents to Primary Care Physicians',
        dataIndex: 'RatioPrimaryCare',
        key: 'RatioPrimaryCare',
        sorter: (a, b) => a.RatioPrimaryCare.localeCompare(b.RatioPrimaryCare)
      },
      {
        title: 'Primary Care Physicians Ratio Quartile',
        dataIndex: 'PrimaryCareQuartile',
        key: 'PrimaryCareQuartile',
        sorter: (a, b) => a.PrimaryCareQuartile - b.PrimaryCareQuartile
      }
  ]; 

  const numDentistsColumns = [
    {
        title: 'County Name',
        dataIndex: 'County',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Number of Dentists',
        dataIndex: 'NumDentists',
        key: 'NumDentists',
        sorter: (a, b) => a.NumDentists - b.NumDentists
      },
      {
        title: 'Ratio of Residents to Dentists',
        dataIndex: 'RatioDentists',
        key: 'RatioDentists',
        sorter: (a, b) => a.RatioDentists.localeCompare(b.RatioDentists)
      },
      {
        title: 'Dentist Ratio Quartile',
        dataIndex: 'DentistQuartile',
        key: 'DentistQuartile',
        sorter: (a, b) => a.DentistQuartile - b.DentistQuartile
      }
  ]; 

  const numMentalHealthColumns = [
    {
        title: 'County Name',
        dataIndex: 'County',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Number of Mental Health Providers',
        dataIndex: 'NumMentalHealth',
        key: 'NumMentalHealth',
        sorter: (a, b) => a.NumMentalHealth - b.NumMentalHealth
      },
      {
        title: 'Ratio of Residents to Mental Health Providers',
        dataIndex: 'RatioMentalHealth',
        key: 'RatioMentalHealth',
        sorter: (a, b) => a.RatioMentalHealth.localeCompare(b.RatioMentalHealth)
      },
      {
        title: 'Mental Health Providers Ratio Quartile',
        dataIndex: 'MentalHealthQuartile',
        key: 'MentalHealthQuartile',
        sorter: (a, b) => a.MentalHealthQuartile - b.MentalHealthQuartile
      }
  ]; 

  // COLUMNS FOR FIRST QUARTILE NUM DOCTOR COUNTIES
  const firstQuartileColumns = [
    {
        title: 'County Name',
        dataIndex: 'County',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Ratio of Residents to Primary Care Physicians',
        dataIndex: 'RatioPrimaryCare',
        key: 'RatioPrimaryCare',
        sorter: (a, b) => a.RatioPrimaryCare.localeCompare(b.RatioPrimaryCare)
      },
      {
        title: 'Ratio of Residents to Dentists',
        dataIndex: 'RatioDentists',
        key: 'RatioDentists',
        sorter: (a, b) => a.RatioDentists.localeCompare(b.RatioDentists)
      },
      {
        title: 'Ratio of Residents to Mental Health Providers',
        dataIndex: 'RatioMentalHealth',
        key: 'RatioMentalHealth',
        sorter: (a, b) => a.RatioMentalHealth.localeCompare(b.RatioMentalHealth)
      }
  ]; 

    // COLUMNS FOR FOURTH QUARTILE NUM DOCTOR COUNTIES
    const fourthQuartileColumns = [
      {
          title: 'County Name',
          dataIndex: 'County',
          key: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
          title: 'Ratio of Residents to Primary Care Physicians',
          dataIndex: 'RatioPrimaryCare',
          key: 'RatioPrimaryCare',
          sorter: (a, b) => a.RatioPrimaryCare.localeCompare(b.RatioPrimaryCare)
        },
        {
          title: 'Ratio of Residents to Dentists',
          dataIndex: 'RatioDentists',
          key: 'RatioDentists',
          sorter: (a, b) => a.RatioDentists.localeCompare(b.RatioDentists)
        },
        {
          title: 'Ratio of Residents to Mental Health Providers',
          dataIndex: 'RatioMentalHealth',
          key: 'RatioMentalHealth',
          sorter: (a, b) => a.RatioMentalHealth.localeCompare(b.RatioMentalHealth)
        }
    ]; 

  // COLUMNS FOR NUM UNINSURED RESULTS
  const numUninsuredColumns = [
    {
        title: 'County Name',
        dataIndex: 'County',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Number of Uninsured Residents',
        dataIndex: 'NumUninsured',
        key: 'NumUninsured',
        sorter: (a, b) => a.NumUninsured - b.NumUninsured
      },
      {
        title: 'Percentage of Uninsured Residents',
        dataIndex: 'PercentUninsured',
        key: 'PercentUninsured',
        sorter: (a, b) => a.PercentUninsured - b.PercentUninsured
      }
  ];

class AccessPage extends React.Component {
    // CLASS CONSTRUCTOR
    constructor(props) {
        super(props)

        this.state = {
            // GENERAL
            selectedState: "",
            countyMapLink: "",
            countyResults: [],
            numCounties: "",
            displayImage: false,

            // NUM DOCTORS
            numDoctorsResults: [],
            numDoctorsFirstQuartileCounties: [],
            numDoctorsFourthQuartileCounties: [],
            displayQuartileHealthcareProviders: false,

            // UNINSURED
            numUninsuredResults: [],
            maxPercent: "",
            maxCounty: "",
            minPercent: "",
            minCounty: "",
            avgPercent: "",
        }

        this.handleStateSelected = this.handleStateSelected.bind(this)
        this.handleMapDisplaySwitch = this.handleMapDisplaySwitch.bind(this)
        this.handleToggleHealthcareProviders = this.handleToggleHealthcareProviders.bind(this)
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
            this.setState({ numCounties: res.results.length})
        });

        // call function to get data on number of doctors
        getNumDoctorsResults(value).then(res => {
            this.setState({ numDoctorsResults: res.results });
        });

        // call function to get first quartile counties 
        getNumDoctorsFirstQuartile(value).then(res => {
          this.setState({ numDoctorsFirstQuartileCounties: res.results })
        });

        // call function to get fourth quartile counties
        getNumDoctorsFourthQuartile(value).then(res => {
          this.setState({ numDoctorsFourthQuartileCounties: res.results })
        });

        // call function to get data on number of people uninsured
        getNumUninsuredResults(value).then(res => {
            this.setState({ numUninsuredResults: res.results });
        });

        // get average, minimum, and maximum percent of people uninsured
        getMaxUninsuredResults(value).then(res => {
          this.setState({ maxPercent: res.results[0].PercentUninsured })
          this.setState({ maxCounty: res.results[0].County })
        });

        getMinUninsuredResults(value).then(res => {
          this.setState({ minPercent: res.results[0].PercentUninsured })
          this.setState({ minCounty: res.results[0].County })
        });

        getAvgUninsuredResults(value).then(res => {
          this.setState({ avgPercent: res.results[0].PercentUninsured })
        });
    }

    // HANDLE MAP DISPLAY BEING SWITCHED
    handleMapDisplaySwitch() {
      let temp = this.state.displayImage
      this.setState({ displayImage: !temp })
    }

    // HANDLE NUM DOCTORS QUARTILE BEING SWITCHED 
    handleToggleHealthcareProviders() {
      let temp = this.state.displayQuartileHealthcareProviders
      console.log(!temp)
      this.setState({ displayQuartileHealthcareProviders: !temp })
    }

    componentDidMount() {
    } 

  render() {

    return (
        <div className="App">
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <h3> Access of Healthcare by County</h3>
                <p>

                    On this page, you can select a state and see its rankings and data about the access of healthcare within each 
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
              {this.state.selectedState !== "" && <Card style={{marginTop: '2vh'}}><CardBody><FormGroup style={{ width: '10vw' }} alignItems="center">
                          <Button style={{ marginTop: '4vh' }} onClick={this.handleMapDisplaySwitch}>Toggle Map Display</Button>
                        </FormGroup>
              {this.state.displayImage && <div align="center"><img src={this.state.countyMapLink}></img></div>}</CardBody></Card>}


              {(this.state.numDoctorsResults.length !== 0) && <Card style={{marginTop: '2vh'}}><div>
                <CardTitle>Number, Ratio, and Quartile for Healthcare Providers</CardTitle>
                <CardBody>
                  <Row>
                    <p>This section provides data on the number of primary care physicians, dentists, and mental health providers by county.
                      The ratio provided gives the number of providers per resident, and the quartile (1-4) is based on the ratio data. This data is compiled by the Wisconsin Institute of Health, as of 2020. Toggle the button below to see the counties (and their ratios) that have all three categories of providers  
                    in the first or fourth quartile.</p>
                  </Row>
                  <Row>
                  <label>Ranking out of {this.state.numCounties} counties in the state.</label>
                  </Row>
                  <Row>
                  <Table dataSource={this.state.numDoctorsResults} columns={numPrimaryCareColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                <Row>
                  <Table dataSource={this.state.numDoctorsResults} columns={numDentistsColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                <Row>
                  <Table dataSource={this.state.numDoctorsResults} columns={numMentalHealthColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                <FormGroup style={{ width: '100vw' }} alignItems="center">
                          <Button style={{ marginTop: '4vh' }} onClick={this.handleToggleHealthcareProviders}>Toggle Display of Top and Bottom Quartile Tables</Button>
                        </FormGroup>
                </CardBody>
              </div></Card>}

              {(this.state.displayQuartileHealthcareProviders) && <Card style={{marginTop: '2vh'}}><div>
                <CardTitle>Counties in the 1st Quartile for Primary Care Physicians, Dentists, and Mental Health Providers</CardTitle>
                <CardBody>
                <Row>
                  <Table dataSource={this.state.numDoctorsFirstQuartileCounties} columns={firstQuartileColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                </CardBody>
              </div></Card>}

              {(this.state.displayQuartileHealthcareProviders) && <Card style={{marginTop: '2vh'}}><div>
                <CardTitle>Counties in the 4th Quartile for Primary Care Physicians, Dentists, and Mental Health Providers</CardTitle>
                <CardBody>
                <Row>
                  <Table dataSource={this.state.numDoctorsFourthQuartileCounties} columns={fourthQuartileColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                </CardBody>
              </div></Card>}

              {(this.state.numUninsuredResults.length !== 0) && <Card style={{marginTop: '2vh'}}><div>
                <CardTitle>Number and Percentage of Uninsured Residents</CardTitle>
                <CardBody>
                  <Row>
                  <p>This section provides the number and percentage of uninsured residents in each county, also from the Wisconsin Institute of Health, as of 2020.
                    Below is the county with the maximum and minimum percent of uninsured residents, as well as the average across counties in the state.
                  </p>
                  </Row>
                  <Row>
                  <Table dataSource={this.state.numUninsuredResults} columns={numUninsuredColumns} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>
                </Row>
                <Row>
                <FormGroup style={{ width: '100vw' }}>
                    <p style={{color:"red"}} >Maximum: {this.state.maxPercent}% uninsured in {this.state.maxCounty} County.</p>
                    <p style={{color:"green"}} >Minimum: {this.state.minPercent}% uninsured in {this.state.minCounty} County.</p>
                    <p style={{color:"black"}} >Average: {this.state.avgPercent}% uninsured.</p>
                </FormGroup>
                </Row></CardBody>
              </div></Card>}

        </Form>
        </div>
      );
  }
}

export default AccessPage