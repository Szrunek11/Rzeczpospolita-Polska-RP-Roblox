let aktualnosci = JSON.parse(localStorage.getItem("aktualnosci")) || [];
let ogloszenia = JSON.parse(localStorage.getItem("ogloszenia")) || [];
let hymn = localStorage.getItem("hymn") || "Jeszcze Polska nie zginęła, Kiedy my żyjemy...";
let hymnLink = localStorage.getItem("hymnLink") || "";
let regulamin = JSON.parse(localStorage.getItem("regulamin")) || null;
let adminLogged = false;

function showSection(id) {
  document.querySelectorAll("main section").forEach(el => el.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if(id==="aktualnosci") renderAktualnosci();
  if(id==="ogloszenia") renderOgloszenia();
  if(id==="regulamin") renderRegulamin();
  if(id==="hymn") renderHymn();
}

function showLogin() {
  document.querySelectorAll("main section").forEach(el => el.classList.add("hidden"));
  document.getElementById("loginPanel").classList.remove("hidden");
}

function adminLogin() {
  const user = document.getElementById("adminLogin").value.trim();
  const pass = document.getElementById("adminPass").value.trim();
  if(user==="admin" && pass==="admin") {
    adminLogged = true;
    document.getElementById("loginPanel").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
  } else {
    document.getElementById("loginError").textContent = "Błędny login lub hasło!";
  }
}

function logout() {
  adminLogged = false;
  showSection("home");
}

// Admin functions
function addAktualnosc() {
  const text = prompt("Wpisz treść aktualności:");
  if(text) {
    aktualnosci.push(text);
    localStorage.setItem("aktualnosci", JSON.stringify(aktualnosci));
    renderAktualnosci();
  }
}

function addOgloszenie() {
  const text = prompt("Wpisz treść ogłoszenia:");
  if(text) {
    ogloszenia.push(text);
    localStorage.setItem("ogloszenia", JSON.stringify(ogloszenia));
    renderOgloszenia();
  }
}

function editHymn() {
  const nowy = prompt("Wpisz nowy tekst hymnu:", hymn);
  if(nowy) {
    hymn = nowy;
    localStorage.setItem("hymn", hymn);
    renderHymn();
  }
}

function addHymnLink() {
  const link = prompt("Wpisz link do nagrania hymnu MP3:", hymnLink);
  if(link) {
    hymnLink = link;
    localStorage.setItem("hymnLink", link);
    renderHymn();
  }
}

function addRegulamin() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf";
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      regulamin = { name: file.name, data: reader.result };
      localStorage.setItem("regulamin", JSON.stringify(regulamin));
      renderRegulamin();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// Render functions
function renderAktualnosci() {
  const div = document.getElementById("aktualnosciLista");
  div.innerHTML = "";
  aktualnosci.forEach((a,i) => {
    const p = document.createElement("p");
    p.textContent = "📰 " + a;
    div.appendChild(p);
    if(adminLogged) {
      const b = document.createElement("button");
      b.textContent = "Usuń";
      b.className = "btn";
      b.onclick = () => {
        aktualnosci.splice(i,1);
        localStorage.setItem("aktualnosci", JSON.stringify(aktualnosci));
        renderAktualnosci();
      };
      div.appendChild(b);
    }
  });
}

function renderOgloszenia() {
  const div = document.getElementById("ogloszeniaLista");
  div.innerHTML = "";
  ogloszenia.forEach((o,i) => {
    const p = document.createElement("p");
    p.textContent = "📢 " + o;
    div.appendChild(p);
    if(adminLogged) {
      const b = document.createElement("button");
      b.textContent = "Usuń";
      b.className = "btn";
      b.onclick = () => {
        ogloszenia.splice(i,1);
        localStorage.setItem("ogloszenia", JSON.stringify(ogloszenia));
        renderOgloszenia();
      };
      div.appendChild(b);
    }
  });
}

function renderHymn() {
  document.getElementById("hymnTekst").textContent = hymn;
  const hDiv = document.getElementById("hymnNagranie");
  hDiv.innerHTML = hymnLink ? `<audio controls src="${hymnLink}"></audio>` : "";
}

function renderRegulamin() {
  const div = document.getElementById("regulaminPlik");
  div.innerHTML = regulamin 
    ? `<a href="${regulamin.data}" download="${regulamin.name}" class="btn">📄 Pobierz ${regulamin.name}</a>`
    : "Brak pliku regulaminu.";
}

// Start
renderAktualnosci();
renderOgloszenia();
renderHymn();
renderRegulamin();
