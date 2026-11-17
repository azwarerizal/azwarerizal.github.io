/* ===== EDIT YOUR CONTENT HERE ===== */
var STAGES=[
 {name:"Integration",x:20,text:"Connect different systems so data flows into one place."},
 {name:"Pipeline",x:180,text:"Build and maintain pipelines that move data on schedule."},
 {name:"Quality",x:340,text:"Check and clean data so teams can trust the numbers."},
 {name:"Migration",x:500,text:"Move data safely from legacy systems to new platforms."}
];
/* ===== END OF CONTENT ===== */
var $=function(id){return document.getElementById(id)};
var root=document.documentElement,reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
var G=!!(window.gsap&&window.ScrollTrigger)&&!reduce;
if(G){root.classList.add("gs");gsap.registerPlugin(ScrollTrigger)}
$("yr").textContent=new Date().getFullYear();

/* theme */
try{var sv=localStorage.getItem("theme");if(sv)root.setAttribute("data-theme",sv)}catch(e){}
$("theme").onclick=function(){
  var d=root.getAttribute("data-theme")?root.getAttribute("data-theme")==="dark":matchMedia("(prefers-color-scheme: dark)").matches;
  var n=d?"light":"dark";root.setAttribute("data-theme",n);try{localStorage.setItem("theme",n)}catch(e){}
};

/* hero statement split into words */
(function(){
  var el=$("statement"),words=el.textContent.split(" ");el.setAttribute("aria-label",el.textContent);el.textContent="";
  words.forEach(function(w,i){var s=document.createElement("span");s.className="w";s.style.setProperty("--i",i);s.setAttribute("aria-hidden","true");s.textContent=w;el.appendChild(s);el.appendChild(document.createTextNode(" "))});
  if(G)gsap.fromTo(".statement .w",{y:50,opacity:0,rotate:3},{y:0,opacity:1,rotate:0,duration:.9,ease:"power4.out",stagger:.035,delay:.15});
})();

/* marquee: duplicate content for a seamless loop */
var track=$("track"),tw;
(function(){
  var h=track.innerHTML;h=h+h;track.innerHTML=h+h;
  if(!G)return;
  tw=gsap.to(track,{xPercent:-50,duration:34,ease:"none",repeat:-1});
  var ts=1;
  ScrollTrigger.create({onUpdate:function(s){ts=s.direction*(1+Math.min(Math.abs(s.getVelocity())/350,7))}});
  gsap.ticker.add(function(){ts+=(1-ts)*.05;tw.timeScale(ts)});
})();

/* scroll progress */
function sc(){var m=document.documentElement.scrollHeight-innerHeight;$("prog").style.width=(m>0?scrollY/m*100:0)+"%"}
addEventListener("scroll",sc,{passive:true});sc();

/* pipeline */
(function(){
  var NS="http://www.w3.org/2000/svg",g=$("nodes"),detail=$("detail"),nodes=[];
  function show(k){
    nodes.forEach(function(n,i){n.classList.toggle("on",i===k)});
    detail.innerHTML="<strong></strong><br><span></span>";
    detail.firstChild.textContent=STAGES[k].name;detail.lastChild.textContent=STAGES[k].text;
    if(G){gsap.fromTo(detail,{opacity:0,y:10},{opacity:1,y:0,duration:.4,ease:"power2.out"});
      gsap.fromTo(nodes[k],{scale:1},{scale:1.06,svgOrigin:(STAGES[k].x+60)+" 75",duration:.18,yoyo:true,repeat:1})}
  }
  STAGES.forEach(function(s,k){
    var n=document.createElementNS(NS,"g");
    n.setAttribute("class","node");n.setAttribute("tabindex","0");n.setAttribute("role","button");n.setAttribute("aria-label",s.name+": show details");
    n.innerHTML='<rect x="'+s.x+'" y="45" width="120" height="60" rx="12"/><text x="'+(s.x+60)+'" y="81"></text>';
    n.lastChild.textContent=s.name;
    n.onclick=function(){show(k)};
    n.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();show(k)}};
    g.appendChild(n);nodes.push(n);
  });
  show(0);
  if(G)gsap.from(nodes,{y:40,opacity:0,duration:.8,ease:"back.out(1.7)",stagger:.15,scrollTrigger:{trigger:".pipe",start:"top 85%"}});
  if(reduce)return;
  var dg=$("dots"),dots=[];
  for(var i=0;i<14;i++){var c=document.createElementNS(NS,"circle");c.setAttribute("class","dot");c.setAttribute("r",3.5);c.setAttribute("cy",75);dg.appendChild(c);dots.push({el:c,p:i/14})}
  var last=performance.now();
  (function frame(t){var dt=(t-last)/1000;last=t;
    dots.forEach(function(d){d.p=(d.p+dt*.12)%1;d.el.setAttribute("cx",60+d.p*520);d.el.setAttribute("opacity",Math.sin(d.p*Math.PI))});
    requestAnimationFrame(frame)})(last);
})();

if(!reduce){
  var mx=innerWidth/2,my=innerHeight/3,gx=mx,gy=my;
  addEventListener("pointermove",function(e){mx=e.clientX;my=e.clientY});
  var secs=document.querySelectorAll("section:not(.hero) .wrap");

  /* reveal on scroll */
  if(G){secs.forEach(function(w){gsap.from(w,{y:60,opacity:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:w,start:"top 88%"}})});
    gsap.from(".tags li",{y:20,opacity:0,stagger:.12,duration:.6,scrollTrigger:{trigger:".tags",start:"top 90%"}})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.15});
    secs.forEach(function(w){w.classList.add("rv");io.observe(w)});
  }

  if(matchMedia("(pointer:fine)").matches){
    /* magnetic buttons */
    document.querySelectorAll(".btn").forEach(function(b){
      b.addEventListener("pointermove",function(e){var r=b.getBoundingClientRect();b.style.transform="translate("+(e.clientX-r.left-r.width/2)*.25+"px,"+(e.clientY-r.top-r.height/2)*.35+"px)"});
      b.addEventListener("pointerleave",function(){b.style.transform=""});
    });
    /* cursor ring that grows over interactive elements */
    if(G){
      root.classList.add("has-cur");
      var qx=gsap.quickTo("#cur","x",{duration:.35,ease:"power3"}),qy=gsap.quickTo("#cur","y",{duration:.35,ease:"power3"});
      addEventListener("pointermove",function(e){qx(e.clientX);qy(e.clientY)});
      document.addEventListener("pointerover",function(e){
        var on=e.target.closest&&e.target.closest("a,button,.node,.tags li,.track span");
        gsap.to("#cur",{scale:on?1.9:1,backgroundColor:on?"rgba(47,91,255,.15)":"rgba(47,91,255,0)",duration:.25});
      });
    }
  }

  /* data-network background */
  var cv=$("bg"),cx=cv.getContext("2d"),W,H,P=[],col="#2f5bff",f=0;
  function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;var n=Math.min(80,Math.round(W*H/18000));P=[];
    for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45})}
  size();addEventListener("resize",size);
  (function draw(){
    if(f++%45===0)col=getComputedStyle(root).getPropertyValue("--blue").trim()||col;
    gx+=(mx-gx)*.08;gy+=(my-gy)*.08;$("glow").style.transform="translate("+(gx-240)+"px,"+(gy-240)+"px)";
    cx.clearRect(0,0,W,H);cx.fillStyle=col;cx.strokeStyle=col;
    P.forEach(function(p,i){
      var dx=p.x-mx,dy=p.y-my,d=Math.sqrt(dx*dx+dy*dy)||1;
      if(d<140){p.x+=dx/d*1.6;p.y+=dy/d*1.6}
      p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      cx.globalAlpha=.5;cx.beginPath();cx.arc(p.x,p.y,2,0,6.3);cx.fill();
      for(var j=i+1;j<P.length;j++){var q=P[j],ax=p.x-q.x,ay=p.y-q.y,dd=ax*ax+ay*ay;
        if(dd<16000){cx.globalAlpha=(1-dd/16000)*.28;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}
    });
    requestAnimationFrame(draw);
  })();
}
