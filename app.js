require('dotenv').config()
const { json } = require("express");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");



const app = express();

app.use("/styles",express.static("styles"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){

    res.sendFile(__dirname+"/index.html");

})


app.post("/", (req, res)=>{
    
    
    const query = req.body.cityname;
    const apiKey = process.env.API_KEY;
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+units+"&appid="+apiKey+""
    https.get(url, (response)=>{
        console.log(response.statusCode);
        
        response.on("data", (data)=>{
            //console.log(data); -> hexademical
            //using JSON to be able to read data from hexademical to text
            const WeatherData = JSON.parse(data);
            console.log(WeatherData); //using max space (readable)

            //console.log(JSON.stringify(WeatherData));//using minimum space

            const temprature = WeatherData.main.temp //select specyfic element of JSON format
            console.log(temprature);

            /* EXAMPLE
            const pressure = WeatherData.main.pressure ;
            console.log(pressure)
            */

            const descr = WeatherData.weather[0].description;
            console.log(descr);

            /*HOW TO GET AN ICON */
            const icon = WeatherData.weather[0].icon
            const imageURL = " http://openweathermap.org/img/wn/"+icon+"@2x.png"

            
            res.write("<h1>The temprature in "+query+" is: " + temprature + " degrees Celcius</h1>");
            res.write("<p>The weather condition is " + descr + "</p>")
            res.write("<img src= "+imageURL+">")
            res.send();
            
        })
        
    })
})

app.listen(3000, function(){

    
    console.log("server is running on port 3000");
});





