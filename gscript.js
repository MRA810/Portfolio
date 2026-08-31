
        // Cursor
        const cursor=document.getElementById("cursor"),ring=document.getElementById("cursor-ring");
        let mx=0,my=0,rx=0,ry=0;
        document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;});
        (function animCursor(){rx+=(mx-rx)*.14;ry+=(my-ry)*.14;cursor.style.left=mx+"px";cursor.style.top=my+"px";ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(animCursor);})();
        document.querySelectorAll("a,button,.gallery-item").forEach(el=>{
            el.addEventListener("mouseenter",()=>{cursor.style.width="18px";cursor.style.height="18px";ring.style.borderColor="var(--green-sage)";});
            el.addEventListener("mouseleave",()=>{cursor.style.width="12px";cursor.style.height="12px";ring.style.borderColor="var(--sea-mint)";});
        });

        // Progress bar
        const bar=document.getElementById("progress-bar");
        window.addEventListener("scroll",()=>{bar.style.width=(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100)+"%";});

        // Navbar
        const nav=document.getElementById("navbar");
        window.addEventListener("scroll",()=>nav.classList.toggle("scrolled",window.scrollY>40));

        // Scroll reveal
        const io=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add("visible")),{threshold:.1});
        document.querySelectorAll(".gallery-item").forEach((el,i)=>{el.style.transitionDelay=(i*.09)+"s";io.observe(el);});

        // View toggle
        const grid=document.getElementById("gallery-grid");
        document.getElementById("btn-grid").addEventListener("click",function(){
            grid.classList.remove("list-view"); this.classList.add("active");
            document.getElementById("btn-list").classList.remove("active");
        });
        document.getElementById("btn-list").addEventListener("click",function(){
            grid.classList.add("list-view"); this.classList.add("active");
            document.getElementById("btn-grid").classList.remove("active");
        });

        // Lightbox
        const lightbox=document.getElementById("lightbox");
        document.querySelectorAll(".gallery-item").forEach(item=>{
            item.addEventListener("click",()=>{
                document.getElementById("lb-time").querySelector("span").textContent=item.dataset.time;
                document.getElementById("lb-title").textContent=item.dataset.title;
                document.getElementById("lb-desc").textContent=item.dataset.desc;
                lightbox.classList.add("open");
            });
        });
        document.getElementById("lb-close").addEventListener("click",()=>lightbox.classList.remove("open"));
        document.getElementById("lb-backdrop").addEventListener("click",()=>lightbox.classList.remove("open"));
        document.addEventListener("keydown",e=>e.key==="Escape"&&lightbox.classList.remove("open"));
    