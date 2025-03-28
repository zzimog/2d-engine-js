(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();function T(){const s=performance.now();let t=s;return{get total(){return performance.now()-s},get interval(){return performance.now()-t},delta(){const e=performance.now(),i=e-t;return t=e,i}}}const O={VIEWPORT_WIDTH:1280,VIEWPORT_HEIGHT:720,VSYNC:!1,FPS:60,HIDE_CURSOR:!1,IMAGE_SMOOTHING:!1};function _(s){const t=s.getContext("2d");if(t===null)throw new Error("Cannot get 2D context from canvas.");return t}class P{options;canvas;ctx;run;fps;currentFrame;drawFrame;constructor(t,e={}){this.options={...O,...e},this.canvas=t,this.ctx=_(this.canvas),this.run=!0,this.fps=0,this.currentFrame=-1,this.setup()}setup(){this.canvas.width=this.options.VIEWPORT_WIDTH,this.canvas.height=this.options.VIEWPORT_HEIGHT,this.options.HIDE_CURSOR&&(this.canvas.style.cursor="none"),window.ENGINE=this}resize(t,e){this.canvas.width=t,this.canvas.height=e}render(t){const e=T();this.fps=0,this.currentFrame=0,this.drawFrame=()=>{this.ctx.imageSmoothingEnabled=this.options.IMAGE_SMOOTHING,this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),t({fps:this.fps.toFixed(2),currentFrame:this.currentFrame}),this.currentFrame++};const i=()=>{this.drawFrame&&this.run&&this.drawFrame(),e.interval>1e3&&(this.fps=this.currentFrame/e.delta()*1e3,this.currentFrame=0),this.options.VSYNC?requestAnimationFrame(i):setTimeout(i,1e3/this.options.FPS)};return i()}}function y(s){for(const[t,e]of s)if(t)return typeof e=="function"?e():e}const o=Object.freeze({UP:"up",TOP:"top",RIGHT:"right",BOTTOM:"bottom",DOWN:"down",LEFT:"left"});function I(s){return y([[s==o.TOP,o.BOTTOM],[s==o.UP,o.DOWN],[s==o.BOTTOM,o.TOP],[s==o.DOWN,o.UP],[s==o.RIGHT,o.LEFT],[s==o.LEFT,o.RIGHT]])}class g{engine;position;size;color;constructor(t){this.engine=t,this.size={width:0,height:0},this.position={x:0,y:0},this.color="transparent",console.log("Entity initialized.")}setSize(t,e){return this.size={width:t,height:e??t},this}setPosition(t){return typeof t=="function"&&(t=t(this.position)),this.position={x:Math.floor(t.x),y:Math.floor(t.y)},this}setColor(t){return this.color=t,this}getProjections(t){const{x:e,y:i}=t||this.position,{width:n,height:r}=this.size;return{x1:e,x2:e+n,y1:i,y2:i+r}}draw(){const t=this.engine.ctx;t.fillStyle=this.color,t.fillRect(this.position.x,this.position.y,this.size.width,this.size.height)}willCollide(t,e){const i=this.getProjections(t),n=e.getProjections();return i.x1<n.x2&&i.x2>n.x1&&i.y2>n.y1&&i.y1<n.y2}isColliding(t){return this.willCollide(this.position,t)}relativePosition(t){const e=this.getProjections(),i=t.getProjections();return y([[e.y1>=i.y2,o.TOP],[e.x2<=i.x1,o.RIGHT],[e.y2<=i.y1,o.BOTTOM],[e.x1>=i.x2,o.LEFT]])||!1}contains(t){return t.x>=this.position.x&&t.x<this.position.x+this.size.width&&t.y>=this.position.y&&t.y<this.position.y+this.size.height}}class E extends g{fps;currentFrame;constructor(t){super(t)}update(t,e){this.fps=t,this.currentFrame=e}draw(){const t=this.engine.ctx,{x:e,y:i}=this.position;t.fillStyle="black",t.fillRect(e,i,135,24),t.fillRect(e,i+25,122,24),t.fillStyle="yellow",t.font="24px Consolas, monospace, sans-serif",t.textAlign="left",t.textBaseline="top",t.fillText(`FPS: ${this.fps}`,e,i),t.fillText(`Frame: ${this.currentFrame}`,e,i+25)}}function v(s,t){return Math.max(s,t)}function F(s,t){return Math.min(s,t)}function b(s,t,e){return v(F(s,e),t)}function h(s,t){return s=Math.ceil(s),t=Math.floor(t),Math.floor(Math.random()*(t-s+1))+s}function x(s,t){return Math.random()<.5?s:t}class C extends g{name;speed_y;speed_x;colliders;constructor(t){super(t),this.color="lime",this.name="box",this.colliders=[],this.size={width:h(50,200),height:h(50,200)};const e=h(1,5);this.speed_y=e*x(-1,1),this.speed_x=e*x(-1,1);const{canvas:i}=this.engine;this.position={x:h(10,i.width-this.size.width-10),y:h(10,i.height-this.size.height-10)}}setName(t){return this.name=t,this}setColliders(t){return this.colliders=t,this}onCollision(t,e){switch(console.log(`${this.name} got hit by ${e.name} from ${t}`,e),t){case o.TOP:case o.BOTTOM:{this.speed_y=-1*e.speed_y;break}case o.LEFT:case o.RIGHT:{this.speed_x=-1*e.speed_x;break}}}update(){const t={x:this.position.x+this.speed_x,y:this.position.y+this.speed_y};for(const c of this.colliders)if(this.willCollide(t,c)){const u=this.relativePosition(c),l=c.getProjections();if(u===!1)continue;switch(u){case o.TOP:{this.speed_y=c.speed_y,t.y=l.y2;break}case o.BOTTOM:{this.speed_y=c.speed_y,t.y=l.y1-this.size.height;break}case o.RIGHT:{this.speed_x=c.speed_x,t.x=l.x1-this.size.width;break}case o.LEFT:{this.speed_x=c.speed_x,t.x=l.x2;break}}c.onCollision(I(u),this)}const e=this.getProjections(t),i=Math.abs(this.speed_x),n=Math.abs(this.speed_y),{canvas:r}=this.engine;e.x1<0&&e.x2<r.width?(this.speed_x=i,t.x=0):e.x1>0&&e.x2>r.width&&(this.speed_x=-1*i,t.x=r.width-this.size.width),e.y1<0&&e.y2<r.height?(this.speed_y=n,t.y=0):e.y1>0&&e.y2>r.height&&(this.speed_y=-1*n,t.y=r.height-this.size.height),this.setPosition(t)}draw(){this.update(),super.draw(),this.engine.ctx.fillStyle="black",this.engine.ctx.font="24px Consolas, monospace, sans-serif",this.engine.ctx.textAlign="left",this.engine.ctx.textBaseline="top",this.engine.ctx.fillText(this.name,this.position.x,this.position.y)}}function M(s){return new Promise(t=>{const e=new Image;e.onload=()=>{t(e)},e.onerror=()=>{throw new Error(`Image error: ${s}`)},e.src=s})}function H(s=window){const t={x:0,y:0,active:!1};return s.addEventListener("mousemove",e=>{if(e instanceof MouseEvent){const{clientX:i,clientY:n}=e;t.x=i,t.y=n,t.active=!0}}),s.addEventListener("mouseleave",()=>{t.active=!1}),t}const w=document.getElementById("mainframe"),f=H(w),d=new P(w,{VIEWPORT_WIDTH:window.innerWidth,VIEWPORT_HEIGHT:window.innerHeight,VSYNC:!0,HIDE_CURSOR:!0}),p=await M("./diamond_sword.png"),m=new E(d),a=[],R=Number(prompt("boxes count? (between 5 and 20)","10")),S=b(R,5,20);for(let s=0;s<S;s++){const t=i=>{for(const n of a)if(i.isColliding(n))return!0;return!1};let e=null;do e=new C(d).setName(`${s}`);while(t(e));a.push(e)}for(const s of a)s.setColliders(a.filter(t=>t!==s));d.render(s=>{for(const i of a)i.draw();const{fps:t,currentFrame:e}=s;m.update(t,e),m.draw(),f.active&&d.ctx.drawImage(p,f.x,f.y,p.width*4,p.height*4)});
