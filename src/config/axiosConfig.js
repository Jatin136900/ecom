import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-ecommerce-ajb4.onrender.com/api",
  withCredentials: true,
  timeout: 60000, // 60 seconds
  headers: {
    "Content-Type": "application/json",
  },
});


export default instance;



