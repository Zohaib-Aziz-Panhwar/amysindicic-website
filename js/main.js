(function(){
  var t=document.getElementById('navToggle'),l=document.getElementById('navLinks');
  if(t&&l){t.addEventListener('click',function(){var o=l.classList.toggle('open');t.setAttribute('aria-expanded',o)});}
  // mark current page
  var here=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav__links a').forEach(function(a){if(a.getAttribute('href')===here)a.setAttribute('aria-current','page')});
  // scroll reveal
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(e){io.observe(e)});
  } else { els.forEach(function(e){e.classList.add('in')}); }
  // contact form → mailto (no backend needed)
  var f=document.getElementById('contactForm');
  if(f){f.addEventListener('submit',function(ev){ev.preventDefault();var d=new FormData(f);
    var body='Name: '+d.get('name')+'\nEmail: '+d.get('email')+'\nCurrent role: '+d.get('role')+'\nInterested in: '+d.get('program')+'\n\n'+d.get('message');
    location.href='mailto:amysindicic@gmail.com?subject='+encodeURIComponent('Discovery call request — '+d.get('name'))+'&body='+encodeURIComponent(body);});}
})();
(function(){
  // video modal
  var m=document.getElementById('videoModal');
  if(m){var box=m.querySelector('.modal__box');
    document.querySelectorAll('[data-video]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();
      box.innerHTML='<iframe src="https://www.youtube.com/embed/'+b.getAttribute('data-video')+'?autoplay=1&rel=0" title="Amy Sindicic video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      m.classList.add('open');document.body.style.overflow='hidden';});});
    function close(){m.classList.remove('open');box.innerHTML='';document.body.style.overflow='';}
    m.addEventListener('click',function(e){if(e.target===m||e.target.classList.contains('modal__close'))close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});}
  // count-up
  var nums=document.querySelectorAll('[data-count]');
  if(nums.length&&'IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    var o=new IntersectionObserver(function(en){en.forEach(function(e){if(!e.isIntersecting)return;o.unobserve(e.target);var el=e.target,end=+el.getAttribute('data-count'),suf=el.getAttribute('data-suffix')||'',t0=null;
      function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/1200,1);p=1-Math.pow(1-p,3);el.textContent=Math.round(end*p)+suf;if(p<1)requestAnimationFrame(step);}requestAnimationFrame(step);});},{threshold:.6});
    nums.forEach(function(n){o.observe(n)});}
  // sticky mobile CTA after hero
  var s=document.getElementById('stickyCta'),h=document.querySelector('.hero,.page-hero');
  if(s&&h){window.addEventListener('scroll',function(){s.classList.toggle('show',window.scrollY>h.offsetHeight)},{passive:true});}
  // newsletter → mailto (replace with Mailchimp/ConvertKit action URL)
  document.querySelectorAll('.nl-form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var em=f.querySelector('input[type=email]').value;
    location.href='mailto:amysindicic@gmail.com?subject='+encodeURIComponent('Send me the résumé template + 10 days of writing tips')+'&body='+encodeURIComponent('Please add me to the list: '+em);});});
})();
/* ===== v3 hero: constellation canvas, flipping headline, live translator, parallax ===== */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // --- constellation ---
  var c=document.getElementById('heroNet');
  if(c&&!reduce){
    var ctx=c.getContext('2d'),W,H,pts=[],mx=-1e4,my=-1e4,raf,vis=true;
    function size(){var r=c.getBoundingClientRect();W=c.width=r.width*devicePixelRatio;H=c.height=r.height*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);W/=devicePixelRatio;H/=devicePixelRatio;
      var n=Math.round(Math.min(110,W*H/16000));pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.6+.6,o:Math.random()<.2});}
    size();addEventListener('resize',size);
    c.parentNode.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
    c.parentNode.addEventListener('mouseleave',function(){mx=my=-1e4});
    function draw(){if(!vis){raf=null;return}ctx.clearRect(0,0,W,H);
      for(var i=0;i<pts.length;i++){var p=pts[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
        var dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy);if(d<140){p.x+=dx/d*.6;p.y+=dy/d*.6}}
      for(i=0;i<pts.length;i++){for(var j=i+1;j<pts.length;j++){var a=pts[i],b=pts[j],ddx=a.x-b.x,ddy=a.y-b.y,dd=ddx*ddx+ddy*ddy;if(dd<130*130){var al=(1-Math.sqrt(dd)/130)*.35;ctx.strokeStyle=(a.o||b.o)?'rgba(240,134,28,'+al+')':'rgba(140,170,230,'+al*.8+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}
      for(i=0;i<pts.length;i++){var q=pts[i];ctx.fillStyle=q.o?'rgba(240,134,28,.95)':'rgba(190,210,255,.8)';ctx.beginPath();ctx.arc(q.x,q.y,q.r,0,6.283);ctx.fill();if(q.o){ctx.fillStyle='rgba(240,134,28,.15)';ctx.beginPath();ctx.arc(q.x,q.y,q.r*4,0,6.283);ctx.fill()}}
      raf=requestAnimationFrame(draw)}
    new IntersectionObserver(function(en){vis=en[0].isIntersecting;if(vis&&!raf)draw()}).observe(c);
    draw();
  }
  // --- flipping headline pairs ---
  var f1=document.getElementById('flipFrom'),f2=document.getElementById('flipTo');
  if(f1&&f2&&!reduce){
    var pairs=[['mission-driven','market-ready.'],['GS-15','Vice President.'],['Colonel','Chief of Operations.'],['Program Director','Executive Director.'],['SES-ready','SES.'],['public service','private-sector leader.']],k=0;
    function swap(el,txt){var old=el.querySelector('span');var nw=document.createElement('span');nw.textContent=txt;nw.className='in';old.className='out';el.appendChild(nw);setTimeout(function(){old.remove()},600)}
    setInterval(function(){k=(k+1)%pairs.length;swap(f1,pairs[k][0]);swap(f2,pairs[k][1])},3200);
  }
  // --- live translator ---
  var tf=document.getElementById('tFrom'),tt=document.getElementById('tTo'),tg=document.getElementById('tTag'),tp=document.getElementById('tProg');
  if(tf&&tt){
    var ex=[
      ['Served as Program Manager for a $45M multi-year acquisition program across three directorates.','Led a $45M P&L across 3 business units, delivering on time and 8% under budget.','Program management'],
      ['Supervised 120 civilian and military personnel in a joint operations environment.','Built and led a 120-person cross-functional organization through a major restructuring.','Leadership scope'],
      ['Ensured compliance with federal regulations, OMB guidance and agency policy.','Owned enterprise risk and regulatory compliance for a $300M operation.','Risk & governance'],
      ['Briefed senior leadership and Congressional staff on program status.','Advised the C-suite and board-level stakeholders; secured buy-in for strategic initiatives.','Executive influence'],
      ['Commanded a battalion-level unit during overseas deployment.','Ran a 600-person operation in a high-stakes, resource-constrained environment.','Operations leadership']
    ],i=0;
    function type(el,str,speed,cb){el.textContent='';var n=0;(function tick(){el.textContent=str.slice(0,++n);if(n<str.length)setTimeout(tick,speed);else if(cb)cb()})()}
    function run(){var e=ex[i];tg.textContent=e[2];tf.classList.remove('strike');tt.textContent='';tp.style.width='0';
      if(reduce){tf.textContent=e[0];tt.textContent=e[1];return}
      type(tf,e[0],18,function(){setTimeout(function(){tf.classList.add('strike');type(tt,e[1],26,function(){var t0=Date.now();(function pr(){var p=Math.min((Date.now()-t0)/2600,1);tp.style.width=(p*100)+'%';if(p<1)requestAnimationFrame(pr);else{i=(i+1)%ex.length;run()}})()})},500)})}
    run();
  }
  // --- parallax ---
  var st=document.getElementById('heroStage');
  if(st&&!reduce&&matchMedia('(pointer:fine)').matches){
    var els=st.querySelectorAll('[data-depth]');
    st.closest('.hero').addEventListener('mousemove',function(e){var r=st.getBoundingClientRect(),x=(e.clientX-(r.left+r.width/2))/r.width,y=(e.clientY-(r.top+r.height/2))/r.height;
      els.forEach(function(el){var d=+el.getAttribute('data-depth');el.style.transform='translate('+(-x*d)+'px,'+(-y*d)+'px)'})});
    st.closest('.hero').addEventListener('mouseleave',function(){els.forEach(function(el){el.style.transform=''})});
  }
})();
/* ===== v4 ===== */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // progress bar
  var pb=document.getElementById('progressBar');
  if(pb){addEventListener('scroll',function(){var h=document.documentElement;pb.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true});}
  // hero spotlight
  var sp=document.getElementById('heroSpot');
  if(sp&&matchMedia('(pointer:fine)').matches){var hero=sp.parentNode;hero.addEventListener('mousemove',function(e){var r=hero.getBoundingClientRect();sp.style.setProperty('--sx',(e.clientX-r.left)+'px');sp.style.setProperty('--sy',(e.clientY-r.top)+'px')});}
  // compare slider
  var cmp=document.getElementById('cmp'),hd=document.getElementById('cmpHandle');
  if(cmp&&hd){var drag=false,cut=50;function set(p){cut=Math.max(4,Math.min(96,p));cmp.style.setProperty('--cut',cut+'%');hd.setAttribute('aria-valuenow',Math.round(cut))}
    function fromX(x){var r=cmp.getBoundingClientRect();set((x-r.left)/r.width*100)}
    hd.addEventListener('pointerdown',function(e){drag=true;hd.setPointerCapture(e.pointerId)});
    addEventListener('pointerup',function(){drag=false});
    addEventListener('pointermove',function(e){if(drag)fromX(e.clientX)});
    cmp.addEventListener('pointerdown',function(e){if(e.target===hd||hd.contains(e.target))return;fromX(e.clientX)});
    hd.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')set(cut-4);if(e.key==='ArrowRight')set(cut+4)});
    if(!reduce){new IntersectionObserver(function(en){if(!en[0].isIntersecting)return;var t0=null;(function a(t){if(drag)return;if(!t0)t0=t;var p=Math.min((t-t0)/1800,1),e=1-Math.pow(1-p,3);set(50+Math.sin(e*Math.PI*2)*22);if(p<1)requestAnimationFrame(a)})(performance.now());},{threshold:.5}).observe(cmp);}
    set(50);}
  // picker
  var pk=document.getElementById('picker'),tiers=document.querySelectorAll('#tiers .tier');
  if(pk&&tiers.length){pk.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var i=+b.getAttribute('data-pick');pk.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)});tiers.forEach(function(t,j){t.classList.toggle('hot',j===i);t.classList.toggle('dim',j!==i)});tiers[i].scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})})});}
  // featured quote rotation
  var fq=document.getElementById('featureQuote');
  if(fq){var qs=fq.querySelectorAll('blockquote'),dots=fq.querySelector('.feature-quote__dots'),cur=0,tm;
    qs.forEach(function(_,i){var d=document.createElement('button');d.setAttribute('aria-label','Testimonial '+(i+1));d.addEventListener('click',function(){show(i);restart()});dots.appendChild(d)});
    function show(i){cur=i;qs.forEach(function(q,j){q.classList.toggle('on',j===i)});dots.querySelectorAll('button').forEach(function(d,j){d.classList.toggle('on',j===i)})}
    function restart(){clearInterval(tm);if(!reduce)tm=setInterval(function(){show((cur+1)%qs.length)},5500)}
    show(0);restart();}
  // slide-in offer
  var si=document.getElementById('slidein'),sx=document.getElementById('slideinClose');
  if(si){var dismissed=false;try{dismissed=sessionStorage.getItem('t123-offer')==='1'}catch(e){}
    if(!dismissed&&location.pathname.indexOf('resources')<0){var shown=false;addEventListener('scroll',function(){if(shown)return;var h=document.documentElement;if(h.scrollTop/(h.scrollHeight-h.clientHeight)>.35){shown=true;si.classList.add('show')}},{passive:true});}
    sx&&sx.addEventListener('click',function(){si.classList.remove('show');try{sessionStorage.setItem('t123-offer','1')}catch(e){}});}
})();
