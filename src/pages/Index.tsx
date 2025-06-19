
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Clock, Star, Brain, Shield, Zap, Heart, ArrowRight } from 'lucide-react';
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
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=600&fit=crop",
      benefits: ["Mejora VO2 max y recuperación", "Optimiza función respiratoria"],
      description: "Energía sostenible para atletas de élite"
    },
    {
      name: "MELENA DE LEÓN",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=600&fit=crop",
      benefits: ["Estimula factor NGF neuroplasticidad", "Mejora memoria y concentración"],
      description: "Potencia cognitiva para máximo rendimiento"
    },
    {
      name: "RHODIOLA ROSEA",
      image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=600&h=600&fit=crop",
      benefits: ["Reduce cortisol y fatiga adrenal", "Aumenta resistencia al estrés"],
      description: "Adaptación superior bajo presión"
    },
    {
      name: "REISHI",
      image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?w=600&h=600&fit=crop",
      benefits: ["Fortalece sistema inmunitario", "Mejora calidad del sueño REM"],
      description: "Recuperación y longevidad optimizada"
    }
  ];

  const testimonials = [
    {
      name: "Ana Martínez",
      sport: "Crossfit Competitivo",
      text: "Mi rendimiento en WODs mejoró 20% desde que uso AmasFungis. La diferencia es notable.",
      rating: 5
    },
    {
      name: "Carlos Ruiz",
      sport: "Triatlón Ironman",
      text: "Recuperación más rápida y energía constante durante entrenamientos largos.",
      rating: 5
    },
    {
      name: "Sofia Herrero",
      sport: "Yoga & Meditación",
      text: "Claridad mental excepcional. Mi práctica de mindfulness alcanzó otro nivel.",
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
    <div className="min-h-screen bg-carbon text-warm-white font-premium overflow-x-hidden antialiased">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-carbon to-graphite">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop')"
          }}
        />
        <div className="relative z-10 text-center container-premium animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
            Arranca hoy con<br />
            <span className="text-soft-yellow">Adaptógenos A+</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-12 max-w-4xl mx-auto text-gray-300 leading-relaxed">
            Claridad mental, energía prolongada y foco diario.<br />
            <span className="text-soft-yellow">Suplementos naturales con respaldo científico.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="btn-primary text-lg">
              <ArrowRight className="mr-2" size={20} />
              Ver productos
            </button>
            <button 
              className="btn-secondary text-lg"
              onClick={() => setShowChatModal(true)}
            >
              <MessageCircle className="mr-2" size={20} />
              Hablar con nuestro Coach IA
            </button>
          </div>
          
          {/* Scientific Authority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div className="bg-graphite/50 backdrop-blur-sm border border-soft-yellow/20 p-6 rounded-lg">
              <div className="text-3xl font-bold text-soft-yellow mb-2">300+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Estudios Científicos</div>
            </div>
            <div className="bg-graphite/50 backdrop-blur-sm border border-soft-yellow/20 p-6 rounded-lg">
              <div className="text-3xl font-bold text-soft-yellow mb-2">15K+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Atletas Activos</div>
            </div>
            <div className="bg-graphite/50 backdrop-blur-sm border border-soft-yellow/20 p-6 rounded-lg">
              <div className="text-3xl font-bold text-soft-yellow mb-2">4.9★</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Rating Promedio</div>
            </div>
          </div>
        </div>
      </section>

      {/* FLASH OFFER SECTION */}
      <section className="relative py-16 bg-graphite border-t border-b border-soft-yellow/30">
        <div className="absolute left-0 top-0 h-full w-2 bg-soft-yellow"></div>
        <div className="container-premium">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-soft-yellow">
                OFERTA ESPECIAL
              </h2>
              <p className="text-xl font-medium text-gray-300">
                Cupón <span className="bg-soft-yellow text-carbon px-3 py-1 rounded font-bold">BLACK10</span> - 10% OFF en tu primera compra
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-sm font-medium mb-3 text-gray-400 uppercase tracking-wide">Termina en:</div>
              <div className="flex gap-4 text-2xl font-bold">
                <div className="bg-carbon text-soft-yellow px-4 py-2 rounded-lg border border-soft-yellow/30">
                  {String(timeLeft.hours).padStart(2, '0')}
                  <div className="text-xs text-gray-400">HORAS</div>
                </div>
                <div className="bg-carbon text-soft-yellow px-4 py-2 rounded-lg border border-soft-yellow/30">
                  {String(timeLeft.minutes).padStart(2, '0')}
                  <div className="text-xs text-gray-400">MIN</div>
                </div>
                <div className="bg-carbon text-soft-yellow px-4 py-2 rounded-lg border border-soft-yellow/30">
                  {String(timeLeft.seconds).padStart(2, '0')}
                  <div className="text-xs text-gray-400">SEG</div>
                </div>
              </div>
            </div>
            
            <button className="btn-primary whitespace-nowrap">
              Comprar con descuento
            </button>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="section-padding bg-carbon">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Productos <span className="text-soft-yellow">Destacados</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              "Estudio publicado en Frontiers in Immunology, 2021"
            </p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out" 
                   style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {products.map((product, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-graphite/80 backdrop-blur-sm border border-soft-yellow/20 p-8 rounded-2xl text-center group hover:border-soft-yellow/50 transition-all duration-300">
                      <div className="relative mb-8">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-72 h-72 mx-auto rounded-2xl object-cover border-2 border-soft-yellow/30 group-hover:border-soft-yellow/60 transition-all duration-300"
                        />
                      </div>
                      
                      <h3 className="text-3xl font-bold mb-4 text-soft-yellow">
                        {product.name}
                      </h3>
                      
                      <p className="text-lg font-medium mb-6 text-gray-300">
                        {product.description}
                      </p>
                      
                      <div className="space-y-3 mb-8">
                        {product.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center text-left bg-carbon/50 p-4 rounded-lg border border-soft-yellow/10">
                            <div className="w-2 h-2 bg-soft-yellow rounded-full mr-3 flex-shrink-0"></div>
                            <div className="text-gray-300">{benefit}</div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="btn-secondary">
                        Ver más
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-soft-yellow text-carbon p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-soft-yellow text-carbon p-3 rounded-full hover:scale-110 transition-transform shadow-lg"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Testimonials */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-graphite/60 backdrop-blur-sm border border-soft-yellow/20 p-6 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-soft-yellow text-soft-yellow" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="text-soft-yellow font-semibold">
                  {testimonial.name}
                </div>
                <div className="text-gray-400 text-sm">
                  {testimonial.sport}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAT HOOK SECTION */}
      <section className="section-padding bg-carbon border-t border-soft-yellow/30">
        <div className="container-premium text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              ¿Dudas? Habla <span className="text-soft-yellow">GRATIS</span><br />
              con nuestro Coach IA
            </h2>
            <p className="text-xl font-medium mb-8 text-gray-300">
              Haz hasta <span className="text-soft-yellow font-bold">{chatQuestions} preguntas</span> antes de registrarte
            </p>
            <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto">
              Planes personalizados • Dosis exactas • Timing perfecto • Stacks potentes
            </p>
            
            <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
              <DialogTrigger asChild>
                <button className="btn-primary text-xl premium-glow">
                  <MessageCircle className="mr-3" />
                  Iniciar Chat
                </button>
              </DialogTrigger>
              <DialogContent className="bg-graphite border-2 border-soft-yellow/30 text-warm-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center mb-6 text-soft-yellow">
                    Coach IA - AmasFungis
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="bg-carbon/80 p-6 border border-soft-yellow/20 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-soft-yellow">
                      Tienes {chatQuestions} preguntas gratis
                    </h3>
                    <p className="text-gray-300 mb-4">
                      Nuestro Coach IA especializado en adaptógenos te ayudará con:
                    </p>
                    <ul className="text-left space-y-2 text-gray-300">
                      <li className="flex items-center"><div className="w-2 h-2 bg-soft-yellow rounded-full mr-3"></div>Plan personalizado según tu deporte</li>
                      <li className="flex items-center"><div className="w-2 h-2 bg-soft-yellow rounded-full mr-3"></div>Dosis exactas para máximos resultados</li>
                      <li className="flex items-center"><div className="w-2 h-2 bg-soft-yellow rounded-full mr-3"></div>Timing perfecto de suplementación</li>
                      <li className="flex items-center"><div className="w-2 h-2 bg-soft-yellow rounded-full mr-3"></div>Stacks potentes para objetivos específicos</li>
                    </ul>
                  </div>
                  
                  <div className="bg-soft-yellow/10 border border-soft-yellow/30 text-soft-yellow p-4 rounded-lg font-medium text-center">
                    Regístrate para respuestas ilimitadas + 10% OFF en tu primera compra
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      className="flex-1 btn-secondary"
                      onClick={() => {
                        setChatQuestions(prev => Math.max(0, prev - 1));
                        setShowChatModal(false);
                      }}
                    >
                      USAR PREGUNTA GRATIS
                    </button>
                    <button 
                      className="flex-1 btn-primary"
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
      <footer className="bg-graphite py-12 border-t border-soft-yellow/30">
        <div className="container-premium">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-3xl font-bold text-soft-yellow mb-2">AMASFUNGIS</h3>
              <p className="text-gray-400">Adaptógenos premium para máximo rendimiento</p>
            </div>
            
            <div className="flex gap-8 mb-6 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-soft-yellow transition-colors font-medium">Tienda</a>
              <a href="#" className="text-gray-400 hover:text-soft-yellow transition-colors font-medium">Contacto</a>
              <a href="#" className="text-gray-400 hover:text-soft-yellow transition-colors font-medium">FAQ</a>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-graphite border border-soft-yellow/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-soft-yellow hover:border-soft-yellow/60 transition-colors cursor-pointer">
                IG
              </div>
              <div className="w-10 h-10 bg-graphite border border-soft-yellow/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-soft-yellow hover:border-soft-yellow/60 transition-colors cursor-pointer">
                WA
              </div>
              <div className="w-10 h-10 bg-graphite border border-soft-yellow/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-soft-yellow hover:border-soft-yellow/60 transition-colors cursor-pointer">
                YT
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-soft-yellow/20">
            <p className="text-gray-500">© 2024 AmasFungis. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
