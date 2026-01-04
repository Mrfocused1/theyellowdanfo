import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, Ticket, ArrowDown, BookOpen, Shirt, Image as ImageIcon, Menu } from 'lucide-react';

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
      `}</style>

            {/* --- HEADER --- */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-900 border-b-8 border-yellow-400 px-4 md:px-8 py-4 shadow-2xl">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden bg-yellow-400 border-2 border-black p-2 shadow-[4px_4px_0px_#000] hover:translate-y-1 transition-transform">
                            {menuOpen ? <X className="text-black" size={24} /> : <Menu className="text-black" size={24} />}
                        </button>

                        <h1 className="font-display text-2xl md:text-4xl text-yellow-400 tracking-wider">MARKET TERMINUS</h1>
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
                    {['Home', 'What We Do', 'The Book', 'Programmes', 'Market', 'Contact'].map((item, i) => (
                        <li
                            key={i}
                            onClick={() => {
                                if (item === 'Home' && onNavigate) {
                                    onNavigate('home');
                                } else if (item === 'What We Do' && onNavigate) {
                                    onNavigate('home');
                                } else if (item === 'Contact' && onNavigate) {
                                    onNavigate('home');
                                } else if (item === 'Programmes' && onNavigate) {
                                    onNavigate('home');
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
                        {["ALL", "BOOKS", "APPAREL", "PRINTS"].map(cat => (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="group bg-white p-4 pb-6 transform hover:-translate-y-1 transition-all duration-300">
                                <div className="aspect-square bg-neutral-200 mb-4 relative overflow-hidden border border-black">
                                    {/* Product Image Placeholder */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 group-hover:bg-yellow-50 transition-colors">
                                        {product.category === 'BOOKS' && <BookOpen size={48} className="text-neutral-400" />}
                                        {product.category === 'APPAREL' && <Shirt size={48} className="text-neutral-400" />}
                                        {product.category === 'PRINTS' && <ImageIcon size={48} className="text-neutral-400" />}
                                    </div>
                                    <div className="absolute top-2 left-2 bg-black text-yellow-400 text-xs font-bold px-2 py-1">{product.tag}</div>

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button
                                            onClick={() => addToCart(product.title)}
                                            className="bg-yellow-400 text-black font-display px-6 py-3 hover:bg-white transition-colors"
                                        >
                                            ADD TO WALLET
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-display text-2xl text-black leading-none mb-1">{product.title}</h3>
                                <div className="flex justify-between items-center mt-2 border-t border-black/10 pt-2">
                                    <span className="font-mono-style text-sm text-neutral-500">{product.type}</span>
                                    <span className="font-bold text-black">{product.price}</span>
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
            < footer className="border-t border-yellow-400 py-8 text-center" >
                <p className="font-mono-style text-xs text-stone-600">
                    © 2024 THE YELLOW DANFO. LAGOS, NIGERIA.
                </p>
            </footer >
        </div >
    );
};

export default MarketPage;
