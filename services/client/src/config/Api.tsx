import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
    // api の全てのリクエストに対して、この baseURL が付与される 
    baseURL: BASE_URL,

    // 自動的にクッキーを送信される ための設定
    withCredentials: true,

    // リクエストのヘッダーに json を指定
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
