window.ConfluenceEngine={
 score(x){
   const checks=[
    ["HTF bias",x.structure?.bias==="BULLISH"||x.structure?.bias==="BEARISH"],
    ["Liquidity",!!x.liquidity?.bsl&&!!x.liquidity?.ssl],
    ["Sweep",x.liquidity?.sweep!=="NONE"],
    ["Structure",!!x.structure?.bos],
    ["FVG",!!x.fvg],
    ["Order Block",!!x.ob],
    ["Displacement",x.displacement>=1],
    ["Volume",x.relvol==null?false:x.relvol>=1],
    ["Session",x.session==="NEW YORK"||x.session==="LONDON"]
   ];
   const score=checks.reduce((n,a)=>n+(a[1]?1:0),0)/checks.length*10;
   const bias=x.structure?.bias||"WAIT";
   const decision=score>=8&&bias!=="WAIT"?(bias==="BULLISH"?"LONG":"SHORT"):score>=6?"WAIT FOR CONFIRMATION":"NO TRADE";
   return {score,checks,decision};
 }
};