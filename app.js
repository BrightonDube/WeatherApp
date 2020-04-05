//jshint esversion: 6
const express = require("express");
const app = express();
const https = require("https"); //native node module for making http requests
const port = 3100 || process.env.PORT;
const dotenv = require('dotenv');

app.set('view engine', 'ejs');

dotenv.config(); // This reads the environment variable values from the .env file. You can then access them as you would access any other environment variables:

app.use(express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => { 
    res.sendFile(`${__dirname}/index.html`);
});

app.post('/', (req, res)=>{
    let city = req.body.city;
    let unit = req.body.unit;
    let api_key = process.env.API_KEY;
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${api_key}&q=${city}&units=${unit}`
    https
        .get(
            url,
            resp => {
                let data = ""; // A chunk of data has been recieved.
                resp.on("data", chunk => {
                    data += chunk;
                }); // The whole response has been received. Print out the result.
                resp.on("end", () => {
                    let dataJSON = JSON.parse(data);
                    
                    let icon = dataJSON.weather[0].icon;
                    let iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                    
                    let name = dataJSON.name;                    
                    let description = dataJSON.weather[0].description;
                    let temp = dataJSON.main.temp;
                    res.render('index', {
                        iconUrl: iconUrl,
                        name: name,                       
                        description: description,
                        temp: temp
                    });
                }); //end of on.end
            }
        )
        .on("error", err => {
            console.log("Error: " + err.message);
        });
});

app.listen(port, () => {
    console.log("Server running on port" + port);
});