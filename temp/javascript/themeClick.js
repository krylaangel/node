async function loadTheme() {
  const res = await fetch("/theme/get-theme", {
    credentials: "same-origin",
  });
  const data = await res.json();
  document.body.className = data.theme || "light";
}

async function setTheme(theme) {
  await fetch("/theme/set-theme", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ theme }),
  });
  document.body.className = theme;
}

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();

  document.querySelectorAll("button[data-theme]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const theme = btn.getAttribute("data-theme");
      await setTheme(theme);
    });
  });
});
