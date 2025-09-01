const { articles } = require("./data/articles");
const { response } = require("express");

const LOGIN_CREDENTIALS = {
  email: "kryla-angela1307@gmail.com",
  password: "123456789",
};

async function getToken() {
  try {
    const response = await fetch("http://localhost:3000/auth_jwt/api_login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(LOGIN_CREDENTIALS),
    });
    const data = await response.json();
    return data.token;
  } catch (err) {
    console.log(err);
  }
}
async function seedArticles() {
  try {
    const token = await getToken();
    const response = await fetch("http://localhost:3000/articles/many", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ articles }),
    });
    const data = await response.json();
    console.log("Результат завантаження:", data);
  } catch (err) {
    console.log(err);
    console.error("Помилка при додаванні статтей:", err);
  }
}
seedArticles();
