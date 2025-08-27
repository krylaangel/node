document.addEventListener("DOMContentLoaded", () => {
  const messagesDiv = document.getElementById("messages");

  // JWT login
  const jwtForm = document.getElementById("jwtForm");
  jwtForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("jwtEmail").value;
    const password = document.getElementById("jwtPassword").value;

    try {
      const res = await fetch("/auth_jwt/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.redirected) {
        window.location.href = res.url;
      } else {
        const data = await res.json();
        messagesDiv.innerText = data.message;
      }
    } catch (err) {
      messagesDiv.innerText = "Error logging in with JWT";
      console.error(err);
    }
  });
});
