var $=function(id){return document.getElementById(id)};
var root=document.documentElement,reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
var G=!!(window.gsap&&window.ScrollTrigger)&&!reduce;
$("yr").textContent=new Date().getFullYear();

/* nav highlight follows the section in view */
(function(){
  var links=document.querySelectorAll("#nav a"),map={};
  links.forEach(function(a){map[a.getAttribute("href").slice(1)]=a});
  var targets=[[document.querySelector(".hero"),"top"],[$("work"),"top"],[$("about"),"about"],[$("contact"),"contact"]];
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    var key=targets.filter(function(t){return t[0]===e.target})[0][1];
    links.forEach(function(a){a.classList.remove("on")});map[key].classList.add("on");
  })},{rootMargin:"-45% 0px -45% 0px"});
  targets.forEach(function(t){io.observe(t[0])});
})();

if(G){
  gsap.registerPlugin(ScrollTrigger);

  /* page-load sequence */
  var tl=gsap.timeline({defaults:{ease:"power4.out"}});
  tl.from(".pill",{y:-40,opacity:0,duration:.8})
    .from(".ln>span",{yPercent:115,rotate:4,duration:1.1,stagger:.15},"-=.4")
    .from(".sp",{scale:0,rotate:-180,duration:1,ease:"back.out(2)",stagger:.2},"-=.6")
    .from(".tag",{y:20,opacity:0,duration:.8},"-=.7");

  /* cards rise as they enter */
  gsap.utils.toArray(".c").forEach(function(c){
    gsap.from(c,{y:130,opacity:0,duration:1,ease:"power3.out",scrollTrigger:{trigger:c,start:"top 92%"}});
  });
  gsap.from(".about p,.contact h2,.contact .btn",{y:50,opacity:0,duration:.9,stagger:.12,ease:"power3.out",
    scrollTrigger:{trigger:".about",start:"top 80%"}});

  if(matchMedia("(pointer:fine)").matches){
    /* background and sparkles drift with the pointer */
    var mq=[gsap.quickTo("#mesh","x",{duration:1.2}),gsap.quickTo("#mesh","y",{duration:1.2})];
    var s1=[gsap.quickTo(".s1","x",{duration:.8}),gsap.quickTo(".s1","y",{duration:.8})];
    var s2=[gsap.quickTo(".s2","x",{duration:.8}),gsap.quickTo(".s2","y",{duration:.8})];
    var cx=gsap.quickTo("#cur","x",{duration:.35,ease:"power3"}),cy=gsap.quickTo("#cur","y",{duration:.35,ease:"power3"});
    root.classList.add("has-cur");
    addEventListener("pointermove",function(e){
      var nx=e.clientX/innerWidth-.5,ny=e.clientY/innerHeight-.5;
      mq[0](nx*-60);mq[1](ny*-60);
      s1[0](nx*60);s1[1](ny*40);s2[0](nx*-50);s2[1](ny*-35);
      cx(e.clientX);cy(e.clientY);
    });
    document.addEventListener("pointerover",function(e){
      var on=e.target.closest&&e.target.closest("a,.c");
      gsap.to("#cur",{scale:on?1.9:1,backgroundColor:on?"rgba(143,220,192,.18)":"rgba(143,220,192,0)",duration:.25});
    });

    /* 3D tilt on cards */
    document.querySelectorAll(".c").forEach(function(c){
      c.addEventListener("pointermove",function(e){
        var r=c.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
        gsap.to(c,{rotationY:px*10,rotationX:-py*10,y:-8,transformPerspective:900,duration:.4,overwrite:"auto"});
      });
      c.addEventListener("pointerleave",function(){gsap.to(c,{rotationY:0,rotationX:0,y:0,duration:.6,ease:"power3.out",overwrite:"auto"})});
    });

    /* magnetic button */
    var b=document.querySelector(".btn");
    b.addEventListener("pointermove",function(e){var r=b.getBoundingClientRect();
      gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.3,y:(e.clientY-r.top-r.height/2)*.4,duration:.3})});
    b.addEventListener("pointerleave",function(){gsap.to(b,{x:0,y:0,duration:.5,ease:"elastic.out(1,.5)"})});
  }
}
