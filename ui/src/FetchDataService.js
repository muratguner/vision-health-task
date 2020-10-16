const BACKEND_URL = "http://localhost:5000";
export default class FetchDataService {
  async filterWithNumberPlate(numberPlate) {
    try {
      const response = await fetch(`${BACKEND_URL}/car/${numberPlate}`);
      const json = await response.json();
      return json;
    } catch (e) {}
  }

  async getPersonsByCar(color) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/getPersonsByCar?color=${color}`
      );
      const json = await response.json();
      return json;
    } catch (e) {}
  }

  async filterPersonByAge(age) {
    try {
      const response = await fetch(
        `${BACKEND_URL}/getPersonsOlderThan?age=${age}`
      );
      const json = await response.json();
      return json;
    } catch (e) {}
  }
}
