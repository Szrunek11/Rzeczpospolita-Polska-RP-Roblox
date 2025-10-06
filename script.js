// Dane
let aktualnosci = JSON.parse(localStorage.getItem("aktualnosci") || "[]");
let ogloszenia = JSON.parse(localStorage.getItem("ogloszenia") || "[]");
let obywatele = JSON.parse(localStorage.getItem("obywatele") || "[]");
let galeria = JSON.parse(localStorage.getItem("galeria") || "[]");

// Aktualności
function renderNews(){
  const list=document.getElementById("aktualnosciLista");
  if(!list) return;
  list.innerHTML = aktualnosci.map(n=>`<article><h3>${n.title}</h3><p>${n.text}</p></article>`).join("");
}
renderNews();

// Obywatele
function renderObywatele(){
  const list=document.getElementById("obywateleLista");
  if(!list) return;
  list.innerHTML = obywatele.map(o=>`<li>${o}</li>`).join("");
}
renderObywatele();

// Galeria
function renderGaleria(){
  const div=document.getElementById("galeriaZdjecia");
  if(!div) return;
  div.innerHTML = galeria.map(src=>`<img src="${src}">`).join("");
}
renderGaleria();

// Rekrutacja
const form=document.getElementById("rekrutacjaForm");
if(form){
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const nick=document.getElementById("rekrutNick").value;
    const text=document.getElementById("rekrutText").value;
    if(nick && text){
      obywatele.push(nick);
      localStorage.setItem("obywatele",JSON.stringify(obywatele));
      document.getElementById("rekrutMessage").innerHTML=`✅ Rekrutacja wysłana! Dołącz na Discord: <a href="https://discord.gg/5aZqgpErnc" target="_blank">Kliknij tutaj</a>`;
      form.reset();
    }
  });
}

// Panel admina
function adminLogin(){
  const u=document.getElementById("adminUser").value;
  const p=document.getElementById("adminPass").value;
  if(u==="admin" && p==="admin"){
    document.getElementById("adminLogin").style.display="none";
    document.getElementById("adminPanel").style.display="block";
  }else alert("Niepoprawne dane logowania!");
}
function addNews(){
  const t=document.getElementById("newsTitle").value;
  const x=document.getElementById("newsText").value;
  if(!t||!x)return;
  aktualnosci.push({title:t,text:x});
  localStorage.setItem("aktualnosci",JSON.stringify(aktualnosci));
  alert("Aktualność dodana!");
}
function addPhoto(){
  const input=document.getElementById("photoInput");
  const file=input.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    galeria.push(e.target.result);
    localStorage.setItem("galeria",JSON.stringify(galeria));
    alert("Zdjęcie dodane!");
  }
  reader.readAsDataURL(file);
}
