window.StructureEngine={
 analyze(c){
   if(c.length<30)return {bias:"WAIT",bos:null,mss:null,hhhl:0,lhll:0};
   const highs=[],lows=[]; const w=2;
   for(let i=w;i<c.length-w;i++){let h=true,l=true;for(let j=1;j<=w;j++){h&&=c[i].high>c[i-j].high&&c[i].high>=c[i+j].high;l&&=c[i].low<c[i-j].low&&c[i].low<=c[i+j].low}if(h)highs.push(c[i]);if(l)lows.push(c[i])}
   const sh=highs.slice(-4),sl=lows.slice(-4);let hhhl=0,lhll=0;
   if(sh.length>=2) hhhl=sh.at(-1).high>sh.at(-2).high?1:-1;
   if(sl.length>=2) hhhl+=sl.at(-1).low>sl.at(-2).low?1:-1;
   if(sh.length>=2) lhll=sh.at(-1).high<sh.at(-2).high?1:0;
   if(sl.length>=2) lhll+=sl.at(-1).low<sl.at(-2).low?1:0;
   const last=c.at(-1), priorHigh=Math.max(...sh.map(x=>x.high)),priorLow=Math.min(...sl.map(x=>x.low));
   const bos=last.close>priorHigh?"BULLISH":last.close<priorLow?"BEARISH":null;
   const bias=(hhhl>=1)?"BULLISH":(lhll>=1?"BEARISH":"WAIT");
   return {bias,bos,mss:bos,hhhl,lhll,highs:sh,lows:sl};
 }
};