
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Clock, Star, Zap, Brain, Shield, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 45
  });
  const [chatQuestions, setChatQuestions] = useState(5);
  const [showChatModal, setShowChatModal] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const products = [
    {
      name: "CORDYCEPS",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=400&fit=crop",
      benefits: ["🚀 Energía explosiva", "💨 Resistencia sin límites"],
      description: "El secreto de los atletas olímpicos"
    },
    {
      name: "MELENA DE LEÓN",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&fit=crop",
      benefits: ["🧠 Enfoque láser", "⚡ Memoria de acero"],
      description: "Tu cerebro en modo bestia"
    },
    {
      name: "RHODIOLA",
      image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=400&fit=crop",
      benefits: ["💪 Anti-estrés total", "🔋 Recuperación épica"],
      description: "Domina el estrés como un guerrero"
    },
    {
      name: "REISHI",
      image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?w=400&h=400&fit=crop",
      benefits: ["🛡️ Sistema inmune blindado", "😴 Sueño reparador"],
      description: "El hongo de la inmortalidad"
    }
  ];

  const testimonials = [
    {
      name: "Carlos M.",
      sport: "Crossfit",
      text: "Desde que uso AmasFungis mis WODs son BRUTALES. Sin excusas.",
      rating: 5
    },
    {
      name: "Ana R.",
      sport: "Powerlifting",
      text: "Mi PR aumentó 15kg en deadlift. Esto funciona DE VERDAD.",
      rating: 5
    },
    {
      name: "Miguel L.",
      sport: "MMA",
      text: "Recuperación más rápida = más entrenamientos. Matemáticas simples.",
      rating: 5
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <div className="min-h-screen bg-gym-black text-neon-yellow font-gym overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-gym-black to-dark-gray">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop')"
          }}
        />
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <h1 className="text-7xl md:text-9xl font-black mb-8 leading-none">
            ARRANCA HOY<br />
            <span className="text-neon-yellow animate-pulse-neon">CON ADAPTÓGENOS</span><br />
            <span className="text-8xl md:text-[12rem]">A+</span>
          </h1>
          <p className="text-2xl md:text-3xl font-bold mb-12 max-w-4xl mx-auto leading-tight">
            🔥 NO MÁS EXCUSAS. NO MÁS LÍMITES. 💪<br />
            <span className="text-white">Suplementos de élite para atletas que van EN SERIO</span>
          </p>
          <button 
            className="cta-button text-2xl py-6 px-12 animate-pulse-neon"
            onClick={() => window.open('#productos', '_self')}
          >
            IR A LA TIENDA 🚀
          </button>
          
          {/* Scientific Authority */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="border border-neon-yellow p-4">
              <div className="text-3xl font-black text-neon-yellow">+300</div>
              <div className="text-sm text-white">ESTUDIOS CIENTÍFICOS</div>
            </div>
            <div className="border border-neon-yellow p-4">
              <div className="text-3xl font-black text-neon-yellow">15K+</div>
              <div className="text-sm text-white">ATLETAS ACTIVOS</div>
            </div>
            <div className="border border-neon-yellow p-4">
              <div className="text-3xl font-black text-neon-yellow">4.9★</div>
              <div className="text-sm text-white">RATING PROMEDIO</div>
            </div>
          </div>
        </div>
      </section>

      {/* FLASH OFFER SECTION */}
      <section className="relative py-12 bg-gradient-to-r from-neon-yellow to-yellow-400 text-gym-black overflow-hidden">
        <div className="diagonal-stripe absolute inset-0 opacity-20"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
            <div className="mb-6 md:mb-0">
              <h2 className="text-4xl md:text-6xl font-black mb-4">
                🔥 OFERTA RELÁMPAGO 🔥
              </h2>
              <p className="text-xl font-bold">
                CUPÓN <span className="bg-gym-black text-neon-yellow px-4 py-2 font-black">BLACK10</span> - 10% OFF
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">TERMINA EN:</div>
              <div className="flex gap-4 text-3xl font-black">
                <div className="bg-gym-black text-neon-yellow px-4 py-2 rounded">
                  {String(timeLeft.hours).padStart(2, '0')}
                  <div className="text-xs">HORAS</div>
                </div>
                <div className="bg-gym-black text-neon-yellow px-4 py-2 rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}
                  <div className="text-xs">MIN</div>
                </div>
                <div className="bg-gym-black text-neon-yellow px-4 py-2 rounded">
                  {String(timeLeft.seconds).padStart(2, '0')}
                  <div className="text-xs">SEG</div>
                </div>
              </div>
            </div>
            
            <button className="bg-gym-black text-neon-yellow font-black py-4 px-8 text-xl hover:scale-105 transition-transform border-4 border-gym-black">
              COMPRAR AHORA 💥
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCTS SLIDER SECTION */}
      <section id="productos" className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-black text-center mb-16">
            ARSENAL <span className="text-neon-yellow">COMPLETO</span>
          </h2>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="relative overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" 
                   style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {products.map((product, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-gym-black border-2 border-neon-yellow p-8 text-center group hover:bg-dark-gray transition-all duration-300">
                      <div className="relative mb-8">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-64 h-64 mx-auto rounded-full object-cover border-4 border-neon-yellow group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute -top-4 -right-4 bg-neon-yellow text-gym-black px-3 py-1 text-sm font-black transform rotate-12">
                          PREMIUM
                        </div>
                      </div>
                      
                      <h3 className="text-4xl font-black mb-4 text-neon-yellow">
                        {product.name}
                      </h3>
                      
                      <p className="text-lg font-bold mb-6 text-white">
                        {product.description}
                      </p>
                      
                      <div className="space-y-3 mb-8">
                        {product.benefits.map((benefit, i) => (
                          <div key={i} className="text-lg font-bold bg-dark-gray p-3 border border-neon-yellow">
                            {benefit}
                          </div>
                        ))}
                      </div>
                      
                      <button className="cta-button-secondary w-full">
                        VER TIENDA 🛒
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-neon-yellow text-gym-black p-3 hover:scale-110 transition-transform"
            >
              <ChevronLeft size={32} />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-neon-yellow text-gym-black p-3 hover:scale-110 transition-transform"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Testimonials */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gym-black border border-neon-yellow p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-neon-yellow text-neon-yellow" />
                  ))}
                </div>
                <p className="text-white mb-4 italic">"{testimonial.text}"</p>
                <div className="text-neon-yellow font-bold">
                  {testimonial.name} - {testimonial.sport}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAT HOOK SECTION */}
      <section className="py-20 bg-gym-black">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              🤖 COACH <span className="text-neon-yellow">IA</span> GRATIS
            </h2>
            <p className="text-2xl font-bold mb-8 text-white">
              Habla gratis con nuestro Coach IA especializado<br />
              <span className="text-neon-yellow">({chatQuestions} preguntas restantes)</span>
            </p>
            <p className="text-lg mb-12 text-gray-300">
              ✅ Planes personalizados ✅ Dosis exactas ✅ Timing perfecto ✅ Stacks potentes
            </p>
            
            <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
              <DialogTrigger asChild>
                <button className="cta-button text-2xl animate-pulse-neon">
                  <MessageCircle className="inline mr-3" />
                  INICIAR CHAT 💬
                </button>
              </DialogTrigger>
              <DialogContent className="bg-gym-black border-2 border-neon-yellow text-neon-yellow max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black text-center mb-6">
                    🤖 COACH IA - AMASFUNGIS
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="bg-dark-gray p-6 border border-neon-yellow">
                    <h3 className="text-xl font-bold mb-4 text-neon-yellow">
                      🎁 TIENES {chatQuestions} PREGUNTAS GRATIS
                    </h3>
                    <p className="text-white mb-4">
                      Nuestro Coach IA especializado en adaptógenos te ayudará con:
                    </p>
                    <ul className="text-left space-y-2 text-white">
                      <li>✅ Plan personalizado según tu deporte</li>
                      <li>✅ Dosis exactas para máximos resultados</li>
                      <li>✅ Timing perfecto de suplementación</li>
                      <li>✅ Stacks potentes para objetivos específicos</li>
                      <li>✅ Interacciones y contraindicaciones</li>
                    </ul>
                  </div>
                  
                  <div className="bg-neon-yellow text-gym-black p-4 font-bold text-center">
                    🔥 REGÍSTRATE para respuestas ilimitadas + 10% OFF en tu primera compra
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      className="flex-1 bg-transparent border-2 border-neon-yellow text-neon-yellow py-3 px-6 font-bold hover:bg-neon-yellow hover:text-gym-black transition-all"
                      onClick={() => {
                        setChatQuestions(prev => Math.max(0, prev - 1));
                        setShowChatModal(false);
                      }}
                    >
                      USAR PREGUNTA GRATIS
                    </button>
                    <button 
                      className="flex-1 bg-neon-yellow text-gym-black py-3 px-6 font-bold hover:bg-yellow-400 transition-all"
                      onClick={() => setShowChatModal(false)}
                    >
                      REGISTRARSE + 10% OFF
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark-gray py-12 border-t border-neon-yellow">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-4xl font-black text-neon-yellow mb-2">AMASFUNGIS</h3>
              <p className="text-white">Adaptógenos de élite para atletas sin excusas</p>
            </div>
            
            <div className="flex gap-8 mb-6 md:mb-0">
              <a href="#" className="text-white hover:text-neon-yellow transition-colors font-bold">FAQ</a>
              <a href="#" className="text-white hover:text-neon-yellow transition-colors font-bold">CONTACTO</a>
              <a href="#" className="text-white hover:text-neon-yellow transition-colors font-bold">TÉRMINOS</a>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-neon-yellow transition-colors text-2xl">📧</a>
              <a href="#" className="text-white hover:text-neon-yellow transition-colors text-2xl">📱</a>
              <a href="#" className="text-white hover:text-neon-yellow transition-colors text-2xl">💬</a>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400">© 2024 AmasFungis. Todos los derechos reservados. 💪</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
