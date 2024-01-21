// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={appid}
// appid = 0440be1ba2d1c55f52e0c0e7f89e9f98;
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=0440be1ba2d1c55f52e0c0e7f89e9f98

const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temp =
    Math.round((orgVal.main.temp - 273.15 + Number.EPSILON) * 100) / 100;
  let minTemp =
    Math.round((orgVal.main.temp_min - 273.15 + Number.EPSILON) * 100) / 100;
  let maxTemp =
    Math.round((orgVal.main.temp_max - 273.15 + Number.EPSILON) * 100) / 100;
  let location = orgVal.name;
  let country = orgVal.sys.country;
  let status = orgVal.weather[0].main;
//   console.log(temp, minTemp, maxTemp, location, country);

  let newDataFile = tempVal.replace("{%tempVal%}", temp);
  newDataFile = newDataFile.replace("{%tempMin%}", minTemp);
  newDataFile = newDataFile.replace("{%tempMax%}", maxTemp);
  newDataFile = newDataFile.replace("{%location%}", location);
  newDataFile = newDataFile.replace("{%country%}", country);
  newDataFile = newDataFile.replace("{%tempStatus%}", status);

  //   console.log(newDataFile);
  return newDataFile;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Gadhinglaj&appid=0440be1ba2d1c55f52e0c0e7f89e9f98"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        // console.log(arrData);

        let realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(2530, "127.0.0.1", () => {
  console.log("listening http://127.0.0.1:2530");
});
