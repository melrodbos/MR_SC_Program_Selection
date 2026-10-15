const dialog=document.getElementById('lightbox');
const big=document.getElementById('large-image');
const canvas=document.querySelector('.lightbox-canvas');
const level=document.getElementById('zoom-level');
let zoom=1,fitZoom=1;
function applyZoom(){
  if(!big.naturalWidth)return;
  big.style.width=Math.round(big.naturalWidth*zoom)+'px';
  big.style.height=Math.round(big.naturalHeight*zoom)+'px';
  big.style.maxWidth='none';big.style.maxHeight='none';
  canvas.classList.toggle('is-zoomed',zoom>fitZoom*1.05);
  level.textContent=zoom<=fitZoom*1.01?'Fit':Math.round(zoom*100)+'%';
}
function fit(){
  if(!big.naturalWidth)return;
  fitZoom=Math.min((canvas.clientWidth-36)/big.naturalWidth,(canvas.clientHeight-36)/big.naturalHeight,1);
  zoom=fitZoom;applyZoom();canvas.scrollTo(0,0);
}
function changeZoom(factor){
  if(!big.naturalWidth)return;
  const centerX=canvas.scrollLeft+canvas.clientWidth/2,centerY=canvas.scrollTop+canvas.clientHeight/2;
  const previous=zoom;
  zoom=Math.min(5,Math.max(fitZoom,zoom*factor));applyZoom();
  canvas.scrollLeft=centerX*(zoom/previous)-canvas.clientWidth/2;
  canvas.scrollTop=centerY*(zoom/previous)-canvas.clientHeight/2;
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
  document.querySelectorAll('.project').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter);
}));
document.querySelectorAll('.asset').forEach(button=>button.addEventListener('click',()=>{
  big.onload=()=>fit();big.src=button.dataset.full;big.alt=button.dataset.name;
  document.getElementById('large-title').textContent=button.dataset.name;
  document.getElementById('open-original').href=button.dataset.full;
  dialog.showModal();if(big.complete&&big.naturalWidth)fit();
}));
document.getElementById('zoom-in').addEventListener('click',()=>changeZoom(1.7));
document.getElementById('zoom-out').addEventListener('click',()=>changeZoom(1/1.7));
document.getElementById('zoom-fit').addEventListener('click',fit);
big.addEventListener('click',()=>changeZoom(zoom<=fitZoom*1.01?2:1.5));
document.getElementById('close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
document.getElementById('year').textContent=new Date().getFullYear();
