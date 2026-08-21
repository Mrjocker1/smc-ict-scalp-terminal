window.Market = (()=> {
  const state={symbol:"NQ",candles:[],last:null,online:false,base:localStorage.getItem("apiBase")||""};
  let timer=null;
  async function fetchCandles(symbol){
    if(!state.base) throw new Error("No data endpoint configured");
    const url=state.base.replace(/\/$/,"")+"/api/candles?symbol="+encodeURIComponent(symbol)+"&interval=1m&limit=300";
    const r=await fetch(url,{cache:"no-store"}); if(!r.ok) throw new Error("HTTP "+r.status);
    const data=await r.json();
    if(!Array.isArray(data.candles)) throw new Error("Invalid provider response");
    return data.candles.map(x=>({time:Number(x.time),open:+x.open,high:+x.high,low:+x.low,close:+x.close,volume:x.volume==null?null:+x.volume})).filter(x=>Number.isFinite(x.time)&&[x.open,x.high,x.low,x.close].every(Number.isFinite));
  }
  async function refresh(){
    try{state.candles=await fetchCandles(state.symbol);state.last=state.candles.at(-1);state.online=true;document.dispatchEvent(new CustomEvent("market:update",{detail:state}));}
    catch(e){state.online=false;document.dispatchEvent(new CustomEvent("market:error",{detail:e}));}
  }
  function start(){clearInterval(timer);refresh();timer=setInterval(refresh,1000)}
  function setSymbol(s){state.symbol=s;state.candles=[];refresh()}
  function configure(base){state.base=base.replace(/\/$/,"");localStorage.setItem("apiBase",state.base);start()}
  return {state,start,setSymbol,configure,refresh};
})();