const express = require('express');
const mysql      = require('mysql');
var cors = require('cors')


const routes = require('./routes')
const config = require('./config.json')

const app = express();

// whitelist localhost 3000
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));

// STATE NAME FROM CODE 
app.get('/map/getNameFromCode', routes.get_name_from_code)

// STATE RANKINGS 
app.get('/map/getNewsRankings', routes.get_news_rankings)

// COUNTIES FROM STATE CODE 
app.get('/map/getCountiesFromState', routes.get_counties_from_state)

// MAPPING FROM STATE CODE TO NUMERIC RANKING
app.get('/map/getCodeToNumericRanking', routes.get_code_to_ranking)

// MAPPING FROM STATE CODE TO ACCESS RANKING
app.get('/map/getAccessRankings', routes.get_access_rankings)

// MAPPING FROM STATE CODE TO QUALITY RANKING
app.get('/map/getQualityRankings', routes.get_quality_rankings)

// MAPPING FROM STATE CODE TO PUBLIC HEALTH RANKING
app.get('/map/getPublicHealthRankings', routes.get_publichealth_rankings)

// COUNTY MAP FROM STATE NAME 
app.get('/quality/getCountyMapLink', routes.get_county_map_link)

// COUNTIES FROM STATE NAME 
app.get('/quality/getCountiesFromStateName', routes.get_counties_from_state_name)

// MORTALITY RESULTS FROM COUNTIES
app.get('/quality/getCountyMortalityResults1', routes.get_county_mortality_results1)
app.get('/quality/getCountyMortalityResults2', routes.get_county_mortality_results2)
app.get('/quality/getCountyMortalityResults3', routes.get_county_mortality_results3)


app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
