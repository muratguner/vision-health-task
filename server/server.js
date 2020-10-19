const express = require("express"),
  server = express();

// Add headers
server.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

//setting the port.
server.set("port", process.env.PORT || 5000);

//Binding to localhost://5000
server.listen(5000, () => {
  console.log("Express server started at port 5000");
});

var cache = require("memory-cache");
var path = "sample.xml";
var fs = require("fs");
var xml2js = require("xml2js");
var parser = new xml2js.Parser({ explicitArray: false });
var cors = require("cors");

server.get("/car/:NumberPlate?", cors(), (req, res, next) => {
  getJsonData()
    .then((jsonData) => {
      const numberPlate = req.params.NumberPlate;
      filterWithNumberPlate(jsonData, numberPlate.toUpperCase())
        .then((response) => {
          res.header("Content-Type", "application/json");
          res.type("json").send(JSON.stringify(response, null, 4) + "\n");
        })
        .catch(() => {
          res.json("No data available");
        });
    })
    .catch(() => {});
});

server.get("/person/:id?/car", cors(), (req, res, next) => {
  const id = req.params.id;
  getJsonData().then((jsonData) => {
    getPersonCars(jsonData, id)
      .then((response) => {
        res.header("Content-Type", "application/json");
        res.type("json").send(JSON.stringify(response, null, 4) + "\n");
      })
      .catch(() => {
        res.json("No data available");
      });
  });
});

server.get("/getPersonsByCar?:color", (req, res, next) => {
  const color = req.query.color;
  const colorCapitalized = color.charAt(0).toUpperCase() + color.slice(1);
  getJsonData().then((jsonData) => {
    getPersonsByCar(jsonData, colorCapitalized)
      .then((response) => {
        res.header("Content-Type", "application/json");
        res.type("json").send(JSON.stringify(response, null, 4) + "\n");
      })
      .catch(() => {
        res.json("No data available");
      });
  });
});

server.get("/getPersonsOlderThan?:age", cors(), (req, res, next) => {
  const age = req.query.age;
  getJsonData().then((jsonData) => {
    filterPersonByAge(jsonData, age)
      .then((response) => {
        res.header("Content-Type", "application/json");
        res.type("json").send(JSON.stringify(response, null, 4) + "\n");
      })
      .catch(() => {
        res.json("No data available");
      });
  });
});

server.get("/getPersonsWithInsurance", cors(), (req, res, next) => {
  getJsonData().then((jsonData) => {
    getPersonsWithInsurance(jsonData)
      .then((response) => {
        res.header("Content-Type", "application/json");
        res.type("json").send(JSON.stringify(response, null, 4) + "\n");
      })
      .catch(() => {
        res.json("No data available");
      });
  });
});

/**
 * Responsible for generating a person car array for given id.
 * @param {string} jsonData json string of the xml data.
 * @param {string} id person id from the request.
 */
function getPersonCars(jsonData, id) {
  return new Promise((resolve, reject) => {
    let jsonObj = JSON.parse(jsonData);
    let carArray = [];
    jsonObj.People.Person.forEach((person) => {
      let child = {};
      if (person.Car !== undefined) {
        if (person.id === id) {
          (person.Car.length === undefined &&
            resolve(
              (child = { color: person.Car.Color, type: person.Car.Type })
            )) ||
            (person.Car.length > 1 &&
              person.Car.forEach((car) => {
                child = { color: car.Color, type: car.Type };
                carArray.push(child);
              }));
          resolve(carArray);
        }
      }
    });
    reject("Rejected");
  });
}

/**
 * Responsible for generating a car object for given numberPlate.
 * @param {string} jsonData json string of the xml data.
 * @param {string} numberPlate plate number from the request.
 */
function filterWithNumberPlate(jsonData, numberPlate) {
  return new Promise((resolve, reject) => {
    let jsonObj = JSON.parse(jsonData);
    jsonObj.People.Person.forEach((person) => {
      let child = {};
      if (person.Car !== undefined) {
        if (person.Car.length === undefined) {
          if (person.Car.NumberPlate === numberPlate) {
            child = { color: person.Car.Color, type: person.Car.Type };
            resolve(child);
          }
        } else if (person.Car.length > 1) {
          person.Car.forEach((car) => {
            if (car.NumberPlate === numberPlate) {
              child = { color: car.Color, type: car.Type };
              resolve(child);
            }
          });
        }
      }
    });
    reject("Rejected");
  });
}

/**
 * Responsible for generating an person array for given color.
 * @param {string} jsonData json string of the xml data.
 * @param {string} color color from the request.
 */
function getPersonsByCar(jsonData, color) {
  return new Promise((resolve, reject) => {
    let jsonObj = JSON.parse(jsonData);
    let perArray = [];
    jsonObj.People.Person.forEach((person) => {
      let child = "";
      if (person.Car !== undefined) {
        if (person.Car.length === undefined && person.Car.color === color) {
          perArray.push((child = person.Name));
        } else if (person.Car.length > 1) {
          person.Car.forEach((car) => {
            if (car.Color === color) {
              child = person.Name;
              perArray.push(child);
            }
          });
        }
      }
    });
    if (perArray.length === 0) reject("No data available");
    resolve(perArray);
  });
}

/**
 * Responsible for generating an person array for given age.
 * @param {string} jsonData json string of the xml data.
 * @param {string} age query param from the request.
 */
function filterPersonByAge(jsonData, age) {
  return new Promise((resolve, reject) => {
    let jsonObj = JSON.parse(jsonData);
    let perArray = [];
    jsonObj.People.Person.forEach((person) => {
      let child = "";
      if (person.Age !== undefined) {
        if (person.Age >= Number(age)) {
          perArray.push((child = person.Name));
        }
      }
    });
    if (perArray.length === 0) reject("No data available");
    resolve(perArray);
  });
}

/**
 * Responsible for generating an person array.
 * @param {string} jsonData json string of the xml data.
 */
function getPersonsWithInsurance(jsonData) {
  return new Promise((resolve, reject) => {
    let jsonObj = JSON.parse(jsonData);
    let perArray = [];
    jsonObj.People.Person.forEach((person) => {
      let child = "";
      if (person.Car !== undefined) {
        if (person.Car.length === undefined) {
          if (person.Car.Insurance !== undefined) {
            perArray.push((child = person.Name));
          }
        } else if (person.Car.length > 1) {
          person.Car.forEach((car) => {
            if (car.Insurance !== undefined) {
              child = person.Name;
              var childExists = perArray.includes(child);
              if (childExists == false) perArray.push(child);
            }
          });
        }
      }
    });
    if (perArray.length === 0) reject("No data available");
    resolve(perArray);
  });
}

/**
 * Responsible for genating a json string.
 * Stores the json string in memory after genarating the string.
 */
function getJsonData() {
  return new Promise((resolve, reject) => {
    if (cache.get("json") !== null) {
      resolve(cache.get("json"));
    } else {
      var xml = fs.readFileSync(path);
      parser.parseString(xml, function (err, result) {
        if (err) {
          console.error("xml2js.parseString: Error occurred: ", err);
        } else {
          let jsonGlobal = JSON.stringify(result);
          cache.put("json", jsonGlobal);
          resolve(jsonGlobal);
        }
      });
    }
    reject("Rejected");
  });
}
