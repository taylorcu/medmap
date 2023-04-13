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

// fetch county map link from state name 
async function get_county_map_link(req, res) {
    const name = req.query.stateName

    // make database query
    connection.query(`
        SELECT Link 
        FROM CountyMaps
        WHERE State= '${name}'
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

// fetch counties list from state name 
async function get_counties_from_state_name(req, res) {
    const name = req.query.stateName

    // fetch code from US Maps table then fetch counties 
    connection.query(`
        SELECT Code
        FROM USNewsData
        WHERE Name='${name}'
    `, function (error, results, fields) {
        const stateCode = results[0].Code
        connection.query(`
        SELECT * 
        FROM Counties
        WHERE state= '${stateCode}'
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            console.log(results)
            res.json({ results: results})
        }
    });
    });
    
}

// fetch county mortality results from counties 
async function get_county_mortality_results1(req, res) {
    const name = req.query.stateName

    // fetch code from US Maps table then fetch counties 
    connection.query(`
        SELECT Code
        FROM USNewsData
        WHERE Name='${name}'
    `, function (error, results, fields) {
            const stateCode = results[0].Code
            connection.query(`
            WITH Master AS (
                SELECT name, MortalityRates.FIPS AS FIPS, Category, MR
                FROM Counties
                JOIN  MortalityRates
                ON Counties.fips = MortalityRates.FIPS
                WHERE state='${stateCode}'
            ),
            NN As (
                SELECT FIPS, MR AS MRNN
                FROM Master
                WHERE Category='Neonatal disorders'
            ),
            HIV AS (
                SELECT FIPS, MR AS MRHIV
                FROM Master
                WHERE Category='HIV/AIDS and tuberculosis'
            ),
            MUS AS (
                SELECT FIPS, MR AS MRMUS
                FROM Master
                WHERE Category='Musculoskeletal disorders'
            ),
            Named AS (
                SELECT name, NN.FIPS, MRNN
                FROM Master NATURAL JOIN NN
            )
            SELECT DISTINCT name, MRNN, MRHIV, MRMUS
            FROM Named NATURAL JOIN HIV NATURAL JOIN MUS
        `, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                console.log('mortality')
                console.log(results)
                res.json({ results: results})
            }
        });
    });

}

// fetch county mortality results from counties 
async function get_county_mortality_results2(req, res) {
    const name = req.query.stateName

    // fetch code from US Maps table then fetch counties 
    connection.query(`
        SELECT Code
        FROM USNewsData
        WHERE Name='${name}'
    `, function (error, results, fields) {
            const stateCode = results[0].Code
            connection.query(`
            WITH Master AS (
                SELECT name, MortalityRates.FIPS AS FIPS, Category, MR
                FROM Counties
                JOIN  MortalityRates
                ON Counties.fips = MortalityRates.FIPS
                WHERE state='${stateCode}'
            ),
            DIG AS (
                SELECT FIPS, MR AS MRDIG
                FROM Master
                WHERE Category='Digestive diseases'
            ),
            RESP AS (
                SELECT FIPS, MR AS MRRESP
                FROM Master
                WHERE Category='Chronic respiratory diseases'
            ),
            DIA AS (
                SELECT FIPS, MR AS MRDIA
                FROM Master
                WHERE Category='Diabetes; urogenital; blood; and endocrine diseases'
            ),
            Named AS (
                SELECT name, DIG.FIPS, MRDIG
                FROM Master NATURAL JOIN DIG
            )
            SELECT DISTINCT name, MRDIG, MRRESP, MRDIA
            FROM Named NATURAL JOIN RESP NATURAL JOIN DIA
        `, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                console.log('mortality')
                console.log(results)
                res.json({ results: results})
            }
        });
    });

}

// fetch county mortality results from counties 
async function get_county_mortality_results3(req, res) {
    const name = req.query.stateName

    // fetch code from US Maps table then fetch counties 
    connection.query(`
        SELECT Code
        FROM USNewsData
        WHERE Name='${name}'
    `, function (error, results, fields) {
            const stateCode = results[0].Code
            connection.query(`
            WITH Master AS (
                SELECT name, MortalityRates.FIPS AS FIPS, Category, MR
                FROM Counties
                JOIN  MortalityRates
                ON Counties.fips = MortalityRates.FIPS
                WHERE state='${stateCode}'
            ),
            NUER AS (
                SELECT FIPS, MR AS MRNUER
                FROM Master
                WHERE Category='Neurological disorders'
            ),
            LIV AS (
                SELECT FIPS, MR AS MRLIV
                FROM Master
                WHERE Category='Cirrhosis and other chronic liver diseases'
            ),
            CARD AS (
                SELECT FIPS, MR AS MRCARD
                FROM Master
                WHERE Category='Cardiovascular diseases'
            ),
            MAT AS (
                SELECT FIPS, MR AS MRMAT
                FROM Master
                WHERE Category='Maternal disorders'
            ),
            Named AS (
                SELECT name, NUER.FIPS, MRNUER
                FROM Master NATURAL JOIN NUER
            )
            SELECT DISTINCT name, MRNUER, MRLIV, MRCARD, MRMAT
            FROM Named NATURAL JOIN LIV NATURAL JOIN CARD NATURAL JOIN MAT
        `, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                console.log('mortality')
                console.log(results)
                res.json({ results: results})
            }
        });
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
    get_county_map_link,
    get_counties_from_state_name,
    get_county_mortality_results1,
    get_county_mortality_results2,
    get_county_mortality_results3
}