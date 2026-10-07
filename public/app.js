let items=[], filter="all";
const grid=document.getElementById("grid"), search=document.getElementById("search"), empty=document.getElementById("empty");
async function load(){items=await fetch("/api/library").then(r=>r.json()); render();}
function render(){
  const q=search.value.toLowerCase();
  const shown=items.filter(x=>(filter==="all"||x.type===filter)&&x.title.toLowerCase().includes(q));
  grid.innerHTML="";
  empty.hidden=shown.length!==0;
  shown.forEach(x=>{
    const card=document.createElement("article"); card.className="card";
    card.innerHTML=`<div class="poster">${escapeHtml(x.title)}</div><div class="info"><div>${escapeHtml(x.title)}</div><div class="type">${x.type==="series"?"Série":"Film"}</div></div>`;
    card.onclick=()=>play(x); grid.appendChild(card);
  });
}
function play(x){document.getElementById("player").hidden=false;document.getElementById("playerTitle").textContent=x.title;const v=document.getElementById("video");v.src="/api/video/"+x.id;v.play().catch(()=>{});}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));}
document.querySelectorAll("nav button").forEach(b=>b.onclick=()=>{document.querySelectorAll("nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");filter=b.dataset.filter;render();});
search.oninput=render;
document.getElementById("browse").onclick=()=>document.querySelector("section").scrollIntoView({behavior:"smooth"});
document.getElementById("close").onclick=()=>{const v=document.getElementById("video");v.pause();v.removeAttribute("src");document.getElementById("player").hidden=true};
load();