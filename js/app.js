(()=> {
 const $=id=>document.getElementById(id); let chart,candleSeries;
 function initChart(){
   chart=LightweightCharts.createChart($("chart"),{layout:{background:{type:"solid",color:"#090d13"},textColor:"#718097"},grid:{vertLines:{color:"#111821"},horzLines:{color:"#111821"}},rightPriceScale:{borderColor:"#1b2530"},timeScale:{borderColor:"#1b2530",timeVisible:true,secondsVisible:false}});
   candleSeries=chart.addSeries(LightweightCharts.CandlestickSeries,{upColor:"#35d6a2",downColor:"#f05e70",borderVisible:false,wickUpColor:"#35d6a2",wickDownColor:"#f05e70"});
   new ResizeObserver(()=>chart.applyOptions({width:$("chart").clientWidth})).observe($("chart"));
 }
 function fmt(n){return Number.isFinite(n)?n.toFixed(2):"—"}
 function setText(id,v){$(id).textContent=v}
 function render(st){
   const c=st.candles;if(!c.length)return;
   candleSeries.setData(c.map(x=>({time:x.time,open:x.open,high:x.high,low:x.low,close:x.close})));
   chart.timeScale().fitContent();
   const last=c.at(-1),first=c[0],chg=last.close-first.open;
   setText("price",fmt(last.close));setText("change",(chg>=0?"+":"")+fmt(chg));
   const structure=StructureEngine.analyze(c),liq=LiquidityEngine.analyze(c),fvg=FVGEngine.analyze(c),ob=OBEngine.analyze(c),sess=SessionEngine.levels(c);
   const ranges=c.slice(-20).map(x=>x.high-x.low),atr=ranges.reduce((a,b)=>a+b,0)/Math.max(1,ranges.length),disp=(last.high-last.low)/Math.max(atr,1e-9);
   const vols=c.slice(-21).map(x=>x.volume).filter(Number.isFinite),relvol=vols.length>5?last.volume/(vols.slice(0,-1).reduce((a,b)=>a+b,0)/Math.max(1,vols.length-1)):null;
   const con=ConfluenceEngine.score({structure,liquidity:liq,fvg,ob,session:sess.session,displacement:disp,relvol});
   setText("bias",structure.bias);$("bias").className="bias "+(structure.bias==="BULLISH"?"bull":structure.bias==="BEARISH"?"bear":"neutral");
   setText("session",sess.session);setText("structureState",structure.bias);setText("hhhl",structure.hhhl>0?"HH/HL":"—");setText("lhll",structure.lhll>0?"LH/LL":"—");setText("bos",structure.bos||"—");setText("mss",structure.mss||"—");
   setText("bsl",fmt(liq.bsl));setText("ssl",fmt(liq.ssl));setText("sweep",liq.sweep);setText("sweepState",liq.sweep);
   setText("pdhpdl","Use prior-session adapter");setText("fvg",fvg?`${fvg.type} · ${fmt(fvg.low)} → ${fmt(fvg.high)}`:"No valid FVG");setText("fvgState",fvg?.type||"—");
   setText("ob",ob?`${ob.type} · ${fmt(ob.low)} → ${fmt(ob.high)}`:"No valid OB");setText("obState",ob?.type||"—");
   if(fvg)setText("pd",last.close<((fvg.low+fvg.high)/2)?"DISCOUNT":"PREMIUM");else setText("pd","—");
   setText("sessionName",sess.session);setText("asia",sess.asia?`${fmt(sess.asia.high)} / ${fmt(sess.asia.low)}`:"—");setText("london",sess.london?`${fmt(sess.london.high)} / ${fmt(sess.london.low)}`:"—");setText("ny",sess.ny?`${fmt(sess.ny.high)} / ${fmt(sess.ny.low)}`:"—");setText("nyopen",sess.ny?fmt(sess.ny.low+(sess.ny.high-sess.ny.low)/2):"—");
   setText("volume",last.volume==null?"UNAVAILABLE":String(last.volume));setText("relvol",relvol==null?"—":relvol.toFixed(2)+"x");setText("disp",disp.toFixed(2)+"x");setText("atr",fmt(atr));
   setText("score",con.score.toFixed(1)+"/10");$("scoreBar").firstElementChild.style.width=(con.score*10)+"%";
   $("checks").innerHTML=con.checks.map(x=>`<div class="check ${x[1]?"yes":"no"}">${x[1]?"✓":"×"} ${x[0]}</div>`).join("");
   setText("decision",con.decision);$("decision").className="decision "+(con.decision==="LONG"?"long":con.decision==="SHORT"?"short":"neutral");
   setText("lastUpdate",new Date().toLocaleTimeString());
 }
 function status(on){$("connection").textContent=on?"● LIVE DATA":"● DATA OFFLINE";$("connection").className="status "+(on?"online":"offline")}
 document.addEventListener("market:update",e=>{status(true);render(e.detail)});
 document.addEventListener("market:error",()=>status(false));
 document.querySelectorAll(".symbol").forEach(b=>b.onclick=()=>{document.querySelectorAll(".symbol").forEach(x=>x.classList.remove("active"));b.classList.add("active");Market.setSymbol(b.dataset.symbol);$("chartTitle").textContent=b.dataset.symbol+" · 1 MIN"});
 $("saveSettings").onclick=()=>{Market.configure($("apiBase").value.trim());alert("Connection saved. The dashboard will remain DATA OFFLINE until the endpoint returns valid candles.")};
 $("apiBase").value=Market.state.base; initChart(); Market.start();
})();