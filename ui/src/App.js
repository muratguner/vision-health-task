import "./App.css";
import FetchDataService from "../src/FetchDataService";
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { Box } from "@material-ui/core";

function App() {
  const [plate, setPlate] = useState([]);
  const [persons, setPersons] = useState([]);
  const [color, setColor] = useState();
  const [personAgeArray, setPersonAgeArray] = useState([]);

  const filterWithNumberPlate = async function filterWithNumberPlate(
    numberPlate
  ) {
    try {
      let fetchDataService = new FetchDataService();
      let response = await fetchDataService.filterWithNumberPlate(numberPlate);
      setPlate(response);
    } catch (e) {}
  };

  const getPersonsByCar = async function getPersonsByCar(color) {
    setColor(color);
    try {
      let fetchDataService = new FetchDataService();
      let response = await fetchDataService.getPersonsByCar(color);
      setPersons(response);
    } catch (e) {}
  };

  const filterPersonByAge = async function filterPersonByAge(age) {
    try {
      let fetchDataService = new FetchDataService();
      let response = await fetchDataService.filterPersonByAge(age);
      setPersonAgeArray(response);
    } catch (e) {}
  };

  return (
    <div className="App">
      <Box display="flex" width={1500} height={80} bgcolor="lightblue">
        <Box m="auto">
          <TextField
            id="standard-basic"
            label="Qury Plate Number"
            onChange={(e) => filterWithNumberPlate(e.target.value)}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        width={1500}
        height={80}
        bgcolor={plate === undefined ? "white" : plate.color}
        alignItems="center"
        justifyContent="center"
      >
        <Box m="auto">{plate === undefined ? "" : plate.type}</Box>
        <Box m="auto">{plate === undefined ? "" : plate.color}</Box>
      </Box>
      <Box display="flex" width={1500} height={80} bgcolor="lightblue">
        <Box m="auto">
          <TextField
            id="standard-basic"
            label="Persons with Color"
            onChange={(e) => getPersonsByCar(e.target.value)}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        width={1500}
        height={80}
        bgcolor={color}
        alignItems="center"
        justifyContent="center"
      >
        <Box m="auto">
          {persons !== "No data available" &&
            persons.map((value) => <div key={value}>{value}</div>)}
        </Box>
      </Box>
      <Box display="flex" width={1500} height={80} bgcolor="lightblue">
        <Box m="auto">
          <TextField
            id="standard-basic"
            label="Persons with Age"
            onChange={(e) => filterPersonByAge(e.target.value)}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        width={1500}
        height={80}
        alignItems="center"
        justifyContent="center"
      >
        <Box m="auto">
          {personAgeArray !== "No data available" &&
            personAgeArray.map((value) => <div key={value}>{value}</div>)}
        </Box>
      </Box>
    </div>
  );
}

export default App;
