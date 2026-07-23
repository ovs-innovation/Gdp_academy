import axios from "axios";
import { API_BASE_URL } from "../lib/apiConfig";

const API_URL = `${API_BASE_URL}/student-profiles/wishlist`;

export const getWishlist = async (token: string) => {
   const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
   });
   return response.data;
};

export const toggleWishlist = async (token: string, teacherId: string) => {
   const response = await axios.post(API_URL, { teacherId }, {
      headers: { Authorization: `Bearer ${token}` }
   });
   return response.data;
};
