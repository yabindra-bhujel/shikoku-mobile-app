import axios from 'axios';
const baseUrl = 'http://127.0.0.1:8000';


const ApiManager = axios.create({
    baseURL: baseUrl,
    responseType: 'json',
    withCredentials: true,
});

export default ApiManager;
