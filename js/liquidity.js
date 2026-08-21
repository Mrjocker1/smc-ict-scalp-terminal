window.LiquidityEngine={
 analyze(c){
   if(c.length<10)return {};
   const prev=c.slice(0,-1),last=c.at(-1);
   const highs=prev.map(x=>x.high),lows=prev.map(x=>x.low);
   const bsl=Math.max(...highs.slice(-30)),ssl=Math.min(...lows.slice(-30));
   const sweep=last.high>bsl&&last.close<bsl?"BSL SWEEP":last.low<ssl&&last.close>ssl?"SSL SWEEP":"NONE";
   return {bsl,ssl,sweep};
 }
};