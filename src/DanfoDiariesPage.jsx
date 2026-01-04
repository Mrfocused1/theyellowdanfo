import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Menu, ShoppingBag, X, ChevronDown, ChevronUp, Calendar, Home } from 'lucide-react';

const DanfoDiariesPage = ({ onNavigate }) => {
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState({});

  const diariesContainerRef = useRef(null);

  const DIARY_ENTRIES = [
    { date: "FEB 20, 2019", title: "THE SPARK", desc: "Around 7 p.m. in a quiet nook of London, while editing a 350-page manuscript shaped by over two decades of research into hidden narratives and visual histories, something shifted. The demands of academic work gave way to a creative spark. What began as an unplanned detour into a chic-lit concept quietly set in motion the beginnings of The Yellow Danfo — a cultural movement sparked by contrast, curiosity, and creative freedom.", img: null },
    { date: "OCT 25, 2023", title: "BOOK PUBLISHED", desc: "Edited between Lagos and London, the debut book 'The Yellow Danfo: At the Frontier of Sustainable Transportation' was officially published on Amazon. A bold work of creative non-fiction that sets the foundation for the entire movement.", img: null },
    { date: "NOV 06, 2023", title: "INSTAGRAM LAUNCH", desc: "@theyellowdanfo quietly launched on Instagram, aligning with the tourism narrative of Nigeria and Africa. Embracing a community business model, it leverages user-generated content (UGC) inspired by the iconic yellow Danfo to engage and grow its audience.", img: null },
    { date: "MAY 17, 2024", title: "ECHOES OF LAGOS", desc: "The Yellow Danfo's debut event, 'Echoes of Lagos Life' Private View, held at CitiHeights Hotel, marked a key milestone under its Exhibitions and Cultural Pop-Ups programme. The event showcased the works of both emerging and established artists, captivating audiences with vivid portrayals of Lagos life across various artistic mediums.", img: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/1750778898513blob.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:776,cg:true" },
    { date: "AUG 23, 2024", title: "HEN VIRTUAL", desc: "In preparation for HEN 2024, The Yellow Danfo delivered a virtual session titled 'The Yellow Danfo Advantage.' Designed for artists, designers, and creatives, it focused on essential hospitality skills and their relevance to participants' roles. The training connected creativity with customer engagement, helping attendees present their work professionally at the exhibition.", img: null },
    { date: "AUG 28-29, 2024", title: "HEN EXHIBITION", desc: "The Yellow Danfo proudly participated in the HEN Hospitality Exhibition, showcasing a vibrant collaboration with talented artists and designers. Our exhibition highlighted the fusion of creative innovation and cultural expression, attracting strong interest from attendees across the hospitality sector. The event provided an excellent platform to connect with industry professionals, promote local artistry, and celebrate the dynamic spirit of design and hospitality.", img: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/1750785271695blob.jpg/:/cr=t:3.1%25,l:5.36%25,w:89.29%25,h:51.63%25/rs=w:776,h:776,cg:true,m" },
    { date: "FEB - JUL 2025", title: "DANFO DIARIES TOUR", desc: "A vibrant tour celebrating African voices, fostering dialogue, and promoting cross-cultural understanding through literature and the arts. Activities: Includes children's storytelling, drumming workshops, author events, and themed discussions. Audience: Open to readers aged 4 to 80, including book clubs, students, educators, and creatives.", img: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/IMG_9922.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:738,cg:true" },
    { date: "FEB 2025", title: "PECKHAM LIBRARY", desc: "The Yellow Danfo made a memorable stop at Peckham Library during a First Friday Club speaking event. Focus: The session explored how Lagos' Yellow Danfo buses act as a medium for storytelling and connection, reflecting the city's vibrant culture and community spirit.", img: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/IMG_0228.JPG/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:776,cg:true" },
    { date: "FEB 2025", title: "CUSTOMER LOVE", desc: "'Hello Funmi, Thank you for today. I had a great time and thanks for the food and Palm wine. Can't stop telling everyone about it and getting them to have a taste. Looking forward to reading your book and seeing you again. Best wishes, Mawu'", img: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/PHOTO-2025-06-24-20-37-09.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:776,cg:true" },
    { date: "MAR 2025", title: "GREEN PURPLE", desc: "Green Purple Creative Social Responsibility Session. A collaborative event focusing on sustainability, community engagement, and the role of creative arts in driving social responsibility initiatives.", img: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/Green%20Purple%20Creative%20Social%20Responsibility%20Se.JPG/:/cr=t:1.24%25,l:0%25,w:97.51%25,h:97.51%25/rs=w:776,cg:true,m" },
    { date: "APR 2025", title: "BEATS OF IDENTITY", desc: "Beats of Identity is a vibrant workshop experience that brings African culture to life through drumming, storytelling, and creativity. Designed for children, families, and the young at heart, it sparks self-expression and connection through creative writing, drawing, rhythm, and hands-on crafts—all while exploring themes of identity, communication, and cultural heritage.", img: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/BEATS%20OF%20IDENTITY%20FLYER%20IMAGE%20NEW.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:776,cg:true" },
    { date: "SEP 06, 2025", title: "BOOK FAIR", desc: "The Multicultural Book Fair. Venue: Conway Hall, 25 Red Lion Square, London, WC1R 4RL. 6th September 2025. Join us for a day of diverse stories, cultural exchange, and literary inspiration, featuring The Yellow Danfo as a key exhibitor.", img: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/blob-c47ecc5.png/:/cr=t:0%25,l:12.5%25,w:75%25,h:100%25/rs=w:776,h:1035,cg:true" },
  ];

  // Menu items
  const MENU_ITEMS = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'diaries', label: 'DANFO DIARIES', icon: Calendar, active: true },
  ];

  // Toggle diary entry expansion
  const toggleDiaryEntry = (index) => {
    setExpandedEntries(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Load GSAP
  useEffect(() => {
    const loadGSAP = async () => {
      if (window.gsap && window.ScrollTrigger) {
        setGsapLoaded(true);
        return;
      }

      const loadScript = (src) => {
        return new Promise((resolve, reject) => {
          const existing = document.querySelector(`script[src="${src}"]`);
          if (existing) {
            resolve();
            return;
          }
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

        setTimeout(() => {
          if (window.gsap) {
            window.gsap.registerPlugin(window.ScrollTrigger);
            setGsapLoaded(true);
          }
        }, 100);
      } catch (error) {
        console.error("GSAP load error", error);
      }
    };
    loadGSAP();
  }, []);

  // Animate cards on scroll
  useLayoutEffect(() => {
    if (!gsapLoaded || !diariesContainerRef.current) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const timer = setTimeout(() => {
      const cards = gsap.utils.toArray('.diary-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { x: i % 2 === 0 ? -50 : 50, opacity: 0, scale: 0.9 },
          {
            x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Animate the bus
      const bus = diariesContainerRef.current.querySelector('.diaries-bus');
      if (bus) {
        gsap.to(bus, {
          y: "80vh",
          ease: "none",
          scrollTrigger: {
            trigger: diariesContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5
          }
        });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, [gsapLoaded]);

  return (
    <div ref={diariesContainerRef} className="bg-zinc-900 text-stone-100 min-h-screen font-sans selection:bg-yellow-400 selection:text-black">
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Special+Elite&family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />

      <style>{`
        .font-display { font-family: 'Anton', sans-serif; }
        .font-mono-style { font-family: 'Special Elite', monospace; }
        .dashed-road { background-image: linear-gradient(to bottom, #444 50%, transparent 50%); background-size: 2px 60px; }
        .tape-corner { position: absolute; width: 80px; height: 30px; background-color: rgba(255, 255, 255, 0.4); transform: rotate(45deg); backdrop-filter: blur(2px); box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
        .texture-noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 40;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Noise Overlay */}
      <div className="texture-noise"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-900 border-b-4 border-yellow-400">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <img
            src="https://i.postimg.cc/BbH97B8w/danfo-logo-copy.png"
            alt="The Yellow Danfo"
            className="h-10 md:h-14 w-auto cursor-pointer"
            onClick={() => onNavigate && onNavigate('home')}
          />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="text-stone-400 hover:text-yellow-400 font-mono-style text-sm transition-colors"
            >
              HOME
            </button>
            <span className="text-yellow-400 font-mono-style text-sm border-b-2 border-yellow-400">
              DANFO DIARIES
            </span>
            <button
              onClick={() => onNavigate && onNavigate('market')}
              className="text-stone-400 hover:text-yellow-400 font-mono-style text-sm transition-colors"
            >
              MARKET
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-yellow-400"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-neutral-900 border-t border-yellow-400/30 py-4">
            <div className="container mx-auto px-4 flex flex-col gap-4">
              <button
                onClick={() => { onNavigate && onNavigate('home'); setMenuOpen(false); }}
                className="text-stone-400 hover:text-yellow-400 font-mono-style text-lg text-left"
              >
                HOME
              </button>
              <span className="text-yellow-400 font-mono-style text-lg">
                DANFO DIARIES
              </span>
              <button
                onClick={() => { onNavigate && onNavigate('market'); setMenuOpen(false); }}
                className="text-stone-400 hover:text-yellow-400 font-mono-style text-lg text-left"
              >
                MARKET
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block bg-yellow-400 text-black px-3 py-1 font-mono-style font-bold mb-4">
            ROUTE LOG
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-6">
            DANFO <span className="text-yellow-400">DIARIES</span>
          </h1>
          <p className="font-mono-style text-stone-400 max-w-2xl mx-auto text-lg">
            Follow our journey through time. Every stop tells a story of culture, creativity, and community.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative pb-32">
        {/* Road Line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-2 dashed-road hidden md:block"></div>

        {/* Moving Bus (Desktop) */}
        <div className="diaries-bus fixed top-32 left-1/2 -translate-x-1/2 z-30 hidden md:block">
          <div className="w-12 h-24 bg-yellow-400 border-2 border-black rounded shadow-[0_0_20px_rgba(251,191,36,0.5)] flex flex-col items-center justify-center">
            <div className="w-10 h-16 bg-black/10"></div>
          </div>
        </div>

        {/* Diary Cards */}
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-12 md:space-y-24">
            {DIARY_ENTRIES.map((entry, index) => {
              const isLeft = index % 2 === 0;
              const isExpanded = expandedEntries[index];

              return (
                <div
                  key={index}
                  className={`diary-card relative md:w-[45%] ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}
                >
                  <div className={`bg-stone-100 text-black p-6 shadow-xl border-4 border-white transform ${isLeft ? 'md:rotate-1' : 'md:-rotate-1'} relative`}>
                    {/* Tape Corner */}
                    <div className={`tape-corner -top-4 ${isLeft ? 'right-10' : 'left-10'} hidden md:block`}></div>

                    {/* Date Badge */}
                    <div className="font-mono-style text-xs text-red-600 font-bold mb-2 border-b border-stone-300 pb-2">
                      {entry.date}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-2xl md:text-3xl mb-3 leading-none">
                      {entry.title}
                    </h3>

                    {/* Description */}
                    <div className={`transition-all duration-500 overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-24'}`}>
                      <p className="font-serif text-sm md:text-base leading-relaxed mb-4">
                        {entry.desc}
                      </p>
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleDiaryEntry(index)}
                      className="flex items-center justify-center w-full py-2 bg-stone-200 hover:bg-stone-300 transition-colors mt-2 gap-2 font-mono-style text-xs"
                    >
                      {isExpanded ? (
                        <>SHOW LESS <ChevronUp size={16}/></>
                      ) : (
                        <>READ MORE <ChevronDown size={16}/></>
                      )}
                    </button>

                    {/* Image */}
                    {entry.img && (
                      <div className={`w-full bg-stone-200 overflow-hidden border-2 border-stone-300 mt-4 transition-all duration-500 ${isExpanded ? '' : 'aspect-video'}`}>
                        <img
                          src={entry.img}
                          alt={entry.title}
                          className={`w-full transition-all duration-500 ${isExpanded ? 'h-auto' : 'h-full object-cover'}`}
                        />
                      </div>
                    )}

                    {/* Timeline Connector (Desktop) */}
                    <div className={`hidden md:block absolute top-1/2 ${isLeft ? '-right-12' : '-left-12'} w-8 h-0.5 bg-yellow-400`}></div>
                    <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${isLeft ? '-right-16' : '-left-16'} w-4 h-4 bg-yellow-400 rounded-full border-2 border-black`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-yellow-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-black mb-6">
            JOIN THE JOURNEY
          </h2>
          <p className="font-serif text-black/70 max-w-xl mx-auto mb-8">
            Be part of our story. Follow along as we continue to bridge cultures and create change through storytelling.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate && onNavigate('home:contact')}
              className="bg-black text-yellow-400 font-display text-xl px-8 py-4 hover:bg-neutral-800 transition-colors"
            >
              GET IN TOUCH
            </button>
            <button
              onClick={() => onNavigate && onNavigate('market')}
              className="border-4 border-black text-black font-display text-xl px-8 py-4 hover:bg-black hover:text-yellow-400 transition-colors"
            >
              VISIT THE MARKET
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 py-8 border-t-4 border-yellow-400">
        <div className="container mx-auto px-4 text-center">
          <p className="font-mono-style text-xs text-stone-600">
            © 2024 THE YELLOW DANFO. LAGOS.<br/>
            BUILT FOR FUNMI AKISANYA.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DanfoDiariesPage;
