const state={articles:[],read:new Set(JSON.parse(localStorage.getItem("radar-read")||"[]")),saved:new Set(JSON.parse(localStorage.getItem("radar-saved")||"[]"))};
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]));
function persist(){localStorage.setItem("radar-read",JSON.stringify([...state.read]));localStorage.setItem("radar-saved",JSON.stringify([...state.saved]));}
function fmt(d){if(!d)return"";const x=new Date(d);return Number.isNaN(x.getTime())?d:x.toLocaleString("pt-BR",{dateStyle:"short",timeStyle:"short"});}
function priority(a){if(a.priority)return a.priority;return "KNOWLEDGE";}
function render(){
 const q=$("#search").value.trim().toLowerCase(),cat=$("#category").value,status=$("#status").value;
 let list=state.articles.filter(a=>(cat==="all"||a.category===cat)&&(!q||[a.title,a.summary,a.source,a.category].join(" ").toLowerCase().includes(q)));
 list=list.filter(a=>status==="all"||(status==="read"&&state.read.has(a.id))||(status==="unread"&&!state.read.has(a.id))||(status==="saved"&&state.saved.has(a.id)));
 $("#resultCount").textContent=list.length+" notícia"+(list.length===1?"":"s");
 $("#totalCount").textContent=state.articles.length;$("#unreadCount").textContent=state.articles.filter(a=>!state.read.has(a.id)).length;
 $("#empty").hidden=list.length!==0;
 $("#newsList").innerHTML=list.map(a=>{const r=state.read.has(a.id),s=state.saved.has(a.id),p=priority(a),pc=p.toLowerCase().replaceAll(" ","-");return `<article class="card ${r?"read":""}">
   <div class="card-top"><span class="tag">${esc(a.category)}</span><span class="priority ${pc}">${esc(p)}</span></div>
   <h3>${esc(a.title)}</h3><p class="summary">${esc(a.summary||"Leia a notícia na fonte oficial.")}</p>
   <div class="meta"><span>${esc(a.source)}</span><span>•</span><span>${esc(fmt(a.published_at))}</span></div>
   <div class="card-actions"><div class="links"><a class="link" href="${esc(a.url)}" target="_blank" rel="noopener" data-read="${esc(a.id)}">Abrir fonte ↗</a><button class="link" data-read="${esc(a.id)}">${r?"Marcar como não lida":"Marcar como lida"}</button></div><button class="link save ${s?"on":""}" data-save="${esc(a.id)}">${s?"★ Salva":"☆ Salvar"}</button></div>
 </article>`}).join("");
 document.querySelectorAll("[data-read]").forEach(el=>el.addEventListener("click",e=>{const id=el.dataset.read;state.read.has(id)?state.read.delete(id):state.read.add(id);persist();render()}));
 document.querySelectorAll("[data-save]").forEach(el=>el.addEventListener("click",()=>{const id=el.dataset.save;state.saved.has(id)?state.saved.delete(id):state.saved.add(id);persist();render()}));
}
async function load(){try{const r=await fetch("data/articles.json?"+Date.now());state.articles=await r.json();$("#lastUpdated").textContent="Arquivo atualizado "+fmt(state.articles[0]?.collected_at||new Date());render()}catch(e){$("#newsList").innerHTML='<div class="empty">Não foi possível carregar o arquivo de notícias.</div>'}}
async function refresh(){const b=$("#refreshBtn");b.disabled=true;b.textContent="Recarregando...";await load();setTimeout(()=>{b.disabled=false;b.textContent="Atualizar agora"},500)}
$("#search").addEventListener("input",render);$("#category").addEventListener("change",render);$("#status").addEventListener("change",render);$("#refreshBtn").addEventListener("click",refresh);load();setInterval(load,300000);