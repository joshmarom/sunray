import axios from 'axios';

const baseURL = 'https://countriesnow.space/api/v0.1/';

export default axios.create({ baseURL });
