import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://reqres.in/api/";

const getUsers = (page) => {
  return axios.get(API_URL + `users?page=${page}`, { headers: authHeader() });
};
const editUser = (id, params) => {
  return axios.patch(API_URL + `users/${id}`, params, {
    headers: authHeader(),
  });
};

const userService = {
  getUsers,
  editUser,
};

export default userService;
