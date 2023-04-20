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
            res.json({ results: results})
        }
    });
}

// return mapping of state name to selected ranking
async function get_rankings_list(req, res) {
    const rankingMethod = req.query.rankingMethod + "Ranking"

    // if overall ranking 
    if (rankingMethod == "OverallRanking") {
        // make database query with sum 
        connection.query(`
        SELECT Name, HealthCareAccessRanking + HealthCareQualityRanking + PublicHealthRanking AS Ranking
        FROM USNewsData
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
    });

    } else {
        // make database query
        connection.query(`
        SELECT Name, ${rankingMethod} AS Ranking
        FROM USNewsData
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
    });

    }
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
                res.json({ results: results})
            }
        });
    });

}

// max mortality rate from category and state
async function get_max_mortality(req, res) {
    const stateName = req.query.stateName
    const category = req.query.category 

    connection.query(`
    SELECT Code
    FROM USNewsData
    WHERE Name='${stateName}'
`, function (error, results, fields) {
        const stateCode = results[0].Code
        connection.query(`
        WITH Master AS (
            SELECT name, MortalityRates.FIPS AS FIPS, Category, MR
            FROM Counties
            JOIN  MortalityRates
            ON Counties.fips = MortalityRates.FIPS
            WHERE state='${stateCode}'
        )
        SELECT MR, name
        FROM Master
        WHERE MR = (SELECT MAX(MR) FROM Master WHERE Category='${category}')
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
    });
});
}

// min mortality rate from category and state
async function get_min_mortality(req, res) {
    const stateName = req.query.stateName
    const category = req.query.category 

    connection.query(`
    SELECT Code
    FROM USNewsData
    WHERE Name='${stateName}'
`, function (error, results, fields) {
        const stateCode = results[0].Code
        connection.query(`
        WITH Master AS (
            SELECT name, MortalityRates.FIPS AS FIPS, Category, MR
            FROM Counties
            JOIN  MortalityRates
            ON Counties.fips = MortalityRates.FIPS
            WHERE state='${stateCode}'
        )
        SELECT MR, name
        FROM Master
        WHERE MR = (SELECT MIN(MR) FROM Master WHERE Category='${category}')
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
    });
});
}

// avg mortality rate from category and state
async function get_avg_mortality(req, res) {
    const stateName = req.query.stateName
    const category = req.query.category 

    connection.query(`
    SELECT Code
    FROM USNewsData
    WHERE Name='${stateName}'
`, function (error, results, fields) {
        const stateCode = results[0].Code
        connection.query(`
        WITH Master AS (
            SELECT name, MortalityRates.FIPS AS FIPS, Category, MR
            FROM Counties
            JOIN  MortalityRates
            ON Counties.fips = MortalityRates.FIPS
            WHERE state='${stateCode}'
        )
        SELECT AVG(MR) AS MR
        FROM Master
        WHERE Category='${category}'
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
    });
});
}

async function get_qual_and_length(req, res) {
    const stateName = req.query.stateName

    // make database query
    connection.query(`
    SELECT *
    FROM LengthQualityOfLife
    WHERE CountyName IS NOT NULL AND State='${stateName}'
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
});
}

async function get_qual_and_length_first_quartile(req, res) {
    const stateName = req.query.stateName

    // make database query
    connection.query(`
    SELECT CountyName, LengthRank, QualRank
    FROM LengthQualityOfLife
    WHERE CountyName IS NOT NULL AND State='${stateName}' AND LengthQuartile=1 AND QualQuartile=1
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
});
}

async function get_qual_and_length_fourth_quartile(req, res) {
    const stateName = req.query.stateName

    // make database query
    connection.query(`
    SELECT CountyName, LengthRank, QualRank
    FROM LengthQualityOfLife
    WHERE CountyName IS NOT NULL AND State='${stateName}' AND LengthQuartile=4 AND QualQuartile=4
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
});

}

async function get_clinical_and_health(req, res) {
    const stateName = req.query.stateName

    // make database query
    connection.query(`
    SELECT County, OutcomesRank, OutcomeQuartile, ClinicalRank, ClinicalQuartile
    FROM ClinicalCareAndHealthOutcomes
    WHERE County IS NOT NULL AND State='${stateName}'
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
});
}

async function get_clinical_and_health_first_quartile(req, res) {
    const stateName = req.query.stateName

    // make database query
    connection.query(`
    SELECT County, OutcomesRank, ClinicalRank
    FROM ClinicalCareAndHealthOutcomes
    WHERE County IS NOT NULL AND State='${stateName}' AND OutcomeQuartile=1 AND ClinicalQuartile=1
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
});
}

async function get_clinical_and_health_fourth_quartile(req, res) {
    const stateName = req.query.stateName

    // make database query
    connection.query(`
    SELECT County, OutcomesRank, ClinicalRank
    FROM ClinicalCareAndHealthOutcomes
    WHERE County IS NOT NULL AND State='${stateName}' AND OutcomeQuartile=4 AND ClinicalQuartile=4
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
});
}

async function get_num_doctors(req, res) {
    const stateName = req.query.stateName

    // make database query
    connection.query(`
    SELECT *
    FROM NumDoctors
    WHERE County IS NOT NULL AND State='${stateName}'
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
    });
}

async function get_num_doctors_first_quartile(req, res) {
    const stateName = req.query.stateName

    // make database query
    connection.query(`
    SELECT County, RatioPrimaryCare, RatioDentists, RatioMentalHealth
    FROM NumDoctors
    WHERE County IS NOT NULL AND State='${stateName}' AND PrimaryCareQuartile=1 AND DentistQuartile=1 AND MentalHealthQuartile=1
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
    });
}

async function get_num_doctors_fourth_quartile(req, res) {
    const stateName = req.query.stateName

    // make database query
    connection.query(`
    SELECT County, RatioPrimaryCare, RatioDentists, RatioMentalHealth
    FROM NumDoctors
    WHERE County IS NOT NULL AND State='${stateName}' AND PrimaryCareQuartile=4 AND DentistQuartile=4 AND MentalHealthQuartile=4
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
    });
}

async function get_num_uninsured(req, res) {
    const stateName = req.query.stateName

    // make database query
    connection.query(`
    SELECT *
    FROM NumUninsured
    WHERE County IS NOT NULL AND State='${stateName}'
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
    });
}

async function get_max_uninsured(req, res) {
    const stateName = req.query.stateName
    // make connection
    connection.query(`
        WITH Master AS (
            SELECT PercentUninsured, County
            FROM NumUninsured
            WHERE state='${stateName}'
        )
        SELECT PercentUninsured, County
        FROM Master
        WHERE PercentUninsured = (SELECT MAX(PercentUninsured) FROM Master)
`, function (error, results, fields) {

    if (error) {
        console.log(error)
        res.json({ error: error })
    } else if (results) {
        res.json({ results: results})
    }
});
}

async function get_min_uninsured(req, res) {
    const stateName = req.query.stateName

    // make connection
    connection.query(`
        WITH Master AS (
            SELECT PercentUninsured, County
            FROM NumUninsured
            WHERE state='${stateName}'
        )
        SELECT PercentUninsured, County
        FROM Master
        WHERE PercentUninsured = (SELECT MIN(PercentUninsured) FROM Master)
`, function (error, results, fields) {

    if (error) {
        console.log(error)
        res.json({ error: error })
    } else if (results) {
        res.json({ results: results})
    }
});
}

async function get_avg_uninsured(req, res) {
    const stateName = req.query.stateName

    // make connection
    connection.query(`
        SELECT AVG(PercentUninsured) AS PercentUninsured, County
        FROM NumUninsured
        WHERE state='${stateName}'
`, function (error, results, fields) {

    if (error) {
        console.log(error)
        res.json({ error: error })
    } else if (results) {
        res.json({ results: results})
    }
});
}

async function get_county_names(req, res) {
    const name = req.query.stateName

    // fetch code from US Maps table then fetch counties 
    connection.query(`
        SELECT Code
        FROM USNewsData
        WHERE Name='${name}'
    `, function (error, results, fields) {
        const stateCode = results[0].Code
        connection.query(`
        SELECT name
        FROM Counties
        WHERE state= '${stateCode}'
    `, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results})
        }
    });
    });
}

async function get_county_length_quality_rank(req, res) {
    const countyName = req.query.countyName
    const stateName = req.query.stateName

    // get state code
    connection.query(`
    SELECT Code
    FROM USNewsData
    WHERE Name='${stateName}'
    `, function(error, results, fields) {
        const stateCode = results[0].Code

        // get county fips 
        connection.query(`
            SELECT fips
            FROM Counties
            WHERE name='${countyName}' AND state='${stateCode}'
        `, function (error, results, fields) {
                const countyFips = results[0].fips
                connection.query(`
                SELECT LengthRank, QualRank
                FROM LengthQualityOfLife
                WHERE FIPS=${countyFips}
            `, function (error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results})
                }
            });
        });
    });
    
}

async function get_county_clinical_health_rank(req, res) {
    const countyName = req.query.countyName
    const stateName = req.query.stateName

        // get state code
        connection.query(`
        SELECT Code
        FROM USNewsData
        WHERE Name='${stateName}'
        `, function(error, results, fields) {
            const stateCode = results[0].Code
    
            // get county fips 
            connection.query(`
                SELECT fips
                FROM Counties
                WHERE name='${countyName}' AND state='${stateCode}'
            `, function (error, results, fields) {
                    const countyFips = results[0].fips
                    connection.query(`
                    SELECT OutcomesRank, ClinicalRank
                    FROM ClinicalCareAndHealthOutcomes
                    WHERE FIPS=${countyFips}
                `, function (error, results, fields) {
    
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: results})
                    }
                });
            });
        });
}

async function get_county_mortality_rates(req, res) {
    const countyName = req.query.countyName
    const stateName = req.query.stateName

    // get state code
    connection.query(`
    SELECT Code
    FROM USNewsData
    WHERE Name='${stateName}'
    `, function(error, results, fields) {
        const stateCode = results[0].Code

        // get county fips 
        connection.query(`
            SELECT fips
            FROM Counties
            WHERE name='${countyName}' AND state='${stateCode}'
        `, function (error, results, fields) {
                const countyFips = results[0].fips
                connection.query(`
                SELECT *
                FROM MortalityRates
                WHERE FIPS=${countyFips}
            `, function (error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results})
                }
            });
        });
    });
    
}

async function get_county_number_doctors(req, res) {
    const countyName = req.query.countyName
    const stateName = req.query.stateName

    // get state code
    connection.query(`
    SELECT Code
    FROM USNewsData
    WHERE Name='${stateName}'
    `, function(error, results, fields) {
        const stateCode = results[0].Code

        // get county fips 
        connection.query(`
            SELECT fips
            FROM Counties
            WHERE name='${countyName}' AND state='${stateCode}'
        `, function (error, results, fields) {
                const countyFips = results[0].fips
                connection.query(`
                SELECT *
                FROM NumDoctors
                WHERE FIPS=${countyFips}
            `, function (error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results})
                }
            });
        });
    });
}

async function get_county_percent_uninsured(req, res) {
    const countyName = req.query.countyName
    const stateName = req.query.stateName

    // get state code
    connection.query(`
    SELECT Code
    FROM USNewsData
    WHERE Name='${stateName}'
    `, function(error, results, fields) {
        const stateCode = results[0].Code

        // get county fips 
        connection.query(`
            SELECT fips
            FROM Counties
            WHERE name='${countyName}' AND state='${stateCode}'
        `, function (error, results, fields) {
                const countyFips = results[0].fips
                connection.query(`
                SELECT *
                FROM NumUninsured
                WHERE FIPS=${countyFips}
            `, function (error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results})
                }
            });
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
    get_rankings_list,
    get_county_map_link,
    get_counties_from_state_name,
    get_county_mortality_results1,
    get_county_mortality_results2,
    get_county_mortality_results3,
    get_max_mortality,
    get_min_mortality,
    get_avg_mortality,
    get_qual_and_length,
    get_qual_and_length_first_quartile,
    get_qual_and_length_fourth_quartile,
    get_clinical_and_health,
    get_clinical_and_health_first_quartile,
    get_clinical_and_health_fourth_quartile,
    get_num_doctors,
    get_num_doctors_first_quartile,
    get_num_doctors_fourth_quartile,
    get_num_uninsured,
    get_max_uninsured,
    get_min_uninsured,
    get_avg_uninsured,
    get_county_names,
    get_county_length_quality_rank,
    get_county_clinical_health_rank,
    get_county_mortality_rates,
    get_county_number_doctors,
    get_county_percent_uninsured
}