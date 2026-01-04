import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Ticket, ArrowDown, Menu } from 'lucide-react';

/**
 * THE YELLOW DANFO - MARKET TERMINUS
 * Standalone E-Commerce Page
 */

const MarketPage = ({ onNavigate }) => {
    const [cartCount, setCartCount] = useState(0);
    const [cartOpen, setCartOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [lastTicket, setLastTicket] = useState(null);
    const [activeCategory, setActiveCategory] = useState("ALL");

    // Product Catalog
    const PRODUCTS = [
        { id: 1, title: "The Yellow Danfo (Book)", price: "£15.00", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/blob-0c345ac.png", category: "BOOKS" },
        { id: 2, title: "Sunshine The Miracle Child", price: "£6.00", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/blob-e173850.png", category: "BOOKS" },
        { id: 3, title: "Second-Class Citizen - Buchi Emecheta", price: "£10.00", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/BUCHI%20EMECHETA.jpg", category: "BOOKS" },
        { id: 4, title: "The Lion And The Jewel - Notes by Ayotunde Oyetunde", price: "£12.00", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/IMG_2552.jpg", category: "BOOKS" },
        { id: 5, title: "Our Beautiful Bride by Deji Oripeloye", price: "£8.00", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/IMG_2544.jpg", category: "BOOKS" },
        { id: 6, title: "God Answers Okey's Prayer", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/IMG_2562-fb2d90e.jpg", category: "BOOKS" },
        { id: 7, title: "Mother Horse", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/IMG_2563.jpg", category: "BOOKS" },
        { id: 8, title: "God Sends Mfon a Bird", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/IMG_2565.jpg", category: "BOOKS" },
        { id: 9, title: "Sade At The Beach", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/IMG_2568.jpg", category: "BOOKS" },
        { id: 10, title: "The Strange Bird", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/IMG_2569.jpg", category: "BOOKS" },
        { id: 11, title: "Laraba And The King's Parrot", price: "£4.00", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/IMG_2567.jpg", category: "BOOKS" },
        { id: 12, title: "Abo And The Crocodile", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/IMG_2546%20(1).jpg", category: "BOOKS" },
        { id: 13, title: "King Jaja Of Opobo", price: "£8.00", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/IMG_2555.jpg", category: "BOOKS" },
        { id: 14, title: "My Baby Sister", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/IMG_2556.jpg", category: "BOOKS" },
        { id: 15, title: "The Wicked King", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/IMG_2557.jpg", category: "BOOKS" },
        { id: 16, title: "Trouble In The Dog Kingdom", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/IMG_2550.jpg", category: "BOOKS" },
        { id: 17, title: "The Greedy Tortoise", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/IMG_2548.jpg", category: "BOOKS" },
        { id: 18, title: "Mopelola The Tale Of A Beauty Goddess", price: "£8.00", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/IMG_2545.jpg", category: "BOOKS" },
        { id: 19, title: "Tortoise And The Magic Stick", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/IMG_2566.jpg", category: "BOOKS" },
        { id: 20, title: "One Good Turn...", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/IMG_2547.jpg", category: "BOOKS" },
        { id: 21, title: "Moremi The Courageous Queen", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/IMG_2546%20(1).jpg", category: "BOOKS" },
        { id: 22, title: "Nigerian Passport Holder", price: "£5.00", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/ols/IMG_2551.jpg", category: "ACCESSORIES" },
        { id: 23, title: "Kunle The Village Boy", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/blob-6c1fd39.png", category: "BOOKS" },
        { id: 24, title: "Chief Koko's Bicycle And The Twin Brothers", price: "£3.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/CHIEF%20KOKO'S%20BICYCLE.jpg", category: "BOOKS" },
        { id: 25, title: "A Greedy Woman", price: "£1.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/THE%20GREEDY%20WOMAN.jpg", category: "BOOKS" },
        { id: 26, title: "The Prince's Remedy", price: "£1.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/THE%20PRINCE'S%20REMEDY.jpg", category: "BOOKS" },
        { id: 27, title: "Respecting Elders", price: "£1.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/RESPECTING%20ELDERS.jpg", category: "BOOKS" },
        { id: 28, title: "The King That Loves His People", price: "£1.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/THE%20KING%20THAT%20LOVES%20HIS%20PEOPLE.jpg", category: "BOOKS" },
        { id: 29, title: "A Mother's Love", price: "£1.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/A%20MOTHERS%20LOVE.jpg", category: "BOOKS" },
        { id: 30, title: "Chekube And Her Husband", price: "£1.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/CHEKUBE%20AND%20HER%20HUSBAND.jpg", category: "BOOKS" },
        { id: 31, title: "Unforgettable Tears", price: "£1.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/UNFORGETTABLE%20TEARS.jpg", category: "BOOKS" },
        { id: 32, title: "Be Polite To Elders", price: "£1.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/BE%20POLITE%20TO%20ELDERS.jpg", category: "BOOKS" },
        { id: 33, title: "Be Obedient", price: "£1.50", imageUrl: "https://img1.wsimg.com/isteam/ip/80ac6c26-cf52-4e3a-b1c8-790d32133838/BE%20OBEDIENT.jpg", category: "BOOKS" },
    ];

    const filteredProducts = activeCategory === "ALL"
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === activeCategory);

    // Add to Cart with Animation
    const addToCart = (itemTitle) => {
        setCartCount(prev => prev + 1);
        setLastTicket(itemTitle);

        // Ticket Animation
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

    // Cart Pulse Animation
    useEffect(() => {
        if (cartCount > 0 && window.gsap) {
            window.gsap.fromTo(".cart-icon-container",
                { scale: 1, rotation: 0 },
                { scale: 1.3, rotation: 10, yoyo: true, repeat: 1, duration: 0.15, ease: "power2.out" }
            );
        }
    }, [cartCount]);

    // Load GSAP (optional, for animations)
    useEffect(() => {
        if (window.gsap) return;
        const gsapScript = document.createElement('script');
        gsapScript.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
        document.body.appendChild(gsapScript);
    }, []);

    return (
        <div className="bg-zinc-900 text-stone-100 min-h-screen font-sans selection:bg-yellow-400 selection:text-black">
            {/* Fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Anton&family=Special+Elite&family=Inter:wght@400;600;800&display=swap" rel="stylesheet" />

            <style>{`
        .font-display { font-family: 'Anton', sans-serif; }
        .font-mono-style { font-family: 'Special Elite', monospace; }
        .clip-ticket { clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%); }
        .magnetic-btn:hover .btn-icon { transform: translateX(4px); }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

            {/* --- HEADER --- */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-900 border-b-8 border-yellow-400 px-4 md:px-8 py-4 shadow-2xl">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <img
                            src="https://i.postimg.cc/BbH97B8w/danfo-logo-copy.png"
                            alt="The Yellow Danfo"
                            className="h-10 md:h-14 w-auto cursor-pointer"
                            onClick={() => onNavigate && onNavigate('home')}
                        />

                        {/* Mobile Menu Button */}
                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden bg-yellow-400 border-2 border-black p-2 shadow-[4px_4px_0px_#000] hover:translate-y-1 transition-transform">
                            {menuOpen ? <X className="text-black" size={24} /> : <Menu className="text-black" size={24} />}
                        </button>

                        <h1 className="hidden md:block font-display text-2xl md:text-4xl text-yellow-400 tracking-wider">MARKET TERMINUS</h1>
                        <div className="hidden md:block bg-yellow-400 text-black px-2 py-1 font-mono-style text-xs font-bold">OFFICIAL STORE</div>
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-4">
                        {/* Desktop Menu Button */}
                        <button onClick={() => setMenuOpen(!menuOpen)} className="hidden md:block bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-2 font-display text-sm hover:bg-yellow-400 hover:text-black transition-colors">
                            MENU
                        </button>

                        {/* Cart Button */}
                        <div className="relative cursor-pointer group" onClick={() => setCartOpen(!cartOpen)}>
                            <div className="cart-icon-container bg-yellow-400 text-black p-3 rounded shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] group-hover:translate-y-1 transition-transform border-2 border-black">
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
            </header>

            {/* --- MENU DRAWER --- */}
            < div className={`fixed inset-y-0 left-0 w-full md:w-96 bg-black text-yellow-400 z-[80] transform transition-transform duration-500 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} p-8 border-r-8 border-yellow-400 flex flex-col justify-center`}>
                <button onClick={() => setMenuOpen(false)} className="absolute top-8 right-8 text-white"><X size={32} /></button>
                <ul className="space-y-6 text-3xl font-black uppercase tracking-tighter">
                    {['Home', 'What We Do', 'The Book', 'Programmes', 'Danfo Diaries', 'Market', 'Contact'].map((item, i) => (
                        <li
                            key={i}
                            onClick={() => {
                                if (item === 'Home' && onNavigate) {
                                    onNavigate('home');
                                } else if (item === 'What We Do' && onNavigate) {
                                    onNavigate('home:whatwedo');
                                } else if (item === 'Contact' && onNavigate) {
                                    onNavigate('home:contact');
                                } else if (item === 'Programmes' && onNavigate) {
                                    onNavigate('home:programmes');
                                } else if (item === 'The Book' && onNavigate) {
                                    onNavigate('home:book');
                                } else if (item === 'Danfo Diaries' && onNavigate) {
                                    onNavigate('diaries');
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
            </div >

            {/* --- TEMP TICKET ANIMATION --- */}
            < div id="temp-ticket" className="fixed top-24 right-20 z-[60] hidden pointer-events-none origin-top" >
                <div className="bg-stone-100 text-black w-48 p-4 font-mono-style text-xs shadow-xl border-2 border-black clip-ticket">
                    <div className="border-b border-dashed border-black pb-2 mb-2 text-center font-bold">Lagos Bus Ticket</div>
                    <div className="text-center mb-2 uppercase text-lg leading-none font-display">{lastTicket || "TICKET"}</div>
                    <div className="flex justify-between">
                        <span>PAID</span>
                        <span className="text-red-600 font-bold border-2 border-red-600 px-1 rounded -rotate-12">STAMPED</span>
                    </div>
                    <div className="mt-2 text-[10px] text-center opacity-50">KEEP TICKET SAFE</div>
                </div>
            </div >

            {/* --- CART DRAWER --- */}
            < div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-yellow-400 z-[70] transform transition-transform duration-500 ease-in-out border-l-4 border-black ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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
                        <button className="w-full bg-black text-yellow-400 font-display text-2xl py-4 hover:bg-neutral-800 transition-colors uppercase magnetic-btn flex justify-center items-center group">
                            <span className="mr-2">Checkout</span>
                            <ArrowDown className="btn-icon transition-transform -rotate-90" size={20} />
                        </button>
                    </div>
                </div>
            </div >

            {/* --- MAIN CONTENT --- */}
            < main className="pt-32 pb-20 px-6" >
                <div className="container mx-auto">

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {["ALL", "BOOKS", "ACCESSORIES"].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 font-display text-lg border-2 border-yellow-400 transition-colors ${activeCategory === cat ? 'bg-yellow-400 text-black' : 'text-yellow-400 hover:bg-yellow-400/20'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="group bg-white p-3 md:p-4 pb-4 md:pb-6 transform hover:-translate-y-1 transition-all duration-300">
                                <div className="aspect-[3/4] bg-neutral-200 mb-3 md:mb-4 relative overflow-hidden border border-black">
                                    {/* Product Image */}
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => addToCart(product.title)}
                                            className="bg-yellow-400 text-black font-display px-4 md:px-6 py-2 md:py-3 text-sm md:text-base hover:bg-white transition-colors"
                                        >
                                            ADD TO WALLET
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-display text-lg md:text-xl text-black leading-tight mb-1 line-clamp-2">{product.title}</h3>
                                <div className="flex justify-between items-center mt-2 border-t border-black/10 pt-2">
                                    <span className="font-mono-style text-xs md:text-sm text-neutral-500">{product.category}</span>
                                    <span className="font-bold text-black text-sm md:text-base">{product.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredProducts.length === 0 && (
                        <div className="text-center py-20">
                            <p className="font-mono-style text-stone-400 text-xl">No products in this category yet.</p>
                        </div>
                    )}

                </div>
            </main >

            {/* --- FOOTER --- */}
            <footer className="border-t-4 border-yellow-400 py-12 bg-neutral-900">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                            <img
                                src="https://i.postimg.cc/BbH97B8w/danfo-logo-copy.png"
                                alt="The Yellow Danfo"
                                className="h-10 w-auto opacity-70"
                            />
                            <div className="h-8 w-px bg-stone-700"></div>
                            <p className="font-mono-style text-xs text-stone-500">
                                LAGOS • LONDON
                            </p>
                        </div>
                        <div className="text-center md:text-right">
                            <p className="font-mono-style text-xs text-stone-600">
                                © 2024 THE YELLOW DANFO. LAGOS.<br />
                                BUILT FOR FUNMI AKISANYA.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default MarketPage;
