(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();function x(){const o=performance.now();let t=o;return{get total(){return performance.now()-o},get interval(){return performance.now()-t},delta(){const e=performance.now(),i=e-t;return t=e,i}}}const g={VIEWPORT_WIDTH:1280,VIEWPORT_HEIGHT:720,VSYNC:!1,FPS:60,HIDE_CURSOR:!1};class m{options;canvas;ctx;fps;run;drawFrame;constructor(t,e={}){const i={...g,...e};this.options=i,this.canvas=t;const s=t.getContext("2d");if(s===null)throw new Error("Cannot get 2D context from canvas.");this.ctx=s,this.fps=i.FPS,this.run=!0,this.setup()}setup(){this.canvas.width=this.options.VIEWPORT_WIDTH,this.canvas.height=this.options.VIEWPORT_HEIGHT,this.options.HIDE_CURSOR&&(this.canvas.style.cursor="none"),window.ENGINE=this}resize(t,e){this.canvas.width=t,this.canvas.height=e,this.ctx.imageSmoothingEnabled=!1}render(t){const e=x();let i=0,s=0;this.drawFrame=()=>{this.ctx.imageSmoothingEnabled=!1,this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),t({fps:0,currentFrame:0})},this.ctx.imageSmoothingEnabled=!1;const n=()=>{this.run&&(this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),t({fps:i.toFixed(2),currentFrame:s})),s++,e.interval>1e3&&(i=s/e.delta()*1e3,s=0),this.options.VSYNC?requestAnimationFrame(n):setTimeout(n,1e3/this.options.FPS)};return n()}}function w(o){for(const[t,e]of o)if(t)return e}class u{engine;position;size;color;constructor(t){this.engine=t,this.size={width:0,height:0},this.position={x:0,y:0},this.color="transparent",console.log("Entity initialized.")}setSize(t,e){return this.size={width:t,height:e??t},this}setPosition(t){return typeof t=="function"&&(t=t(this.position)),this.position={x:Math.floor(t.x),y:Math.floor(t.y)},this}setColor(t){return this.color=t,this}getProjections(t){const{x:e,y:i}=t||this.position,{width:s,height:n}=this.size;return{x1:e,x2:e+s,y1:i,y2:i+n}}draw(){const t=this.engine.ctx;t.fillStyle=this.color,t.fillRect(this.position.x,this.position.y,this.size.width,this.size.height)}willCollide(t,e){const i=this.getProjections(t),s=e.getProjections();return i.x1<s.x2&&i.x2>s.x1&&i.y2>s.y1&&i.y1<s.y2}isColliding(t){return this.willCollide(this.position,t)}relativePosition(t){const e=this.getProjections(),i=t.getProjections();return w([[e.y1>=i.y2,"TOP"],[e.x2<=i.x1,"RIGHT"],[e.y2<=i.y1,"BOTTOM"],[e.x1>=i.x2,"LEFT"]])||!1}isInBound(t){return t.x>=this.position.x&&t.x<this.position.x+this.size.width&&t.y>=this.position.y&&t.y<this.position.y+this.size.height}}class y extends u{fps;currentFrame;constructor(t){super(t)}update(t,e){this.fps=t,this.currentFrame=e}draw(){const t=this.engine.ctx,{x:e,y:i}=this.position;t.fillStyle="black",t.fillRect(e,i,135,24),t.fillRect(e,i+25,122,24),t.fillStyle="yellow",t.font="24px Consolas, monospace, sans-serif",t.textAlign="left",t.textBaseline="top",t.fillText(`FPS: ${this.fps}`,e,i),t.fillText(`Frame: ${this.currentFrame}`,e,i+25)}}function r(o,t){return o=Math.ceil(o),t=Math.floor(t),Math.floor(Math.random()*(t-o+1))+o}class v extends u{name;speed_v;speed_h;colliders;constructor(t){super(t);const e=r(1,5);this.speed_v=e,this.speed_h=e,this.size={width:r(50,200),height:r(50,200)},this.position={x:r(10,window.innerWidth-this.size.width-10),y:r(10,window.innerHeight-this.size.height-10)},this.name="box",this.colliders=[],this.setColor("lime")}setName(t){return this.name=t,this}setColliders(t){return this.colliders=t,this}getNextPosition(){return{x:this.position.x+this.speed_v,y:this.position.y+this.speed_h}}draw(){const t=this.getProjections();(t.x1<=0||t.x2>=window.innerWidth)&&(this.speed_v*=-1),(t.y1<=0||t.y2>=window.innerHeight)&&(this.speed_h*=-1),this.setPosition(()=>{const e=this.getNextPosition();for(const i of this.colliders)if(this.willCollide(e,i))switch(this.relativePosition(i)){case"TOP":case"BOTTOM":this.speed_h*=-1,i.speed_h*=-1;break;case"RIGHT":case"LEFT":this.speed_v*=-1,i.speed_v*=-1;break}return this.getNextPosition()}),super.draw(),this.engine.ctx.fillStyle="black",this.engine.ctx.font="24px Consolas, monospace, sans-serif",this.engine.ctx.textAlign="left",this.engine.ctx.textBaseline="top",this.engine.ctx.fillText(this.name,this.position.x,this.position.y)}}function P(o){return new Promise(t=>{const e=new Image;e.onload=()=>{t(e)},e.onerror=()=>{throw new Error(`Image error: ${o}`)},e.src=o})}function E(o=window){const t={x:0,y:0,active:!1};return o.addEventListener("mousemove",e=>{if(e instanceof MouseEvent){const{clientX:i,clientY:s}=e;t.x=i,t.y=s,t.active=!0}}),o.addEventListener("mouseleave",()=>{t.active=!1}),t}const p=document.getElementById("mainframe"),l=E(p),c=new m(p,{VIEWPORT_WIDTH:window.innerWidth,VIEWPORT_HEIGHT:window.innerHeight,VSYNC:!0,HIDE_CURSOR:!0}),d=await P("./diamond_sword.png"),f=new y(c),h=[],T=5;for(let o=0;o<T;o++){const t=new v(c).setName(`${o}`);h.push(t)}for(const o of h)o.setColliders(h.filter(t=>t!==o));c.render(o=>{for(const i of h)i.draw();const{fps:t,currentFrame:e}=o;f.update(t,e),f.draw(),l.active&&c.ctx.drawImage(d,l.x,l.y,d.width*4,d.height*4)});
