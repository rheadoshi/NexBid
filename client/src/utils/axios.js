import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',  // Your backend
  withCredentials: true,             // Important if using cookies/sessions
});

export default api;
