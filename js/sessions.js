window.SessionEngine={
 session(ts){
   const d=new Date(ts*1000),h=d.getUTCHours()+d.getUTCMinutes()/60;
   if(h>=0&&h<7)return "ASIA";
   if(h>=7&&h<13.5)return "LONDON";
   if(h>=13.5&&h<20)return "NEW YORK";
   return "OFF";
 },
 levels(c){
   const today=new Date().toISOString().slice(0,10), buckets={ASIA:[],LONDON:[], "NEW YORK":[]};
   c.forEach(x=>{const s=this.session(x.time);if(buckets[s])buckets[s].push(x)});
   const pack=a=>a.length?{high:Math.max(...a.map(x=>x.high)),low:Math.min(...a.map(x=>x.low))}:null;
   return {asia:pack(buckets.ASIA),london:pack(buckets.LONDON),ny:pack(buckets["NEW YORK"]),session:this.session(c.at(-1)?.time||Date.now()/1000)};
 }
};