import axios from "axios";
import {API_URL} from "./apiConfig.ts";

const axiosInstance = axios.create({
    baseURL: `${API_URL}`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance;