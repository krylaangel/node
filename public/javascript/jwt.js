document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const getUsersBtn = document.getElementById("getUsersBtn");
  const usersList = document.getElementById("usersList");
  const nameInput = document.getElementById("name");

  loginBtn.addEventListener("click", async () => {
    const name = nameInput.value;
    if (!name) return alert("Enter a name");

    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    alert(data.message);
  });

  logoutBtn.addEventListener("click", async () => {
    const res = await fetch("/auth/logout", { method: "POST" });
    const data = await res.json();
    alert(data.message);
    usersList.innerHTML = "";
  });

  getUsersBtn.addEventListener("click", async () => {
    const res = await fetch("/secure/users", {
      method: "GET",
      credentials: "same-origin",
    });

    if (res.status === 401 || res.status === 403) {
      return alert("Unauthorized! Login first.");
    }

    const data = await res.json();
    usersList.innerHTML = "";
    data.users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = `${user.id} - ${user.name} (${user.age} y.o.)`;
      usersList.appendChild(li);
    });
  });
});
