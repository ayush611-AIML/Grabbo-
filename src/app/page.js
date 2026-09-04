'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, MapPin, Clock, ShieldAlert } from 'lucide-react'
import dynamic from 'next/dynamic'
const Scene = dynamic(() => import('@/components/Scene'), { ssr: false })
import { getLatestArticles } from '../../backend/actions.js'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      const data = await getLatestArticles()
      setArticles(data)
      setLoading(false)
    }
    fetchArticles()
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.8, ease: "easeOut" }
  }

  return (
    <main className="relative w-full min-h-screen bg-[#0b0f19] text-gray-200">
      {/* Fixed 3D Background */}
      <Scene />

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-black flex-shrink-0">
            <Image src="/logo.jpg" alt="Grabbo Logo" fill className="object-cover" />
          </div>
          <div className="text-2xl font-bold font-serif text-white tracking-widest uppercase">GRABBO</div>
        </div>
        <div className="hidden md:flex space-x-8 text-sm tracking-widest text-gray-300 uppercase">
          <a href="#" className="hover:text-gold transition-colors">Home</a>
          <a href="#precautions" className="hover:text-gold transition-colors">Precautions</a>
          <a href="#collection" className="hover:text-gold transition-colors">Shop</a>
          <a href="#story" className="hover:text-gold transition-colors">About Us</a>
          <a href="#events" className="hover:text-gold transition-colors">Events</a>
          <a href="#testimonials" className="hover:text-gold transition-colors">Testimonials</a>
        </div>
        <button className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-[#0b0f19] transition-all uppercase tracking-widest text-xs font-semibold rounded">
          Shop Now
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full h-[150vh] flex flex-col items-center pt-[30vh] z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="text-center px-4 flex flex-col items-center"
        >
          <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-bold text-white drop-shadow-2xl tracking-wide">
            GRABBO
          </h1>
          <h2 className="text-4xl md:text-6xl font-light text-white/90 italic mb-8 drop-shadow-2xl">
            Everyday Essentials
          </h2>
          <div className="w-16 h-[1px] bg-gold mb-8"></div>
          <p className="text-sm md:text-base font-light max-w-xl mx-auto opacity-80 uppercase tracking-[0.2em] leading-relaxed">
            A curated collection of artisanal convenience, reimagined for the modern connoisseur.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute top-[85vh] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/50">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[1px] h-16 bg-gradient-to-b from-gold to-transparent"
          />
        </motion.div>
      </section>

      {/* Content wrapper - made transparent so the 3D scene is visible everywhere */}
      <div className="relative z-20 pt-24">
        
        {/* Regulatory & Precautions */}
        <section id="precautions" className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-white/5 mb-16">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h4 className="text-gold uppercase tracking-[0.2em] text-sm mb-4"><ShieldAlert className="inline mr-2 -mt-1" size={16} /> Compliance & Safety</h4>
            <h2 className="text-4xl md:text-5xl text-white font-serif mb-6">Regulatory & Precautions</h2>
            <p className="text-gray-400 font-light max-w-2xl mx-auto">
              Our automated weekly bulletin keeping you informed on our rigorous safety protocols, ethical sourcing updates, and high-end curation standards.
            </p>
          </motion.div>

          <div className="relative w-full overflow-hidden flex">
            {/* Fade Gradients */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0b0f19] to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0b0f19] to-transparent z-20 pointer-events-none" />
            
            <div className="flex w-max animate-scroll">
              {loading ? (
                <div className="w-[400px] flex justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
                </div>
              ) : articles.length > 0 ? (
                [...articles, ...articles, ...articles, ...articles].map((article, i) => (
                  <motion.div key={i} className="w-[350px] md:w-[450px] flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-lg group hover:border-gold/30 transition-colors flex flex-col mx-4">
                    <div className="text-gold text-xs uppercase tracking-widest mb-4">
                      {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h3 className="text-xl text-white font-serif mb-4">{article.title}</h3>
                    <div className="text-gray-400 text-sm font-light leading-relaxed whitespace-pre-wrap line-clamp-6 flex-1">
                      {article.content}
                    </div>
                    <button className="text-gold text-xs uppercase tracking-widest mt-6 flex items-center gap-2 group-hover:text-white transition-colors">
                      Read Full Policy <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="w-[400px] text-center py-12 border border-white/10 border-dashed rounded-lg bg-black/20 mx-4">
                  <p className="text-gray-400 font-light italic">The automated compliance system is initializing. Our AI will publish the first bulletin shortly.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Signature Collection */}
        <section id="collection" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="mb-16 md:flex justify-between items-end">
            <div>
              <h4 className="text-gold uppercase tracking-[0.2em] text-sm mb-4">Curated Selection</h4>
              <h2 className="text-5xl md:text-6xl text-white">Signature Collection</h2>
            </div>
            <button className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest hover:text-gold transition-colors mt-6 md:mt-0">
              View All <ArrowRight size={16} />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: '01', name: 'Oud & Bergamot Reserve', price: '₹12,000', desc: 'An exquisite composition of rare oud wood, bright Italian bergamot, and warm amber.', image: '/perfume.png' },
              { id: '02', name: 'Vintage Cane Cola', price: '₹90', desc: 'Classic sparkling cola crafted with pure cane sugar.', image: '/cola.png' },
              { id: '03', name: 'Gourmet Tonkotsu Ramen', price: '₹250', desc: 'Rich, slow-simmered broth with authentic sun-dried noodles.', image: '/ramen.png' }
            ].map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group cursor-pointer"
              >
                <div className="relative w-full aspect-[4/5] bg-white/5 backdrop-blur-md rounded-lg overflow-hidden mb-6 border border-white/5 group-hover:border-gold/30 transition-colors duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <div className="absolute top-4 left-4 text-gold text-sm font-serif italic z-20">{item.id}</div>
                  
                  {/* Product Image or Placeholder */}
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover opacity-60 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent">
                       <div className="w-24 h-32 border border-gold/30 rounded-t-full flex items-center justify-center backdrop-blur-sm">
                         <span className="font-serif text-3xl tracking-widest text-gold/60">CS</span>
                       </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-2xl text-white mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-400 font-sans">{item.desc}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-gold font-serif">{item.price}</span>
                  <span className="text-xs uppercase tracking-wider text-white/50 group-hover:text-white transition-colors">Add to Cart</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* About Us */}
        <section id="story" className="py-32 bg-black/40 backdrop-blur-md border-y border-white/5 mt-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            {/* About the Store */}
            <motion.div {...fadeInUp}>
              <h4 className="text-gold uppercase tracking-[0.2em] text-sm mb-4">The Store</h4>
              <h2 className="text-5xl md:text-6xl text-white mb-8 font-serif">Uncompromising Quality</h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6 font-light">
                We believe that convenience should never come at the cost of quality. Born from a passion for exceptional ingredients and elegant design, Grabbo transforms the mundane errand into a moment of discovery.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-10 font-light">
                Every item on our shelves is meticulously sourced, ethically produced, and thoughtfully presented. Welcome to the new standard of convenience.
              </p>
            </motion.div>
            
            {/* About the Owner */}
            <motion.div 
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center text-center space-y-6 md:ml-auto md:mr-12"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border border-gold/30 p-2">
                <div className="w-full h-full rounded-full bg-black/50 overflow-hidden relative flex flex-col items-center justify-center">
                   <span className="text-gold/40 font-serif text-sm uppercase tracking-widest text-center px-4">Owner Image<br/>(Awaiting Upload)</span>
                </div>
              </div>
              <div>
                <h3 className="text-3xl text-white font-serif mb-2">The Founder</h3>
                <h4 className="text-gold uppercase tracking-[0.2em] text-xs mb-4">Vision & Curation</h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed max-w-sm italic">
                  "I wanted to build a space where grabbing an everyday essential feels just as luxurious as walking into a high-end boutique."
                </p>
              </div>
            </motion.div>
            
          </div>
        </section>

        {/* Events */}
        <section id="events" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h4 className="text-gold uppercase tracking-[0.2em] text-sm mb-4">The Experience</h4>
            <h2 className="text-4xl md:text-5xl text-white font-serif mb-12">Events</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
            {/* Products - Tall box on the left */}
            <motion.div {...fadeInUp} className="md:col-span-5 md:row-span-2 bg-white/5 backdrop-blur-md rounded-lg overflow-hidden relative group">
               <Image src="/event-products.jpg" alt="Products Array" fill className="object-cover group-hover:scale-105 transition-transform duration-1000 z-0" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 z-10" />
               <div className="absolute bottom-8 left-8 text-white font-serif text-3xl z-20">Curated Shelf</div>
            </motion.div>
            
            {/* Store Front - Top right */}
            <motion.div {...fadeInUp} className="md:col-span-7 bg-white/5 backdrop-blur-md rounded-lg overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-transparent opacity-80 z-10" />
               <div className="absolute inset-0 bg-black/20 backdrop-blur-sm group-hover:scale-105 transition-transform duration-1000 z-0" />
               <div className="absolute bottom-8 left-8 text-white font-serif text-3xl z-20">Store Front</div>
            </motion.div>
            
            {/* Atmosphere - Bottom right (Split 1) */}
            <motion.div {...fadeInUp} className="md:col-span-4 bg-white/5 backdrop-blur-md rounded-lg overflow-hidden relative group">
               <Image src="/event-atmosphere.png" alt="Atmosphere" fill className="object-cover group-hover:scale-105 transition-transform duration-1000 z-0" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 z-10" />
               <div className="absolute bottom-8 left-8 text-white z-20">
                 <div className="font-serif text-3xl mb-2">JALSA</div>
                 <div className="text-xs uppercase tracking-widest text-gold/80">brought to you by BREEZE x GRABBO!</div>
               </div>
            </motion.div>

            {/* Upcoming Events - Bottom right (Split 2) */}
            <motion.div {...fadeInUp} className="md:col-span-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 flex flex-col justify-center relative group hover:border-gold/30 transition-colors">
               <div className="text-gold uppercase tracking-[0.2em] text-[10px] mb-3">Calendar</div>
               <h3 className="text-2xl text-white font-serif mb-4">Upcoming Events</h3>
               <ul className="space-y-4">
                 <li className="border-b border-white/10 pb-3">
                   <div className="text-sm text-gray-300 font-light">Midnight Tasting</div>
                   <div className="text-[10px] text-gold mt-1 uppercase tracking-wider">Oct 12 • Invite Only</div>
                 </li>
                 <li>
                   <div className="text-sm text-gray-300 font-light">Artisan Popup</div>
                   <div className="text-[10px] text-gold mt-1 uppercase tracking-wider">Oct 24 • Open Access</div>
                 </li>
               </ul>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-32 border-t border-white/5 mt-24 overflow-hidden relative">
          <motion.div {...fadeInUp} className="text-center mb-16 px-6 md:px-12">
            <h4 className="text-gold uppercase tracking-[0.2em] text-sm mb-4">Word of Mouth</h4>
            <h2 className="text-4xl md:text-5xl text-white font-serif mb-12">Testimonials</h2>
          </motion.div>

          <div className="relative w-full overflow-hidden flex">
            {/* Fade Gradients for smooth entering/exiting */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#0b0f19] to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#0b0f19] to-transparent z-20 pointer-events-none" />
            
            <div className="flex w-max animate-scroll">
              {[
                { quote: "Grabbo completely elevated my daily routine. The curation is impeccable and the atmosphere is simply unmatched.", author: "Priya S.", title: "Creative Director" },
                { quote: "Finally, a convenience store that understands luxury. Every visit feels like stepping into an exclusive boutique.", author: "Rahul M.", title: "Architect" },
                { quote: "From the artisanal selections to the stunning interior, they have redefined what it means to grab the essentials.", author: "Ananya K.", title: "Fashion Editor" },
                { quote: "An absolute gem in the city. The coffee is phenomenal, and the curated snacks are my new obsession.", author: "Rohan D.", title: "Entrepreneur" },
                { quote: "I love how they took the basic concept of a convenience store and made it an elevated, sensory experience.", author: "Maya T.", title: "Designer" },
                { quote: "The attention to detail here is incredible. From the packaging to the service, everything is top-tier.", author: "Karan S.", title: "Director" }
              ].concat([
                { quote: "Grabbo completely elevated my daily routine. The curation is impeccable and the atmosphere is simply unmatched.", author: "Priya S.", title: "Creative Director" },
                { quote: "Finally, a convenience store that understands luxury. Every visit feels like stepping into an exclusive boutique.", author: "Rahul M.", title: "Architect" },
                { quote: "From the artisanal selections to the stunning interior, they have redefined what it means to grab the essentials.", author: "Ananya K.", title: "Fashion Editor" },
                { quote: "An absolute gem in the city. The coffee is phenomenal, and the curated snacks are my new obsession.", author: "Rohan D.", title: "Entrepreneur" },
                { quote: "I love how they took the basic concept of a convenience store and made it an elevated, sensory experience.", author: "Maya T.", title: "Designer" },
                { quote: "The attention to detail here is incredible. From the packaging to the service, everything is top-tier.", author: "Karan S.", title: "Director" }
              ]).map((testimonial, i) => (
                <div 
                  key={i}
                  className="w-[350px] md:w-[450px] flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-lg relative group hover:border-gold/30 transition-colors mx-4"
                >
                  <div className="text-gold font-serif text-6xl absolute top-4 left-6 opacity-20">"</div>
                  <p className="text-gray-300 font-light leading-relaxed mb-8 relative z-10 pt-4">
                    {testimonial.quote}
                  </p>
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-white font-serif text-lg">{testimonial.author}</h4>
                    <p className="text-gold text-xs uppercase tracking-widest mt-1">{testimonial.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/60 backdrop-blur-xl pt-24 pb-12 px-6 border-t border-gold/20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden bg-black flex-shrink-0">
                  <Image src="/logo.jpg" alt="Grabbo Logo" fill className="object-cover" />
                </div>
                <div className="text-3xl font-bold font-serif text-white tracking-widest uppercase">GRABBO</div>
              </div>
              <p className="text-gray-400 font-light max-w-sm mb-8 leading-relaxed">
                Elevating the everyday by turning simple essentials into an extraordinary, curated experience.
              </p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/grabbo_snu?igsi=MWRvZGVhYTg4dm5l" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-colors text-xs font-bold">IG</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-gold font-serif mb-6 text-lg">Visit Us</h4>
              <ul className="space-y-4 text-gray-400 text-sm font-light">
                <li className="flex gap-3"><MapPin size={18} className="text-gold shrink-0" /> 123 Artisan Lane, Bandra West, Mumbai 400050</li>
                <li className="flex gap-3"><Clock size={18} className="text-gold shrink-0" /> Mon-Sun: 7:00 AM - 11:00 PM</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-gold font-serif mb-6 text-lg">Collaboration</h4>
              <p className="text-gray-400 text-sm font-light mb-4">Follow and Subscribe our social medial for exclusive releases and Events.</p>
              <div className="flex">
                <input type="email" placeholder="Email Address" className="bg-transparent border-b border-white/20 px-0 py-2 text-white focus:outline-none focus:border-gold flex-1 text-sm transition-colors" />
                <button className="border-b border-gold text-gold px-4 py-2 uppercase tracking-widest text-xs hover:bg-gold hover:text-black transition-colors font-semibold">Join</button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600 uppercase tracking-widest">
            <p>&copy; 2026 GRABBO Convenience. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gold transition-colors">Privacy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
