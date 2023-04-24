# MedMap

Project Description: This is my (Taylor Cunningham) senior design project. The general idea of the application is to create an interface for users to access data on the access and quality of healthcare on a county-level. The homepage gives a description of each of the available tabs and their purpose. 

Running the code: This should be run with node version 16 (have run into connection errors otherwise). I have found switching node versions to be easiest when using nvm. npm install in both the client and server directly and then use npm start to run locally. In some cases on running npm install, I have run into initial errors about react dependencies being incompatible, but using -f to force has never caused any issues.

Dependencies: This application uses react-use-map (to display the interactive map of the US on the map page), react-shards (for HTML display), and react-canvasjs-react (for display of charts). All necessary dependencies will be installed using npm install.  

Data sources and tabs: The data already included in the application is from the following sources 
1. State rankings of public health, healthcare access, and healthcare quality -- US News and World Reports, 2023
2. County ranking for length of life, quality of life, health outcomes, clinical care -- Wisconsin Institute of Health, 2022
3. County mortality rates -- JAMA, 2014 
4. County number, ratio, and quartile of healthcare providers & number and percentage of uninsured residents -- Wisconsin Insitute of Health, 2022

Possible data to be added in the future:
1. County by county average cost of accessing healthcare
2. County by county number of available hospital beds 
3. County by county number of healthcare facilities (hospitals, clinics, emergency care facilities, etc) 
4. State policies about Medicare, abortion, and other healthcare-related laws 

