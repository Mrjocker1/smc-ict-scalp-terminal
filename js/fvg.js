window.FVGEngine={
 analyze(c){
   if(c.length<5)return null;
   const out=[];
   for(let i=2;i<c.length;i++){
     const a=c[i-2],b=c[i-1],d=c[i];
     if(a.high<d.low)out.push({type:"BULLISH",low:a.high,high:d.low,time:d.time});
     if(a.low>d.high)out.push({type:"BEARISH",low:d.high,high:a.low,time:d.time});
   }
   return out.at(-1)||null;
 }
};