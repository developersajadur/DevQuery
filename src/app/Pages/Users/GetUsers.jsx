import axios from "axios";

export const getUsers = async () => {
  const fetchUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/users/api/get`
  try {
    const response = await axios.get(fetchUrl);
    const users = response?.data?.users;    
    return users;
  } catch (error) {
    console.error("Error details:", error); // Log the error details
    return [];
  }
};