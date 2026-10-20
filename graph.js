(() => {
"use strict";
const $=id=>document.getElementById(id), canvas=$("plot-canvas"),ctx=canvas.getContext("2d");
const n=id=>{const v=Number($(id).value);if(!Number.isFinite(v))throw new Error("Enter finite numeric values.");return v;};
const f=x=>n("ga")*x*x*x+n("gb")*x*x+n("gc")*x+n("gd");
function plot(){try{const xmin=n("gxmin"),xmax=n("gxmax"),ymin=n("gymin"),ymax=n("gymax");if(!(xmax>xmin&&ymax>ymin))throw new Error("Maximum bounds must be greater than minimum bounds.");const W=canvas.width,H=canvas.height,pad=48;ctx.clearRect(0,0,W,H);ctx.fillStyle="#0a0e10";ctx.fillRect(0,0,W,H);const X=x=>(x-xmin)/(xmax-xmin)*(W-2*pad)+pad,Y=y=>(ymax-y)/(ymax-ymin)*(H-2*pad)+pad;
ctx.lineWidth=1;ctx.strokeStyle="#1d2924";ctx.fillStyle="#829087";ctx.font="12px monospace";
const xStep=niceStep((xmax-xmin)/10),yStep=niceStep((ymax-ymin)/10);
for(let x=Math.ceil(xmin/xStep)*xStep;x<=xmax;x+=xStep){const px=X(x);ctx.beginPath();ctx.moveTo(px,pad);ctx.lineTo(px,H-pad);ctx.stroke();ctx.textAlign="center";ctx.fillText(fmt(x),px,H-pad+19);}
for(let y=Math.ceil(ymin/yStep)*yStep;y<=ymax;y+=yStep){const py=Y(y);ctx.beginPath();ctx.moveTo(pad,py);ctx.lineTo(W-pad,py);ctx.stroke();ctx.textAlign="right";ctx.fillText(fmt(y),pad-8,py+4);}
ctx.strokeStyle="#68776e";ctx.lineWidth=1.5;if(xmin<=0&&xmax>=0){ctx.beginPath();ctx.moveTo(X(0),pad);ctx.lineTo(X(0),H-pad);ctx.stroke();}if(ymin<=0&&ymax>=0){ctx.beginPath();ctx.moveTo(pad,Y(0));ctx.lineTo(W-pad,Y(0));ctx.stroke();}
ctx.strokeStyle="#63f59a";ctx.lineWidth=3;ctx.beginPath();let drawing=false;for(let i=0;i<=1200;i++){const x=xmin+(xmax-xmin)*i/1200,y=f(x),px=X(x),py=Y(y);if(!Number.isFinite(y)||py< -H*4||py>H*5){drawing=false;continue;}if(!drawing){ctx.moveTo(px,py);drawing=true;}else ctx.lineTo(px,py);}ctx.stroke();
const a=n("ga"),b=n("gb"),c=n("gc"),d=n("gd");let desc="f(x) = "+polyText(a,b,c,d);$("graph-result").textContent=desc+" · x ∈ ["+fmt(xmin)+", "+fmt(xmax)+"]";}catch(e){$("graph-result").textContent=e.message;}}
function niceStep(raw){const p=Math.pow(10,Math.floor(Math.log10(raw||1))),m=raw/p;return (m<=1?1:m<=2?2:m<=5?5:10)*p;}
function fmt(x){return Number(x.toPrecision(5)).toString();}
function polyText(a,b,c,d){const parts=[];[[a,"x³"],[b,"x²"],[c,"x"],[d,""]].forEach(([v,s])=>{if(v===0)return;const sign=v<0?" − ":" + ";const mag=Math.abs(v);parts.push((parts.length?(v<0?" − ":" + "):(v<0?"−":""))+(s&&mag===1?"":fmt(mag))+s);});return parts.join("")||"0";}
$("plot").addEventListener("click",plot);$("reset").addEventListener("click",()=>{[["gxmin","-5"],["gxmax","5"],["gymin","-2"],["gymax","10"]].forEach(([id,v])=>$(id).value=v);plot();});
["ga","gb","gc","gd","gxmin","gxmax","gymin","gymax"].forEach(id=>$(id).addEventListener("change",plot));plot();
})();