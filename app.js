(async()=>{
const C=window.CFG,$=s=>document.querySelector(s),P=document.body.dataset.p;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fd=d=>new Date(d).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});
$("#nav").innerHTML=[["index","Dates"],["album","Album"],["carte","Carte"],["listes","Listes"],["capsules","Capsules"]].map(([h,t])=>`<a href="${h}.html"${h==P?' class="on"':""}>${t}</a>`).join("");
let db=null;if(C.firebase&&window.firebase){firebase.initializeApp(C.firebase);db=firebase.firestore();}
const ls=c=>JSON.parse(localStorage.getItem(c)||"[]");
const store={
 async list(c){if(db){const s=await db.collection(c).orderBy("ts").get();return s.docs.map(d=>({id:d.id,...d.data()}));}return ls(c);},
 async add(c,o){o.ts=Date.now();if(db){await db.collection(c).add(o);}else{o.id=String(o.ts);const a=ls(c);a.push(o);localStorage.setItem(c,JSON.stringify(a));}},
 async set(c,id,o){if(db){await db.collection(c).doc(id).update(o);}else{const a=ls(c);Object.assign(a.find(x=>x.id==id),o);localStorage.setItem(c,JSON.stringify(a));}}
};
if(P=="index"){
 const t=new Date(C.retrouvailles.date+"T00:00:00");
 const tick=()=>{const ms=Math.max(0,t-Date.now());$("#cd").innerHTML=[[Math.floor(ms/864e5),"jours"],[Math.floor(ms/36e5)%24,"heures"],[Math.floor(ms/6e4)%60,"minutes"],[Math.floor(ms/1e3)%60,"secondes"]].map(([n,l])=>`<div><b>${n}</b><i>${l}</i></div>`).join("");};
 tick();setInterval(tick,1000);$("#lab").textContent=C.retrouvailles.label;
 $("#tog").textContent=Math.floor((Date.now()-new Date(C.start))/864e5)+" jours depuis le début";
 $("#dates").innerHTML=C.dates.map(x=>{const n=Math.round((new Date(x.d)-Date.now())/864e5);return `<li><time>${fd(x.d)}</time><span>${esc(x.t)}</span><em>${n>0?"dans "+n+" j":n==0?"aujourd'hui":"il y a "+(-n)+" j"}</em></li>`}).join("");
}
if(P=="album"){
 $("#g").innerHTML=C.photos.map((p,i)=>`<figure><img loading="lazy" src="${p.src}" alt="${esc(p.t)}" data-i="${i}"><figcaption>${esc(p.t)}</figcaption></figure>`).join("");
 const dl=$("#dl");$("#g").onclick=e=>{const i=e.target.dataset.i;if(i==null)return;dl.querySelector("img").src=C.photos[i].src;dl.querySelector("p").textContent=C.photos[i].t;dl.showModal();};dl.onclick=()=>dl.close();
}
if(P=="carte"){
 const m=L.map("map",{worldCopyJump:true}).setView([40,-30],2);
 L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",{attribution:"© OpenStreetMap © CARTO"}).addTo(m);
 fetch("https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json").then(r=>r.json()).then(g=>L.geoJSON(g,{style:f=>C.visited.includes(f.id)?{color:"#2f7a4b",weight:1.5,fillColor:"#3f8f5b",fillOpacity:.5}:{weight:0,fillOpacity:0}}).addTo(m));
 C.photos.filter(p=>p.fav&&p.lat!=null).forEach(p=>L.marker([p.lat,p.lng]).addTo(m).bindPopup(`<img src="${p.src}" width="180" alt=""><br>${esc(p.t)}`));
}
if(P=="listes"){
 const R=async c=>{const a=await store.list(c);$("#"+c).innerHTML=a.map(x=>`<li><label><input type="checkbox" data-c="${c}" data-id="${x.id}"${x.done?" checked":""}>${esc(x.title)}</label></li>`).join("")||'<li class="empty">Rien pour l\'instant. Ajoute le premier.</li>';};
 await R("films");await R("musiques");
 document.onsubmit=async e=>{e.preventDefault();const f=e.target,i=f.querySelector("input");await store.add(f.dataset.c,{title:i.value,done:false});i.value="";R(f.dataset.c);};
 document.onchange=async e=>{const t=e.target;if(t.dataset.id){await store.set(t.dataset.c,t.dataset.id,{done:t.checked});}};
}
if(P=="capsules"){
 const all=await store.list("capsules");
 $("#caps").innerHTML=Object.entries(C.unlock).map(([k,d])=>{const u=new Date(d+"T00:00:00"),open=Date.now()>=u,ms=all.filter(x=>x.cap==k);
  const body=open?(ms.map(x=>`<blockquote><p>${esc(x.text).replace(/\n/g,"<br>")}</p><cite>${esc(x.who)}</cite></blockquote>`).join("")||"<p>Aucun message déposé.</p>")
  :`<p class="lock">Fermée jusqu'au ${fd(u)}. ${ms.length} message(s) déposé(s).</p><form data-k="${k}"><select aria-label="Auteur">${C.couple.map(n=>`<option>${esc(n)}</option>`).join("")}</select><textarea required rows="6" placeholder="Ton message, à lire le jour J"></textarea><button>Déposer dans la capsule</button></form>`;
  return `<section><h2>${k=="1an"?"Nos 1 an":"Nos 2 ans"}</h2>${body}</section>`}).join("");
 $("#caps").onsubmit=async e=>{e.preventDefault();const f=e.target;await store.add("capsules",{cap:f.dataset.k,who:f.querySelector("select").value,text:f.querySelector("textarea").value});location.reload();};
}
})();
