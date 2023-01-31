const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

// connection details
const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();

// return state name given state code 
async function get_name_from_code(req, res) {
    const code = req.query.stateCode

    // make database query
    connection.query(`
        SELECT Name 
        FROM USNewsData
        WHERE Code= '${code}'
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            console.log(results)
            res.json({ results: results})
        }
    });
}

// fetch US news rankings from state code 
async function get_news_rankings(req, res) {
    const code = req.query.stateCode

    // make database query
    connection.query(`
        SELECT Code, Name, HealthCareAccessRanking, HealthCareQualityRanking, PublicHealthRanking,(HealthCareAccessRanking + HealthCareQualityRanking + PublicHealthRanking) AS CompositeRanking
        FROM USNewsData
        WHERE Code= '${code}'
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            console.log(results)
            res.json({ results: results})
        }
    });
}

// return list of counties from state code
async function get_counties_from_state(req, res) {
    const code = req.query.stateCode

    // make database query
    connection.query(`
        SELECT * 
        FROM Counties
        WHERE state= '${code}'
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            console.log(results)
            res.json({ results: results})
        }
    });
}

// return mapping of state code to conglomerate ranking 
async function get_code_to_ranking(req, res) {
    // make database query
    connection.query(`
        SELECT Code, (HealthCareAccessRanking + HealthCareQualityRanking + PublicHealthRanking) AS Ranking
        FROM USNewsData
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            console.log(results)
            res.json({ results: results})
        }
    });
}

// return mapping of state code to access ranking 
async function get_access_rankings(req, res) {
    // make database query
    connection.query(`
        SELECT Code, HealthCareAccessRanking AS Ranking
        FROM USNewsData
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            console.log(results)
            res.json({ results: results})
        }
    });
}

// return mapping of state code to quality ranking 
async function get_quality_rankings(req, res) {
    // make database query
    connection.query(`
        SELECT Code, HealthCareQualityRanking AS Ranking
        FROM USNewsData
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            console.log(results)
            res.json({ results: results})
        }
    });
}

// return mapping of state code to public health ranking 
async function get_publichealth_rankings(req, res) {
    // make database query
    connection.query(`
        SELECT Code, PublicHealthRanking AS Ranking
        FROM USNewsData
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            console.log(results)
            res.json({ results: results})
        }
    });
}

module.exports = {
    get_news_rankings,
    get_name_from_code,
    get_counties_from_state,
    get_code_to_ranking,
    get_access_rankings,
    get_quality_rankings,
    get_publichealth_rankings,
}