import axios from 'axios';

const baseURL = window.location.hostname === 'localhost'
  ? "http://localhost:5000"
  : import.meta.env.VITE_SERVER_API

const apiReq = axios.create({
  baseURL: baseURL,
  withCredentials: true
});


export default apiReq;
