import axios from "axios";
import config from "../config";

export const getSliders = async () => {
  const { data } = await axios.get(
    `${config.apiUrl}api/paginaprincipal/sliders`
  );
  return data;
};
