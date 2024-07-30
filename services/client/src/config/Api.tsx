import axios from 'axios';

// export const myip = '192.168.1.81'
// export const myip = "172.30.59.228"
export const myip = '127.0.0.1'

const BASE_URL = `http://${myip}:8000`;
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
    data: FormData.toString(),
});

export default axiosInstance;
