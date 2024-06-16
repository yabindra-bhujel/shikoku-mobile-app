import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:8000';


const ApiManager = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

export default ApiManager;
