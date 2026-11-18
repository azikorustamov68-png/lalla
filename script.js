const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];

// Mobil menyu
const mobileMenu=$('#mobileMenu'),navMenu=$('#navMenu');
mobileMenu.addEventListener('click',()=>{const open=navMenu.classList.toggle('open');mobileMenu.setAttribute('aria-expanded',String(open))});
$$('#navMenu a').forEach(a=>a.addEventListener('click',()=>{navMenu.classList.remove('open');mobileMenu.setAttribute('aria-expanded','false')}));

// Qidiruv
const searchBox=$('#searchBox'),searchInput=$('#searchInput'),searchMatches=$('#searchMatches');
$('#searchOpen').addEventListener('click',()=>{searchBox.classList.toggle('visible');if(searchBox.classList.contains('visible'))searchInput.focus()});
$('#searchClose').addEventListener('click',()=>searchBox.classList.remove('visible'));
const catalogue=['iPhone 17 Pro','MacBook Air','iPad Pro','Apple Watch','AirPods Pro'];
searchInput.addEventListener('input',()=>{const q=searchInput.value.trim().toLowerCase();searchMatches.innerHTML=q?(catalogue.filter(x=>x.toLowerCase().includes(q)).map(x=>`<a href="#products">${x}</a>`).join('')||'<a>Natija topilmadi</a>'):'';$$('a[href]',searchMatches).forEach(a=>a.addEventListener('click',()=>searchBox.classList.remove('visible')))});

// Carousel: autoplay, tugmalar, nuqtalar, touch/mouse swipe
const track=$('#sliderTrack'),cards=$$('.product-card',track),dots=$('#sliderDots'),windowSlider=$('#sliderWindow');
let index=0,timer=null,startX=null,deltaX=0;
const visible=()=>innerWidth<760?1:innerWidth<1050?2:3;
const last=()=>Math.max(0,cards.length-visible());
function paint(){index=Math.min(index,last());const width=cards[0].getBoundingClientRect().width+18;track.style.transform=`translateX(${-index*width}px)`;$$('button',dots).forEach((b,i)=>b.classList.toggle('active',i===index))}
function go(i){index=(i+last()+1)%(last()+1);paint()}
function makeDots(){dots.innerHTML='';for(let i=0;i<=last();i++){const b=document.createElement('button');b.setAttribute('aria-label',`Slayd ${i+1}`);b.addEventListener('click',()=>{go(i);restart()});dots.append(b)}paint()}
function restart(){clearInterval(timer);timer=setInterval(()=>go(index+1),4700)}
$('#slidePrev').addEventListener('click',()=>{go(index-1);restart()});
$('#slideNext').addEventListener('click',()=>{go(index+1);restart()});
windowSlider.addEventListener('pointerdown',e=>{startX=e.clientX;deltaX=0;windowSlider.setPointerCapture(e.pointerId)});
windowSlider.addEventListener('pointermove',e=>{if(startX!==null)deltaX=e.clientX-startX});
function endSwipe(){if(startX!==null&&Math.abs(deltaX)>45)go(index+(deltaX<0?1:-1));startX=null;deltaX=0;restart()}
windowSlider.addEventListener('pointerup',endSwipe);windowSlider.addEventListener('pointercancel',endSwipe);
windowSlider.addEventListener('mouseenter',()=>clearInterval(timer));windowSlider.addEventListener('mouseleave',restart);
window.addEventListener('resize',makeDots);makeDots();restart();

// Savatcha — o‘quv demo, haqiqiy to‘lov ulanmagan
const prices={'iPhone 17 Pro':18999000,'MacBook Air':14499000,'iPad Pro':12999000,'Apple Watch':5499000,'AirPods Pro':3299000},cart={};
const fmt=n=>new Intl.NumberFormat('uz-UZ').format(n)+' so‘m';
const drawer=$('#cartDrawer'),scrim=$('#scrim');
function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('visible');setTimeout(()=>el.classList.remove('visible'),2100)}
function drawCart(){const entries=Object.entries(cart).filter(([,q])=>q>0);$('#cartItems').innerHTML=entries.map(([name,q])=>`<li><span>${name} × ${q}<br><small>${fmt(prices[name]*q)}</small></span><button data-delete="${name}">O‘chirish</button></li>`).join('');$('#cartEmpty').hidden=entries.length>0;$('#cartCount').textContent=entries.reduce((s,[,q])=>s+q,0);$('#cartTotal').textContent=fmt(entries.reduce((s,[n,q])=>s+prices[n]*q,0));$$('[data-delete]').forEach(b=>b.addEventListener('click',()=>{delete cart[b.dataset.delete];drawCart()}))}
$$('.add-cart').forEach(b=>b.addEventListener('click',()=>{const name=b.dataset.product;cart[name]=(cart[name]||0)+1;drawCart();toast(name+' savatchaga qo‘shildi')}));
function openCart(){drawer.classList.add('open');scrim.classList.add('visible');drawer.setAttribute('aria-hidden','false')}
function closeCart(){drawer.classList.remove('open');scrim.classList.remove('visible');drawer.setAttribute('aria-hidden','true')}
$('#cartOpen').addEventListener('click',openCart);$('#cartClose').addEventListener('click',closeCart);scrim.addEventListener('click',closeCart);
$('#checkout').addEventListener('click',()=>toast(Object.keys(cart).length?'Bu o‘quv demo: to‘lov tizimi ulanmagan.':'Avval mahsulot tanlang.'));

// Video player boshqaruvlari
const video=$('#demoVideo'),cover=$('#filmCover'),playPause=$('#playPause'),seek=$('#seek'),clock=$('#clock');
const timeText=t=>Number.isFinite(t)?`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`:'0:00';
async function toggleVideo(){try{if(video.paused){await video.play();cover.classList.add('hidden');playPause.textContent='Ⅱ'}else{video.pause();cover.classList.remove('hidden');playPause.textContent='▶'}}catch(e){toast('Video ochilmadi. Internet aloqasini tekshiring.')}} 
$('#bigPlay').addEventListener('click',toggleVideo);playPause.addEventListener('click',toggleVideo);video.addEventListener('click',toggleVideo);
video.addEventListener('timeupdate',()=>{seek.value=video.duration?video.currentTime/video.duration*100:0;clock.textContent=timeText(video.currentTime)});
video.addEventListener('ended',()=>{cover.classList.remove('hidden');playPause.textContent='▶'});
seek.addEventListener('input',()=>{if(Number.isFinite(video.duration))video.currentTime=Number(seek.value)/100*video.duration});
$('#mute').addEventListener('click',()=>{video.muted=!video.muted;$('#mute').textContent=video.muted?'×':'♫'});
$('#fullScreen').addEventListener('click',()=>{if(video.requestFullscreen)video.requestFullscreen();else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();searchBox.classList.remove('visible');navMenu.classList.remove('open')}});
drawCart();
