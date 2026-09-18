import fs from "node:fs/promises";

const SOURCES=[
 {name:"Ministério do Trabalho e Emprego",url:"https://www.gov.br/trabalho-e-emprego/pt-br/noticias-e-conteudo",category:"Legislação & Normas"},
 {name:"eSocial",url:"https://www.gov.br/esocial/pt-br/noticias",category:"eSocial & Folha"},
 {name:"CNI — Conexão Trabalho",url:"https://conexaotrabalho.portaldaindustria.com.br/",category:"Mercado de Trabalho"},
 {name:"Câmara dos Deputados",url:"https://www.camara.leg.br/assuntos/trabalho-previdencia-e-assistencia",category:"Legislação & Normas"}
];

const headers={"User-Agent":"Radar-RH-RAJA/1.0 (+https://github.com/rhrajahub/RADAR-RH-RAJA)"};
const clean=s=>String(s||"").replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\\s+/g," ").trim();
const slug=s=>s.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function extract(html,source,base,category){
 const out=[],seen=new Set();
 const re=/<a[^>]+href=["']([^"']+)["'][^>]*>([\\s\\S]*?)<\\/a>/gi; let m;
 while((m=re.exec(html))!==null){
   const title=clean(m[2]); if(title.length<35||title.length>220)continue;
   let url;try{url=new URL(m[1],base).href}catch{continue}
   if(!url.startsWith("https://")||seen.has(url))continue;
   const t=(title+" "+url).toLowerCase();
   if(!/(trabalho|emprego|rh|recursos humanos|esocial|fgts|férias|ferias|salario|salário|clt|legis|jornada|beneficio|benefício|caged|pat|segur|previd|saude|saúde|gestao|gestão|contrat|demiss|deslig|aprendiz|estag|igualdade|assédio|assédio)/i.test(t))continue;
   seen.add(url);out.push({id:slug(source+"-"+title),title,summary:"Atualização identificada na fonte oficial. Abra a publicação para consultar o conteúdo completo.",source,url,category,priority:"KNOWLEDGE",published_at:null,collected_at:new Date().toISOString()});
   if(out.length>=25)break;
 }
 return out;
}
const existing=JSON.parse(await fs.readFile("data/articles.json","utf8"));
const byId=new Map(existing.map(a=>[a.id,a]));
for(const src of SOURCES){
 try{
   const r=await fetch(src.url,{headers}); if(!r.ok)continue;
   const html=await r.text();
   for(const a of extract(html,src.name,src.url,src.category))byId.set(a.id,{...a,...(byId.get(a.id)||{})});
 }catch(e){console.log("source failed",src.name,e.message)}
}
const all=[...byId.values()].sort((a,b)=>new Date(b.published_at||b.collected_at)-new Date(a.published_at||a.collected_at));
await fs.writeFile("data/articles.json",JSON.stringify(all.slice(0,1000),null,2)+"\n");
console.log("Radar atualizado:",all.length,"artigos");
