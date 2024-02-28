import axios from 'axios';

const baseURL = 'https://api.weatherapi.com/v1';

export default axios.create({ baseURL });
