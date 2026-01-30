import axios from "axios";
import config from "../config";


export const getMenus = async () => {
  const { data } = await axios.get(`${config.apiUrl}api/menus`);
  return data;
};
