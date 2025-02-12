import axios from "axios";

const apiRequest = axios.create({
    baseURL: "https://server-jnyw2rbea-saluumaas-projects.vercel.app/api",
    withCredentials: true,
});

export default apiRequest;