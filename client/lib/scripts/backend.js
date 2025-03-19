import axios from "axios";

const backendURL = import.meta.env.VITE_API_URL;

export const backend = axios.create({
  baseURL: `${backendURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
})
