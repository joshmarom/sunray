import axios from 'axios';

const baseURL = 'https://api.geoapify.com/v1/geocode/reverse';

export default axios.create({ baseURL });
