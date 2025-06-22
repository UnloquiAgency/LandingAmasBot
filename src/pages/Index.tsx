
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Clock, Star, Brain, Shield, Zap, Heart, ArrowRight, FlaskConical, Award, Users, X, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 27,
    seconds: 0
  });
  const [chatQuestions, setChatQuestions] = useState(5);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: '¡Hola! Soy AmasBot, tu asistente especializado en adaptógenos. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

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

  const handleSendMessage = () => {
    if (inputMessage.trim() && chatQuestions > 0) {
      setChatMessages(prev => [...prev, 
        { type: 'user', message: inputMessage },
        { type: 'bot', message: 'Gracias por tu pregunta. Basándome en tu perfil, te recomiendo comenzar con Rhodiola para el estrés y Cordyceps para el rendimiento. ¿Practicas algún deporte específico?' }
      ]);
      setChatQuestions(prev => prev - 1);
      setInputMessage('');
    }
  };

  const products = [
    {
      name: "RHODIOLA ROSEA",
      subtitle: "3% Salidrosidos",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&q=80",
      benefits: [
        "↓ Cortisol 28% → Acta Neuropsychiatrica, 2022",
        "↑ Foco +15% (P3 ERP) → Nordic J. of Psychiatry, 2007",
        "↑ BDNF +40% → J. of Ethnopharmacology, 2014"
      ],
      description: "Usada por pilotos soviéticos para resistir estrés extremo",
      icon: "🧠"
    },
    {
      name: "REISHI",
      subtitle: "Ganoderma lucidum 4:1",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=600&fit=crop&q=80",
      benefits: [
        "↑ Macrófagos +25% → Frontiers in Immunology, 2021",
        "↓ Latencia de sueño 50% → Sleep Medicine, 2019",
        "↑ Sueño NREM 15% → J. Ethnopharmacology, 2020"
      ],
      description: "Conocido como el \"Hongo de los 10.000 años\"",
      icon: "🌙"
    },
    {
      name: "MELENA DE LEÓN",
      subtitle: "20:1",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&h=600&fit=crop&q=80",
      benefits: [
        "↑ NGF 60%, BDNF 25% → J. Agric. Food Chem., 2014",
        "↓ Errores de memoria 18% → Wiley OL, 2021"
      ],
      description: "Usado por monjes zen para claridad mental",
      icon: "🧩"
    },
    {
      name: "ASHWAGANDHA",
      subtitle: "5:1",
      image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=600&h=600&fit=crop&q=80",
      benefits: [
        "↓ Cortisol ~30% → Indian J. Psych. Medicine, 2012",
        "↑ Testosterona 17% → J. ISSN, 2015",
        "↑ Fuerza 10% → J. Ethnopharmacology, 2016"
      ],
      description: "\"Ashwa\" = caballo. Potencia física y mental ancestral",
      icon: "💪"
    },
    {
      name: "CORDYCEPS MILITARIS",
      subtitle: "8:1",
      image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?w=600&h=600&fit=crop&q=80",
      benefits: [
        "↑ VO₂ max +5 ml/kg/min → M&S in Sports, 2020",
        "↑ TTE +70s → MSSE, 2004",
        "↑ ATP & mitocondrias → Phytomedicine, 2011"
      ],
      description: "Usado por astronautas chinos y corredores tibetanos",
      icon: "🫁"
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

  const studies = [
    {
      title: "Mejora del Rendimiento Cognitivo",
      journal: "Journal of Cognitive Enhancement",
      year: "2023",
      result: "+22% en memoria de trabajo",
      participants: "180 atletas"
    },
    {
      title: "Reducción del Estrés Oxidativo",
      journal: "Sports Medicine Research",
      year: "2022",
      result: "-35% marcadores inflamatorios",
      participants: "240 deportistas"
    },
    {
      title: "Optimización del Sueño REM",
      journal: "Sleep & Recovery Sciences",
      year: "2023",
      result: "+40% calidad de sueño",
      participants: "156 atletas élite"
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
      <section className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: "url('/lovable-uploads/c024332f-c716-4a99-9f96-0249ee604e1c.png')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon/95 via-carbon/80 to-carbon/70"></div>
        <div className="relative z-10 text-center container-premium animate-fade-in">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="/lovable-uploads/21388e86-11e0-4546-982e-809742308e1e.png" 
              alt="AmasFungis Logo" 
              className="h-16 w-auto mr-4"
            />
            <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight">
              Adaptógenos A+
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-medium mb-12 max-w-4xl mx-auto text-gray-300 leading-relaxed">
            Claridad mental, energía prolongada y foco diario.<br />
            <span className="text-soft-yellow">Suplementos naturales con respaldo científico.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group relative bg-gradient-to-r from-soft-yellow to-yellow-400 text-carbon font-bold py-4 px-10 rounded-xl hover:from-yellow-400 hover:to-soft-yellow transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-soft-yellow/20">
              <div className="flex items-center">
                <ArrowRight className="mr-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                <span className="text-lg">Ver Productos Premium</span>
              </div>
            </button>
            
            <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
              <DialogTrigger asChild>
                <button className="group relative bg-transparent border-2 border-soft-yellow text-soft-yellow font-bold py-4 px-10 rounded-xl hover:bg-soft-yellow hover:text-carbon transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <div className="flex items-center">
                    <MessageCircle className="mr-3 group-hover:rotate-12 transition-transform duration-300" size={20} />
                    <span className="text-lg">Hablar con AmasBot</span>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-carbon border-2 border-soft-yellow/30 text-warm-white max-w-md sm:max-w-lg max-h-[80vh] p-0 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-soft-yellow/20 to-soft-yellow/10 p-6 border-b border-soft-yellow/20">
                  <DialogTitle className="text-2xl font-bold text-center text-soft-yellow flex items-center justify-center">
                    <Brain className="mr-3" size={28} />
                    AmasBot IA
                  </DialogTitle>
                  <p className="text-center text-gray-300 mt-2">
                    {chatQuestions} preguntas gratuitas restantes
                  </p>
                </div>
                
                <div className="flex flex-col h-96">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                          msg.type === 'user' 
                            ? 'bg-soft-yellow text-carbon ml-4' 
                            : 'bg-graphite border border-soft-yellow/20 text-gray-100 mr-4'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-soft-yellow/20 bg-graphite/50">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={chatQuestions > 0 ? "Escribe tu pregunta..." : "Regístrate para más preguntas"}
                        disabled={chatQuestions === 0}
                        className="flex-1 bg-carbon border border-soft-yellow/30 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-soft-yellow/60 disabled:opacity-50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={chatQuestions === 0 || !inputMessage.trim()}
                        className="bg-soft-yellow text-carbon p-3 rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                    
                    {chatQuestions === 0 && (
                      <div className="mt-4 p-3 bg-soft-yellow/10 border border-soft-yellow/30 rounded-lg text-center">
                        <p className="text-soft-yellow font-medium text-sm">
                          ¡Regístrate para preguntas ilimitadas + 10% OFF!
                        </p>
                        <button className="mt-2 bg-soft-yellow text-carbon px-4 py-2 rounded-lg font-medium text-sm hover:bg-yellow-400 transition-colors">
                          Registrarse Ahora
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                Cupón <span className="bg-soft-yellow text-carbon px-3 py-1 rounded font-bold">AMASAL10</span> - 10% OFF
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
              Fórmulas premium respaldadas por investigación científica rigurosa
            </p>
          </div>
          
          <div className="relative max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out" 
                   style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {products.map((product, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-graphite/80 backdrop-blur-sm border border-soft-yellow/20 p-6 rounded-2xl group hover:border-soft-yellow/50 transition-all duration-300">
                      <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                          <div className="relative mb-6">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-64 lg:h-80 rounded-xl object-cover border-2 border-soft-yellow/30 group-hover:border-soft-yellow/60 transition-all duration-300"
                            />
                            <div className="absolute top-4 left-4 text-4xl">
                              {product.icon}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-2xl lg:text-3xl font-bold mb-2 text-soft-yellow">
                            {product.name}
                          </h3>
                          <p className="text-lg text-gray-400 mb-6">
                            {product.subtitle}
                          </p>
                          
                          <div className="space-y-3 mb-6">
                            {product.benefits.map((benefit, i) => (
                              <div key={i} className="flex items-start text-sm bg-carbon/50 p-3 rounded-lg border border-soft-yellow/10">
                                <div className="w-2 h-2 bg-soft-yellow rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                <div className="text-gray-300">{benefit}</div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="bg-soft-yellow/10 border border-soft-yellow/30 p-4 rounded-lg mb-6">
                            <p className="text-soft-yellow font-medium text-sm">
                              💡 {product.description}
                            </p>
                          </div>
                          
                          <button className="btn-secondary w-full lg:w-auto">
                            Ver más
                          </button>
                        </div>
                      </div>
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
        </div>
      </section>

      {/* STUDIES SECTION */}
      <section className="section-padding bg-gradient-to-b from-carbon via-green-950/30 to-carbon">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Respaldo <span className="text-green-400">Científico</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Investigación clínica que valida la eficacia de nuestras fórmulas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {studies.map((study, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60"></div>
                <div className="relative bg-gradient-to-br from-green-950/60 to-carbon/90 backdrop-blur-sm border border-green-400/30 p-8 rounded-2xl hover:border-green-400/60 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="flex items-center mb-6">
                    <div className="bg-green-400/20 p-3 rounded-xl mr-4">
                      <FlaskConical className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-green-400 font-bold text-sm tracking-wide">ESTUDIO CLÍNICO</div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-6 text-white leading-tight">
                    {study.title}
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-green-950/30 rounded-lg border border-green-400/20">
                      <span className="text-gray-400 text-sm font-medium">Revista:</span>
                      <span className="text-green-300 text-sm font-semibold">{study.journal}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-950/30 rounded-lg border border-green-400/20">
                      <span className="text-gray-400 text-sm font-medium">Año:</span>
                      <span className="text-green-300 text-sm font-semibold">{study.year}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-950/30 rounded-lg border border-green-400/20">
                      <span className="text-gray-400 text-sm font-medium">Participantes:</span>
                      <span className="text-green-300 text-sm font-semibold">{study.participants}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-400/20 to-green-500/20 border border-green-400/40 p-6 rounded-xl text-center">
                    <div className="text-green-400 font-bold text-xl mb-2">
                      {study.result}
                    </div>
                    <div className="text-green-300 text-sm font-medium">Resultado comprobado</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-carbon">
        <div className="container-premium">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              ¿Dudas? <span className="text-soft-yellow">Chatea gratis</span><br />
              con AmasBot
            </h2>
            <p className="text-xl font-medium mb-8 text-gray-300">
              Nuevo asistente de inteligencia artificial
            </p>
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
