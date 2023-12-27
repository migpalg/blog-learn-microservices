import axios from "axios";

export const postsClient = axios.create({
  baseURL: "http://127.0.0.1:3000",
});

export const commentsClient = axios.create({
  baseURL: "http://127.0.0.1:3001",
});

export const queryClient = axios.create({
  baseURL: "http://127.0.0.1:3002",
});
