import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ShoppingBag, MapPin, Menu, ArrowDown, Ticket, Info, Heart, Users, BookOpen, X, Play, Compass, Mail, FileText, CheckCircle, Scissors, Star, List, PenTool } from 'lucide-react';

// DanfoBus SVG Component (Front View)
const DanfoBus = ({ view = 'front', className, style }) => {
  const THEME = {
    yellow: '#FFC805',
    black: '#0F0F0F',
  };

  return (
    <svg viewBox="0 0 200 240" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="100" cy="230" rx="90" ry="10" fill="black" opacity="0.3" />
      {/* Body */}
      <rect x="20" y="20" width="160" height="200" rx="20" fill={THEME.yellow} stroke={THEME.black} strokeWidth="4" />
      {/* Roof */}
      <path d="M15 20 H185 L190 40 H10 L15 20Z" fill="white" stroke={THEME.black} strokeWidth="3" />
      {/* Windshield */}
      <rect x="30" y="50" width="140" height="70" rx="10" fill="#1a1a1a" stroke={THEME.black} strokeWidth="2" />
      {/* Stripe */}
      <rect x="20" y="130" width="160" height="20" fill={THEME.black} />
      {/* Lights */}
      <circle cx="45" cy="170" r="15" fill="white" stroke={THEME.black} strokeWidth="2" />
      <circle cx="155" cy="170" r="15" fill="white" stroke={THEME.black} strokeWidth="2" />
      {/* Grill */}
      <line x1="70" y1="170" x2="130" y2="170" stroke={THEME.black} strokeWidth="2" />
      <line x1="70" y1="175" x2="130" y2="175" stroke={THEME.black} strokeWidth="2" />
      {/* Plate */}
      <rect x="75" y="200" width="50" height="15" fill="white" stroke={THEME.black} />
      <text x="100" y="211" fontSize="10" textAnchor="middle" fill="black" fontWeight="bold">LAGOS</text>
      {/* Mirrors */}
      <path d="M20 70 L5 60 V90 L20 100" fill={THEME.black} />
      <path d="M180 70 L195 60 V90 L180 100" fill={THEME.black} />
    </svg>
  );
};


const App = ({ onNavigate, initialOverlay, onOverlayOpened, skipLoading, onLoadComplete }) => {
  const [loading, setLoading] = useState(!skipLoading); // Only show loading on initial site visit
  const [isLoaded, setIsLoaded] = useState(true); // Skip preloader, go straight to main
  const [cartCount, setCartCount] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [missionOpen, setMissionOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [workshopOpen, setWorkshopOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("IDLE"); // IDLE, SENDING, SENT

  // Handle initial overlay from navigation
  useEffect(() => {
    if (initialOverlay) {
      if (initialOverlay === 'contact') setContactOpen(true);
      else if (initialOverlay === 'whatwedo') setMissionOpen(true);
      else if (initialOverlay === 'programmes') setWorkshopOpen(true);
      else if (initialOverlay === 'book') setBookOpen(true);
      if (onOverlayOpened) onOverlayOpened();
    }
  }, [initialOverlay, onOverlayOpened]);
  const [currentStop, setCurrentStop] = useState("BOARDING");
  const [lastTicket, setLastTicket] = useState(null);
  const [gsapLoaded, setGsapLoaded] = useState(false);

  // Refs for animation
  const containerRef = useRef(null);
  const dashboardRef = useRef(null);
  const routeLineRef = useRef(null);
  const busIconRef = useRef(null);
  const destinationTextRef = useRef(null);
  const missionContainerRef = useRef(null);
  const contactContainerRef = useRef(null);
  const detailBookRef = useRef(null);

  // --- CONTENT DATA ---
  const STOPS = [
    { id: 1, title: "BOARDING: DEPOT", label: "STOP 01" },
    { id: 2, title: "THE DRIVER: FUNMI", label: "STOP 02" },
    { id: 3, title: "ORIGIN: FROM A BOOK", label: "STOP 03" },
    { id: 4, title: "FEATURED BOOK", label: "STOP 04" },
    { id: 5, title: "INSIDE THE STORY", label: "STOP 05" },
    { id: 6, title: "THE MOVEMENT", label: "STOP 06" },
    { id: 7, title: "CULTURE → OPPORTUNITY", label: "STOP 07" },
    { id: 8, title: "PROGRAMMES", label: "STOP 08" },
    { id: 9, title: "COLLABORATORS", label: "STOP 09" },
    { id: 10, title: "THE DANFO MARKET", label: "STOP 10" },
    { id: 11, title: "SUBSCRIBE", label: "STOP 11" },
    { id: 12, title: "LAST STOP", label: "STOP 12" },
  ];

  const BOOKS = [
    { id: 1, title: "The Yellow Danfo", price: "£15,000", type: "Hardcover", tag: "DEBUT" },
    { id: 2, title: "Lagos Rhythm", price: "£8,500", type: "Paperback", tag: "NEW" },
    { id: 3, title: "Eko Stories", price: "£10,000", type: "Photo Book", tag: "LIMITED" },
    { id: 4, title: "Route 99", price: "£5,000", type: "Zine", tag: "ZINE" },
  ];

  // --- SCRIPT LOADING ---
  useEffect(() => {
    const loadGSAP = async () => {
      if (window.gsap) {
        setGsapLoaded(true);
        return;
      }
      const gsapScript = document.createElement('script');
      gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
      gsapScript.onload = () => {
        const stScript = document.createElement('script');
        stScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js";
        stScript.onload = () => {
          window.gsap.registerPlugin(window.ScrollTrigger);
          setGsapLoaded(true);
        };
        document.body.appendChild(stScript);
      };
      document.body.appendChild(gsapScript);
    };
    loadGSAP();
  }, []);

  // Initial Loading Animation Timer (4 seconds total)
  useEffect(() => {
    if (skipLoading) {
      // Already loaded, notify parent immediately
      if (onLoadComplete) onLoadComplete();
      return;
    }
    const timer = setTimeout(() => {
      setLoading(false);
      if (onLoadComplete) onLoadComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [skipLoading, onLoadComplete]);

  // --- ANIMATION LOGIC ---
  useLayoutEffect(() => {
    if (!gsapLoaded || !isLoaded) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    // 1. Initial Ignition Animation
    const tl = gsap.timeline();
    tl.from(".dashboard-frame", { y: 50, opacity: 0, duration: 0.5 });

    // 2. Route Map Drawing
    gsap.fromTo(routeLineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      }
    );

    // 3. Bus Icon Movement on Route
    gsap.to(busIconRef.current, {
      y: "85vh",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // 4. Section & Destination Board Logic
    STOPS.forEach((stop) => {
      ScrollTrigger.create({
        trigger: `#stop-${stop.id}`,
        start: "top 60%",
        end: "bottom 60%",
        onEnter: () => updateDestination(stop.title),
        onEnterBack: () => updateDestination(stop.title),
      });

      // Parallax for window elements (only if they exist)
      const parallaxElements = document.querySelectorAll(`.parallax-bg-${stop.id}`);
      if (parallaxElements.length > 0) {
        gsap.to(`.parallax-bg-${stop.id}`, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: `#stop-${stop.id}`,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }
    });

    // 5. Scroll Speed Shake (Simulating Bus)
    let scrollTimeout;
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity());
        if (velocity > 100) {
          gsap.to(dashboardRef.current, {
            x: () => Math.random() * 2 - 1,
            y: () => Math.random() * 2 - 1,
            duration: 0.1,
            overwrite: true
          });
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            gsap.to(dashboardRef.current, { x: 0, y: 0, duration: 0.2 });
          }, 100);
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [gsapLoaded, isLoaded]);

  // --- MISSION PAGE ANIMATION ---
  useLayoutEffect(() => {
    if (!gsapLoaded || !missionOpen || !missionContainerRef.current) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const timer = setTimeout(() => {
      const scrollerEl = missionContainerRef.current.querySelector('.mission-scroller');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".mission-track",
          scroller: scrollerEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          snap: {
            snapTo: "labels",
            duration: { min: 0.5, max: 2 },
            delay: 0.1,
            ease: "power2.inOut"
          }
        }
      });

      tl.addLabel("start");
      // Road lines now use CSS infinite animation, no GSAP needed
      tl.to(".mission-bus", { y: "25vh", x: 20, rotation: 1, duration: 2, ease: "power1.inOut" }, 0)
        .fromTo(".mission-card-1",
          { opacity: 0, x: -100, rotate: -5 },
          { opacity: 1, x: 0, rotate: -2, duration: 1.5, ease: "back.out(1.2)" },
          "<+0.5"
        );
      tl.addLabel("stories");
      tl.to(".mission-bus", { y: "55vh", x: -20, rotation: -1, duration: 17.5, ease: "power1.inOut" })
        .to(".mission-card-1", { opacity: 0, y: -100, scale: 0.9, duration: 1 }, "<")
        .fromTo(".mission-card-2",
          { opacity: 0, x: 100, rotate: 5 },
          { opacity: 1, x: 0, rotate: 1, duration: 1.5, ease: "back.out(1.2)" },
          "-=2"
        );
      tl.addLabel("bridges");
      tl.to(".mission-bus", { y: "85vh", x: 60, rotation: 2, duration: 12, ease: "power1.inOut" })
        .to(".mission-card-2", { opacity: 0, y: -100, scale: 0.9, duration: 1 }, "<")
        .fromTo(".mission-card-3",
          { opacity: 0, x: -100, rotate: -5 },
          { opacity: 1, x: 0, rotate: 0, duration: 1.5, ease: "back.out(1.2)" },
          "-=2"
        )
        .to(".mission-bus", { scale: 1.05, duration: 0.5, yoyo: true, repeat: 1 }, ">");
      tl.addLabel("change");
      tl.to(".mission-bus", { y: "120vh", x: 60, rotation: 0, duration: 5, ease: "power1.inOut" })
        .to(".mission-card-3", { opacity: 0, y: -100, scale: 0.9, duration: 1 }, "<")
        .fromTo(".mission-footer",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.5, ease: "back.out(1.2)" },
          "-=1"
        );
      tl.addLabel("footer");

    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().filter(st => st.vars.scroller).forEach(st => st.kill());
    };
  }, [gsapLoaded, missionOpen]);

  // --- CONTACT "CONDUCTOR'S MANIFEST" ANIMATION ---
  useEffect(() => {
    if (!gsapLoaded || !contactOpen || !contactContainerRef.current) return;
    const gsap = window.gsap;

    setFormStatus("IDLE");

    // Bus Panel Slide In
    gsap.fromTo(".danfo-panel",
      { y: 800, rotation: -5, opacity: 0 },
      { y: 0, rotation: -1, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    // Engine Idle Vibration
    gsap.to(".danfo-panel", {
      x: 1, y: 1, rotation: -1.2,
      duration: 0.1, repeat: -1, yoyo: true, ease: "none", delay: 0.8
    });

  }, [gsapLoaded, contactOpen]);

  // --- HELPERS ---
  const updateDestination = (text) => {
    if (!destinationTextRef.current) return;
    if (window.gsap) {
      const tl = window.gsap.timeline();
      tl.to(destinationTextRef.current, { y: -20, opacity: 0, duration: 0.2, ease: "power1.in" })
        .set(destinationTextRef.current, { textContent: text, y: 20 })
        .to(destinationTextRef.current, { y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
    }
    setCurrentStop(text);
  };

  const addToCart = (itemTitle) => {
    setCartCount(prev => prev + 1);
    setLastTicket(itemTitle);

    // Ticket Animation
    if (window.gsap) {
      const ticket = document.getElementById('temp-ticket');
      window.gsap.fromTo(ticket,
        { y: -200, rotation: -10, opacity: 0, display: 'block' },
        {
          y: 0, rotation: 0, opacity: 1, duration: 0.6, ease: "elastic.out(1, 0.5)", onComplete: () => {
            window.gsap.to(ticket, {
              scale: 0.2, x: 200, y: 300, opacity: 0, duration: 0.5, delay: 1,
              onComplete: () => { ticket.style.display = 'none'; }
            });
          }
        }
      );
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormStatus("SENDING");
    if (window.gsap) {
      const tl = window.gsap.timeline();
      // Physical Stamp Animation
      tl.to(".ink-stamp", { scale: 1.5, opacity: 1, duration: 0.2, ease: "power4.in" }) // Stamp hits paper
        .to(".ink-stamp", { scale: 1, rotation: "random(-5, 5)", duration: 0.1, ease: "bounce.out" })
        .add(() => setFormStatus("SENT"));
    }
  };

  // --- STYLES ---
  const fontLink = (
    <link href="https://fonts.googleapis.com/css2?family=Anton&family=Special+Elite&family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
  );

  return (
    <div className="bg-neutral-900 text-stone-100 min-h-screen font-sans overflow-hidden selection:bg-yellow-400 selection:text-black">
      {fontLink}
      <style>{`
        .font-display { font-family: 'Anton', sans-serif; }
        .font-mono-style { font-family: 'Special Elite', monospace; }
        .danfo-yellow { background-color: #FBBF24; color: #171717; }
        .bg-danfo-yellow { background-color: #FBBF24; }
        .text-danfo-yellow { color: #FBBF24; }
        .texture-noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 40;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .clip-ticket { clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%); }
        .stroke-draw { stroke-dasharray: 1000; stroke-dashoffset: 1000; }
        .bus-stripe { background: repeating-linear-gradient(45deg, #000, #000 10px, #FBBF24 10px, #FBBF24 20px); }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .loading-fadeout {
          animation: fadeOut 1s ease-out 3s forwards;
        }
        @keyframes busLaneChange {
          0%, 100% { transform: translateX(-40px); }
          50% { transform: translateX(40px); }
        }
        @keyframes roadLinesApproach {
          from { background-position: 0 0; }
          to { background-position: 0 -80px; }
        }
        .loading-bus {
          animation: busLaneChange 2s ease-in-out infinite;
        }
        .loading-road-lines {
          background-image: linear-gradient(to bottom, white 50%, transparent 50%);
          background-size: 4px 80px;
          animation: roadLinesApproach 0.2s linear infinite;
        }
        .perspective-road {
          perspective: 800px;
          perspective-origin: 50% 30%;
        }
        .road-surface {
          transform: rotateX(70deg);
          transform-origin: 50% 100%;
        }
        .mission-bus-shadow { filter: drop-shadow(0px 10px 10px rgba(0,0,0,0.5)); }
        .dashed-road {
          background-image: linear-gradient(to bottom, #444 50%, transparent 50%);
          background-size: 2px 60px;
        }
        @keyframes roadScroll {
          from { background-position: 0 0; }
          to { background-position: 0 60px; }
        }
        .dashed-road-line {
          animation: roadScroll 0.3s linear infinite;
        }
        /* Manifest Styles */
        .manifest-paper {
          background-image: linear-gradient(#e5e5e5 1px, transparent 1px);
          background-size: 100% 2.5em;
          line-height: 2.5em;
        }
        .tape-corner {
          position: absolute;
          width: 80px;
          height: 30px;
          background-color: rgba(255, 255, 255, 0.4);
          transform: rotate(45deg);
          backdrop-filter: blur(2px);
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .ink-stamp {
          transform: scale(2);
          opacity: 0;
          pointer-events: none;
        }
      `}</style>

      {/* NOISE OVERLAY */}
      <div className="texture-noise"></div>

      {/* --- INITIAL LOADING ANIMATION (DRIVING BUS) --- */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-yellow-400 flex items-center justify-center flex-col loading-fadeout overflow-hidden">
          {/* Perspective Road */}
          <div className="absolute inset-0 perspective-road overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-[500%] road-surface bg-neutral-700">
              {/* Road center line */}
              <div className="loading-road-lines absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3"></div>
              {/* Road edge lines */}
              <div className="absolute top-0 bottom-0 left-[20%] w-2 bg-white"></div>
              <div className="absolute top-0 bottom-0 right-[20%] w-2 bg-white"></div>
            </div>
          </div>

          {/* Bus driving towards viewer */}
          <div className="relative z-10 mt-16">
            <img
              src="https://i.postimg.cc/3xdgQ0wH/danfo-2.png"
              alt="Yellow Danfo Bus"
              className="w-64 h-64 object-contain loading-bus drop-shadow-2xl"
            />
          </div>

          <h1 className="mt-8 text-4xl font-black tracking-tighter uppercase text-black relative z-10 drop-shadow-lg">Boarding...</h1>
          <div className="mt-4 w-48 h-5 bg-white border-4 border-black rounded-sm p-1 relative z-10 shadow-lg">
            <div className="h-full bg-yellow-400 animate-pulse w-full rounded-sm"></div>
          </div>
        </div>
      )}

      {/* --- DASHBOARD UI (FIXED) --- */}
      <div ref={dashboardRef} className={`dashboard-frame fixed inset-0 z-40 pointer-events-none transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

        {/* TOP: Destination Board */}
        <div className="absolute top-0 left-0 right-0 h-24 md:h-32 bg-neutral-900 border-b-8 border-yellow-400 flex items-center justify-between px-4 md:px-8 shadow-2xl">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden pointer-events-auto">
            <Menu className="text-yellow-400" size={28} />
          </div>

          {/* Destination Roller */}
          <div className="flex-1 flex justify-center overflow-hidden h-full items-center relative">
            <div className="bg-black border-2 border-zinc-700 px-6 py-2 md:px-12 md:py-4 rounded shadow-inner relative w-full max-w-2xl text-center">
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none z-10"></div>
              <h2 ref={destinationTextRef} className="font-display text-2xl md:text-4xl text-yellow-400 tracking-wider uppercase whitespace-nowrap">
                THE YELLOW DANFO
              </h2>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="pointer-events-auto flex items-center gap-4">
            {/* Desktop Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="hidden md:block bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-2 font-display text-sm hover:bg-yellow-400 hover:text-black transition-colors">
              MENU
            </button>

            {/* Mobile Menu Button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden bg-yellow-400 border-2 border-black p-2 shadow-[4px_4px_0px_#000] hover:translate-y-1 transition-transform">
              {menuOpen ? <X className="text-black" size={24} /> : <Menu className="text-black" size={24} />}
            </button>

            {/* Cart / Ticket Wallet */}
            <div className="relative cursor-pointer" onClick={() => setCartOpen(!cartOpen)}>
              <div className="bg-yellow-400 text-black p-2 md:p-3 rounded shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-y-1 transition-transform border-2 border-black">
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white font-mono-style text-xs w-6 h-6 flex items-center justify-center rounded-full border border-black">
                    {cartCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LEFT: Route Map (Desktop Only) */}
        <div className="hidden md:block absolute top-32 left-8 bottom-24 w-12 flex flex-col items-center py-8">
          <div className="w-1 h-full bg-zinc-800 relative rounded-full overflow-hidden">
            {/* Dynamic Line */}
            <div ref={routeLineRef} className="w-full bg-yellow-400 h-full absolute top-0 left-0 origin-top"></div>
          </div>
          {/* Bus Icon Marker */}
          <div ref={busIconRef} className="absolute top-0 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
            <div className="w-8 h-12 bg-black border-2 border-yellow-400 rounded-lg flex flex-col items-center justify-center p-1">
              <div className="w-full h-4 bg-yellow-400/20 mb-1 rounded-sm"></div>
              <div className="w-1 h-1 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* RIGHT: Window Frame Detail */}
        <div className="hidden md:block absolute top-32 right-8 bottom-24 w-4 bg-zinc-800/50 rounded-full backdrop-blur-sm border-l border-white/10"></div>

        {/* BOTTOM: Controls / Hint */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-neutral-900 border-t-8 border-yellow-400 flex items-center justify-between px-8 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-2 font-mono-style text-xs text-yellow-400/50">
            <span>BUS ID: LAD-505-XC</span>
          </div>

          <div className="hidden md:flex flex-col items-center animate-bounce">
            <span className="font-display text-yellow-400 tracking-widest text-sm mb-1">SCROLL TO TRAVEL</span>
            <ArrowDown className="text-yellow-400" size={20} />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            <span className="font-mono-style text-green-500 text-xs">ENGINE ACTIVE</span>
          </div>
        </div>
      </div>

      {/* --- TEMP TICKET ANIMATION (Hidden by default) --- */}
      <div id="temp-ticket" className="fixed top-32 right-20 z-[60] hidden pointer-events-none">
        <div className="bg-stone-100 text-black w-48 p-4 font-mono-style text-xs shadow-xl rotate-3 border-2 border-black clip-ticket">
          <div className="border-b border-dashed border-black pb-2 mb-2 text-center font-bold">Lagos Bus Ticket</div>
          <div className="text-center mb-2 uppercase text-lg leading-none font-display">{lastTicket || "TICKET"}</div>
          <div className="flex justify-between">
            <span>PAID</span>
            <span className="text-red-600 font-bold border-2 border-red-600 px-1 rounded -rotate-12">STAMPED</span>
          </div>
        </div>
      </div>

      {/* --- CART DRAWER --- */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-yellow-400 z-50 transform transition-transform duration-500 ease-in-out border-l-4 border-black ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
            <h2 className="font-display text-4xl text-black">YOUR WALLET</h2>
            <button onClick={() => setCartOpen(false)}><X className="text-black" size={32} /></button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cartCount === 0 ? (
              <div className="text-black/50 font-mono-style text-center mt-20">
                <Ticket size={48} className="mx-auto mb-4 opacity-50" />
                <p>No tickets purchased yet.</p>
                <p className="text-sm mt-2">Buy a seat to start.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...Array(cartCount)].map((_, i) => (
                  <div key={i} className="bg-stone-100 p-4 border-2 border-black shadow-md flex justify-between items-center clip-ticket">
                    <div>
                      <div className="font-display text-xl text-black uppercase">{lastTicket || "The Yellow Danfo"}</div>
                      <div className="font-mono-style text-xs text-stone-600">Seat #{100 + i}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                      <span className="text-black font-bold">1</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 border-t-2 border-black pt-4">
            <div className="flex justify-between font-display text-2xl text-black mb-4">
              <span>TOTAL</span>
              <span>£{cartCount * 15000}</span>
            </div>
            <button className="w-full bg-black text-yellow-400 font-display text-2xl py-4 hover:bg-neutral-800 transition-colors uppercase">
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* --- MENU DRAWER --- */}
      <div className={`fixed inset-y-0 left-0 w-full md:w-96 bg-black text-yellow-400 z-[60] transform transition-transform duration-500 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} p-8 border-r-8 border-yellow-400 flex flex-col justify-center`}>
        <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-8 text-white"><X size={32} /></button>
        <ul className="space-y-6 text-3xl font-black uppercase tracking-tighter">
          {['Home', 'What We Do', 'The Book', 'Programmes', 'Market', 'Contact'].map((item, i) => (
            <li
              key={i}
              onClick={() => {
                if (item === 'What We Do') {
                  setMissionOpen(true);
                } else if (item === 'Market' && onNavigate) {
                  onNavigate('market');
                } else if (item === 'Contact') {
                  setContactOpen(true);
                } else if (item === 'Programmes') {
                  setWorkshopOpen(true);
                } else if (item === 'The Book') {
                  setBookOpen(true);
                }
                setMenuOpen(false);
              }}
              className="hover:text-white cursor-pointer border-b border-gray-800 pb-2 flex items-center gap-4 transition-colors"
            >
              <span className="text-sm font-mono text-gray-500">0{i + 1}</span> {item}
            </li>
          ))}
        </ul>
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="font-mono-style text-xs text-gray-500">THE YELLOW DANFO</p>
          <p className="font-mono-style text-xs text-gray-600 mt-2">Lagos • Nigeria</p>
        </div>
      </div>

      {/* --- MISSION OVERLAY --- */}
      <div ref={missionContainerRef} className={`fixed inset-0 z-[70] bg-stone-900 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] ${missionOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}>
        <div className="mission-scroller h-full overflow-y-auto overflow-x-hidden bg-zinc-900">
          <div className="mission-track h-[4000vh] relative">
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-8 right-8 z-50">
                <button onClick={() => setMissionOpen(false)} className="text-stone-500 hover:text-yellow-400 font-display text-xl underline decoration-yellow-400">CLOSE</button>
              </div>

              <div className="absolute top-8 left-8 z-40">
                <div className="inline-block bg-yellow-400 text-black px-2 font-mono-style font-bold mb-2">MANIFESTO</div>
                <h1 className="font-display text-4xl md:text-6xl text-white leading-none">OUR <span className="text-yellow-400">ROUTE</span></h1>
              </div>

              <div className="absolute top-0 bottom-0 w-64 bg-zinc-800 border-x-4 border-dashed border-stone-600">
                <div className="dashed-road-line absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-2 dashed-road"></div>
              </div>

              <div className="mission-bus absolute top-[-20vh] z-30 transform -translate-x-1/2">
                <img
                  src="https://i.postimg.cc/4xZ5Cx9x/danfo-top-down.png"
                  alt="Yellow Danfo Bus"
                  className="w-32 h-auto mission-bus-shadow"
                />
              </div>

              <div className="mission-card-1 absolute left-4 md:left-[10%] lg:left-[20%] max-w-md p-8 bg-stone-100 text-black shadow-[10px_10px_0px_rgba(251,191,36,1)] border-l-8 border-black z-40 opacity-0">
                <div className="text-xs font-mono-style bg-black text-yellow-400 inline-block px-2 mb-2">STOP 01</div>
                <h2 className="font-display text-4xl mb-4">WE MOVE STORIES</h2>
                <p className="font-serif leading-relaxed">We ignite conversations that travel beyond borders. Through immersive author talks and narrative events, we amplify African voices that resonate across generations.</p>
              </div>

              <div className="mission-card-2 absolute right-4 md:right-[10%] lg:right-[20%] max-w-md p-8 bg-yellow-400 text-black shadow-[10px_10px_0px_rgba(0,0,0,1)] border-r-8 border-black z-40 opacity-0">
                <div className="text-xs font-mono-style bg-white text-black inline-block px-2 mb-2">STOP 02</div>
                <h2 className="font-display text-4xl mb-4">WE BUILD BRIDGES</h2>
                <p className="font-serif leading-relaxed">Connecting cultures and creatives. We blend traditional heritage with modern expression, creating platforms where diasporic experiences intersect in global conversations.</p>
              </div>

              <div className="mission-card-3 absolute left-4 md:left-[10%] lg:left-[20%] max-w-md p-8 bg-zinc-800 text-white shadow-[10px_10px_0px_rgba(255,255,255,0.2)] border-t-8 border-yellow-400 z-40 opacity-0">
                <div className="text-xs font-mono-style bg-yellow-400 text-black inline-block px-2 mb-2">STOP 03</div>
                <h2 className="font-display text-4xl mb-4 text-yellow-400">WE CREATE CHANGE</h2>
                <p className="font-serif leading-relaxed">Art is our catalyst. Through workshops and healing experiences, we make space for personal transformation, equipping changemakers to lead with vision.</p>
              </div>

              <div className="mission-footer absolute bottom-20 left-1/2 -translate-x-1/2 text-center z-40 opacity-0">
                <h2 className="font-display text-4xl md:text-6xl text-white mb-4">END OF <span className="text-yellow-400">ROUTE</span></h2>
                <p className="font-mono-style text-stone-400 mb-6">Thank you for riding with us</p>
                <button
                  onClick={() => setMissionOpen(false)}
                  className="bg-yellow-400 text-black font-display text-xl px-8 py-4 hover:bg-white transition-colors"
                >
                  EXIT BUS
                </button>
                <div className="mt-8 font-mono-style text-xs text-stone-600">
                  © 2024 THE YELLOW DANFO. LAGOS.
                </div>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-yellow-400/50 animate-bounce font-mono-style text-xs">
                SCROLL TO DRIVE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- WORKSHOPS OVERLAY (THE ACADEMY) --- */}
      <div className={`fixed inset-0 z-[72] bg-stone-900 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] overflow-y-auto ${workshopOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}>
        <div className="min-h-full pt-8 pb-20">
          <div className="container mx-auto px-6 max-w-6xl">

            {/* Header */}
            <div className="flex justify-between items-start mb-16">
              <div>
                <div className="inline-block bg-yellow-400 text-black px-2 font-mono-style font-bold mb-4 transform -rotate-1">SKILL ACQUISITION</div>
                <h1 className="font-display text-5xl md:text-7xl text-white leading-none">THE DANFO <span className="text-yellow-400">ACADEMY</span></h1>
                <p className="mt-4 text-stone-400 font-serif max-w-lg">Practical, hands-on workshops for parents, professionals, and anyone who wants to confidently care for Afro, curly, and coily hair.</p>
              </div>
              <button onClick={() => setWorkshopOpen(false)} className="text-stone-500 hover:text-yellow-400 font-display text-xl underline decoration-yellow-400">CLOSE</button>
            </div>

            {/* Hero Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-20">
              <div className="bg-yellow-400 p-8 border-4 border-black shadow-[10px_10px_0px_rgba(255,255,255,0.1)] relative overflow-hidden group">
                <Scissors className="absolute -right-4 -bottom-4 text-black/10 transform rotate-45" size={200} />
                <h3 className="font-display text-4xl text-black mb-4 relative z-10">PRACTICAL SKILLS</h3>
                <p className="font-serif text-black/80 relative z-10">From foundational care to artistic mastery. Practice on professional mannequins and gain real-world confidence.</p>
              </div>
              <div className="bg-stone-800 p-8 border-l-8 border-yellow-400 flex flex-col justify-center">
                <h3 className="font-display text-3xl text-white mb-4">"Turn stressful hair time into quality bonding time."</h3>
                <ul className="space-y-2 font-mono-style text-sm text-stone-400">
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-yellow-400" /> All products & tools provided</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-yellow-400" /> Take-home care kit</li>
                  <li className="flex items-center gap-2"><CheckCircle size={14} className="text-yellow-400" /> 2 weeks of follow-up support</li>
                </ul>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid md:grid-cols-12 gap-12 mb-20">
              {/* Left: Overview */}
              <div className="md:col-span-5">
                <h3 className="font-display text-3xl text-white mb-8 border-b border-stone-700 pb-2">WORKSHOP OVERVIEW</h3>
                <div className="space-y-6">
                  {[
                    "Learn to identify hair textures and types",
                    "Gain foundational knowledge of natural hair care, braiding, and canerow/cornrow hairstyles",
                    "Develop creative hair styling skills using safe, eco-friendly hair products",
                    "Understand tools, techniques, and hygiene practices for working with natural hair and extensions",
                    "Build confidence, self-esteem, and community connections through inclusive learning"
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 group">
                      <span className="font-display text-yellow-400 text-xl">0{i + 1}</span>
                      <p className="text-stone-300 font-serif group-hover:text-white transition-colors">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Detailed Content */}
              <div className="md:col-span-7 bg-stone-100 text-black p-8 shadow-xl md:transform md:rotate-1 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-400/50 backdrop-blur-sm -mt-4 transform -rotate-1"></div>
                <h3 className="font-display text-3xl mb-6 text-center">CURRICULUM</h3>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold font-mono-style mb-4 border-b-2 border-black pb-1">NATURAL HAIR CARE</h4>
                    <ul className="space-y-2 text-sm list-disc pl-4 font-serif">
                      <li>Introduction to braiding techniques</li>
                      <li>Advanced braiding and styling designs</li>
                      <li>Using eco-friendly products and tools</li>
                      <li>Safe & hygienic extension application</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold font-mono-style mb-4 border-b-2 border-black pb-1">SKILL DEVELOPMENT</h4>
                    <ul className="space-y-2 text-sm list-disc pl-4 font-serif">
                      <li>Hands-on mannequin & model practice</li>
                      <li>Understanding hair health principles</li>
                      <li>Creative styling for personal/pro use</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="grid md:grid-cols-2 gap-8 border-t border-stone-800 pt-12">
              <div>
                <h3 className="font-display text-2xl text-white mb-4">WHO SHOULD ATTEND?</h3>
                <ul className="space-y-3 text-stone-400 text-sm font-mono-style">
                  <li className="flex gap-3"><span className="text-yellow-400">→</span> Beginners & intermediates interested in eco-friendly practices</li>
                  <li className="flex gap-3"><span className="text-yellow-400">→</span> Hairdressing students expanding technical skills</li>
                  <li className="flex gap-3"><span className="text-yellow-400">→</span> Parents & guardians wanting practical guidance</li>
                  <li className="flex gap-3"><span className="text-yellow-400">→</span> Enthusiasts eager to learn modest & fashionable styles</li>
                </ul>
              </div>

              <div className="bg-zinc-800 p-6 flex items-center gap-6 border border-stone-700">
                <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users size={32} className="text-black" />
                </div>
                <div>
                  <div className="font-mono-style text-xs text-yellow-400 mb-1">WORKSHOP INSTRUCTOR</div>
                  <h4 className="font-display text-2xl text-white">EXPERIENCED, QUALIFIED & CERTIFIED</h4>
                  <p className="text-stone-500 text-sm mt-1">Guiding you from basics to mastery.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- "THE BOOK" (MANIFESTO) OVERLAY --- */}
      <div className={`fixed inset-0 z-[73] bg-stone-900 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] overflow-y-auto ${bookOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}>
        <div className="min-h-full pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-6xl">

            {/* Header */}
            <div className="flex justify-between items-start mb-16">
              <div>
                <div className="inline-block bg-yellow-400 text-black px-2 font-mono-style font-bold mb-4 transform -rotate-1">VEHICLE PARTICULARS</div>
                <h1 className="font-display text-5xl md:text-7xl text-white leading-none">THE <span className="text-yellow-400">MANIFESTO</span></h1>
              </div>
              <button onClick={() => setBookOpen(false)} className="text-stone-500 hover:text-yellow-400 font-display text-xl underline decoration-yellow-400">CLOSE</button>
            </div>

            {/* Top Section: Book & Synopsis */}
            <div className="grid md:grid-cols-2 gap-16 items-center mb-24">

              {/* Left: 3D Book */}
              <div className="relative flex justify-center" style={{ perspective: '1000px' }}>
                <div
                  ref={detailBookRef}
                  className="w-80 h-[500px] bg-white border-4 border-black shadow-[20px_20px_0px_0px_rgba(251,191,36,0.3)] relative transition-shadow duration-300 cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-yellow-400/20" style={{ transform: 'translateZ(20px)' }}>
                    <BookOpen size={64} className="mb-4 opacity-50"/>
                    <h3 className="font-display text-4xl text-center leading-none">THE YELLOW DANFO</h3>
                    <div className="mt-auto w-full border-t-2 border-black pt-4 flex justify-between font-mono-style text-xs">
                      <span>F. AKISANYA</span>
                      <span>2023</span>
                    </div>
                  </div>
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent"></div>
                </div>
              </div>

              {/* Right: Synopsis */}
              <div>
                <h2 className="font-display text-3xl text-yellow-400 mb-6">AT THE FRONTIER OF SUSTAINABLE TRANSPORTATION</h2>
                <div className="prose prose-invert prose-lg text-stone-300 font-serif leading-relaxed">
                  <p className="mb-6">
                    More than just a transit system, the Danfo is the heartbeat of Lagos. This book is a cultural blueprint, a moving manifesto, and a love letter to the resilience of a city that never stops.
                  </p>
                  <p className="mb-6">
                    Funmi Akisanya explores how these yellow buses weave through the chaos to create order, fueling the economic engine of Nigeria while defining its visual identity. It delves into the potential for sustainable evolution without losing the soul of the streets.
                  </p>
                  <ul className="space-y-2 font-mono-style text-sm text-yellow-400 mt-8">
                    <li className="flex gap-2">★ Hardcover: 240 Pages</li>
                    <li className="flex gap-2">★ Full-Color Photography</li>
                    <li className="flex gap-2">★ Essays & Interviews</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Purchase Section: Ticket Counters */}
            <div className="bg-stone-100 text-black p-12 border-8 border-black relative overflow-hidden mb-24">
              <div className="absolute top-0 right-0 p-4 font-mono-style text-xs font-bold opacity-50">ISSUED AT LAGOS HQ</div>

              <h3 className="font-display text-4xl mb-12 text-center border-b-2 border-black pb-4 inline-block mx-auto">GET YOUR TICKET (BUY COPY)</h3>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Option 1: Direct */}
                <div className="text-center group cursor-pointer" onClick={() => addToCart("The Yellow Danfo")}>
                  <div className="w-20 h-20 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <ShoppingBag size={32}/>
                  </div>
                  <h4 className="font-display text-2xl">OFFICIAL SHOP</h4>
                  <p className="font-mono-style text-xs text-stone-500 mb-4">Direct from Author</p>
                  <span className="bg-black text-white px-4 py-2 font-bold hover:bg-yellow-400 hover:text-black transition-colors inline-block">ADD TO CART</span>
                </div>

                {/* Option 2: Local */}
                <div className="text-center group">
                  <div className="w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <MapPin size={32}/>
                  </div>
                  <h4 className="font-display text-2xl">LAGOS STORES</h4>
                  <p className="font-mono-style text-xs text-stone-500 mb-4">Rovingheights / Jazzhole</p>
                  <span className="border-2 border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition-colors inline-block">VIEW LIST</span>
                </div>

                {/* Option 3: Global */}
                <div className="text-center group">
                  <div className="w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Compass size={32}/>
                  </div>
                  <h4 className="font-display text-2xl">INTERNATIONAL</h4>
                  <p className="font-mono-style text-xs text-stone-500 mb-4">Amazon / Waterstones</p>
                  <span className="border-2 border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition-colors inline-block">ORDER ONLINE</span>
                </div>
              </div>
            </div>

            {/* SECTION: INSIDE THE ENGINE (Chapters) */}
            <div className="mb-24">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-yellow-400 p-2 border-2 border-black">
                  <List size={24} className="text-black"/>
                </div>
                <h3 className="font-display text-3xl text-white">INSIDE THE ENGINE</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { num: "01", title: "THE YELLOW VEINS", desc: "Mapping the chaotic yet rhythmic arteries of Lagos transportation." },
                  { num: "02", title: "CONDUCTOR'S CALL", desc: "The language, the hustle, and the unwritten rules of the road." },
                  { num: "03", title: "WHEELS OF CHANGE", desc: "Sustainability meets tradition: The future of African mobility." },
                  { num: "04", title: "FACES IN THE WINDOW", desc: "Portraits of the millions who move the city every day." }
                ].map((chap) => (
                  <div key={chap.num} className="bg-zinc-800 border-l-4 border-yellow-400 p-6 hover:bg-zinc-700 transition-colors">
                    <div className="font-mono-style text-yellow-400 text-sm mb-2">CHAPTER {chap.num}</div>
                    <h4 className="font-display text-xl text-white mb-2">{chap.title}</h4>
                    <p className="font-serif text-stone-400 text-sm">{chap.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION: PASSENGER REVIEWS */}
            <div className="mb-24 relative">
              <h3 className="font-display text-3xl text-white mb-8 text-right">PASSENGER REVIEWS</h3>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="bg-white text-black p-6 shadow-[8px_8px_0px_#FBBF24] transform -rotate-1 relative flex-1">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border border-black shadow-sm"></div>
                  <div className="flex gap-1 text-yellow-500 mb-4"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
                  <p className="font-serif italic mb-4">"A masterclass in storytelling. Funmi captures the smell of fuel and the sound of the streets perfectly."</p>
                  <p className="font-mono-style text-xs font-bold">— Tunde A., Urban Planner</p>
                </div>
                <div className="bg-white text-black p-6 shadow-[8px_8px_0px_#FBBF24] transform rotate-2 relative mt-8 md:mt-0 flex-1">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full border border-black shadow-sm"></div>
                  <div className="flex gap-1 text-yellow-500 mb-4"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
                  <p className="font-serif italic mb-4">"Finally, a book that treats the Danfo not just as a bus, but as a cultural icon. Essential reading."</p>
                  <p className="font-mono-style text-xs font-bold">— The Lagos Review</p>
                </div>
              </div>
            </div>

            {/* SECTION: THE DRIVER'S NOTE */}
            <div className="bg-yellow-400 p-8 border-4 border-black relative">
              <div className="absolute top-4 right-4"><PenTool size={32} className="opacity-20"/></div>
              <h3 className="font-display text-3xl text-black mb-6">FROM THE DRIVER'S LOG</h3>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-32 h-32 bg-black grayscale border-4 border-white shadow-lg flex-shrink-0 flex items-center justify-center">
                  <Users className="text-stone-500 w-16 h-16"/>
                </div>
                <div>
                  <p className="font-serif text-black leading-relaxed mb-4 text-lg italic">
                    "I wrote this because the story of Lagos cannot be told without its wheels. Every dent on a Danfo tells a story of survival. This book is my attempt to document that resilience before the landscape changes forever."
                  </p>
                  <p className="font-mono-style text-sm font-bold">— Funmi Akisanya</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- CONTACT "CONDUCTOR'S MANIFEST" OVERLAY --- */}
      <div
        ref={contactContainerRef}
        className={`fixed inset-0 z-[75] bg-black/90 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)] overflow-y-auto ${contactOpen ? 'translate-y-0' : '-translate-y-full pointer-events-none'}`}
      >
        <div className="min-h-full flex items-center justify-center p-4 py-8">
          {/* Danfo Panel Background */}
          <div className="danfo-panel relative w-full max-w-4xl bg-yellow-400 p-2 md:p-4 rounded-xl shadow-2xl overflow-hidden border-8 border-black">

            {/* Decor: Black Stripes - hidden on mobile */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-12 bg-black"></div>
            <div className="hidden md:block absolute bottom-12 left-0 right-0 h-12 bg-black"></div>

            {/* Inner Content Area */}
            <div className="relative z-10 flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-8 p-4 md:p-8">

              {/* Close Button */}
              <div className="absolute top-2 right-2 md:top-4 md:right-4 z-50">
                <button onClick={() => setContactOpen(false)} className="bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black p-2 rounded-full transition-colors border-2 border-black">
                  <X size={24} />
                </button>
              </div>

              {/* Left Info Panel */}
              <div className="md:col-span-4 flex flex-col text-black bg-white/20 p-4 md:p-6 backdrop-blur-sm border-2 border-black rounded shadow-lg md:transform md:-rotate-1">
              <div>
                <h2 className="font-display text-4xl mb-2 leading-none">LAGOS <br /> DISPATCH</h2>
                <div className="h-1 w-20 bg-black mb-4"></div>
                <p className="font-mono-style text-xs font-bold mb-6">ROUTE: LAGOS ↔ LONDON</p>

                <div className="space-y-4 font-mono-style text-sm">
                  <p className="flex items-center gap-2"><MapPin size={16} /> 124 Mainland Bridge</p>
                  <p className="flex items-center gap-2"><Mail size={16} /> hello@yellowdanfo.com</p>
                </div>
              </div>
              <div className="mt-4 md:mt-8 border-t-2 border-black pt-4 text-xs font-bold">
                <p>DRIVER ID: #LAD-505</p>
                <p>STATUS: ON DUTY</p>
              </div>
            </div>

            {/* Right: The Manifest (Form) */}
            <div className="md:col-span-8 relative">
              {/* Paper Effect */}
              <div className="bg-stone-100 p-4 md:p-8 shadow-2xl relative manifest-paper md:transform md:rotate-1 border border-stone-300">

                {/* Tapes */}
                <div className="tape-corner -top-3 -left-3"></div>
                <div className="tape-corner -top-3 -right-3 transform -rotate-45"></div>
                <div className="tape-corner -bottom-3 -left-3 transform -rotate-45"></div>
                <div className="tape-corner -bottom-3 -right-3"></div>

                {/* Stamp Animation Layer */}
                <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                  <div className={`ink-stamp border-4 border-red-600 text-red-600 font-display text-6xl md:text-8xl p-4 -rotate-12 bg-stone-100/90 mix-blend-multiply ${formStatus === 'SENT' ? 'opacity-100' : 'opacity-0'}`}>
                    CLEARED
                  </div>
                </div>

                <div className="mb-6 border-b-2 border-black pb-2">
                  <h3 className="font-mono-style text-lg font-bold">PASSENGER MANIFEST</h3>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className="font-mono-style text-xs font-bold text-stone-500">FULL NAME</label>
                    <input type="text" className="w-full bg-transparent border-b-2 border-stone-300 focus:border-black outline-none font-mono-style text-lg py-1 transition-colors text-black" placeholder="Write Name Here" required disabled={formStatus === 'SENT'} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono-style text-xs font-bold text-stone-500">CONTACT FREQUENCY (EMAIL)</label>
                    <input type="email" className="w-full bg-transparent border-b-2 border-stone-300 focus:border-black outline-none font-mono-style text-lg py-1 transition-colors text-black" placeholder="email@address.com" required disabled={formStatus === 'SENT'} />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono-style text-xs font-bold text-stone-500">MESSAGE LOG</label>
                    <textarea rows="3" className="w-full bg-transparent border-b-2 border-stone-300 focus:border-black outline-none font-mono-style text-lg py-1 transition-colors resize-none leading-8 text-black" placeholder="Enter message details..." required disabled={formStatus === 'SENT'}></textarea>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={formStatus !== 'IDLE'}
                      className="bg-black text-white font-display text-xl px-8 py-3 hover:bg-stone-800 transition-colors flex items-center gap-2 clip-ticket"
                    >
                      {formStatus === 'IDLE' ? 'HAND TO CONDUCTOR' : (formStatus === 'SENDING' ? 'PROCESSING...' : 'LOGGED')}
                      {formStatus === 'SENT' && <CheckCircle size={18} className="text-green-400" />}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
        </div>
      </div>

      {/* --- MAIN SCROLL CONTENT (WINDOW) --- */}
      <div ref={containerRef} className={`stop-content relative z-10 pt-32 pb-24 md:pl-20 md:pr-4 ${isLoaded ? 'block' : 'hidden'}`}>

        {/* STOP 01: DEPOT */}
        <section id="stop-1" className="min-h-screen flex items-center justify-center relative py-20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="parallax-bg-1 absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-6 text-center z-10">
            <div className="inline-block bg-yellow-400 text-black px-3 py-1 font-mono-style font-bold mb-6 rotate-2">
              LAGOS • NIGERIA • 2023-2026
            </div>
            <h1 className="font-display text-7xl md:text-9xl mb-6 text-white drop-shadow-lg leading-[0.9]">
              THE <span className="text-yellow-400">YELLOW</span><br /> DANFO
            </h1>
            <p className="font-mono-style text-stone-300 max-w-xl mx-auto mb-10 text-lg">
              Step inside. This isn't just a website. It's a journey through the heart of sustainable transportation and cultural storytelling.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate && onNavigate('market')}
                className="bg-yellow-400 text-black font-display text-xl px-8 py-4 hover:bg-white transition-colors clip-ticket border-b-4 border-black active:translate-y-1 active:border-b-0"
              >
                ENTER SHOP
              </button>
              <button className="border-2 border-yellow-400 text-yellow-400 font-display text-xl px-8 py-4 hover:bg-yellow-400/10 transition-colors">
                READ THE STORY
              </button>
            </div>
          </div>
        </section>

        {/* STOP 02: THE DRIVER */}
        <section id="stop-2" className="min-h-screen flex items-center relative py-20 bg-neutral-900/50 border-y border-white/5">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="parallax-bg-2 absolute -inset-4 bg-yellow-400 rotate-2 rounded shadow-lg opacity-20"></div>
              <div className="relative bg-stone-100 p-2 rotate-1 shadow-2xl max-w-md mx-auto">
                <div className="aspect-[3/4] bg-neutral-800 relative overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-500">
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                    <Users size={64} className="text-zinc-600" />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-red-600 text-white px-2 font-display text-lg">FOUNDER</div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-3xl text-black uppercase">Funmi Akisanya</h3>
                  <p className="font-mono-style text-xs text-stone-600 mt-2 border-t border-black pt-2">
                    Award-winning enterprise coach. Pioneer in sustainable arts. Bridging storytelling and cultural identity.
                  </p>
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-400/80 -rotate-2 opacity-80 backdrop-blur-sm"></div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="font-mono-style text-yellow-400 mb-4">STOP 02 — THE CONDUCTOR</div>
              <h2 className="font-display text-5xl md:text-7xl mb-6">THE DRIVER'S <br /> SEAT</h2>
              <div className="prose prose-invert prose-lg font-serif opacity-80">
                <p>
                  "We are not just moving people; we are moving minds."
                </p>
                <p>
                  Funmi stands at the intersection of enterprise and art. With a history of elevating Africa's sustainable crafts sector, she launched this platform to turn a cultural icon—the Danfo—into a vehicle for global dialogue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* STOP 03: ORIGIN */}
        <section id="stop-3" className="min-h-[80vh] flex items-center justify-center relative py-20">
          <div className="container mx-auto px-6 text-center max-w-4xl">
            <div className="parallax-bg-3 inline-block">
              <div className="bus-stripe h-4 w-full mb-8"></div>
              <p className="font-serif italic text-2xl md:text-4xl leading-relaxed text-stone-200">
                "Our journey began with a book — <span className="text-yellow-400 not-italic font-bold">The Yellow Danfo: At the Frontier of Sustainable Transportation</span> (October 2023). What started as a cultural blueprint and a moving manifesto has evolved…"
              </p>
              <div className="bus-stripe h-4 w-full mt-8"></div>
            </div>
          </div>
        </section>

        {/* STOP 04: FEATURED BOOK */}
        <section id="stop-4" className="min-h-screen flex items-center py-20 bg-yellow-400 text-black">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="bg-black text-white px-3 py-1 font-mono-style text-sm mb-4 inline-block">BEST SELLER</span>
              <h2 className="font-display text-6xl md:text-8xl mb-4 leading-none">THE YELLOW <br /> DANFO</h2>
              <div className="text-xl font-bold mb-6 font-mono-style">HARDCOVER • 1ST EDITION</div>
              <p className="text-lg mb-8 max-w-md font-serif leading-relaxed">
                The debut book that started the movement. An exploration of Lagos through the lens of its most iconic transport system.
              </p>
              <div className="flex items-center gap-6">
                <div className="font-display text-4xl">£15,000</div>
                <button
                  onClick={() => addToCart("The Yellow Danfo")}
                  className="bg-black text-white px-8 py-3 font-display text-xl hover:bg-white hover:text-black transition-colors flex items-center gap-2"
                >
                  BUY TICKET <Ticket size={18} />
                </button>
              </div>
            </div>
            <div className="relative flex justify-center parallax-bg-4">
              <div className="w-80 h-[500px] bg-white border-4 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-yellow-400/20">
                  <BookOpen size={64} className="mb-4 opacity-50" />
                  <h3 className="font-display text-4xl text-center leading-none">THE YELLOW DANFO</h3>
                  <div className="mt-auto w-full border-t-2 border-black pt-4 flex justify-between font-mono-style text-xs">
                    <span>F. AKISANYA</span>
                    <span>2023</span>
                  </div>
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* STOP 05: INSIDE THE STORY (FROM ORIGINAL) */}
        <section id="stop-5" className="py-32 relative overflow-hidden bg-gray-900">
          <div className="container mx-auto px-4 relative z-10 text-center text-white">
            <div className="mb-8 border-l-8 border-yellow-400 pl-6 relative inline-block text-left">
              <div className="absolute -left-[30px] top-0 bg-yellow-400 border-2 border-black w-10 h-10 flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_#000] text-black">
                05
              </div>
              <h4 className="font-mono text-sm tracking-widest text-gray-400 uppercase mb-2">An Excerpt</h4>
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter">
                Inside The Story
              </h2>
            </div>

            <div className="relative max-w-4xl mx-auto mt-12">
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((win) => (
                  <div key={win} className="h-64 bg-gray-800 rounded-lg border-4 border-black overflow-hidden relative group">
                    <div className="absolute top-0 w-full h-8 bg-black/50 z-20"></div>
                    <div className="absolute inset-0 bg-yellow-400 flex items-center justify-center overflow-hidden">
                      <div className="text-[10rem] font-black opacity-10 select-none whitespace-nowrap animate-marquee text-black">
                        LAGOS NEVER SLEEPS
                      </div>
                      <p className="absolute p-6 text-black font-serif font-bold text-lg z-10 bg-white/90 m-4 shadow-lg transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        "The engine coughed, a guttural sound that vibrated through the soles of my feet..."
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-gray-400 font-mono">Hover windows to read</div>
            </div>
          </div>
        </section>

        {/* STOP 06: THE MOVEMENT */}
        <section id="stop-6" className="min-h-screen py-20">
          <div className="container mx-auto px-6">
            <h2 className="font-display text-5xl mb-12 text-center">PASSENGER MANIFEST</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Storytellers", "Strategists", "Changemakers"].map((role, i) => (
                <div key={i} className={`bg-neutral-800 border border-yellow-400/30 p-8 hover:bg-yellow-400 hover:text-black transition-all group parallax-bg-6`}>
                  <div className="w-12 h-12 bg-stone-700 group-hover:bg-black rounded-full mb-6 flex items-center justify-center transition-colors">
                    <span className="font-display text-xl text-white">{i + 1}</span>
                  </div>
                  <h3 className="font-display text-3xl mb-2">{role}</h3>
                  <p className="font-mono-style text-sm opacity-70 group-hover:opacity-100">
                    Artists, educators, and advocates joining forces to amplify African voices globally.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STOP 07: Placeholder for scroll continuity */}
        <section id="stop-7" className="hidden"></section>

        {/* STOP 08: PROGRAMMES (FROM ORIGINAL) */}
        <section id="stop-8" className="py-12 bg-yellow-400 border-t-4 border-b-4 border-black overflow-hidden">
          <div className="container mx-auto px-4 mb-8">
            <h2 className="text-4xl font-black uppercase text-black">Stop 08: Programmes</h2>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 px-4 md:px-20 pb-12 hide-scrollbar">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="snap-center shrink-0 w-[85vw] md:w-[400px] bg-white border-4 border-black shadow-[10px_10px_0px_#000] p-8 flex flex-col h-[500px]">
                <div className="flex-1 bg-gray-100 mb-6 border border-black flex items-center justify-center overflow-hidden relative">
                  <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-200 to-yellow-500 opacity-50"></div>
                  <span className="absolute font-black text-6xl opacity-20 text-black">EVENT</span>
                </div>
                <h3 className="text-3xl font-black uppercase mb-2 leading-none text-black">Programme <br />Title 0{item}</h3>
                <p className="font-serif mb-4 text-black">Empowering the next generation of creatives through sustainable workshops.</p>
                <button className="self-start underline font-bold uppercase hover:bg-black hover:text-white px-2 text-black">Read Details</button>
              </div>
            ))}
            <div className="w-12 shrink-0"></div>
          </div>
        </section>

        {/* STOP 09: COLLABORATORS (FROM ORIGINAL) */}
        <section id="stop-9" className="py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-8 border-l-8 border-black pl-6 relative inline-block text-left">
              <div className="absolute -left-[30px] top-0 bg-yellow-400 border-2 border-black w-10 h-10 flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_#000]">
                09
              </div>
              <h4 className="font-mono text-sm tracking-widest text-gray-400 uppercase mb-2">Global Network</h4>
              <h2 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter text-black">
                Collaborators
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 mt-12">
              {['British Council', 'Lagos State', 'Arts Guild', 'Tech Next'].map((brand, i) => (
                <div key={i} className="text-2xl font-black uppercase border-2 border-black p-4 rotate-[-2deg] hover:rotate-0 hover:bg-yellow-400 transition-all text-black">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STOP 10: SHOP */}
        <section id="stop-10" className="py-20 min-h-screen bg-neutral-900">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <h2 className="font-display text-6xl">THE DANFO MARKET</h2>
              <div className="font-mono-style text-sm hidden md:block">Quality • Authenticity • Culture</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {BOOKS.map((book) => (
                <div key={book.id} className="group relative bg-white p-4 pb-8 transform transition-transform hover:-translate-y-2">
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 z-10">{book.tag}</div>

                  <div className="aspect-[2/3] bg-stone-200 mb-4 overflow-hidden relative border border-stone-300">
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 group-hover:scale-105 transition-transform duration-500">
                      <span className="font-display text-2xl text-stone-600 text-center px-4 leading-none">{book.title}</span>
                    </div>
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-white border-r-stone-300 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  <h3 className="font-display text-2xl text-black leading-none mb-1">{book.title}</h3>
                  <p className="font-mono-style text-stone-500 text-sm mb-4">{book.type}</p>

                  <div className="flex justify-between items-center border-t border-black pt-4">
                    <span className="font-bold text-black">{book.price}</span>
                    <button
                      onClick={() => addToCart(book.title)}
                      className="bg-black text-yellow-400 p-2 rounded-sm hover:bg-yellow-400 hover:text-black transition-colors"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STOP 11: SUBSCRIBE */}
        <section id="stop-11" className="py-20 flex justify-center">
          <div className="bg-yellow-400 w-full max-w-2xl p-8 md:p-12 text-black clip-ticket border-4 border-black text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-yellow-400 px-4 py-1 font-mono-style text-sm transform -rotate-2">
              NO SHAKING. STAY UPDATED.
            </div>
            <h2 className="font-display text-5xl mb-6">GET YOUR TICKET</h2>
            <p className="font-serif text-lg mb-8">
              Join the movement. Subscribe for updates on book launches, programmes, and cultural stops.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="enter.your@email.com"
                className="flex-1 bg-white border-2 border-black p-4 font-mono-style focus:outline-none focus:ring-4 ring-black/20"
              />
              <button className="bg-black text-white font-display text-xl px-8 py-4 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                PRINT <ArrowDown size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* STOP 12: LAST STOP */}
        <section id="stop-12" className="min-h-[70vh] flex flex-col justify-center items-center text-center pb-32">
          <div className="mb-8 animate-pulse">
            <div className="w-4 h-4 bg-red-600 rounded-full mx-auto mb-2"></div>
            <div className="font-mono-style text-red-600 text-xs tracking-widest">TERMINUS</div>
          </div>
          <h1 className="font-display text-6xl md:text-8xl mb-8">CULTURAL <br /><span className="text-yellow-400">RENAISSANCE</span></h1>
          <div className="flex gap-6">
            <button className="text-white hover:text-yellow-400 font-display text-2xl border-b-2 border-white hover:border-yellow-400 transition-all">
              JOIN THE MOVEMENT
            </button>
          </div>

          <footer className="mt-20 font-mono-style text-xs text-stone-600">
            © 2024 THE YELLOW DANFO. LAGOS. <br />
            BUILT FOR FUNMI AKISANYA.
          </footer>
        </section>

      </div>
    </div>
  );
};

export default App;
