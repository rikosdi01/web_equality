import { useEffect, useState } from "react";
import axios from "axios";
import { useAccessToken } from "../../context/AccessTokenContext";

const API_URL = import.meta.env.VITE_API_URL;

export const useItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken, updateAccessToken } = useAccessToken(); // langsung reactive!
  console.log('Access Token: ', accessToken);

  useEffect(() => {
    const axiosInstance = axios.create({
      baseURL: API_URL,
      withCredentials: true,
    });

    // Axios interceptor untuk auto-refresh token jika 403
    axiosInstance.interceptors.response.use(
      res => res,
      async err => {
        if (err.response?.status === 403) {
          try {
            const refreshRes = await axios.get(`${API_URL}/refresh`, {
              withCredentials: true,
            });
            const newToken = refreshRes.data?.accessToken;
            updateAccessToken(newToken); // Simpan token baru
            err.config.headers.Authorization = `Bearer ${newToken}`;
            return axios(err.config); // Retry original request
          } catch (refreshErr) {
            console.error("Refresh token failed", refreshErr);
          }
        }
        return Promise.reject(err);
      }
    );

    const fetchItems = async () => {
      try {
        if (!accessToken) return;
        const res = await axiosInstance.get("/items", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setItems(res.data);
      } catch (error) {
        console.error("Error fetching items", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();

    const socket = new WebSocket(import.meta.env.VITE_WS_URL);
    socket.onmessage = () => fetchItems();
    return () => socket.close();
  }, [accessToken]);

  return { items, isLoading };
};