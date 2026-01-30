import config from "../../../config";


export const getPrimaryColor = async () => {
  const res = await fetch(`${config.apiUrl}api/paginaprincipal/color`);
  const data = await res.json();

  if (Array.isArray(data) && data.length > 0) {
    return data[0].valor;
  }

  return "#00c657"; // fallback
};
