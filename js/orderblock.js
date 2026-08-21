window.OBEngine={
 analyze(c){
   if(c.length<8)return null;
   for(let i=c.length-2;i>=3;i--){
     const x=c[i],next=c[i+1],range=x.high-x.low;
     if(range<=0)continue;
     const impulse=Math.abs(next.close-next.open);
     if(impulse>=range*1.25){
       if(x.close<x.open&&next.close>x.high)return {type:"BULLISH",low:x.low,high:x.high,time:x.time};
       if(x.close>x.open&&next.close<x.low)return {type:"BEARISH",low:x.low,high:x.high,time:x.time};
     }
   }
   return null;
 }
};