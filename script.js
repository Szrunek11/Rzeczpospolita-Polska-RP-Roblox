// Dane
let obywatele = JSON.parse(localStorage.getItem("obywatele") || "[]");
let ogloszenia = JSON.parse(localStorage.getItem("ogloszenia") || "[]");
let rekrutacje = JSON.parse(localStorage.getItem("rekrutacje") || "[]");

// --- GRACZE ---
function renderOgloszenia(){
  const ul=document.getElementById("ogloszenia-lista");
  if(!ul) return;
  ul.innerHTML="";
  ogloszenia.forEach((text,i)=>{
    const li=document.createElement("li");
    li.innerHTML=`${text}`;
    ul.appendChild(li);
  });
}

// Rejestracja gracza
const regForm=document.getElementById("registerForm");
if(regForm){
regForm.addEventListener("submit", function(e){
  e.preventDefault();
  const nick=document.getElementById("regNick").value.trim();
  const password=document.getElementById("regPassword").value.trim();
  if(obywatele.find(u=>u.nick===nick)){ alert("Ten nick już istnieje!"); return; }
  obywatele.push({nick,password,approved:false,role:"Obywatel"});
  localStorage.setItem("obywatele",JSON.stringify(obywatele));
  alert("Konto zarejestrowane! Poczekaj na zatwierdzenie właściciela.");
  regForm.reset();
});
}

// Logowanie gracza
const loginForm=document.getElementById("loginForm");
if(loginForm){
loginForm.addEventListener("submit", function(e){
  e.preventDefault();
  const nick=document.getElementById("nick").value.trim();
  const password=document.getElementById("password").value.trim();
  const message=document.getElementById("message");
  const user = obywatele.find(u=>u.nick===nick && u.password===password);
  if(!user){ message.textContent="❌ Nieprawidłowy nick lub hasło"; message.style.color="red"; return; }
  if(!user.approved){ message.textContent="🕓 Konto oczekuje na zatwierdzenie"; message.style.color="orange"; return; }
  message.textContent=`✅ Witaj, ${user.nick}! Rola: ${user.role}`;
  message.style.color="green";
});
}

// Formularz rekrutacyjny
function submitRekrutacja(e){
  e.preventDefault();
  const nick=document.getElementById("rekrutNick").value.trim();
  const text=document.getElementById("rekrutText").value.trim();
  if(!nick || !text) return;
  rekrutacje.push({nick,text,approved:false});
  localStorage.setItem("rekrutacje",JSON.stringify(rekrutacje));
  const msg=document.getElementById("rekrutMessage");
  if(msg){ msg.textContent="✅ Rekrutacja wysłana!"; msg.style.color="green"; }
  document.getElementById("rekrutacjaForm").reset();
}

// --- ADMIN ---
function loginAdmin(e){
  e.preventDefault();
  const login=document.getElementById("adminLogin").value.trim();
  const pass=document.getElementById("adminPassword").value.trim();
  const msg=document.getElementById("loginMessage");
  if(login==="admin" && pass==="admin"){
    msg.textContent="✅ Zalogowano!";
    msg.style.color="green";
    document.getElementById("adminLoginSection").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    initPanel();
  } else {
    msg.textContent="❌ Nieprawidłowy login lub hasło";
    msg.style.color="red";
  }
}

// Panel admin
function initPanel(){
  renderUsers();
  renderAdminOgloszenia();
  renderRekrutacje();
}

// Zarządzanie graczami
function renderUsers(){
  const div=document.getElementById("usersList");
  div.innerHTML="";
  obywatele.forEach((u,i)=>{
    const d=document.createElement("div");
    d.style.display="flex";d.style.justifyContent="space-between";d.style.marginBottom="5px";
    d.innerHTML=`<span>${u.nick} — Status: ${u.approved ? "✅ Zatwierdzony":"🕓 Oczekuje"}</span>
    <span>
      ${!u.approved?`<button onclick="approveUser(${i})">Zatwierdź</button>`:""}
      <button onclick="removeUser(${i})">Usuń</button>
    </span>`;
    div.appendChild(d);
  });
}
function approveUser(i){ obywatele[i].approved=true; saveUsers(); renderUsers(); }
function removeUser(i){ obywatele.splice(i,1); saveUsers(); renderUsers(); }
function saveUsers(){ localStorage.setItem("obywatele",JSON.stringify(obywatele)); }

// Ogłoszenia admin
const ogForm=document.getElementById("ogloszeniaForm");
if(ogForm){
ogForm.addEventListener("submit", function(e){
  e.preventDefault();
  const text=document.getElementById("newOgloszenie").value.trim();
  if(text==="") return;
  ogloszenia.unshift(`[${new Date().toLocaleDateString()}] ${text}`);
  localStorage.setItem("ogloszenia",JSON.stringify(ogloszenia));
  document.getElementById("newOgloszenie").value="";
  renderAdminOgloszenia();
  renderOgloszenia();
});
}

function renderAdminOgloszenia(){
  const ul=document.getElementById("adminOgloszenia");
  if(!ul) return;
  ul.innerHTML="";
  ogloszenia.forEach((o,i)=>{
    const li=document.createElement("li");
    li.innerHTML=`<span>${o}</span> <button onclick="removeOgloszenie(${i})">Usuń</button>`;
    ul.appendChild(li);
  });
}
function removeOgloszenie(i){
  ogloszenia.splice(i,1);
  localStorage.setItem("ogloszenia",JSON.stringify(ogloszenia));
  renderAdminOgloszenia();
  renderOgloszenia();
}

// Rekrutacje admin
function renderRekrutacje(){
  const div=document.getElementById("rekrutList");
  if(!div) return;
  div.innerHTML="";
  rekrutacje.forEach((r,i)=>{
    const rdiv=document.createElement("div");
    rdiv.style.display="flex";rdiv.style.justifyContent="space-between";rdiv.style.marginBottom="5px";
    rdiv.innerHTML=`<span>${r.nick}: ${r.text} - Status: ${r.approved ? "✅ Zatwierdzone":"🕓 Oczekuje"}</span>
    <span>
      ${!r.approved?`<button onclick="approveRekrut(${i})">Zatwierdź</button>`:""}
      <button onclick="removeRekrut(${i})">Usuń</button>
    </span>`;
    div.appendChild(rdiv);
  });
}
function approveRekrut(i){ rekrutacje[i].approved=true; localStorage.setItem("rekrutacje",JSON.stringify(rekrutacje)); renderRekrutacje(); }
function removeRekrut(i){ rekrutacje.splice(i,1); localStorage.setItem("rekrutacje",JSON.stringify(rekrutacje)); renderRekrutacje(); }
