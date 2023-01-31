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

const getCountiesFromState= async (stateCode) => {
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


export {
    getNewsRankings,
    getNameFromCode,
    getCountiesFromState,
    getCodeToNumericRanking, 
    getAccessRankings,
    getQualityRankings,
    getPublicHealthRankings,

}