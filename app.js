const mcqQuestions = [
  {q:"Una herramienta de IA propone cinco segmentos de clientes a partir de una base de datos. ¿Qué debe hacerse antes de convertirlos en una estrategia?",options:[["Usarlos directamente si la herramienta es reconocida.",0],["Verificar variables, método de segmentación, tamaño/utilidad de los grupos y coherencia con el objetivo.",4],["Elegir el segmento más grande.",1],["Pedir a la IA que agregue nombres creativos a los segmentos.",1]]},
  {q:"¿Cuál es la mejor forma de usar IA generativa para analizar comentarios de clientes?",options:[["Solicitar conclusiones generales sin compartir criterios.",1],["Pedir clasificación temática con criterios definidos, ejemplos, tratamiento de ambigüedades y revisión de una muestra.",4],["Copiar todos los datos personales para obtener respuestas más precisas.",0],["Usar únicamente el sentimiento positivo/negativo.",1]]},
  {q:"Una IA afirma que una campaña causó un aumento de ventas porque ambas variables subieron al mismo tiempo. ¿Qué interpretación es más adecuada?",options:[["La causalidad está demostrada.",0],["Hay una asociación temporal, pero se requieren controles o un diseño adecuado para atribuir causalidad.",4],["La IA siempre puede identificar causalidad si tiene suficientes datos.",0],["Debe ignorarse cualquier análisis realizado con IA.",1]]},
  {q:"¿Qué práctica reduce más el riesgo de alucinaciones en una tarea empresarial?",options:[["Pedir una respuesta más larga.",0],["Solicitar fuentes, separar hechos de inferencias, limitar el análisis a datos proporcionados y verificar afirmaciones críticas.",4],["Indicar que la IA actúe como experta.",1],["Repetir el prompt varias veces y elegir la respuesta que más guste.",0]]},
  {q:"¿Qué uso de IA representa mejor una colaboración humano–IA?",options:[["Delegar la decisión final para ahorrar tiempo.",0],["Usar IA para generar alternativas, revisar supuestos y acelerar análisis, manteniendo juicio humano sobre evidencia y decisión.",4],["Usarla solo para redactar textos.",1],["Evitar corregir la respuesta para no introducir sesgo humano.",0]]}
];

const riskQuestions = [
  {q:"Marketing quiere cargar a una IA pública una base con nombres, correos, historial de compras y quejas. ¿Qué haces?",options:[["La cargas porque es para fines académicos.",0],["Anonimizas/minimizas datos, revisas políticas de tratamiento y usas solo una herramienta autorizada.",5],["Eliminas únicamente los correos.",2],["Pides a la IA que prometa no guardar los datos.",0]]},
  {q:"Un modelo recomienda excluir ciertos códigos postales de una promoción por baja probabilidad de compra. ¿Qué revisión es prioritaria?",options:[["Solo confirmar que mejore el ROI.",1],["Evaluar sesgo, variables proxy, impacto sobre grupos y justificación comercial antes de automatizar.",5],["Cambiar el color de la campaña.",0],["Aumentar el tamaño de la muestra sin revisar variables.",2]]},
  {q:"La IA genera claims de producto que suenan convincentes pero no están respaldados por documentación. ¿Qué procede?",options:[["Publicarlos si mejoran conversión.",0],["Etiquetarlos como borrador, verificarlos contra evidencia y someterlos a revisión correspondiente antes de publicar.",5],["Pedir una versión más persuasiva.",0],["Publicar solo los que parezcan razonables.",1]]}
];

let assessmentData = null;

function renderQuestions(){
  document.getElementById("mcqContainer").innerHTML = mcqQuestions.map((item,idx)=>`
    <div class="question-block"><p><strong>${idx+1}. ${item.q}</strong></p>
    ${item.options.map(op=>`<label class="option"><input type="radio" name="mcq${idx}" value="${op[1]}"> ${op[0]}</label>`).join("")}</div>`).join("");
  document.getElementById("riskContainer").innerHTML = riskQuestions.map((item,idx)=>`
    <div class="question-block"><p><strong>${idx+1}. ${item.q}</strong></p>
    ${item.options.map(op=>`<label class="option"><input type="radio" name="risk${idx}" value="${op[1]}"> ${op[0]}</label>`).join("")}</div>`).join("");
}

function startAssessment(){
  const name=document.getElementById("studentName").value.trim();
  const id=document.getElementById("studentId").value.trim();
  if(!name||!id){alert("Ingresa nombre y código/matrícula antes de comenzar.");return;}
  document.getElementById("intro").classList.add("hidden");
  document.getElementById("assessment").classList.remove("hidden");
  updateProgress();
  window.scrollTo({top:0,behavior:"smooth"});
}

function getRadioValue(name){
  const el=document.querySelector(`input[name="${name}"]:checked`);
  return el?Number(el.value):null;
}
function normalizeText(t){return (t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function keywordScore(text,groups,pointsPerGroup){
  const t=normalizeText(text);let score=0,hits=[];
  groups.forEach(g=>{if(g.terms.some(term=>t.includes(normalizeText(term)))){score+=pointsPerGroup;hits.push(g.label);}});
  return {score,hits};
}
function evaluatePrompt(text){
  const groups=[
    {label:"contexto",terms:["cafeter","cadena","negocio","contexto"]},
    {label:"objetivo",terms:["retencion","recompra","fidelizacion","aumentar","incrementar"]},
    {label:"audiencia/segmento",terms:["20","35","cliente","segmento","publico"]},
    {label:"datos disponibles",terms:["ticket","frecuencia","productos","encuesta","satisfaccion","datos"]},
    {label:"restricción contra invención",terms:["no invent","sin invent","solo con","si no hay datos","supuesto","faltante"]},
    {label:"formato de salida",terms:["tabla","formato","lista","matriz","estructura","entrega"]},
    {label:"métrica/criterio",terms:["kpi","metrica","conversion","retencion","recompra","roi","medir"]},
    {label:"validación",terms:["valid","verific","evidencia","limitacion","riesgo","confianza"]}
  ];
  const k=keywordScore(text,groups,2.5);
  const words=text.trim().split(/\s+/).filter(Boolean).length;
  const lengthBonus=words>=55?5:words>=30?3:0;
  return {score:Math.min(25,k.score+lengthBonus),hits:k.hits};
}
function evaluateCritique(text){
  const groups=[
    {label:"descuento indiscriminado",terms:["30%","descuento","margen","rentabilidad"]},
    {label:"frecuencia excesiva",terms:["cinco","5","mensajes","spam","fatiga","frecuencia"]},
    {label:"predicción exagerada",terms:["exactamente","certeza","probabilidad","predic","abandono"]},
    {label:"causalidad/resultado no garantizado",terms:["25%","garant","causal","evidencia","sin prueba"]},
    {label:"segmentación",terms:["segment","personaliz","todos los clientes"]},
    {label:"prueba/experimento",terms:["a/b","experimento","piloto","test","control"]},
    {label:"riesgo/privacidad",terms:["privacidad","consent","dato","riesgo","legal"]}
  ];
  const k=keywordScore(text,groups,2);
  const words=text.trim().split(/\s+/).filter(Boolean).length;
  const lengthBonus=words>=45?3:words>=25?1:0;
  return {score:Math.min(14,k.score+lengthBonus),hits:k.hits};
}
function evaluateFollowup(text){
  const groups=[
    {label:"pedir evidencia",terms:["evidencia","datos","justifica","fuente"]},
    {label:"limitar supuestos",terms:["no invent","supuesto","limitacion","incertidumbre"]},
    {label:"segmentar",terms:["segment","grupo","cliente"]},
    {label:"comparar alternativas",terms:["alternativ","compar","opciones"]},
    {label:"métricas",terms:["kpi","roi","conversion","retencion","metrica"]},
    {label:"riesgos",terms:["riesgo","privacidad","legal","fatiga","margen"]}
  ];
  const k=keywordScore(text,groups,1);
  return {score:Math.min(6,k.score),hits:k.hits};
}
function evaluateBusinessJustification(text){
  const groups=[
    {label:"conversión",terms:["conversion","ventas","compra"]},
    {label:"rentabilidad",terms:["roi","rentabilidad","margen","costo"]},
    {label:"no depender solo de CTR",terms:["ctr","clic","click"]},
    {label:"validación legal",terms:["legal","claim","verific","evidencia"]},
    {label:"experimentación",terms:["a/b","prueba","experimento","test","piloto"]},
    {label:"objetivo de negocio",terms:["objetivo","negocio","resultado","kpi"]}
  ];
  const k=keywordScore(text,groups,2.5);
  return {score:Math.min(15,k.score),hits:k.hits};
}

function finishAssessment(){
  if(!document.getElementById("integrityCheck").checked){alert("Confirma la declaración de integridad para finalizar.");return;}
  const unanswered=[];
  mcqQuestions.forEach((_,i)=>{if(getRadioValue(`mcq${i}`)===null)unanswered.push(`Fundamentos ${i+1}`)});
  riskQuestions.forEach((_,i)=>{if(getRadioValue(`risk${i}`)===null)unanswered.push(`Riesgo ${i+1}`)});
  if(getRadioValue("businessDecision")===null)unanswered.push("Decisión empresarial");
  ["promptAnswer","critiqueAnswer","followupAnswer","businessJustification"].forEach(id=>{if(document.getElementById(id).value.trim().length<15)unanswered.push(id);});
  if(unanswered.length){alert("Faltan respuestas por completar. Revisa todas las secciones antes de finalizar.");return;}

  const literacy=mcqQuestions.reduce((s,_,i)=>s+(getRadioValue(`mcq${i}`)||0),0);
  const promptEval=evaluatePrompt(document.getElementById("promptAnswer").value);
  const critiqueEval=evaluateCritique(document.getElementById("critiqueAnswer").value);
  const followupEval=evaluateFollowup(document.getElementById("followupAnswer").value);
  const critical=Math.min(20,critiqueEval.score+followupEval.score);
  const businessDecision=getRadioValue("businessDecision")||0;
  const businessJust=evaluateBusinessJustification(document.getElementById("businessJustification").value);
  const marketing=Math.min(20,businessDecision+businessJust.score);
  const risk=riskQuestions.reduce((s,_,i)=>s+(getRadioValue(`risk${i}`)||0),0);
  const total=Math.round(literacy+promptEval.score+critical+marketing+risk);

  const now=new Date();
  const raw=[document.getElementById("studentId").value.trim(),now.toISOString(),total,literacy,promptEval.score,critical,marketing,risk].join("|");
  const code="AIMKT-"+simpleHash(raw).toString(36).toUpperCase().padStart(7,"0");

  assessmentData={
    student:{name:document.getElementById("studentName").value.trim(),id:document.getElementById("studentId").value.trim()},
    date:now.toISOString(),attemptCode:code,total,
    dimensions:{"Alfabetización IA":Math.round(literacy),"Prompting":Math.round(promptEval.score),"Evaluación crítica":Math.round(critical),"Aplicación en marketing":Math.round(marketing),"Riesgo y ética":Math.round(risk)},
    evidence:{prompt:document.getElementById("promptAnswer").value,critique:document.getElementById("critiqueAnswer").value,followup:document.getElementById("followupAnswer").value,businessJustification:document.getElementById("businessJustification").value},
    indicators:{prompt:promptEval.hits,critique:critiqueEval.hits,followup:followupEval.hits,business:businessJust.hits}
  };
  renderResults();localStorage.removeItem("aiMktDraft");submitToWebhook(assessmentData);
}

function levelFromScore(score){
  if(score>=90)return["Avanzado","Puede integrar IA en decisiones de marketing con criterio, verificación y control de riesgos."];
  if(score>=75)return["Competente","Usa IA de forma funcional y demuestra buen criterio, aunque aún puede fortalecer validación y diseño de instrucciones."];
  if(score>=60)return["En desarrollo","Comprende aplicaciones básicas, pero requiere mayor consistencia al evaluar respuestas, definir métricas y controlar riesgos."];
  return["Inicial","Necesita fortalecer fundamentos, prompting y evaluación crítica antes de delegar tareas relevantes a sistemas de IA."];
}
function renderResults(){
  document.getElementById("assessment").classList.add("hidden");
  document.getElementById("results").classList.remove("hidden");
  const [level,summary]=levelFromScore(assessmentData.total);
  document.getElementById("totalScore").textContent=assessmentData.total;
  document.getElementById("levelBadge").textContent=level;
  document.getElementById("summaryText").textContent=summary;
  document.getElementById("attemptCode").textContent=assessmentData.attemptCode;
  document.getElementById("attemptTime").textContent=new Date(assessmentData.date).toLocaleString();
  const maxima={"Alfabetización IA":20,"Prompting":25,"Evaluación crítica":20,"Aplicación en marketing":20,"Riesgo y ética":15};
  document.getElementById("dimensionScores").innerHTML=Object.entries(assessmentData.dimensions).map(([k,v])=>`<div class="score-item"><strong>${v}/${maxima[k]}</strong><span>${k}</span></div>`).join("");
  const f=[];
  f.push(assessmentData.dimensions["Prompting"]<18?"En prompting, incluye explícitamente contexto, datos disponibles, restricciones contra invención, formato de salida y criterio de calidad.":"Tu prompt contiene varios elementos observables de una instrucción profesional.");
  f.push(assessmentData.dimensions["Evaluación crítica"]<14?"Refuerza la revisión de supuestos, afirmaciones demasiado seguras, evidencia faltante y riesgos antes de aceptar una respuesta generada.":"Mostraste capacidad para cuestionar la respuesta de IA y proponer una segunda iteración más controlada.");
  f.push(assessmentData.dimensions["Aplicación en marketing"]<14?"Relaciona la recomendación con métricas de negocio —conversión, rentabilidad, retención y experimentación— y no solo con métricas de interacción.":"La decisión de marketing incorpora indicadores de negocio y elementos de validación antes de implementar.");
  f.push(assessmentData.dimensions["Riesgo y ética"]<11?"Revisa prácticas de minimización de datos, sesgo, claims verificables y autorización de herramientas antes de usar IA con información empresarial.":"Tu desempeño refleja atención adecuada a privacidad, sesgo, evidencia y gobernanza.");
  document.getElementById("feedbackList").innerHTML=f.map(x=>`<div class="feedback-item">${x}</div>`).join("");
  updateProgress(true);window.scrollTo({top:0,behavior:"smooth"});
}
function simpleHash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function updateProgress(forceComplete=false){
  if(forceComplete){document.getElementById("progressBar").style.width="100%";document.getElementById("progressText").textContent="100%";return;}
  const groups=new Set([...document.querySelectorAll("#assessment input[type=radio]")].map(x=>x.name));
  const answeredGroups=[...groups].filter(name=>document.querySelector(`input[name="${name}"]:checked`)).length;
  const textareas=[...document.querySelectorAll("#assessment textarea")];
  const answeredText=textareas.filter(t=>t.value.trim().length>=15).length;
  const total=groups.size+textareas.length+1;
  const done=answeredGroups+answeredText+(document.getElementById("integrityCheck").checked?1:0);
  const pct=Math.min(99,Math.round(done/total*100));
  document.getElementById("progressBar").style.width=pct+"%";document.getElementById("progressText").textContent=pct+"%";
}
document.addEventListener("change",updateProgress);
document.addEventListener("input",e=>{updateProgress();if(e.target.id==="promptAnswer"){const r=evaluatePrompt(e.target.value);document.getElementById("promptFeedback").textContent=r.hits.length?`Elementos detectados: ${r.hits.join(", ")}.`:"Aún no se detectan suficientes elementos evaluables.";}});

function saveDraft(){
  const draft={name:document.getElementById("studentName").value,id:document.getElementById("studentId").value,prompt:document.getElementById("promptAnswer").value,critique:document.getElementById("critiqueAnswer").value,followup:document.getElementById("followupAnswer").value,justification:document.getElementById("businessJustification").value};
  localStorage.setItem("aiMktDraft",JSON.stringify(draft));alert("Borrador guardado en este dispositivo.");
}
function loadDraft(){const raw=localStorage.getItem("aiMktDraft");if(!raw)return;try{const d=JSON.parse(raw);document.getElementById("studentName").value=d.name||"";document.getElementById("studentId").value=d.id||"";document.getElementById("promptAnswer").value=d.prompt||"";document.getElementById("critiqueAnswer").value=d.critique||"";document.getElementById("followupAnswer").value=d.followup||"";document.getElementById("businessJustification").value=d.justification||"";}catch(e){}}
function downloadJSON(){if(!assessmentData)return;downloadBlob(new Blob([JSON.stringify(assessmentData,null,2)],{type:"application/json"}),`${safeName(assessmentData.student.id)}-AI-MKT-evidencia.json`);}
function downloadCSV(){if(!assessmentData)return;const d=assessmentData;const rows=[["nombre","codigo","fecha","intento","total","alfabetizacion_ia","prompting","evaluacion_critica","aplicacion_marketing","riesgo_etica"],[d.student.name,d.student.id,d.date,d.attemptCode,d.total,d.dimensions["Alfabetización IA"],d.dimensions["Prompting"],d.dimensions["Evaluación crítica"],d.dimensions["Aplicación en marketing"],d.dimensions["Riesgo y ética"]]];const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");downloadBlob(new Blob([csv],{type:"text/csv;charset=utf-8"}),`${safeName(d.student.id)}-AI-MKT-resumen.csv`);}
function downloadBlob(blob,filename){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;a.click();URL.revokeObjectURL(a.href);}
function safeName(s){return String(s).replace(/[^a-z0-9_-]/gi,"_");}
async function submitToWebhook(data){const url=APP_CONFIG.RESULTS_WEBHOOK_URL;if(!url)return;try{await fetch(url,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(data)});}catch(err){console.warn("No fue posible enviar el resultado al webhook.",err);}}
function resetAssessment(){window.location.reload();}
renderQuestions();loadDraft();