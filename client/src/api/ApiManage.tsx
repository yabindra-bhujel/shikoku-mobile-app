import axios from 'axios';
const baseUrl = 'http://192.168.1.81:8000';


const ApiManager = axios.create({
    baseURL: baseUrl,
    responseType: 'json',
    withCredentials: true,
});

export default ApiManager;
