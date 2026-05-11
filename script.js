

// === PARALLAX STONES ===
document.addEventListener("mousemove", parallax);

function parallax(e) {
  const stones = document.querySelectorAll(".floating-stone, .floating-gift");
  stones.forEach(stone => {
    const speed = stone.getAttribute("data-speed");
    const x = (window.innerWidth - e.pageX * speed) / 100;
    const y = (window.innerHeight - e.pageY * speed) / 100;
    stone.style.transform = `translateX(${x}px) translateY(${y}px)`;
  });
}

// === PARTICLES ===
(function(){
  const c=document.getElementById('particles-container');
  for(let i=0;i<60;i++){
    const p=document.createElement('div');p.classList.add('particle');
    const s=Math.random()*4+1;
    p.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${8+Math.random()*12}s;animation-delay:${Math.random()*10}s;background:${Math.random()>.5?'#c9a84c':'rgba(255,255,255,0.6)'};`;
    c.appendChild(p);
  }
})();

// === COUNTDOWN ===
function updateCountdown(){
  const diff=new Date('2026-05-16T00:00:00+05:30').getTime()-Date.now();
  if(diff<=0){
    document.getElementById('countdown-timer').classList.add('hidden');
    document.getElementById('birthday-burst').classList.remove('hidden');
    return;
  }
  const pad=n=>String(Math.floor(n)).padStart(2,'0');
  animNum('days',pad(diff/86400000));
  animNum('hours',pad((diff%86400000)/3600000));
  animNum('minutes',pad((diff%3600000)/60000));
  animNum('seconds',pad((diff%60000)/1000));
}
const pv={};
function animNum(id,val){
  const el=document.getElementById(id);
  if(el&&pv[id]!==val){el.style.transform='scale(1.3)';el.style.color='#e8c96d';el.textContent=val;setTimeout(()=>{el.style.transform='scale(1)';el.style.color='';},200);pv[id]=val;}
}
updateCountdown();setInterval(updateCountdown,1000);
document.getElementById('launch-confetti-btn')?.addEventListener('click',()=>{launchConfetti();launchBalloons();});

// === BACKGROUND BALLOONS ===
const BE=['🎈','🎈','🎀','🎉','💜','💙','🩵','⭐','✨','🌸'];
function launchBalloons(){
  const c=document.getElementById('balloons-container');c.innerHTML='';
  for(let i=0;i<20;i++){
    setTimeout(()=>{
      const b=document.createElement('div');b.classList.add('balloon');
      b.textContent=BE[Math.floor(Math.random()*BE.length)];
      b.style.cssText=`left:${Math.random()*95}%;animation-duration:${4+Math.random()*4}s;font-size:${32+Math.random()*30}px;`;
      c.appendChild(b);setTimeout(()=>b.remove(),8000);
    },i*180);
  }
}
setTimeout(launchBalloons,1500);

// === CONFETTI ===
function launchConfetti(canvasId){
  let cv=document.getElementById(canvasId||'confetti-canvas');
  if(!cv){cv=document.createElement('canvas');cv.id='confetti-canvas';cv.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:998;';document.body.appendChild(cv);}
  const ctx=cv.getContext('2d');cv.width=window.innerWidth;cv.height=window.innerHeight;
  const cols=['#c9a84c','#e8c96d','#ffffff','#f4a0b0','#6dd5fa','#ff6b9d','#9bd8ff'];
  const ps=Array.from({length:200},()=>({x:Math.random()*cv.width,y:Math.random()*-cv.height,w:6+Math.random()*10,h:5+Math.random()*8,c:cols[Math.floor(Math.random()*cols.length)],r:Math.random()*360,rs:(Math.random()-.5)*7,sy:2+Math.random()*3,sx:(Math.random()-.5)*3,op:1}));
  let fr;
  (function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    let alive=false;
    ps.forEach(p=>{if(p.y<cv.height+20){alive=true;p.y+=p.sy;p.x+=p.sx;p.r+=p.rs;if(p.y>cv.height*.7)p.op-=.015;ctx.save();ctx.globalAlpha=Math.max(0,p.op);ctx.translate(p.x,p.y);ctx.rotate(p.r*Math.PI/180);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();}});
    if(alive)fr=requestAnimationFrame(draw);
  })();
}

// === SCROLL REVEAL ===
const ro=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');ro.unobserve(e.target);}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

// === NAVBAR ===
window.addEventListener('scroll',()=>{
  const n=document.getElementById('navbar');
  n.style.padding=window.scrollY>60?'8px 40px':'14px 40px';
});

// === FLASHCARDS (tap toggle for mobile) ===
document.querySelectorAll('.flashcard').forEach(fc=>{
  fc.addEventListener('click',()=>fc.classList.toggle('flipped'));
});

// === BALLOON GAME ===
const BALLOON_COLORS=[
  '#FF6B6B','#FF8E53','#FFC300','#4ECDC4','#45B7D1',
  '#96E6A1','#D4A5F5','#FF85A1','#FFD700','#87CEEB',
  '#FF69B4','#98FB98','#DDA0DD','#F0E68C','#B0E0E6',
  '#FF7F50','#9370DB','#20B2AA'
];

let poppedCount=0;
let gameStarted=false;

function startCelebration(){
  document.getElementById('celebrate-entry').style.display='none';
  document.getElementById('balloon-arena').classList.remove('hidden');
  buildBalloonSky();
  gameStarted=true;
}
window.startCelebration=startCelebration;

function buildBalloonSky(){
  const sky=document.getElementById('balloon-sky');
  sky.innerHTML='';
  sky.style.position = 'relative';
  sky.style.height = '500px';

  for(let i=0;i<18;i++){
    const wrap=document.createElement('div');
    wrap.classList.add('game-balloon-wrap');
    wrap.dataset.index=i;

    // Bouquet layout: narrower spread and shorter strings on mobile to prevent cut-offs
    const isMobile = window.innerWidth <= 600;
    const maxAngle = isMobile ? 32 : 50;
    const angle = -maxAngle + (i * ((maxAngle * 2) / 17)) + (Math.random() * (isMobile ? 6 : 10) - (isMobile ? 3 : 5));
    
    const baseLength = isMobile ? 120 : 150;
    const randomLength = isMobile ? 80 : 120;
    const stringLength = baseLength + Math.random() * randomLength;
    
    wrap.style.cssText=`
      --angle: ${angle}deg;
      position: absolute;
      left: calc(50% - 30px);
      bottom: 20px;
      transform-origin: bottom center;
      transform: rotate(${angle}deg);
      animation: floatBouquet ${3+Math.random()*2}s ease-in-out infinite alternate;
      animation-delay: ${Math.random()*2}s;
      width: 60px;
      height: ${stringLength + 80}px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      pointer-events: none;
      transition: opacity 0.15s ease-out;
    `;

    const color=BALLOON_COLORS[i];
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 60 80');
    svg.classList.add('game-balloon-svg');
    svg.style.cssText = `width: 100%; height: 80px; z-index: 2; transition: transform 0.15s ease-out; pointer-events: auto; cursor: pointer;`;
    svg.innerHTML=`
      <defs>
        <radialGradient id="bg${i}" cx="35%" cy="30%">
          <stop offset="0%" stop-color="white" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="${color}"/>
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="32" rx="26" ry="32" fill="url(#bg${i})"/>
      <ellipse cx="21" cy="18" rx="8" ry="12" fill="rgba(255,255,255,0.3)"/>
      <path d="M30 64 L26 72 L34 72 Z" fill="${color}"/>
    `;

    const str=document.createElement('div');
    str.classList.add('balloon-string');
    str.style.cssText = `width: 1.5px; height: ${stringLength}px; background: rgba(255,255,255,0.3); margin-top: -8px; z-index: 1; transition: opacity 0.15s;`;

    wrap.appendChild(svg);
    wrap.appendChild(str);

    wrap.addEventListener('click',()=>popBalloon(wrap,i));
    sky.appendChild(wrap);
  }
}

function popBalloon(wrap,idx){
  if(wrap.classList.contains('popped'))return;
  wrap.classList.add('popped');
  
  // Vanish fast and smooth
  wrap.style.opacity = '0';
  
  const svg = wrap.querySelector('.game-balloon-svg');
  if(svg) {
    svg.style.transform = 'scale(0)';
    svg.style.pointerEvents = 'none';
  }
  
  poppedCount++;

  // Show year burst overlay
  showYearBurst(poppedCount,wrap);

  // Update count
  document.getElementById('year-count').textContent=poppedCount;

  if(poppedCount===18){
    setTimeout(showMegaCelebration,1000);
  }
}

function showYearBurst(year,wrap){
  const overlay=document.getElementById('pop-burst-overlay');
  const label=document.getElementById('burst-year-label');
  const cv=document.getElementById('burst-canvas');
  overlay.classList.remove('hidden');
  cv.width=window.innerWidth;cv.height=window.innerHeight;

  label.textContent='Year '+year+'! 🎉';
  label.style.animation='none';
  void label.offsetWidth;
  label.style.animation='yearPop .6s cubic-bezier(.16,1,.3,1) both';

  // Mini burst particles
  const ctx=cv.getContext('2d');
  const cx=window.innerWidth/2,cy=window.innerHeight/2;
  const cols=['#FF6B6B','#FFD700','#4ECDC4','#D4A5F5','#FF85A1','#fff'];
  const ps=Array.from({length:80},()=>{
    const ang=Math.random()*Math.PI*2;
    const spd=4+Math.random()*8;
    return{x:cx,y:cy,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd,r:3+Math.random()*4,c:cols[Math.floor(Math.random()*cols.length)],op:1};
  });
  let fr;
  (function drawBurst(){
    ctx.clearRect(0,0,cv.width,cv.height);
    let alive=false;
    ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.15;p.op-=.025;if(p.op>0){alive=true;ctx.save();ctx.globalAlpha=p.op;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.restore();}});
    if(alive)fr=requestAnimationFrame(drawBurst);
    else{ctx.clearRect(0,0,cv.width,cv.height);}
  })();

  setTimeout(()=>{overlay.classList.add('hidden');},1200);
}

function showMegaCelebration(){
  const overlay=document.getElementById('mega-celebration-overlay');
  overlay.classList.remove('hidden');
  const cv=document.getElementById('mega-canvas');
  cv.width=window.innerWidth;cv.height=window.innerHeight;
  launchBalloons();

  // Full confetti on mega-canvas
  const ctx=cv.getContext('2d');
  const cols=['#c9a84c','#e8c96d','#ffffff','#f4a0b0','#6dd5fa','#ff6b9d','#9bd8ff','#FFD700'];
  const ps=Array.from({length:300},()=>({x:Math.random()*cv.width,y:Math.random()*-cv.height*2,w:8+Math.random()*10,h:5+Math.random()*8,c:cols[Math.floor(Math.random()*cols.length)],r:Math.random()*360,rs:(Math.random()-.5)*8,sy:2+Math.random()*4,sx:(Math.random()-.5)*3,op:1}));
  let fr;
  (function draw(){
    ctx.clearRect(0,0,cv.width,cv.height);
    let alive=false;
    ps.forEach(p=>{if(p.y<cv.height+20){alive=true;p.y+=p.sy;p.x+=p.sx;p.r+=p.rs;if(p.y>cv.height*.6)p.op-=.008;ctx.save();ctx.globalAlpha=Math.max(0,p.op);ctx.translate(p.x,p.y);ctx.rotate(p.r*Math.PI/180);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();}});
    if(alive)fr=requestAnimationFrame(draw);
  })();
}

window.showCakeStage=function(){
  document.getElementById('mega-celebration-overlay').classList.add('hidden');
  document.getElementById('balloon-arena').classList.add('hidden');
  document.getElementById('cake-stage').classList.remove('hidden');
  document.getElementById('cake-stage').scrollIntoView({behavior:'smooth'});
  initKnifeDrag();
};

// === KNIFE DRAG ===
function initKnifeDrag(){
  const kc=document.getElementById('knife-container');
  let dragging=false,startX=0,startY=0,origX=0,origY=0,cutDone=false;

  function getPos(e){return e.touches?{x:e.touches[0].clientX,y:e.touches[0].clientY}:{x:e.clientX,y:e.clientY};}

  function checkCut(kc) {
    const kcRect = kc.getBoundingClientRect();
    const cakeRect = document.getElementById('cake-whole').getBoundingClientRect();
    const kx = kcRect.left + 15; // approx blade center
    const ky = kcRect.bottom - 40; // tip of blade
    if(kx > cakeRect.left + cakeRect.width*0.3 && kx < cakeRect.right - cakeRect.width*0.3) {
       if(ky > cakeRect.top && ky < cakeRect.bottom) return true;
    }
    return false;
  }

  kc.addEventListener('mousedown',e=>{if(cutDone)return; dragging=true;const p=getPos(e);startX=p.x;startY=p.y;origX=kc.offsetLeft;origY=kc.offsetTop;kc.style.transition='none';});
  kc.addEventListener('touchstart',e=>{if(cutDone)return; dragging=true;const p=getPos(e);startX=p.x;startY=p.y;origX=kc.offsetLeft;origY=kc.offsetTop;kc.style.transition='none';},{passive:true});

  document.addEventListener('mousemove',e=>{if(!dragging||cutDone)return;const p=getPos(e);kc.style.left=(origX+p.x-startX)+'px';kc.style.top=(origY+p.y-startY)+'px';if(checkCut(kc)){cutDone=true;triggerCut();}});
  document.addEventListener('touchmove',e=>{if(!dragging||cutDone)return;const p=getPos(e);kc.style.left=(origX+p.x-startX)+'px';kc.style.top=(origY+p.y-startY)+'px';if(checkCut(kc)){cutDone=true;triggerCut();}},{passive:true});
  document.addEventListener('mouseup',()=>{dragging=false;});
  document.addEventListener('touchend',()=>{dragging=false;});
}

function triggerCut(){
  const flash=document.getElementById('cut-flash');
  const celebration=document.getElementById('cut-celebration');
  const hint=document.getElementById('cake-drag-hint');
  const candles=document.querySelectorAll('.cnd-flame');
  if(!document.getElementById('cut-celebration').classList.contains('hidden'))return;

  // Extinguish candles
  candles.forEach(f=>{f.style.opacity='0';f.style.animation='none';});

  flash.classList.remove('hidden');
  setTimeout(()=>{flash.classList.add('hidden');},500);

  // Split cake into literal partitions
  const cakeWhole=document.getElementById('cake-whole');
  const w=cakeWhole.offsetWidth;
  const h=cakeWhole.offsetHeight;
  const content=cakeWhole.innerHTML;
  
  cakeWhole.style.width=w+'px';
  cakeWhole.style.height=h+'px';
  cakeWhole.style.display='block';
  
  cakeWhole.innerHTML=`
    <div id="cake-left" style="position:absolute;top:0;left:0;width:100%;height:100%;clip-path:polygon(0 -20%, 50% -20%, 50% 120%, 0 120%);transition:transform 1.5s cubic-bezier(0.25, 1, 0.5, 1); transform-origin: bottom left;">${content}</div>
    <div id="cake-right" style="position:absolute;top:0;left:0;width:100%;height:100%;clip-path:polygon(50% -20%, 100% -20%, 100% 120%, 50% 120%);transition:transform 1.5s cubic-bezier(0.25, 1, 0.5, 1); transform-origin: bottom right;">${content}</div>
  `;
  
  // Apply physics-like fall after a tiny delay
  setTimeout(()=>{
    document.getElementById('cake-left').style.transform='rotateZ(-4deg) translateX(-12px) translateY(4px)';
    document.getElementById('cake-right').style.transform='rotateZ(4deg) translateX(12px) translateY(4px)';
  },50);

  setTimeout(()=>{
    celebration.classList.remove('hidden');
    if(hint) hint.style.display='none';
    document.getElementById('knife-container').style.display='none';
    launchConfetti();
    launchBalloons();
  },800);
}

// === MUSIC TOGGLE ===
window.toggleMusic=function(){
  const icon=document.getElementById('music-icon');
  const bgMusic=document.getElementById('bg-music');
  
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      icon.textContent='🔇'; // Change to mute icon since it is playing
    }).catch(e => {
      console.log('Audio playback failed: ', e);
    });
  } else {
    bgMusic.pause();
    icon.textContent='🎵'; // Change to music icon since it is paused
  }
};

window.addEventListener('resize',()=>{
  const cv=document.getElementById('confetti-canvas');
  if(cv){cv.width=window.innerWidth;cv.height=window.innerHeight;}
});
