import axios from "axios";

const TWENTY_FIRST_API_KEY = process.env.TWENTY_FIRST_API_KEY;

export const twentyFirstClient = axios.create({
  baseURL: "https://magic.21st.dev",
  headers: {
    "x-api-key": TWENTY_FIRST_API_KEY,
    "Content-Type": "application/json",
  },
});
