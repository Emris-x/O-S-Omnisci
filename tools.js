(() => {
"use strict";
const $=id=>document.getElementById(id);
const val=id=>{const n=Number($(id).value);if(!Number.isFinite(n))throw new Error("Enter valid finite numbers in every field.");return n;};
const fmt=n=>{if(!Number.isFinite(n))throw new Error("Result is outside the supported range.");return Number(n.toPrecision(11)).toString();};
function show(id,text,note=""){const el=$(id);el.replaceChildren();el.append(document.createTextNode(text));if(note){const s=document.createElement("small");s.textContent=note;el.append(s);}}
$("solve-quadratic").addEventListener("click",()=>{try{const a=val("qa"),b=val("qb"),c=val("qc");if(a===0){if(b===0)throw new Error(c===0?"Every x is a solution.":"No solution exists.");show("quadratic-result","x = "+fmt(-c/b),"This is a linear equation because a = 0.");return;}const d=b*b-4*a*c;if(d>=0){show("quadratic-result","x₁ = "+fmt((-b+Math.sqrt(d))/(2*a))+"\nx₂ = "+fmt((-b-Math.sqrt(d))/(2*a)),"Discriminant Δ = "+fmt(d));}else{show("quadratic-result","x₁ = "+fmt(-b/(2*a))+" + "+fmt(Math.sqrt(-d)/(2*a))+"i\nx₂ = "+fmt(-b/(2*a))+" − "+fmt(Math.sqrt(-d)/(2*a))+"i","Complex conjugate roots; Δ = "+fmt(d));}}catch(e){show("quadratic-result",e.message);}});
const physics={
force:{labels:["MASS m (kg)","ACCELERATION a (m/s²)","NOT USED"],fn:(a,b)=>[a*b,"N","F = ma"]},
kinetic:{labels:["MASS m (kg)","SPEED v (m/s)","NOT USED"],fn:(a,b)=>[.5*a*b*b,"J","E = ½mv²"]},
potential:{labels:["MASS m (kg)","HEIGHT h (m)","GRAVITY g (m/s²)"],fn:(a,b,c)=>[a*c*b,"J","E = mgh"]},
density:{labels:["MASS m (kg)","VOLUME V (m³)","NOT USED"],fn:(a,b)=>{if(b===0)throw new Error("Volume cannot be zero.");return[a/b,"kg/m³","ρ = m/V"]}},
ohm:{labels:["CURRENT I (A)","RESISTANCE R (Ω)","NOT USED"],fn:(a,b)=>[a*b,"V","V = IR"]},
power:{labels:["VOLTAGE V (V)","CURRENT I (A)","NOT USED"],fn:(a,b)=>[a*b,"W","P = VI"]},
momentum:{labels:["MASS m (kg)","VELOCITY v (m/s)","NOT USED"],fn:(a,b)=>[a*b,"kg·m/s","p = mv"]},
wave:{labels:["FREQUENCY f (Hz)","WAVELENGTH λ (m)","NOT USED"],fn:(a,b)=>[a*b,"m/s","v = fλ"]}
};
function updatePhysicsLabels(){const f=physics[$("physics-formula").value];["pv1-label","pv2-label","pv3-label"].forEach((id,i)=>$(id).textContent=f.labels[i]);$("pv3").disabled=!["potential"].includes($("physics-formula").value);if($("physics-formula").value==="potential"&&Number($("pv3").value)===0)$("pv3").value="9.81";}
$("physics-formula").addEventListener("change",updatePhysicsLabels);updatePhysicsLabels();
$("calculate-physics").addEventListener("click",()=>{try{const f=physics[$("physics-formula").value],a=val("pv1"),b=val("pv2"),c=val("pv3"),r=f.fn(a,b,c);show("physics-result",fmt(r[0])+" "+r[1],r[2]);}catch(e){show("physics-result",e.message);}});
const atomic={H:1.008,He:4.002602,Li:6.94,Be:9.012183,B:10.81,C:12.011,N:14.007,O:15.999,F:18.998403,Ne:20.1797,Na:22.989769,Mg:24.305,Al:26.981538,Si:28.085,P:30.973762,S:32.06,Cl:35.45,Ar:39.948,K:39.0983,Ca:40.078,Sc:44.955908,Ti:47.867,V:50.9415,Cr:51.9961,Mn:54.938044,Fe:55.845,Co:58.933194,Ni:58.6934,Cu:63.546,Zn:65.38,Br:79.904,Ag:107.8682,I:126.90447,Ba:137.327,Au:196.96657,Hg:200.592,Pb:207.2};
function molarMass(formula){const tokens=formula.match(/[A-Z][a-z]?|\d+(?:\.\d+)?|[()]/g)||[];if(tokens.join("")!==formula.replace(/\s/g,""))throw new Error("Unsupported formula syntax. Use element symbols, numbers and parentheses.");let i=0;function group(){let sum=0,seen=false;while(i<tokens.length&&tokens[i]!==")"){const t=tokens[i++];if(t==="("){const inner=group();if(tokens[i++]!==")")throw new Error("Missing closing parenthesis.");let mult=1;if(i<tokens.length&&/^\d+(?:\.\d+)?$/.test(tokens[i]))mult=Number(tokens[i++]);sum+=inner*mult;seen=true;}else if(/^[A-Z]/.test(t)){if(!(t in atomic))throw new Error("Unknown element: "+t);let count=1;if(i<tokens.length&&/^\d+(?:\.\d+)?$/.test(tokens[i]))count=Number(tokens[i++]);if(count<=0)throw new Error("Atom counts must be positive.");sum+=atomic[t]*count;seen=true;}else throw new Error("Unexpected formula token: "+t);}if(!seen)throw new Error("Empty chemical group.");return sum;}const m=group();if(i!==tokens.length)throw new Error("Unbalanced parentheses.");return m;}
$("calculate-molar").addEventListener("click",()=>{try{const f=$("chemical-formula").value.replace(/\s/g,"");if(!f)throw new Error("Enter a chemical formula.");show("molar-result",fmt(molarMass(f))+" g/mol","Approximate molar mass of "+f);}catch(e){show("molar-result",e.message);}});
const units={
length:{m:1,km:1000,cm:.01,mm:.001,µm:1e-6,mi:1609.344,yd:.9144,ft:.3048,in:.0254},
mass:{kg:1,g:.001,mg:1e-6,tonne:1000,lb:.45359237,oz:.028349523125},
time:{s:1,ms:.001,min:60,h:3600,day:86400},
speed:{"m/s":1,"km/h":1/3.6,mph:.44704,"ft/s":.3048},
energy:{J:1,kJ:1000,cal:4.184,kcal:4184,Wh:3600,kWh:3600000,eV:1.602176634e-19},
pressure:{Pa:1,kPa:1000,bar:100000,atm:101325,psi:6894.757293},
temperature:{C:"C",F:"F",K:"K"}
};
function populateUnits(){const cat=$("unit-category").value,keys=Object.keys(units[cat]);for(const id of ["unit-from","unit-to"]){const select=$(id),old=select.value;select.replaceChildren();keys.forEach(k=>{const o=document.createElement("option");o.value=k;o.textContent=k;select.append(o);});select.value=keys.includes(old)?old:(id==="unit-from"?keys[0]:keys[Math.min(1,keys.length-1)]);}convert();}
function convert(){try{const category=$("unit-category").value,from=$("unit-from").value,to=$("unit-to").value,n=val("unit-value");let result;if(category==="temperature"){const c=from==="C"?n:from==="F"?(n-32)*5/9:n-273.15;result=to==="C"?c:to==="F"?c*9/5+32:c+273.15;}else result=n*units[category][from]/units[category][to];show("unit-result",fmt(n)+" "+from+" = "+fmt(result)+" "+to);}catch(e){show("unit-result",e.message);}}
$("unit-category").addEventListener("change",populateUnits);$("unit-value").addEventListener("input",convert);$("unit-from").addEventListener("change",convert);$("unit-to").addEventListener("change",convert);$("convert-unit").addEventListener("click",convert);populateUnits();
function poly(x){return val("ca")*x*x*x+val("cb")*x*x+val("cc")*x+val("cd");}
$("derive").addEventListener("click",()=>{try{const x=val("calculus-a"),h=Math.max(1e-5,Math.abs(x)*1e-5),d=(poly(x+h)-poly(x-h))/(2*h);show("calculus-result","f′("+fmt(x)+") ≈ "+fmt(d),"Central finite difference with h = "+fmt(h));}catch(e){show("calculus-result",e.message);}});
$("integrate").addEventListener("click",()=>{try{let a=val("calculus-a"),b=val("calculus-b");if(a===b){show("calculus-result","Integral = 0");return;}const sign=b<a?-1:1;if(b<a)[a,b]=[b,a];const n=1000,h=(b-a)/n;let sum=poly(a)+poly(b);for(let i=1;i<n;i++)sum+=(i%2?4:2)*poly(a+i*h);show("calculus-result","∫ f(x) dx ≈ "+fmt(sign*sum*h/3),"Simpson's rule on ["+fmt(sign===1?a:b)+", "+fmt(sign===1?b:a)+"] using 1,000 subintervals.");}catch(e){show("calculus-result",e.message);}});
})();