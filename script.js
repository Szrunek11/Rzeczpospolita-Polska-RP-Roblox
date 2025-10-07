// Dane lokalne
let users = JSON.parse(localStorage.getItem("users")) || [];
let aktualnosci = JSON.parse(localStorage.getItem("aktualnosci")) || [];
let ogloszenia = JSON.parse(localStorage.getItem("ogloszenia")) || [];
let rekrutacje = JSON.parse(localStorage.getItem("rekrutacje")) || [];
let zdjecia = JSON.parse(localStorage.getItem("zdjecia")) || [];
let pliki = JSON.parse(localStorage.getItem("pliki")) || [];
let hymn = localStorage.getItem("hymn") || "Jeszcze Polska nie zginęła, Kiedy my żyjemy...";

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
  updateHymnSection();
  renderHome();
  renderRekrutacje();
  renderPliki();
  showSection("home");
}

// Rejestracja krok po kroku
function showRegister(){showSection("registerSection"); showStep(1);}
function showLogin(){showSection("loginSection");}

let currentStep=1;
function showStep(step){
  document.querySelectorAll(".step").forEach(s=>s.classList.remove("active"));
  document.getElementById("step"+step).classList.add("active");
  currentStep=step;
}
function nextStep(step){showStep(step+1);}
function prevStep(step){showStep(step-1);}

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

// Rekrutacja
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
function addPlik(){
  const input=document.createElement("input");
  input.type="file";
  input.onchange=e=>{
    const file=e.target.files[0];
    if(file){
      const reader=new FileReader();
      reader.onload=function(ev){
        pliki.push({name:file.name,data:ev.target.result});
        localStorage.setItem("pliki",JSON.stringify(pliki));
        alert("Plik dodany do pobrania!");
        renderPliki();
      };
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

// Renderowanie strony głównej
function renderHome(){
  document.getElementById("homeAktualnosci").innerHTML = aktualnosci.map(a=>`<p class="pop">📰 ${a}</p>`).join("") || "Brak aktualności.";
  document.getElementById("homeOgloszenia").innerHTML = ogloszenia.map(o=>`<p class="pop">📢 ${o}</p>`).join("") || "Brak ogłoszeń.";
  document.getElementById("homeZdjecia").innerHTML = zdjecia.map(z=>`<img src="${z}" class="pop" style="max-width:200px;margin:5px;">`).join("") || "Brak zdjęć.";
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
function zatwierdz(index){
  alert(`Rekrutacja ${rekrutacje[index].nick} zatwierdzona!`);
  rekrutacje.splice(index,1);
  localStorage.setItem("rekrutacje",JSON.stringify(rekrutacje));
  renderRekrutacje();
}
function usunRekrutacje(index){
  if(confirm("Czy na pewno chcesz usunąć tę rekrutację?")){
    rekrutacje.splice(index,1);
    localStorage.setItem("rekrutacje",JSON.stringify(rekrutacje));
    renderRekrutacje();
  }
}

// Renderowanie plików do pobrania
function renderPliki(){
  const div=document.getElementById("plikiLista");
  div.innerHTML="";
  if(pliki.length===0){div.textContent="Brak plików do pobrania"; return;}
  pliki.forEach((p,index)=>{
    const a=document.createElement("a");
    a.href=p.data;
    a.download=p.name;
    a.textContent=p.name;
    a.className="btn pop";
    a.style.display="block";
    div.appendChild(a);
  });
}

// Hymn Polski
function updateHymnSection(){
  document.getElementById("hymnTekst").innerText = hymn;
  if(currentUser?.admin){
    document.getElementById("editHymnBtn").classList.remove("hidden");
  } else document.getElementById("editHymnBtn").classList.add("hidden");
}
function edytujHymn(){
  const nowy = prompt("Wpisz nowy tekst hymnu:", hymn);
  if(nowy){hymn = nowy; localStorage.setItem("hymn",hymn); updateHymnSection();}
}

// Inicjalizacja
renderHome();
renderRekrutacje();
renderPliki();
updateHymnSection();
