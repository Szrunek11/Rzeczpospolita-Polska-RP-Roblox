// Dane lokalne
let users = JSON.parse(localStorage.getItem("users")) || [];
let aktualnosci = JSON.parse(localStorage.getItem("aktualnosci")) || [];
let ogloszenia = JSON.parse(localStorage.getItem("ogloszenia")) || [];
let rekrutacje = JSON.parse(localStorage.getItem("rekrutacje")) || [];
let zdjecia = JSON.parse(localStorage.getItem("zdjecia")) || [];

let currentUser = null;

// Sekcje strony
function showSection(id){
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// Logowanie
document.getElementById("loginForm").addEventListener("submit", e=>{
  e.preventDefault();
  const name = document.getElementById("loginName").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  if(name==="admin" && pass==="admin"){
    currentUser={name:"admin",admin:true};
  } else{
    const user=users.find(u=>u.name===name && u.pass===pass);
    if(!user){document.getElementById("loginError").textContent="Nieprawidłowy login lub hasło!";return;}
    currentUser=user;
  }
  loginSuccess();
});

function loginSuccess(){
  document.getElementById("loginSection").classList.remove("active");
  document.getElementById("registerSection").classList.remove("active");
  document.getElementById("navBar").classList.remove("hidden");
  if(currentUser.admin) document.getElementById("adminTab").classList.remove("hidden");
  renderHome();
  renderRekrutacje();
  showSection("home");
}

// Rejestracja krok po kroku
function showRegister(){showSection("registerSection"); showStep(1);}
function showLogin(){showSection("loginSection");}

// Obsługa kroków
let currentStep=1;
function showStep(step){
  document.querySelectorAll(".step").forEach(s=>s.classList.remove("active"));
  document.getElementById("step"+step).classList.add("active");
  currentStep=step;
}
function nextStep(step){showStep(step+1);}
function prevStep(step){showStep(step-1);}

// Zakończenie rejestracji
document.getElementById("finishRegister").addEventListener("click",()=>{
  const name=document.getElementById("regName").value.trim();
  const pass=document.getElementById("regPass").value.trim();
  const nick=document.getElementById("regNick").value.trim();
  const wiek=document.getElementById("regWiek").value.trim();
  const miasto=document.getElementById("regMiasto").value.trim();
  const rola=document.getElementById("regRola").value.trim();

  if(users.find(u=>u.name===name)){document.getElementById("registerMsg").textContent="Login już istnieje!"; return;}

  const newUser={name,pass,nick,wiek,miasto,rola};
  users.push(newUser);
  localStorage.setItem("users",JSON.stringify(users));
  document.getElementById("registerMsg").textContent="Rejestracja zakończona! Możesz się zalogować.";
  showLogin();
});

// Wylogowanie
function logout(){
  currentUser=null;
  document.getElementById("navBar").classList.add("hidden");
  document.getElementById("adminTab").classList.add("hidden");
  showSection("loginSection");
}

// Rekrutacja dla graczy
document.getElementById("rekrutacjaForm").addEventListener("submit", e=>{
  e.preventDefault();
  const nick=document.getElementById("rekrutNick").value.trim();
  const text=document.getElementById("rekrutText").value.trim();
  rekrutacje.push({nick,text});
  localStorage.setItem("rekrutacje",JSON.stringify(rekrutacje));
  document.getElementById("rekrutMessage").textContent="Rekrutacja wysłana!";
  e.target.reset();
  renderRekrutacje();
});

// Panel admina
function addAktualnosc(){
  const text=prompt("Wpisz treść aktualności:");
  if(text){aktualnosci.push(text); localStorage.setItem("aktualnosci",JSON.stringify(aktualnosci)); renderHome();}
}
function addOgloszenie(){
  const text=prompt("Wpisz treść ogłoszenia:");
  if(text){ogloszenia.push(text); localStorage.setItem("ogloszenia",JSON.stringify(ogloszenia)); renderHome();}
}
function addZdjecie(){
  const input=document.createElement("input");
  input.type="file";
  input.accept="image/png, image/jpeg";
  input.onchange=e=>{
    const file=e.target.files[0];
    if(file){
      const reader=new FileReader();
      reader.onload=function(ev){
        zdjecia.push(ev.target.result);
        localStorage.setItem("zdjecia",JSON.stringify(zdjecia));
        alert("Zdjęcie dodane!");
        renderHome();
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

// Renderowanie strony głównej
function renderHome(){
  const homeAkt=document.getElementById("homeAktualnosci");
  const homeOgl=document.getElementById("homeOgloszenia");
  const homeImg=document.getElementById("homeZdjecia");

  homeAkt.innerHTML=aktualnosci.map(a=>`<p class="pop">📰 ${a}</p>`).join("") || "Brak aktualności.";
  homeOgl.innerHTML=ogloszenia.map(o=>`<p class="pop">📢 ${o}</p>`).join("") || "Brak ogłoszeń.";
  homeImg.innerHTML=zdjecia.map(z=>`<img src="${z}" class="pop" style="max-width:200px;margin:5px;">`).join("") || "Brak zdjęć.";
}

// Renderowanie rekrutacji w panelu admina
function renderRekrutacje(){
  if(!currentUser?.admin) return;
  const adminDiv=document.getElementById("adminRekrutacje");
  adminDiv.innerHTML="";
  rekrutacje.forEach((r,index)=>{
    const div=document.createElement("div");
    div.className="card pop";
    div.innerHTML=`<b>${r.nick}</b>: ${r.text} 
      <button onclick="zatwierdz(${index})" class="btn small">Zatwierdź</button>
      <button onclick="usunRekrutacje(${index})" class="btn small">Usuń</button>`;
    adminDiv.appendChild(div);
  });
}

// Zatwierdzenie rekrutacji (przypisanie do graczy automatycznie)
function zatwierdz(index){
  alert(`Rekrutacja ${rekrutacje[index].nick} zatwierdzona!`);
  rekrutacje.splice(index,1);
  localStorage.setItem("rekrutacje",JSON.stringify(rekrutacje));
  renderRekrutacje();
}

// Usuwanie rekrutacji
function usunRekrutacje(index){
  if(confirm("Czy na pewno chcesz usunąć tę rekrutację?")){
    rekrutacje.splice(index,1);
    localStorage.setItem("rekrutacje",JSON.stringify(rekrutacje));
    renderRekrutacje();
  }
}

// Inicjalizacja
renderHome();
