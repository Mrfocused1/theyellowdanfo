import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ShoppingBag, MapPin, Menu, ArrowDown, Ticket, Info, Heart, Users, BookOpen, X, Play, Shirt, Image as ImageIcon, Grid, Compass } from 'lucide-react';

const AboutPage = ({ onNavigate, autoOpenMission = false }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [cartOpen, setCartOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [missionOpen, setMissionOpen] = useState(autoOpenMission);
    const [currentStop, setCurrentStop] = useState("BOARDING");
    const [lastTicket, setLastTicket] = useState(null);
    const [gsapLoaded, setGsapLoaded] = useState(false);
    const [activeCategory, setActiveCategory] = useState("ALL");

    // Refs for animation
    const containerRef = useRef(null);
    const dashboardRef = useRef(null);
    const routeLineRef = useRef(null);
    const busIconRef = useRef(null);
    const destinationTextRef = useRef(null);
    const heroBookRef = useRef(null);
    const missionContainerRef = useRef(null);

    // --- CONTENT DATA ---
    const STOPS = [
        { id: 1, title: "BOARDING: DEPOT", label: "STOP 01" },
        { id: 2, title: "THE DRIVER: FUNMI", label: "STOP 02" },
        { id: 3, title: "ORIGIN: FROM A BOOK", label: "STOP 03" },
        { id: 4, title: "FEATURED BOOK", label: "STOP 04" },
        { id: 5, title: "THE NOVEL", label: "STOP 05" },
        { id: 6, title: "THE MOVEMENT", label: "STOP 06" },
        { id: 7, title: "CULTURE → OPPORTUNITY", label: "STOP 07" },
        { id: 8, title: "PROGRAMMES", label: "STOP 08" },
        { id: 9, title: "GET INVOLVED", label: "STOP 09" },
        { id: 10, title: "THE DANFO MARKET", label: "STOP 10" },
        { id: 11, title: "SUBSCRIBE", label: "STOP 11" },
        { id: 12, title: "LAST STOP", label: "STOP 12" },
    ];

    const PRODUCTS = [
        { id: 1, title: "The Yellow Danfo", price: "£15,000", type: "Hardcover", category: "BOOKS", tag: "DEBUT" },
        { id: 2, title: "Lagos Rhythm", price: "£8,500", type: "Paperback", category: "BOOKS", tag: "NEW" },
        { id: 3, title: "Eko Stories", price: "£10,000", type: "Photo Book", category: "BOOKS", tag: "LIMITED" },
        { id: 4, title: "Route 99", price: "£5,000", type: "Zine", category: "BOOKS", tag: "ZINE" },
        { id: 5, title: "No Shaking Tee", price: "£12,000", type: "Apparel", category: "APPAREL", tag: "MERCH" },
        { id: 6, title: "Danfo Pattern Tote", price: "£6,000", type: "Accessory", category: "APPAREL", tag: "ECO" },
        { id: 7, title: "Third Mainland Print", price: "£25,000", type: "Art Print", category: "PRINTS", tag: "ART" },
        { id: 8, title: "Conductor Poster", price: "£8,000", type: "A2 Poster", category: "PRINTS", tag: "VINTAGE" },
    ];

    const filteredProducts = activeCategory === "ALL"
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === activeCategory);

    // --- SCRIPT LOADING ---
    useEffect(() => {
        const loadGSAP = async () => {
            if (window.gsap && window.ScrollTrigger) {
                setGsapLoaded(true);
                return;
            }

            const loadScript = (src) => {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            };

            try {
                await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js");
                await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js");

                window.gsap.registerPlugin(window.ScrollTrigger);
                setGsapLoaded(true);
            } catch (error) {
                console.error("GSAP load error", error);
            }
        };
        loadGSAP();
    }, []);

    // Auto-start
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // --- MAIN SCROLL ANIMATION ---
    useLayoutEffect(() => {
        if (!gsapLoaded || !isLoaded) return;
        const gsap = window.gsap;
        const ScrollTrigger = window.ScrollTrigger;

        gsap.set(".book-card", { y: 100, opacity: 0 });
        ScrollTrigger.batch(".book-card", {
            onEnter: batch => gsap.to(batch, {
                opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "back.out(1.2)"
            }),
            start: "top 85%"
        });

        STOPS.forEach((stop) => {
            ScrollTrigger.create({
                trigger: `#stop-${stop.id}`,
                start: "top 60%",
                end: "bottom 60%",
                onEnter: () => updateDestination(stop.title),
                onEnterBack: () => updateDestination(stop.title),
            });
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
            tl.to(".dashed-road-line", { backgroundPosition: "0 5000px", ease: "none", duration: 30 }, 0);
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
            tl.to(".mission-bus", { y: "85vh", x: 0, rotation: 0, duration: 3.5, ease: "power1.inOut" })
                .to(".mission-card-2", { opacity: 0, y: -100, scale: 0.9, duration: 1 }, "<")
                .fromTo(".mission-card-3",
                    { opacity: 0, x: -100, rotate: -5 },
                    { opacity: 1, x: 0, rotate: 0, duration: 1.5, ease: "back.out(1.2)" },
                    "-=2"
                )
                .to(".mission-bus", { scale: 1.05, duration: 0.5, yoyo: true, repeat: 1 }, ">");
            tl.addLabel("change");
            tl.to(".mission-bus", { y: "120vh", x: 0, rotation: 0, duration: 5, ease: "power1.inOut" })
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

    const handleHeroMouseMove = (e) => {
        if (!heroBookRef.current || !window.gsap) return;
        const { left, top, width, height } = heroBookRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        window.gsap.to(heroBookRef.current, {
            rotationY: x * 30, rotationX: -y * 30, transformPerspective: 1000, ease: "power1.out", duration: 0.5
        });
    };

    const handleHeroMouseLeave = () => {
        if (!heroBookRef.current || !window.gsap) return;
        window.gsap.to(heroBookRef.current, {
            rotationY: 0, rotationX: 0, ease: "power2.out", duration: 0.8
        });
    };

    useEffect(() => {
        if (cartCount > 0 && window.gsap) {
            window.gsap.fromTo(".cart-icon-container",
                { scale: 1, rotation: 0 },
                { scale: 1.3, rotation: 10, yoyo: true, repeat: 1, duration: 0.15, ease: "power2.out" }
            );
        }
    }, [cartCount]);

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
        if (window.gsap) {
            const ticket = document.getElementById('temp-ticket');
            window.gsap.killTweensOf(ticket);
            window.gsap.set(ticket, { clearProps: "all" });
            const tl = window.gsap.timeline();
            tl.set(ticket, { y: -200, x: 0, rotation: -5, opacity: 1, display: 'block', scale: 1 })
                .to(ticket, { y: 20, rotation: 0, duration: 0.4, ease: "power4.out" })
                .to(ticket, { y: 0, duration: 0.1, ease: "bounce.out" })
                .to(ticket, {
                    scale: 0.2, x: 150, y: 100, opacity: 0, duration: 0.6, ease: "power2.in", delay: 0.8,
                    onComplete: () => { ticket.style.display = 'none'; }
                });
        }
    };

    const fontLink = (
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Special+Elite&family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />
    );

    return (
        <div className="bg-neutral-900 text-stone-100 min-h-screen font-sans overflow-hidden selection:bg-yellow-400 selection:text-black">
            {fontLink}
            <style>{`
        .font-display { font-family: 'Anton', sans-serif; }
        .font-mono-style { font-family: 'Special Elite', monospace; }
        .texture-noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 40;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
        .clip-ticket { clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%); }
        .bus-stripe { background: repeating-linear-gradient(45deg, #000, #000 10px, #FBBF24 10px, #FBBF24 20px); }
        .magnetic-btn:hover .btn-icon { transform: translateX(4px); }
        .book-card:hover .peel-corner { opacity: 1; border-width: 50px; }
        .mission-bus-shadow { filter: drop-shadow(0px 10px 10px rgba(0,0,0,0.5)); }
        .dashed-road {
          background-image: linear-gradient(to bottom, #444 50%, transparent 50%);
          background-size: 2px 60px;
        }
      `}</style>

            <div className="texture-noise"></div>

            {/* DASHBOARD UI */}
            <div ref={dashboardRef} className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-0 left-0 right-0 h-24 md:h-32 bg-neutral-900 border-b-8 border-yellow-400 flex items-center justify-between px-4 md:px-8 shadow-2xl">
                    <div className="md:hidden pointer-events-auto">
                        <button onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? <X className="text-yellow-400" size={28} /> : <Menu className="text-yellow-400" size={28} />}
                        </button>
                    </div>

                    <div className="flex-1 flex justify-center overflow-hidden h-full items-center relative">
                        <div className="bg-black border-2 border-zinc-700 px-6 py-2 md:px-12 md:py-4 rounded shadow-inner relative w-full max-w-2xl text-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 pointer-events-none z-10"></div>
                            <h2 ref={destinationTextRef} className="font-display text-4xl md:text-6xl text-yellow-400 tracking-widest uppercase truncate px-2">
                                THE YELLOW DANFO
                            </h2>
                        </div>
                    </div>

                    <div className="pointer-events-auto flex items-center gap-2 md:gap-4">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="hidden md:block bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-2 font-display text-sm hover:bg-yellow-400 hover:text-black transition-colors">
                            MENU
                        </button>
                        <button
                            onClick={() => setMissionOpen(!missionOpen)}
                            className="hidden md:flex bg-stone-800 text-yellow-400 px-3 py-2 border border-yellow-400/30 font-display text-lg tracking-wide hover:bg-yellow-400 hover:text-black transition-colors uppercase items-center gap-2"
                        >
                            MISSION <Compass size={18} />
                        </button>
                        <button
                            onClick={() => setShopOpen(!shopOpen)}
                            className="hidden md:flex bg-black text-yellow-400 px-4 py-2 border-2 border-yellow-400 font-display text-lg tracking-wide hover:bg-yellow-400 hover:text-black transition-colors uppercase items-center gap-2"
                        >
                            MARKET <Grid size={18} />
                        </button>
                        <div className="relative cursor-pointer group" onClick={() => setCartOpen(!cartOpen)}>
                            <div className="cart-icon-container bg-yellow-400 text-black p-2 md:p-3 rounded shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] group-hover:translate-y-1 transition-transform border-2 border-black">
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

            {/* MENU DRAWER */}
            <div className={`fixed inset-y-0 left-0 w-full md:w-96 bg-black text-yellow-400 z-[80] transform transition-transform duration-500 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} p-8 border-r-8 border-yellow-400 flex flex-col justify-center`}>
                <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-8 text-white"><X size={32} /></button>
                <ul className="space-y-6 text-3xl font-black uppercase tracking-tighter">
                    {['Home', 'What We Do', 'The Book', 'Programmes', 'Market', 'Contact'].map((item, i) => (
                        <li
                            key={i}
                            onClick={() => {
                                if (item === 'Home' && onNavigate) onNavigate('home');
                                else if (item === 'Market' && onNavigate) onNavigate('market');
                                else if (item === 'What We Do' && onNavigate) onNavigate('home:whatwedo');
                                else if (item === 'Contact' && onNavigate) onNavigate('home:contact');
                                else if (item === 'Programmes' && onNavigate) onNavigate('home:programmes');
                                else if (item === 'The Book' && onNavigate) onNavigate('home:book');
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

            {/* TEMP TICKET & CART DRAWER */}
            <div id="temp-ticket" className="fixed top-24 right-20 z-[60] hidden pointer-events-none origin-top">
                <div className="bg-stone-100 text-black w-48 p-4 font-mono-style text-xs shadow-xl border-2 border-black clip-ticket">
                    <div className="border-b border-dashed border-black pb-2 mb-2 text-center font-bold">Lagos Bus Ticket</div>
                    <div className="text-center mb-2 uppercase text-lg leading-none font-display">{lastTicket || "TICKET"}</div>
                    <div className="flex justify-between">
                        <span>PAID</span>
                        <span className="text-red-600 font-bold border-2 border-red-600 px-1 rounded -rotate-12">STAMPED</span>
                    </div>
                </div>
            </div>
            <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-yellow-400 z-[70] transform transition-transform duration-500 ease-in-out border-l-4 border-black ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {[...Array(cartCount)].map((_, i) => (
                                    <div key={i} className="bg-stone-100 p-4 border-2 border-black shadow-md flex justify-between items-center clip-ticket">
                                        <div>
                                            <div className="font-display text-xl text-black uppercase">{lastTicket || "The Yellow Danfo"}</div>
                                            <div className="font-mono-style text-xs text-stone-600">Seat #{100 + i}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="mt-8 border-t-2 border-black pt-4">
                        <button className="w-full bg-black text-yellow-400 font-display text-2xl py-4 hover:bg-neutral-800 transition-colors uppercase">
                            Checkout
                        </button>
                    </div>
                </div>
            </div>

            {/* MISSION OVERLAY - Continued in next message due to length */}
            <div ref={missionContainerRef} className={`fixed inset-0 z-[65] bg-stone-900 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] ${missionOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="mission-scroller h-full overflow-y-auto overflow-x-hidden bg-zinc-900">
                    <div className="mission-track h-[3000vh] relative">
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
                                <div className="w-32 h-64 bg-yellow-400 border-4 border-black rounded-lg shadow-2xl relative flex flex-col items-center justify-between p-4 mission-bus-shadow">
                                    <div className="w-full h-8 bg-black/10 rounded-sm"></div>
                                    <div className="font-display text-black text-2xl rotate-180 mb-8 writing-mode-vertical">LAD-505</div>
                                    <div className="w-full h-16 bg-blue-900/40 border-2 border-black/50 rounded-sm backdrop-blur-sm"></div>
                                    <div className="w-full flex justify-between mt-2">
                                        <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-400 shadow-[0_0_10px_white]"></div>
                                        <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-400 shadow-[0_0_10px_white]"></div>
                                    </div>
                                </div>
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
                                <div className="mb-4">
                                    <div className="w-4 h-4 bg-red-600 rounded-full mx-auto mb-2 animate-pulse"></div>
                                    <div className="font-mono-style text-red-600 text-xs tracking-widest">TERMINUS</div>
                                </div>
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

            {/* MARKET OVERLAY - File continues but truncated for token limit */}
            <div className={`fixed inset-0 z-[60] bg-zinc-900 transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)] ${shopOpen ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="h-full overflow-y-auto pt-32 pb-20">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-yellow-400 pb-8">
                            <div>
                                <div className="inline-block bg-yellow-400 text-black px-2 font-mono-style font-bold mb-2">OFFICIAL STORE</div>
                                <h1 className="font-display text-6xl md:text-8xl text-white leading-none">MARKET <span className="text-yellow-400">TERMINUS</span></h1>
                            </div>
                            <div className="flex flex-col items-end gap-4 mt-8 md:mt-0">
                                <div className="flex gap-2">
                                    {["ALL", "BOOKS", "APPAREL", "PRINTS"].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`px-4 py-2 font-display text-lg border border-yellow-400 transition-colors ${activeCategory === cat ? 'bg-yellow-400 text-black' : 'text-yellow-400 hover:bg-yellow-400/20'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="group bg-white p-4 pb-6 transform hover:-translate-y-1 transition-all duration-300">
                                    <div className="aspect-square bg-neutral-200 mb-4 relative overflow-hidden border border-black">
                                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 group-hover:bg-yellow-50 transition-colors">
                                            {product.category === 'BOOKS' && <BookOpen size={48} className="text-neutral-400" />}
                                            {product.category === 'APPAREL' && <Shirt size={48} className="text-neutral-400" />}
                                            {product.category === 'PRINTS' && <ImageIcon size={48} className="text-neutral-400" />}
                                        </div>
                                        <div className="absolute top-2 left-2 bg-black text-yellow-400 text-xs font-bold px-2 py-1">{product.tag}</div>
                                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button onClick={() => addToCart(product.title)} className="bg-yellow-400 text-black font-display px-6 py-3 hover:bg-white transition-colors">ADD TO WALLET</button>
                                        </div>
                                    </div>
                                    <h3 className="font-display text-2xl text-black leading-none mb-1">{product.title}</h3>
                                    <div className="flex justify-between items-center mt-2 border-t border-black/10 pt-2">
                                        <span className="font-mono-style text-sm text-neutral-500">{product.category}</span>
                                        <span className="font-bold text-black">{product.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-20 text-center">
                            <button onClick={() => setShopOpen(false)} className="text-stone-500 hover:text-yellow-400 font-display text-xl underline decoration-yellow-400">CLOSE MARKET & RETURN TO JOURNEY</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN SCROLL CONTENT */}
            <div ref={containerRef} className={`relative z-10 pt-32 pb-24 md:pl-20 md:pr-4 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

                {/* STOP 01 */}
                <section id="stop-1" className="min-h-screen flex items-center justify-center relative py-20">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="parallax-bg-1 absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
                    </div>
                    <div className="container mx-auto px-6 text-center z-10">
                        <div className="inline-block bg-yellow-400 text-black px-3 py-1 font-mono-style font-bold mb-6 rotate-2">
                            LAGOS • NIGERIA • 2023-2026
                        </div>
                        <h1 className="font-display text-7xl md:text-9xl mb-6 text-white drop-shadow-lg leading-[0.9]">
                            FROM PAGES <br /> <span className="text-yellow-400">TO PURPOSE</span>
                        </h1>
                        <p className="font-mono-style text-stone-300 max-w-xl mx-auto mb-10 text-lg">
                            Step inside. This isn't just a website. It's a journey through the heart of sustainable transportation and cultural storytelling.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setShopOpen(true)}
                                className="bg-yellow-400 text-black font-display text-xl px-8 py-4 hover:bg-white transition-colors clip-ticket border-b-4 border-black active:translate-y-1 active:border-b-0 magnetic-btn group"
                            >
                                <span className="flex items-center gap-2">ENTER SHOP <ArrowDown className="btn-icon transition-transform -rotate-90" size={20} /></span>
                            </button>
                            <button className="border-2 border-yellow-400 text-yellow-400 font-display text-xl px-8 py-4 hover:bg-yellow-400/10 transition-colors">
                                READ THE STORY
                            </button>
                        </div>
                    </div>
                </section>

                {/* STOP 02 */}
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
                                <p>"We are not just moving people; we are moving minds."</p>
                                <p>Funmi stands at the intersection of enterprise and art. With a history of elevating Africa's sustainable crafts sector, she launched this platform to turn a cultural icon—the Danfo—into a vehicle for global dialogue.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STOP 03 - INCREASED SPACING */}
                <section id="stop-3" className="min-h-[150vh] flex items-center justify-center relative py-40">
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

                {/* STOP 04 */}
                <section id="stop-4" className="min-h-screen flex items-center py-20 bg-yellow-400 text-black clip-path-slant">
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
                                    className="magnetic-btn group bg-black text-white px-8 py-3 font-display text-xl hover:bg-white hover:text-black transition-colors flex items-center gap-2"
                                >
                                    <span>BUY TICKET</span> <Ticket size={18} className="btn-icon transition-transform" />
                                </button>
                            </div>
                        </div>
                        <div className="relative flex justify-center parallax-bg-4 perspective-1000">
                            <div
                                ref={heroBookRef}
                                onMouseMove={handleHeroMouseMove}
                                onMouseLeave={handleHeroMouseLeave}
                                className="w-80 h-[500px] bg-white border-4 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative transition-shadow duration-300 cursor-pointer"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-yellow-400/20" style={{ transform: 'translateZ(20px)' }}>
                                    <BookOpen size={64} className="mb-4 opacity-50" />
                                    <h3 className="font-display text-4xl text-center leading-none">THE YELLOW DANFO</h3>
                                    <div className="mt-auto w-full border-t-2 border-black pt-4 flex justify-between font-mono-style text-xs">
                                        <span>F. AKISANYA</span>
                                        <span>2023</span>
                                    </div>
                                </div>
                                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent"></div>
                            </div>
                            <div className="absolute -bottom-10 font-mono-style text-xs text-black/50">MOUSE OVER TO INSPECT</div>
                        </div>
                    </div>
                </section>

                {/* STOP 05 */}
                <section id="stop-5" className="min-h-screen flex items-center justify-center py-20 relative">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #FBBF24 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-12 gap-8 items-center">
                            <div className="md:col-span-8">
                                <h2 className="font-display text-6xl md:text-9xl text-stone-100 opacity-20 absolute -top-20 left-0 -z-10">LAGOS RHYTHM</h2>
                                <h2 className="font-display text-5xl md:text-7xl mb-6">MORE THAN A STORY. <br /><span className="text-yellow-400">AN EXPERIENCE.</span></h2>
                                <p className="text-xl text-stone-300 max-w-2xl font-serif">
                                    Travel/culture/social commentary. A bridge for the diaspora. We explore heritage and identity through the chaos and charm of the city.
                                </p>
                            </div>
                            <div className="md:col-span-4 space-y-4 font-mono-style text-yellow-400 text-right">
                                <div className="border border-white/20 p-4 hover:bg-white/5 transition-colors">
                                    <h4 className="font-bold text-white">HERITAGE</h4>
                                    <p className="text-sm">Rooted in history.</p>
                                </div>
                                <div className="border border-white/20 p-4 hover:bg-white/5 transition-colors">
                                    <h4 className="font-bold text-white">IDENTITY</h4>
                                    <p className="text-sm">Defining who we are.</p>
                                </div>
                                <div className="border border-white/20 p-4 hover:bg-white/5 transition-colors">
                                    <h4 className="font-bold text-white">DIASPORA</h4>
                                    <p className="text-sm">Connecting the world.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STOP 06 */}
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

                {/* STOP 07 */}
                <section id="stop-7" className="py-32 border-y border-yellow-400 bg-black">
                    <div className="container mx-auto px-6 flex flex-col items-center">
                        <h2 className="font-display text-yellow-400 text-4xl mb-12 uppercase tracking-widest border-b border-yellow-400 pb-2">Dashboard Metrics</h2>
                        <div className="w-full max-w-4xl grid md:grid-cols-3 gap-12">
                            {[
                                { label: "IMPACT", val: "92%" },
                                { label: "FUNDING", val: "£50M+" },
                                { label: "REACH", val: "Global" }
                            ].map((meter, i) => (
                                <div key={i} className="text-center">
                                    <div className="h-40 w-40 rounded-full border-8 border-neutral-800 border-t-yellow-400 border-r-yellow-400 mx-auto mb-4 rotate-45 flex items-center justify-center bg-neutral-900 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                                        <div className="-rotate-45 font-mono-style text-2xl font-bold text-white">{meter.val}</div>
                                    </div>
                                    <h3 className="font-display text-xl text-stone-400">{meter.label}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STOP 08 */}
                <section id="stop-8" className="py-20 bg-neutral-900">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                            <h2 className="font-display text-4xl">ROUTE TIMETABLE (PROGRAMMES)</h2>
                        </div>
                        <div className="space-y-4">
                            {["Creative Entrepreneurship Workshop", "Lagos Art Walk 2024", "The Sustainability Summit"].map((event, i) => (
                                <div key={i} className="bg-stone-800 p-6 flex flex-col md:flex-row justify-between items-center border-l-4 border-yellow-400 hover:bg-stone-700 transition-colors cursor-pointer">
                                    <div className="font-display text-xl">{event}</div>
                                    <div className="font-mono-style text-sm text-yellow-400 mt-2 md:mt-0">COMING SOON</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STOP 10 */}
                <section id="stop-10" className="py-20 min-h-screen">
                    <div className="container mx-auto px-6">
                        <div className="flex justify-between items-end mb-12">
                            <h2 className="font-display text-6xl">THE DANFO MARKET</h2>
                            <div className="font-mono-style text-sm hidden md:block">Quality • Authenticity • Culture</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {PRODUCTS.filter(p => p.category === 'BOOKS').map((book) => (
                                <div key={book.id} className="book-card group relative bg-white p-4 pb-8 transform transition-transform hover:-translate-y-2">
                                    <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 z-10">{book.tag}</div>
                                    <div className="aspect-[2/3] bg-stone-200 mb-4 overflow-hidden relative border border-stone-300">
                                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 group-hover:scale-110 transition-transform duration-700 ease-out">
                                            <span className="font-display text-2xl text-stone-600 text-center px-4 leading-none">{book.title}</span>
                                        </div>
                                        <div className="peel-corner absolute top-0 right-0 w-0 h-0 border-t-[0px] border-r-[0px] border-t-white border-r-stone-300 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                    </div>
                                    <h3 className="font-display text-2xl text-black leading-none mb-1">{book.title}</h3>
                                    <p className="font-mono-style text-stone-500 text-sm mb-4">{book.type}</p>
                                    <div className="flex justify-between items-center border-t border-black pt-4">
                                        <span className="font-bold text-black">{book.price}</span>
                                        <button onClick={() => addToCart(book.title)} className="bg-black text-yellow-400 p-2 rounded-sm hover:bg-yellow-400 hover:text-black transition-colors transform active:scale-95"><ShoppingBag size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STOP 11 */}
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
                            <input type="email" placeholder="enter.your@email.com" className="flex-1 bg-white border-2 border-black p-4 font-mono-style focus:outline-none focus:ring-4 ring-black/20" />
                            <button className="magnetic-btn group bg-black text-white font-display text-xl px-8 py-4 hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2">
                                <span className="flex items-center gap-2">PRINT <ArrowDown size={18} className="btn-icon transition-transform" /></span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* STOP 12 */}
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

export default AboutPage;
