const baseURL = import.meta.env.VITE_SERVER_URL;

export async function convertToJson(res) {
  const jsonResponse = await res.json()
  if (res.ok) {
    return jsonResponse;
  } else {
    throw {
      name: "servicesError",
      message: jsonResponse,
    };
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }
  async getData(category) {
    const respone = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(respone);
    return data.Result;
  }
  async findProductById(id) {
    const reponse = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(reponse);
    return data.Result;
  }

  async checkout(payload) {
    return fetch(`${baseURL}checkout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(convertToJson);
  }
}
