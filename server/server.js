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

// MAPPING FROM STATE NAME TO SELECTED RANKING
app.get('/map/getRankingsList', routes.get_rankings_list)

// COUNTY MAP FROM STATE NAME 
app.get('/quality/getCountyMapLink', routes.get_county_map_link)

// COUNTIES FROM STATE NAME 
app.get('/quality/getCountiesFromStateName', routes.get_counties_from_state_name)

// MORTALITY RESULTS FROM COUNTIES
app.get('/quality/getCountyMortalityResults1', routes.get_county_mortality_results1)
app.get('/quality/getCountyMortalityResults2', routes.get_county_mortality_results2)
app.get('/quality/getCountyMortalityResults3', routes.get_county_mortality_results3)

// MAX, MIN, AVG MORTALITY FROM STATE AND CATEGORY
app.get('/quality/getMaxMortality', routes.get_max_mortality)
app.get('/quality/getMinMortality', routes.get_min_mortality)
app.get('/quality/getAvgMortality', routes.get_avg_mortality)

// QUALITY AND LENGTH OF LIFE RESULTS 
app.get('/quality/getQualAndLengthResults', routes.get_qual_and_length)

// COUNTIES IN FIRST AND FOURTH QUARTILE QUALITY AND LENGTH OF LIFE 
app.get('/quality/getQualAndLengthFirstQuartile', routes.get_qual_and_length_first_quartile)
app.get('/quality/getQualAndLengthFourthQuartile', routes.get_qual_and_length_fourth_quartile)

// CLINICAL CARE AND HEALTH OUTCOMES RESULTS 
app.get('/quality/getClinicalAndHealthResults', routes.get_clinical_and_health)

// COUNTIES IN FIRST AND FOURTH QUARTILE CLINICAL AND HEALTH
app.get('/quality/getClinicalAndHealthFirstQuartile', routes.get_clinical_and_health_first_quartile)
app.get('/quality/getClinicalAndHealthFourthQuartile', routes.get_clinical_and_health_fourth_quartile)

// NUM DOCTORS RESULTS FROM COUNTIES 
app.get('/access/getNumDoctorsResults', routes.get_num_doctors)

// COUNTIES IN FIRST AND FOURTH QUARTILE ALL NUM DOCTORS
app.get('/access/getNumDoctorsFirstQuartile', routes.get_num_doctors_first_quartile)
app.get('/access/getNumDoctorsFourthQuartile', routes.get_num_doctors_fourth_quartile)

// NUM UNINSURED RESULTS FROM COUNTIES 
app.get('/access/getNumUninsuredResults', routes.get_num_uninsured)

// STATISTICS UNINSURED RESULTS FROM STATE 
app.get('/access/getMaxUninsuredResults', routes.get_max_uninsured)
app.get('/access/getMinUninsuredResults', routes.get_min_uninsured)
app.get('/access/getAvgUninsuredResults', routes.get_avg_uninsured)

// COUNTY NAMES FROM STATE NAME
app.get('/compare/getCountyNamesFromStateName', routes.get_county_names)

// LENGTH AND QUALITY RANK FOR COUNTY
app.get('/compare/getCountyLengthQualityRank', routes.get_county_length_quality_rank)

// HEALTH AND CLINICAL RANK FOR COUNTY
app.get('/compare/getCountyClinicalAndHealthRank', routes.get_county_clinical_health_rank)

// MORTALITY RATES FOR COUNTY
app.get('/compare/getCountyMortalityRates', routes.get_county_mortality_rates)

// NUMBER DOCTORS FOR COUNTY
app.get('/compare/getNumberDoctorsByCounty', routes.get_county_number_doctors)

// PERCENT UNINSURED BY COUNTY
app.get('/compare/getPercentUninsuredByCounty', routes.get_county_percent_uninsured)


app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
