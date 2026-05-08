import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const searchEqualityProducts = async (query, accessToken) => {
    try {
        const response = await axios.get(`${API_URL}/equalities/search`, {
            params: { query },
            headers: {
                Authorization: `Bearer ${accessToken}`, // Jika menggunakan token otentikasi
            }
        });
        return response.data;
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
};

export default searchEqualityProducts;