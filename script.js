// Dane
let aktualnosci = JSON.parse(localStorage.getItem("aktualnosci") || "[]");
let ogloszenia = JSON.parse(localStorage.getItem("ogloszenia") || "[]");
let obywatele = JSON.parse(localStorage.getItem("obywatele") || "[]");
let galeria = JSON.parse(localStorage.getItem("galeria") || "[]");

// 🔐 Logowanie admina
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      const u = document.getElementById("adminUser").value.trim();
      const p = document.getElementById("adminPass").value.trim();
      const error = document.getElementById("loginError");

      if (u === "admin" && p === "admin") {
        localStorage.setItem("adminLogged", "true");
        document.getElementById("adminLogin").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        error.style.display = "none";
      } else {
        error.style.display = "block";
      }
    });
  }

  // 🔁 Utrzymanie zalogowania
  if (localStorage.getItem("adminLogged") === "true") {
    const loginBox = document.getElementById("adminLogin");
    const panel = document.getElementById("adminPanel");
    if (loginBox && panel) {
      loginBox.style.display = "none";
      panel.style.display = "block";
    }
  }

  renderNews();
  renderObywatele();
  renderGaleria();
});

function adminLogout() {
  localStorage.removeItem("adminLogged");
  location.reload();
}

// 📰 Aktualności
function addNews() {
  const t = document.getElementById("newsTitle").value.trim();
  const x = document.getElementById("newsText").value.trim();
  if (!t || !x) return alert("Uzupełnij pola!");
  aktualnosci.push({ title: t, text: x });
  localStorage.setItem("aktualnosci", JSON.stringify(aktualnosci));
  alert("Aktualność dodana!");
}

// 🖼️ Galeria
function addPhoto() {
  const input = document.getElementById("photoInput");
  const file = input.files[0];
  if (!file) return alert("Wybierz plik!");
  const reader = new FileReader();
  reader.onload = e => {
    galeria.push(e.target.result);
    localStorage.setItem("galeria", JSON.stringify(galeria));
    alert("Zdjęcie dodane!");
  };
  reader.readAsDataURL(file);
}

// 📰 Renderowanie aktualności
function renderNews() {
  const list = document.getElementById("aktualnosciLista");
  if (!list) return;
  list.innerHTML = aktualnosci
    .map(n => `<article><h3>${n.title}</h3><p>${n.text}</p></article>`)
    .join("");
}

// 👥 Obywatele
function renderObywatele() {
  const list = document.getElementById("obywateleLista");
  if (!list) return;
  list.innerHTML = obywatele.map(o => `<li>${o}</li>`).join("");
}

// 🖼️ Renderowanie galerii
function renderGaleria() {
  const div = document.getElementById("galeriaZdjecia");
  if (!div) return;
  div.innerHTML = galeria.map(src => `<img src="${src}">`).join("");
}

// 📝 Rekrutacja
const form = document.getElementById("rekrutacjaForm");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    const nick = document.getElementById("rekrutNick").value.trim();
    const text = document.getElementById("rekrutText").value.trim();
    if (nick && text) {
      obywatele.push(nick);
      localStorage.setItem("obywatele", JSON.stringify(obywatele));
      document.getElementById("rekrutMessage").innerHTML = `✅ Rekrutacja wysłana! Dołącz na Discord: <a href="https://discord.gg/5aZqgpErnc" target="_blank">Kliknij tutaj</a>`;
      form.reset();
    }
  });
}
