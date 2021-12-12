import{r as b,j as u,a,C as k,R as M,b as N}from"./vendor.eed9ec8a.js";const H=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const c of n.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function r(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerpolicy&&(n.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?n.credentials="include":e.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(e){if(e.ep)return;e.ep=!0;const n=r(e);fetch(e.href,n)}};H();function y(i){var t=i.toString(16);return t.length==1?"0"+t:t}function I({r:i,g:t,b:r}){return"#"+y(i)+y(t)+y(r)}function v(i){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(i);return t?{r:parseInt(t[1],16),g:parseInt(t[2],16),b:parseInt(t[3],16)}:null}function S({r:i,g:t,b:r}){let o,e,n,c,h,l,s,d,f,p,g,m;return o=i/255,e=t/255,n=r/255,f=Math.max(o,e,n),p=f-Math.min(o,e,n),g=x=>(f-x)/6/p+1/2,m=x=>Math.round(x*100)/100,p==0?s=d=0:(d=p/f,c=g(o),h=g(e),l=g(n),o===f?s=l-h:e===f?s=1/3+c-l:n===f&&(s=2/3+h-c),s<0?s+=1:s>1&&(s-=1)),{h:Math.round(s*360),s:m(d*100),v:m(f*100)}}function B({h:i,s:t,v:r}){var o,e,n,c,h,l,s,d;switch(c=Math.floor(i*6),h=i*6-c,l=r*(1-t),s=r*(1-h*t),d=r*(1-(1-h)*t),c%6){case 0:o=r,e=d,n=l;break;case 1:o=s,e=r,n=l;break;case 2:o=l,e=r,n=d;break;case 3:o=l,e=s,n=r;break;case 4:o=d,e=l,n=r;break;case 5:o=r,e=l,n=s;break}return{r:Math.round(o*255),g:Math.round(e*255),b:Math.round(n*255)}}const L=({colors:i=[]})=>{const t=[10,20,30,40,50,60,70,80,90],r=t.map(e=>a("line",{x1:e,y1:0,x2:e,y2:100,stroke:"#d2e9f7",strokeWidth:.5})),o=t.map(e=>a("line",{x1:0,y1:e,x2:100,y2:e,stroke:"#d2e9f7",strokeWidth:.5}));return u("svg",{className:"SaturationBrightnessPlot-svg",viewBox:"0 0 100 100",children:[u("g",{name:"grid lines",children:[r,o,a("text",{x:2,y:2,style:{fontSize:2},children:"Saturation"}),a("text",{x:95,y:2,style:{fontSize:2},children:"100"}),a("text",{x:6,y:2,transform:"rotate(-90, 10,10)",style:{fontSize:2},children:"Brightness"}),a("text",{x:0,y:99,style:{fontSize:2},children:"0"})]}),i.map(({s:e,v:n})=>a("circle",{cx:e,cy:100-n,r:1,fill:"red"},`s${e}v${n}}`))]})},P=()=>{const[i,t]=b.exports.useState("#f2e6e6"),r=i.match(/\#[a-f0-9]{6}/gi);return u("div",{children:[a("div",{children:u("label",{children:["Hex values:",a("textarea",{value:i,onChange:o=>t(o.currentTarget.value)})]})}),a(L,{colors:r==null?void 0:r.map(v).map(S)}),JSON.stringify(r==null?void 0:r.map(v).map(S))]})},O=()=>{const[i,t]=b.exports.useState(0),r=[[5,95],[15,97],[30,98],[50,96],[70,92],[90,82],[92,62],[87,42],[78,25],[65,12]];return u("div",{children:[u("label",{children:["Select hue (0-360):",a("input",{type:"number",onChange:o=>t(Number.parseInt(o.target.value))})]}),u("div",{children:[u("h3",{children:["Hue: ",i]}),Number.isNaN(i)?null:r.map(([o,e])=>a("div",{children:I(B({h:i/360,s:o/100,v:e/100}))}))]})]})};function R(){const[i,t]=b.exports.useState("#abcdef");return u("div",{className:"App",children:[a(P,{}),a(O,{}),u("label",{children:["HEX:",a("input",{type:"text",name:"hex",value:i,onChange:r=>t(r.currentTarget.value)})]}),a(k,{color:i,onChange:r=>t(r.hex)})]})}M.render(a(N.StrictMode,{children:a(R,{})}),document.getElementById("root"));
