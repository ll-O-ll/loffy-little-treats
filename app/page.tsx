"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, Check, Instagram, Clock, MapPin, Sparkles, Heart, Hexagon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans bg-andalusi">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md px-4">
        <div className="mx-auto max-w-7xl h-20 flex items-center justify-between">
          <Link href="/" className="relative h-14 w-14">
            <Image
              src="/images/lutfi-logo.png"
              alt="Loffy's Little Treats Logo"
              fill
              className="object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href="#gallery" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Gallery
            </Link>
            <Link href="/presale" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest flex items-center gap-1">
              Eid Presale <Sparkles className="h-4 w-4" />
            </Link>
            <Link href="#process" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Process
            </Link>
            <Link href="#policies" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest text-muted-foreground hover:text-foreground">
              Policies
            </Link>
          </div>

          <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 shadow-sm">
            <Link href="/booking/ai">
              Inquire Now
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4">
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp} className="max-w-xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-primary text-xs font-semibold tracking-widest uppercase mb-6">
                Artisanal Custom Treats
              </span>
              <h1 className="font-serif text-5xl font-bold leading-[1.1] sm:text-6xl lg:text-7xl text-foreground mb-8">
                Sweet Moments, <span className="text-primary italic">Custom Made.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-10 font-light">
                Handcrafted treats for your most special occasions. From corporate logos to intimate celebrations, we bring your vision to life with edible art.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg h-14 px-10 shadow-lg shadow-primary/20">
                  <Link href="/booking/ai">
                    Experience Loffy's Pâtissier
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-border text-foreground hover:bg-secondary text-lg h-14 px-10">
                  <Link href="#gallery">
                    View Gallery
                  </Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-square md:aspect-[4/5] lg:aspect-square"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-[2rem] -rotate-3 transform scale-105 blur-2xl"></div>
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-2xl">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/images/lufti-cookies-crumble.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-border">
                <Link href="https://www.instagram.com/loffyslittletreats/" className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-primary hover:scale-110 transition-transform">
                  <Instagram className="h-6 w-6" />
                </Link>
                <div>
                  <div className="text-sm font-bold">@loffyslittletreats</div>
                  <Link href="https://www.instagram.com/loffyslittletreats/" className="text-xs text-muted-foreground hover:text-primary underline underline-offset-2">Follow our journey</Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-32 bg-secondary/30 px-4 relative overflow-hidden">
        {/* Subtle geometric touch */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeInUp} className="text-center mb-20 max-w-2xl mx-auto">
            <h2 className="text-4xl font-serif font-bold mb-6">A Taste of Our Craft</h2>
            <p className="text-muted-foreground font-light text-lg">
              Each treat is designed with precision and baked with love. Explore some of our favorite custom sets.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { src: "/images/blue-cookies.jpg", title: "Baby Shower Bliss", desc: "Intricate blue & silver floral set" },
              { src: "/images/rose-cookies.jpg", title: "Floral Celebration", desc: "Hand-painted organic rose designs" },
              { src: "/images/teddy-bear-cookies.jpg", title: "Teddy Bear Tea", desc: "Adorable custom treats for birthdays" }
            ].map((item, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }}>
                <Card className="group overflow-hidden border-none bg-transparent shadow-none">
                  <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-6">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm font-light uppercase tracking-widest">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-32 px-4 bg-background relative">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-4xl font-serif font-bold mb-8">How We Bake Magic</h2>
              <div className="space-y-10">
                {[
                  { icon: Clock, title: "Availability First", desc: "We block off only what we can perfect. Minimum 2 weeks notice is preferred to ensure your date is secured." },
                  { icon: Sparkles, title: "Creative Freedom", desc: "We love recognizable shapes mixed with abstract foundations. 3-4 designs per dozen keeps the set cohesive." },
                  { icon: Heart, title: "Handcrafted Detail", desc: "Colors and shapes are tailored to your inspo, with room for artistic variation to make them uniquely yours." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="h-14 w-14 shrink-0 rounded-2xl bg-secondary flex items-center justify-center text-primary relative">
                      {/* Geometric touch icon background */}
                      <div className="absolute inset-0 bg-andalusi opacity-10 rounded-2xl"></div>
                      <step.icon className="h-7 w-7 relative z-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed font-light">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeInUp} className="relative aspect-square">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-[3rem] translate-x-6 translate-y-6 -z-10"></div>
              <div className="h-full w-full rounded-[3rem] bg-secondary flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-andalusi opacity-20"></div>
                <div className="text-center p-12 relative z-10">
                  <Hexagon className="h-20 w-20 text-primary mx-auto mb-8 animate-pulse" />
                  <h4 className="text-3xl font-serif font-bold mb-4 italic text-primary">"The treat stays long after the bite is gone."</h4>
                  <p className="text-muted-foreground italic">— Loffy's Philosophy</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section id="policies" className="py-32 px-4 bg-secondary/20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-andalusi opacity-20"></div>
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-6">Ordering Essentials</h2>
            <p className="text-muted-foreground font-light text-lg italic">The details that make our partnership sweet.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="p-10 border-border bg-background h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Sparkles className="h-20 w-20 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" /> Timelines
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span>Minimum 1 dozen per order</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span>50% deposit required to secure your date</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span>Balance due before pickup/delivery</span>
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="p-10 border-border bg-background h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <MapPin className="h-20 w-20 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" /> Delivery & Pickup
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span>Pickup options available upon request</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span>Delivery calculated based on distance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <span>Rush order fees apply for <span className="font-bold underline italic">last minute magic</span></span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-andalusi opacity-10"></div>
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl font-serif font-bold mb-8">Ready to start your custom set?</h2>
          <p className="text-xl opacity-90 mb-12 font-light max-w-xl mx-auto">
            Let **Loffy's Pâtissier** guide you through the process for a seamless discovery and custom quote.
          </p>
          <Button asChild size="lg" className="rounded-full bg-background text-primary hover:bg-white text-xl h-16 px-12 shadow-2xl">
            <Link href="/booking/ai">
              Inquire with Loffy's Pâtissier
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border bg-background px-4 relative">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
          <div className="text-center md:text-left">
            <div className="font-serif text-2xl font-bold text-primary tracking-widest uppercase mb-1">Loffy's Little Treats</div>
            <p className="text-sm text-muted-foreground mt-2 font-light">© {new Date().getFullYear()} Artisanal Custom Treats. Handcrafted with heart.</p>
          </div>
          <div className="flex gap-10">
            <Link href="https://www.instagram.com/loffyslittletreats/" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
              <span className="font-medium tracking-widest uppercase">Instagram</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
