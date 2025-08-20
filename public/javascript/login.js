document.addEventListener("DOMContentLoaded", () => {
  const messagesDiv = document.getElementById("messages");

  // JWT login
  const jwtForm = document.getElementById("jwtForm");
  jwtForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("jwtName").value;

    try {
      const res = await fetch("/auth_jwt/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      messagesDiv.innerText = data.message;
    } catch (err) {
      messagesDiv.innerText = "Error logging in with JWT";
      console.error(err);
    }
  });

  // Passport login
  const passportForm = document.getElementById("passportForm");
  passportForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("passportName").value;
    const password = document.getElementById("passportPassword").value;

    try {
      const res = await fetch("/auth_passport/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      messagesDiv.innerText = data.message;
    } catch (err) {
      messagesDiv.innerText = "Error logging in with Passport";
      console.error(err);
    }
  });
});
