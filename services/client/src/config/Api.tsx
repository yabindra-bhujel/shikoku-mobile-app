import axios from 'axios';

export const SERVER_HOST = '127.0.0.1'
// export const SERVER_HOST = '192.168.1.1'

const BASE_URL = `http://${SERVER_HOST}:8000`;
const axiosInstance = axios.create({
    // api の全てのリクエストに対して、この baseURL が付与される 
    baseURL: BASE_URL,

    // 自動的にクッキーを送信される ための設定
    withCredentials: true,

    // リクエストのヘッダーに json を指定
    headers: {
        "Content-Type": "application/json",
          "Accept": "application/json",
    },
});

export default axiosInstance;
