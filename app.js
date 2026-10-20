(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const expressionEl = $("expression"), resultEl = $("result"), hintEl = $("display-hint");
  const keypad = $("keypad"), modeLabel = $("mode-label"), historyList = $("history-list");
  let expression = "", answer = 0, angleUnit = "DEG", mode = "basic", history = [];
  const keySets = {
    basic: [
      [{label:"AC",action:"clear",type:"danger"},{label:"(",value:"(",type:"function"},{label:")",value:")",type:"function"},{label:"%",value:"%",type:"function"},{label:"÷",value:"/",type:"operator"}],
      [{label:"7",value:"7"},{label:"8",value:"8"},{label:"9",value:"9"},{label:"×",value:"*",type:"operator"},{label:"⌫",action:"back",type:"function"}],
      [{label:"4",value:"4"},{label:"5",value:"5"},{label:"6",value:"6"},{label:"−",value:"-",type:"operator"},{label:"Ans",value:"Ans",type:"function"}],
      [{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"+",value:"+",type:"operator"},{label:"=",action:"calculate",type:"equals"}],
      [{label:"±",action:"sign",type:"function"},{label:"0",value:"0"},{label:".",value:"."},{label:"π",value:"pi",type:"function"},{label:"e",value:"e",type:"function"}]
    ],
    sci: [
      [{label:"AC",action:"clear",type:"danger"},{label:"(",value:"(",type:"function"},{label:")",value:")",type:"function"},{label:"x²",value:"^2",type:"function"},{label:"xʸ",value:"^",type:"operator"}],
      [{label:"sin",value:"sin(",type:"function"},{label:"cos",value:"cos(",type:"function"},{label:"tan",value:"tan(",type:"function"},{label:"√",value:"sqrt(",type:"function"},{label:"÷",value:"/",type:"operator"}],
      [{label:"ln",value:"ln(",type:"function"},{label:"log",value:"log(",type:"function"},{label:"10ˣ",value:"10^(",type:"function"},{label:"eˣ",value:"exp(",type:"function"},{label:"×",value:"*",type:"operator"}],
      [{label:"7",value:"7"},{label:"8",value:"8"},{label:"9",value:"9"},{label:"!",value:"!",type:"function"},{label:"−",value:"-",type:"operator"}],
      [{label:"4",value:"4"},{label:"5",value:"5"},{label:"6",value:"6"},{label:"Ans",value:"Ans",type:"function"},{label:"+",value:"+",type:"operator"}],
      [{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"⌫",action:"back",type:"function"},{label:"=",action:"calculate",type:"equals"}],
      [{label:"±",action:"sign",type:"function"},{label:"0",value:"0"},{label:".",value:"."},{label:"π",value:"pi",type:"function"},{label:"e",value:"e",type:"function"}]
    ],
    symbols: [
      [{label:"AC",action:"clear",type:"danger"},{label:"⌫",action:"back",type:"function"},{label:"(",value:"(",type:"function"},{label:")",value:")",type:"function"},{label:"=",action:"calculate",type:"equals"}],
      [{label:"π",value:"pi",type:"function"},{label:"τ",value:"tau",type:"function"},{label:"φ",value:"phi",type:"function"},{label:"∞",value:"Infinity",type:"function"},{label:"Ans",value:"Ans",type:"function"}],
      [{label:"≤",value:"<=",type:"function"},{label:"≥",value:">=",type:"function"},{label:"≠",value:"!=",type:"function"},{label:"≈",action:"approx",type:"function"},{label:"%",value:"%",type:"function"}],
      [{label:"sin",value:"sin(",type:"function"},{label:"cos",value:"cos(",type:"function"},{label:"tan",value:"tan(",type:"function"},{label:"√",value:"sqrt(",type:"function"},{label:"^",value:"^",type:"operator"}],
      [{label:"7",value:"7"},{label:"8",value:"8"},{label:"9",value:"9"},{label:"÷",value:"/",type:"operator"},{label:"×",value:"*",type:"operator"}],
      [{label:"4",value:"4"},{label:"5",value:"5"},{label:"6",value:"6"},{label:"−",value:"-",type:"operator"},{label:"+",value:"+",type:"operator"}],
      [{label:"1",value:"1"},{label:"2",value:"2"},{label:"3",value:"3"},{label:"0",value:"0"},{label:".",value:"."}]
    ]
  };
  function renderKeys() {
    keypad.replaceChildren();
    keySets[mode].flat().forEach(key => {
      const button = document.createElement("button");
      button.type = "button"; button.className = "key" + (key.type ? " " + key.type : "");
      button.textContent = key.label; button.setAttribute("aria-label", key.label);
      button.addEventListener("click", () => handleKey(key)); keypad.append(button);
    });
    modeLabel.textContent = mode.toUpperCase() + " MODE";
  }
  function updateDisplay() {
    expressionEl.textContent = expression || "0";
    hintEl.classList.remove("error");
    if (!expression) { resultEl.textContent = "0"; hintEl.textContent = "Enter an expression to begin"; return; }
    try {
      const result = calculateExpression(expression);
      resultEl.textContent = formatNumber(result);
      hintEl.textContent = "Preview · press = to evaluate";
    } catch (_) {
      resultEl.textContent = "—";
      hintEl.textContent = "Expression in progress";
    }
  }
  function formatNumber(n) {
    if (typeof n !== "number" || Number.isNaN(n)) throw new Error("Invalid result");
    if (!Number.isFinite(n)) return n > 0 ? "∞" : n < 0 ? "−∞" : "Undefined";
    if (Math.abs(n) < 1e-12) n = 0;
    return Number(n.toPrecision(12)).toString();
  }
  function tokenize(input) {
    const s = input.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-").replace(/π/g,"pi").replace(/τ/g,"tau").replace(/φ/g,"phi").replace(/√/g,"sqrt");
    const tokens = []; let i = 0;
    while (i < s.length) {
      if (/\s/.test(s[i])) { i++; continue; }
      const rest = s.slice(i);
      const num = rest.match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
      if (num) { tokens.push({type:"number",value:Number(num[0])}); i += num[0].length; continue; }
      const word = rest.match(/^[a-zA-Z]+/);
      if (word) { tokens.push({type:"name",value:word[0].toLowerCase()}); i += word[0].length; continue; }
      if ("+-*/^()%!".includes(s[i])) { tokens.push({type:"op",value:s[i]}); i++; continue; }
      throw new Error("Unsupported character");
    }
    // Insert implicit multiplication: 2pi, 2(3+4), (2)(3), and 2sin(30).
    const out = [];
    for (let j=0;j<tokens.length;j++) {
      const prev = out[out.length-1], cur = tokens[j];
      const prevEnds = prev && (prev.type==="number" || prev.type==="name" && ["pi","e","tau","phi","ans","infinity"].includes(prev.value) || prev.value===")" || prev.value==="!");
      const curStarts = cur.type==="number" || cur.type==="name" || cur.value==="(";
      if (prevEnds && curStarts) out.push({type:"op",value:"*"});
      out.push(cur);
    }
    return out;
  }
  function calculateExpression(input) {
    const tokens = tokenize(input); let pos = 0;
    if (!tokens.length) return 0;
    const constants = {pi:Math.PI,e:Math.E,tau:Math.PI*2,phi:(1+Math.sqrt(5))/2,ans:answer,infinity:Infinity};
    const toRad = x => angleUnit==="DEG" ? x*Math.PI/180 : x;
    const funcs = {
      sin:x=>Math.sin(toRad(x)), cos:x=>Math.cos(toRad(x)), tan:x=>{const c=Math.cos(toRad(x));if(Math.abs(c)<1e-14)throw new Error("Undefined tangent");return Math.tan(toRad(x));},
      asin:x=>angleUnit==="DEG"?Math.asin(x)*180/Math.PI:Math.asin(x), acos:x=>angleUnit==="DEG"?Math.acos(x)*180/Math.PI:Math.acos(x), atan:x=>angleUnit==="DEG"?Math.atan(x)*180/Math.PI:Math.atan(x),
      sqrt:x=>{if(x<0)throw new Error("Square root of a negative number is not real");return Math.sqrt(x);},
      ln:x=>{if(x<=0)throw new Error("ln requires a positive number");return Math.log(x);},
      log:x=>{if(x<=0)throw new Error("log requires a positive number");return Math.log10(x);},
      exp:x=>Math.exp(x), abs:x=>Math.abs(x), floor:x=>Math.floor(x), ceil:x=>Math.ceil(x), round:x=>Math.round(x), sinh:x=>Math.sinh(x), cosh:x=>Math.cosh(x), tanh:x=>Math.tanh(x)
    };
    function primary() {
      const t=tokens[pos++];
      if (!t) throw new Error("Incomplete expression");
      if (t.value==="+") return expressionAt(25);
      if (t.value==="-") return -expressionAt(25);
      if (t.value==="(") { const v=expressionAt(0); if (!tokens[pos] || tokens[pos++].value!==")") throw new Error("Missing closing parenthesis"); return postfix(v); }
      if (t.type==="number") return postfix(t.value);
      if (t.type==="name") {
        if (Object.prototype.hasOwnProperty.call(constants,t.value)) return postfix(constants[t.value]);
        if (Object.prototype.hasOwnProperty.call(funcs,t.value)) {
          let arg;
          if (tokens[pos] && tokens[pos].value==="(") { pos++; arg=expressionAt(0); if (!tokens[pos] || tokens[pos++].value!==")") throw new Error("Missing closing parenthesis"); }
          else arg=primary();
          const val=funcs[t.value](arg); if (Number.isNaN(val)) throw new Error("Invalid function input"); return postfix(val);
        }
        throw new Error("Unknown function or constant: "+t.value);
      }
      throw new Error("Expected a number");
    }
    function postfix(v) {
      while(tokens[pos] && (tokens[pos].value==="!" || tokens[pos].value==="%")) {
        const op=tokens[pos++].value;
        if(op==="!") { if(v<0 || !Number.isInteger(v) || v>170) throw new Error("Factorial requires an integer from 0 to 170"); let f=1;for(let k=2;k<=v;k++)f*=k;v=f; }
        else v/=100;
      }
      return v;
    }
    const precedence={"+":10,"-":10,"*":20,"/":20,"%":20,"^":30};
    function expressionAt(minPrec) {
      let left=primary();
      while(pos<tokens.length) {
        const op=tokens[pos].value, prec=precedence[op];
        if(prec===undefined || prec<minPrec) break;
        pos++; const right=expressionAt(prec+(op==="^"?0:1));
        if(op==="+")left+=right;else if(op==="-")left-=right;else if(op==="*")left*=right;else if(op==="/"){if(right===0)throw new Error("Division by zero");left/=right;}else if(op==="%"){if(right===0)throw new Error("Division by zero");left%=right;}else if(op==="^")left=Math.pow(left,right);
      }
      return left;
    }
    const value=expressionAt(0);
    if(pos!==tokens.length) throw new Error("Unexpected token");
    if(Number.isNaN(value)) throw new Error("Result is not a real number");
    if(!Number.isFinite(value)) throw new Error("Result is outside the supported range");
    return value;
  }
  function handleKey(key) {
    if(key.action==="clear"){expression="";updateDisplay();return;}
    if(key.action==="back"){expression=expression.slice(0,-1);updateDisplay();return;}
    if(key.action==="calculate"){evaluate();return;}
    if(key.action==="sign"){expression=expression ? "-("+expression+")" : "-";updateDisplay();return;}
    if(key.action==="approx"){try{hintEl.textContent="≈ "+formatNumber(calculateExpression(expression));}catch(_){hintEl.textContent="Enter a complete expression first";}return;}
    if(key.value!==undefined){expression+=key.value;updateDisplay();}
  }
  function evaluate() {
    if(!expression.trim())return;
    const source=expression;
    try {
      const value=calculateExpression(source); answer=value;
      const result=formatNumber(value);
      history.unshift({expression:source,result}); history=history.slice(0,8);
      renderHistory(); expression=result; resultEl.textContent=result; expressionEl.textContent=source;
      hintEl.classList.remove("error");hintEl.textContent="Calculated locally · result stored as Ans";
      $("history-count").textContent="1 SESSION"; 
    } catch(err) {hintEl.classList.add("error");hintEl.textContent=err.message||"Unable to calculate this expression";resultEl.textContent="Error";}
  }
  function renderHistory() {
    historyList.replaceChildren();
    if(!history.length){const p=document.createElement("p");p.className="empty-history";p.textContent="Your calculations will appear here.";historyList.append(p);return;}
    history.forEach(item=>{const b=document.createElement("button");b.className="history-item";b.type="button";const e=document.createElement("span");e.className="history-expression";e.textContent=item.expression;const r=document.createElement("span");r.className="history-result";r.textContent=item.result;b.append(e,r);b.addEventListener("click",()=>{expression=item.expression;updateDisplay();});historyList.append(b);});
  }
  document.querySelectorAll(".mode-tab").forEach(tab=>tab.addEventListener("click",()=>{
    mode=tab.dataset.mode;document.querySelectorAll(".mode-tab").forEach(t=>{const active=t===tab;t.classList.toggle("active",active);t.setAttribute("aria-selected",String(active));});renderKeys();
  }));
  $("angle-toggle").addEventListener("click",()=>{angleUnit=angleUnit==="DEG"?"RAD":"DEG";$("angle-toggle").textContent=angleUnit;updateDisplay();});
  $("clear-history").addEventListener("click",()=>{history=[];renderHistory();$("history-count").textContent="READY";});
  document.addEventListener("keydown",e=>{
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.key==="Enter"||e.key==="="){e.preventDefault();evaluate();return;}
    if(e.key==="Escape"){expression="";updateDisplay();return;}
    if(e.key==="Backspace"){expression=expression.slice(0,-1);updateDisplay();return;}
    if(/^[0-9.+\-*/^()%!]$/.test(e.key)){expression+=e.key;updateDisplay();return;}
    if(e.key==="("||e.key===")"){expression+=e.key;updateDisplay();}
  });
  if("serviceWorker" in navigator && location.protocol!=="file:") {
    window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").then(()=>{$("connection-label").textContent="OFFLINE READY";}).catch(()=>{$("connection-label").textContent="LOCAL ENGINE";}));
  }
  renderKeys();updateDisplay();
})();