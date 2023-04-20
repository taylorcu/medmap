import config from './config.json'

const getNewsRankings = async (stateCode) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/map/getNewsRankings?stateCode=${stateCode}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getNameFromCode = async (stateCode) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/map/getNameFromCode?stateCode=${stateCode}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getCountiesFromState = async (stateCode) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/map/getCountiesFromState?stateCode=${stateCode}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getCodeToNumericRanking = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/map/getCodeToNumericRanking`, {
        method: 'GET',
        
    })
    return res.json()
}

const getAccessRankings = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/map/getAccessRankings`, {
        method: 'GET',
        
    })
    return res.json()
}

const getQualityRankings = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/map/getQualityRankings`, {
        method: 'GET',
        
    })
    return res.json()
}

const getPublicHealthRankings = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/map/getPublicHealthRankings`, {
        method: 'GET',
        
    })
    return res.json()
}

const getRankingsList = async (rankingMethod) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/map/getRankingsList?rankingMethod=${rankingMethod}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getCountyMapLink = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getCountyMapLink?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getCountiesFromStateName = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getCountiesFromStateName?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getCountyMortalityResults1 = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getCountyMortalityResults1?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getCountyMortalityResults2 = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getCountyMortalityResults2?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getCountyMortalityResults3 = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getCountyMortalityResults3?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getMaxMortality = async (category, stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getMaxMortality?stateName=${stateName}&category=${category}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getMinMortality = async (category, stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getMinMortality?stateName=${stateName}&category=${category}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getAvgMortality = async (category, stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getAvgMortality?stateName=${stateName}&category=${category}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getQualAndLengthResults = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getQualAndLengthResults?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getQualAndLengthFirstQuartile = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getQualAndLengthFirstQuartile?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getQualAndLengthFourthQuartile = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getQualAndLengthFourthQuartile?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getClinicalAndHealthResults = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getClinicalAndHealthResults?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getClinicalAndHealthFirstQuartile = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getClinicalAndHealthFirstQuartile?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getClinicalAndHealthFourthQuartile = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/quality/getClinicalAndHealthFourthQuartile?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getNumDoctorsResults = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/access/getNumDoctorsResults?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getNumDoctorsFirstQuartile = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/access/getNumDoctorsFirstQuartile?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getNumDoctorsFourthQuartile = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/access/getNumDoctorsFourthQuartile?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getNumUninsuredResults = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/access/getNumUninsuredResults?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getMaxUninsuredResults = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/access/getMaxUninsuredResults?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getMinUninsuredResults = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/access/getMinUninsuredResults?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getAvgUninsuredResults = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/access/getAvgUninsuredResults?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getCountyNamesFromStateName = async (stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/compare/getCountyNamesFromStateName?stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getCountyLengthQualityRank = async (countyName, stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/compare/getCountyLengthQualityRank?countyName=${countyName}&stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getCountyClinicalAndHealthRank = async (countyName, stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/compare/getCountyClinicalAndHealthRank?countyName=${countyName}&stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getCountyMortalityRates = async (countyName, stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/compare/getCountyMortalityRates?countyName=${countyName}&stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getNumberDoctorsByCounty = async (countyName, stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/compare/getNumberDoctorsByCounty?countyName=${countyName}&stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}

const getPercentUninsuredByCounty = async (countyName, stateName) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/compare/getPercentUninsuredByCounty?countyName=${countyName}&stateName=${stateName}`, {
        method: 'GET',
        
    })
    return res.json()
}




export {
    getNewsRankings,
    getNameFromCode,
    getCountiesFromState,
    getCodeToNumericRanking, 
    getAccessRankings,
    getQualityRankings,
    getPublicHealthRankings,
    getRankingsList,
    getCountyMapLink,
    getCountiesFromStateName,
    getCountyMortalityResults1,
    getCountyMortalityResults2,
    getCountyMortalityResults3,
    getMaxMortality,
    getMinMortality,
    getAvgMortality,
    getQualAndLengthResults,
    getQualAndLengthFirstQuartile,
    getQualAndLengthFourthQuartile,
    getClinicalAndHealthResults,
    getClinicalAndHealthFirstQuartile,
    getClinicalAndHealthFourthQuartile,
    getNumDoctorsResults,
    getNumDoctorsFirstQuartile,
    getNumDoctorsFourthQuartile,
    getNumUninsuredResults,
    getMaxUninsuredResults,
    getMinUninsuredResults,
    getAvgUninsuredResults,
    getCountyNamesFromStateName,
    getCountyLengthQualityRank,
    getCountyClinicalAndHealthRank,
    getCountyMortalityRates,
    getNumberDoctorsByCounty,
    getPercentUninsuredByCounty

}