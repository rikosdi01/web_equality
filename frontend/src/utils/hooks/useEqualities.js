import { useEffect, useState } from "react";
import axios from "axios";
import { useAccessToken } from "../../context/AccessTokenContext";

const API_URL = import.meta.env.VITE_API_URL;

export const useEqualities = () => {
  const [equalities, setEqualities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessToken } = useAccessToken(); // langsung reactive!
  console.log('Access Token: ', accessToken);

  useEffect(() => {
    const fetchEqualities = async () => {
      try {
        if (!accessToken) {
          console.error("No access token found");
          return;
        }

        const res = await axios.get(`${API_URL}/equalities`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        setEqualities(res.data); // Update state dengan data terbaru
      } catch (error) {
        console.error("Error fetching equalities", error);
      } finally {
        setIsLoading(false); // Menghentikan loading setelah request selesai
      }
    };

    fetchEqualities(); // Panggil fetch data pertama kali

    // Menambahkan WebSocket untuk mendengarkan update
    const socket = new WebSocket(import.meta.env.VITE_WS_URL);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📡 Data berubah:", data);

      // Setelah menerima data, fetch ulang data equalities
      fetchEqualities();
    };

    return () => {
      socket.close(); // Menutup koneksi WebSocket saat komponen tidak lagi digunakan
    };
  }, [accessToken]); // Menjalankan efek ini saat pertama kali komponen dimuat dan saat accessToken berubah

  return { equalities, isLoading };
};
