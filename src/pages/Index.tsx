import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Clock, Star, Brain, Shield, Zap, Heart, ArrowRight, FlaskConical, Award, Users, X, Send, ArrowDown, Square } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
// --- SUPABASE ---
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://xjgsdhlkpijsrapzqyqu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqZ3NkaGxrcGlqc3JhcHpxeXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTY1NzQsImV4cCI6MjA2NTc5MjU3NH0.SkhFlC9wbziXdqhCGQ_qXsxkiChQikLfQDaKooS3rj4';
const supabase = createClient(supabaseUrl, supabaseKey);

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 27,
    seconds: 0
  });
  const [chatQuestions, setChatQuestions] = useState(5);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  // Session ID persistente
  function getSessionId() {
    let sessionId = localStorage.getItem('amasbot_sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('amasbot_sessionId', sessionId);
    }
    return sessionId;
  }
  const [sessionId, setSessionId] = useState(getSessionId());

  // Reiniciar sesión
  function resetSession() {
    const newId = crypto.randomUUID();
    localStorage.setItem('amasbot_sessionId', newId);
    setSessionId(newId);
    setChatMessages([]);
    setOnboardingActive(true);
    setConnectionStatus('idle');
    setWizardStep('connect');
    setShowAmasbot(true);
    localStorage.removeItem('amasbot_started');
  }

  // Manejo de stage
  const [currentStage, setCurrentStage] = useState(null);

  // Countdown timer con fingerprint persistente
  useEffect(() => {
    // Duración total del countdown en segundos (ejemplo: 27 minutos)
    const COUNTDOWN_SECONDS = 27 * 60;
    // Intentar recuperar el timestamp de inicio del countdown
    let countdownStart = localStorage.getItem('amasfungis_countdown_start');
    if (!countdownStart) {
      countdownStart = Date.now().toString();
      localStorage.setItem('amasfungis_countdown_start', countdownStart);
    }
    const startTimestamp = parseInt(countdownStart, 10);

    function updateCountdown() {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimestamp) / 1000);
      const remaining = Math.max(COUNTDOWN_SECONDS - elapsed, 0);
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;
      setTimeLeft({ hours, minutes, seconds });
      if (remaining === 0) {
        // Si termina, reinicia el fingerprint para un nuevo ciclo
        localStorage.removeItem('amasfungis_countdown_start');
      }
    }

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Estados para control de request y stop
  const [pendingRequestId, setPendingRequestId] = useState(null);
  const [cancelledRequests, setCancelledRequests] = useState(new Set());

  // Estados para el wizard de onboarding
  const [wizardStep, setWizardStep] = useState<'connect' | 'name' | 'email' | 'chat'>('connect');
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingEmail, setOnboardingEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [toastError, setToastError] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [isSubmittingName, setIsSubmittingName] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  // Estado para guardar el paso actual del wizard aunque se cierre
  const [lastWizardStep, setLastWizardStep] = useState<'connect' | 'name' | 'email' | 'chat'>('connect');

  // Cuando cambia wizardStep (excepto 'chat'), guarda el último paso
  useEffect(() => {
    if (wizardStep !== 'chat') setLastWizardStep(wizardStep);
  }, [wizardStep]);

  // Envío de mensaje y fetch a n8n con control de stop
  async function handleSendMessage() {
    if (!inputMessage.trim() || pendingRequestId) return;
    if (inputMessage.length > 1000) {
      setChatMessages(prev => [...prev, { type: 'bot', message: 'El mensaje es demasiado largo. Por favor, reduce tu consulta a menos de 1000 caracteres.' }]);
      return;
    }
    const userMsg = { type: 'user', message: inputMessage };
    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    const requestId = crypto.randomUUID();
    setPendingRequestId(requestId);
    try {
      const res = await fetch('https://unloquiagency.app.n8n.cloud/webhook/chat-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          chatInput: userMsg.message
        })
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        setPendingRequestId(null);
        return;
      }
      // Si la respuesta es el error de email, mostrar toast y no avanzar
      if (data && typeof data.message === 'string' && data.message.includes('correo no parece válido')) {
        setToastError(data.message);
        setPendingRequestId(null);
        return;
      }
      // Si estamos en el paso de email y la respuesta no es error, pasar a chat normal
      if (wizardStep === 'email') {
        setWizardStep('chat');
      }
      if (data && typeof data.message === 'string' && data.message.trim()) {
        const botMsg = {
          type: 'bot',
          message: data.message,
          imageUrl: data.imageUrl,
        };
        setChatMessages(prev => [...prev, botMsg]);
      }
      setPendingRequestId(null);
    } catch (e) {
        setChatMessages(prev => [...prev, { type: 'bot', message: 'Error de conexión: ' + (e?.message || e) }]);
      setPendingRequestId(null);
    }
  }

  // Botón Stop: cancela el request pendiente
  function handleStopRequest() {
    if (pendingRequestId) {
      setCancelledRequests(prev => new Set(prev).add(pendingRequestId));
      setPendingRequestId(null);
      setIsTyping(false);
    }
  }

  const products = [
    {
      display: "Melena de León",
      scientific: "Hericium erinaceus",
      icon: "🍄",
      subtitle: "Extracto 20 : 1",
      image: "/assets/melenadeleon.png",
      benefits: [
        "↑ NGF 60%, BDNF 25% → J. Agric. Food Chem., 2014",
        "↓ Errores de memoria 18% → Wiley OL, 2021"
      ],
      description: "Usado por monjes zen para claridad mental"
    },
    {
      display: "Ashwagandha",
      scientific: "Withania somnifera",
      icon: "🌱",
      subtitle: "Extracto 5 : 1",
      image: "/assets/ashwaganda.png",
      benefits: [
        "↓ Cortisol ~30% → Indian J. Psych. Medicine, 2012",
        "↑ Testosterona 17% → J. ISSN, 2015",
        "↑ Fuerza 10% → J. Ethnopharmacology, 2016"
      ],
      description: "\"Ashwa\" = caballo. Potencia física y mental ancestral"
    },
    {
      display: "Cordyceps",
      scientific: "Cordyceps militaris",
      icon: "🍄",
      subtitle: "Extracto 10: 1",
      image: "/assets/cordyceps.png",
      benefits: [
        "↑ VO₂ max +5 ml/kg/min → M&S in Sports, 2020",
        "↑ TTE +70s → MSSE, 2004",
        "↑ ATP & mitocondrias → Phytomedicine, 2011"
      ],
      description: "Usado por astronautas chinos y corredores tibetanos"
    },
    {
      display: "Rhodiola",
      scientific: "Rhodiola rosea",
      icon: "🌿",
      subtitle: "3 % Salidrosidos",
      image: "/assets/rhodiolarosea.png",
      benefits: [
        "↓ Cortisol 28% → Acta Neuropsychiatrica, 2022",
        "↑ Foco +15% (P3 ERP) → Nordic J. of Psychiatry, 2007",
        "↑ BDNF +40% → J. of Ethnopharmacology, 2014"
      ],
      description: "Usada por pilotos soviéticos para resistir estrés extremo"
    },
    {
      display: "Reishi",
      scientific: "Ganoderma lucidum",
      icon: "🍄",
      subtitle: "Extracto 4 : 1",
      image: "/assets/reishi.png",
      benefits: [
        "↑ Macrófagos +25% → Frontiers in Immunology, 2021",
        "↓ Latencia de sueño 50% → Sleep Medicine, 2019",
        "↑ Sueño NREM 15% → J. Ethnopharmacology, 2020"
      ],
      description: "Conocido como el \"Hongo de los 10.000 años\""
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

  const estudios = [
    {
      suplemento: "Melena de León",
      titulo: "Neurogénesis y Creatividad",
      referencia: "Journal of Neurochemistry",
      año: 2021,
      participantes: "65 adultos jóvenes",
      resultado: "+45% NGF (factor de crecimiento nervioso)",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Ashwagandha",
      titulo: "Reducción de Estrés Crónico",
      referencia: "Indian Journal of Psychological Medicine",
      año: 2019,
      participantes: "60 adultos",
      resultado: "-44% puntaje de ansiedad (DASS-21)",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Cordyceps",
      titulo: "Aumento de VO₂ máx (Resistencia)",
      referencia: "Medicine & Science in Sports",
      año: 2020,
      participantes: "36 atletas",
      resultado: "+5.6 ml/kg/min VO₂ máx",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Reishi",
      titulo: "Refuerzo Inmune Natural",
      referencia: "Frontiers in Immunology",
      año: 2021,
      participantes: "70 adultos",
      resultado: "+34% actividad de células NK",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Rhodiola Rosea",
      titulo: "Resiliencia al Estrés Laboral",
      referencia: "Acta Neuropsychiatrica",
      año: 2022,
      participantes: "100 adultos con alta carga laboral",
      resultado: "-28% cortisol salival",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Melena de León",
      titulo: "Mejora de la Memoria Visual",
      referencia: "Phytotherapy Research",
      año: 2020,
      participantes: "50 personas con estrés laboral",
      resultado: "+20% en tareas de memoria visual",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Ashwagandha",
      titulo: "Mejor Recuperación Muscular",
      referencia: "Journal of the International Society of Sports Nutrition",
      año: 2020,
      participantes: "57 deportistas",
      resultado: "+18% fuerza en press de banca",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Cordyceps",
      titulo: "Reducción de Fatiga Muscular",
      referencia: "Journal of Dietary Supplements",
      año: 2019,
      participantes: "40 corredores",
      resultado: "-29% percepción de fatiga",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Reishi",
      titulo: "Poder Antioxidante en Sangre",
      referencia: "Journal of Functional Foods",
      año: 2022,
      participantes: "52 personas",
      resultado: "+31% capacidad antioxidante plasmática",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Rhodiola Rosea",
      titulo: "Atención y Velocidad Mental",
      referencia: "Nordic Journal of Psychiatry",
      año: 2007,
      participantes: "60 estudiantes",
      resultado: "+15% puntuación en pruebas de reacción",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Melena de León",
      titulo: "Reducción de Ansiedad Social",
      referencia: "Biomedical Research",
      año: 2022,
      participantes: "42 adultos",
      resultado: "-32% puntuación de ansiedad",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Ashwagandha",
      titulo: "Regulación del Sueño Profundo",
      referencia: "PLOS One",
      año: 2022,
      participantes: "58 adultos con insomnio",
      resultado: "+26% tiempo de sueño reparador",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Cordyceps",
      titulo: "Mejora del Rendimiento Anaeróbico",
      referencia: "International Journal of Medicinal Mushrooms",
      año: 2021,
      participantes: "60 ciclistas",
      resultado: "+15% potencia en sprint",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Reishi",
      titulo: "Sueño Reparador",
      referencia: "Evidence-Based Complementary and Alternative Medicine",
      año: 2021,
      participantes: "41 adultos mayores",
      resultado: "+28% tiempo de sueño profundo",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Rhodiola Rosea",
      titulo: "Reducción de Fatiga en Deportistas",
      referencia: "Phytomedicine",
      año: 2017,
      participantes: "70 corredores",
      resultado: "-24% sensación de fatiga",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Melena de León",
      titulo: "Mejor Desempeño Cognitivo bajo presión",
      referencia: "Evidence-Based Complementary and Alternative Medicine",
      año: 2020,
      participantes: "38 estudiantes",
      resultado: "+18% en tests de foco",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Ashwagandha",
      titulo: "Reducción de Cortisol",
      referencia: "Journal of Ayurveda and Integrative Medicine",
      año: 2021,
      participantes: "100 adultos",
      resultado: "-27% cortisol salival",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Cordyceps",
      titulo: "Recuperación Post-Entreno",
      referencia: "Frontiers in Pharmacology",
      año: 2022,
      participantes: "50 deportistas",
      resultado: "+23% velocidad de recuperación",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Reishi",
      titulo: "Reducción de Inflamación",
      referencia: "International Immunopharmacology",
      año: 2020,
      participantes: "55 personas con estrés",
      resultado: "-37% marcadores inflamatorios",
      descripcion: "Resultado comprobado"
    },
    {
      suplemento: "Rhodiola Rosea",
      titulo: "Mejora de Memoria y Aprendizaje",
      referencia: "Journal of Ethnopharmacology",
      año: 2014,
      participantes: "49 adultos",
      resultado: "+40% BDNF (protección neuronal)",
      descripcion: "Resultado comprobado"
    }
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  // Estado para mostrar/ocultar el chat flotante
  const [showAmasbot, setShowAmasbot] = useState(false);

  // Ref para auto-scroll
  const chatEndRef = useRef(null);

  // Estado para mostrar/ocultar el botón de scroll to bottom
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const chatBodyRef = useRef(null);

  // Detectar si el usuario está abajo del todo
  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;
    const handleScroll = () => {
      const atBottom = chatBody.scrollHeight - chatBody.scrollTop - chatBody.clientHeight < 60;
      setShowScrollBtn(!atBottom);
    };
    chatBody.addEventListener('scroll', handleScroll);
    return () => chatBody.removeEventListener('scroll', handleScroll);
  }, [showAmasbot]);

  // Scroll automático al fondo
  useEffect(() => {
    if (showAmasbot && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showAmasbot]);

  // Estado de typing (animación de escribiendo...)
  const [isTyping, setIsTyping] = useState(false);
  // Detectar si el último mensaje es del usuario y el bot está "respondiendo"
  useEffect(() => {
    if (!showAmasbot) return;
    if (chatMessages.length === 0) return setIsTyping(false);
    const last = chatMessages[chatMessages.length - 1];
    // Solo mostrar typing si hay request pendiente y no fue cancelado
    setIsTyping(last.type === 'user' && !!pendingRequestId);
  }, [chatMessages, showAmasbot, pendingRequestId]);

  // Scroll automático al fondo también cuando isTyping cambia
  useEffect(() => {
    if (showAmasbot && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showAmasbot, isTyping]);

  // Chips de sugerencias (puedes personalizar las preguntas)
  const sugerencias = [
    '¿Qué son los adaptógenos y cómo me ayudan?',
    '¿Cómo hago un pedido?'
  ];

  // Cerrar el chat al hacer click fuera del modal
  function handleModalClick(e) {
    if (e.target.classList.contains('amasbot-chat-modal')) {
      setShowAmasbot(false);
    }
  }

  // Estado para transición de onboarding y conexión
  const [onboardingActive, setOnboardingActive] = useState(() => {
    // Solo mostrar onboarding si no existe el flag en localStorage
    return !localStorage.getItem('amasbot_started');
  });
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'loading' | 'connected'>(
    localStorage.getItem('amasbot_started') ? 'connected' : 'idle'
  );

  // DEBUG: log de estados principales
  console.log('showAmasbot', showAmasbot, 'onboardingActive', onboardingActive, 'wizardStep', wizardStep);

  // Nueva función para abrir el chat o el wizard según el estado de la sesión
  function openWizardOrChat() {
    if (localStorage.getItem('amasbot_started') === 'true' || connectionStatus === 'connected') {
      setShowAmasbot(true);
      setOnboardingActive(false); // Muestra el chat normal
    } else {
      setShowAmasbot(true);
      setOnboardingActive(true);  // Muestra el wizard
      setWizardStep(lastWizardStep);
    }
  }

  // Modal de contacto
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    // Validación básica del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      alert('Por favor ingresa un email válido.');
      setIsSending(false);
      return;
    }
    
    try {
      // Formspree configuration - simple and direct
      const formData = new FormData();
      formData.append('name', contactForm.name);
      formData.append('email', contactForm.email);
      formData.append('subject', contactForm.subject);
      formData.append('message', contactForm.message);
      formData.append('_replyto', contactForm.email);

      const response = await fetch('https://formspree.io/f/xanjpabq', {
          method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setContactSuccess(true);
        setContactForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => {
          setShowContactModal(false);
          setContactSuccess(false);
        }, 2000);
      } else {
        throw new Error('Error sending email');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      alert('Error al enviar el mensaje. Por favor intenta de nuevo.');
    } finally {
      setIsSending(false);
    }
  };

  // Cambios en la sección de estudios para mostrar solo 3 estudios a la vez en el carrusel
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);
  const estudiosToShow = estudios.slice(currentStudyIndex, currentStudyIndex + 3);

  const handlePrevStudy = () => {
    setCurrentStudyIndex((prev) => (prev - 1 + estudios.length) % estudios.length);
  };
  const handleNextStudy = () => {
    setCurrentStudyIndex((prev) => (prev + 1) % estudios.length);
  };

  // Estado para mostrar el modal de términos
  const [showTerms, setShowTerms] = useState(false);

  return (
    <div className="min-h-screen bg-carbon text-warm-white font-premium overflow-x-hidden antialiased">
      
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-85"
          style={{
            backgroundImage: "url('/lovable-uploads/c024332f-c716-4a99-9f96-0249ee604e1c.png')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon/95 via-carbon/80 to-carbon/70"></div>
        <div className="relative z-10 text-center container-premium animate-fade-in">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight">
              Adaptógenos<img
                src="/assets/logoamasfungis.png"
                alt="AmasFungis Logo"
                className="inline-logo"
                style={{height: '1.35em', width: 'auto', marginLeft: '0.05em', marginTop: '-0.18em', verticalAlign: 'middle'}}
                loading="lazy"
              />
            </h1>
          </div>
          <p className="text-xl md:text-2xl font-medium mb-12 max-w-4xl mx-auto text-gray-300 leading-relaxed">
            Claridad mental, energía prolongada y foco diario.<br />
            <span className="text-soft-yellow">Suplementos naturales con respaldo científico.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <a
              href="https://amasfungis.com/shop-2/"
              className="group relative bg-gradient-to-r from-soft-yellow to-yellow-400 text-carbon font-bold py-4 px-10 rounded-xl hover:from-yellow-400 hover:to-soft-yellow transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-soft-yellow/20"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex items-center">
                <ArrowRight className="mr-3 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                <span className="text-lg">Ver Productos</span>
              </div>
            </a>
            
            <button
              className="group relative bg-transparent border-2 border-soft-yellow text-soft-yellow font-bold py-4 px-10 rounded-xl hover:bg-soft-yellow hover:text-carbon transition-all duration-300 transform hover:scale-105 shadow-lg"
              type="button"
              onClick={openWizardOrChat}
            >
                  <div className="flex items-center">
                    <MessageCircle className="mr-3 group-hover:rotate-12 transition-transform duration-300" size={20} />
                    <span className="text-lg">Hablar con AmasBot</span>
                  </div>
                </button>
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
            
            <a
              href="https://amasfungis.com/shop-2/"
              className="btn-primary whitespace-nowrap"
              style={{ display: 'inline-block', textAlign: 'center' }}
            >
              Comprar con descuento
            </a>
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
                              alt={product.display}
                              className="w-full h-64 lg:h-80 rounded-xl object-cover border-2 border-soft-yellow/30 group-hover:border-soft-yellow/60 transition-all duration-300"
                              loading="lazy"
                            />
                            <div className="absolute top-4 left-4 text-4xl">
                              {product.icon}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-2xl lg:text-3xl font-bold mb-2 text-soft-yellow flex items-center gap-2">
                            {product.display}
                            <span className="text-xs font-semibold text-yellow-200 bg-yellow-400/10 border border-yellow-300/30 rounded px-2 py-0.5 ml-2 align-middle" style={{letterSpacing: '0.04em'}}>{product.subtitle}</span>
                          </h3>
                          <span className="block text-sm text-yellow-100/80 mb-2 ml-7" style={{fontSize:'0.93em', fontWeight:400}}>
                            ({product.scientific})
                          </span>
                          
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
          <div className="relative">
            <div className="embla py-4">
              <div className="embla__container">
                {estudiosToShow.map((study, index) => (
                  <div key={index} className="embla__slide">
                    <div className="relative group h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-300/5 to-green-600/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-40 pointer-events-none"></div>
                      <div className="relative bg-gradient-to-br from-green-950/60 to-carbon/90 backdrop-blur-sm border border-green-400/30 p-8 rounded-2xl hover:border-green-400/60 transition-all duration-300 hover:transform hover:scale-105 h-full flex flex-col">
                        <div className="flex-grow">
                  <div className="flex items-center mb-6">
                    <div className="bg-green-400/20 p-3 rounded-xl mr-4">
                      <FlaskConical className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-green-400 font-bold text-sm tracking-wide">ESTUDIO CLÍNICO</div>
                  </div>
                  
                          <h3 className="text-xl font-bold mb-6 text-white leading-tight min-h-[56px]">
                            {study.titulo}
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center p-3 bg-green-950/30 rounded-lg border border-green-400/20 min-h-[52px]">
                              <span className="text-gray-400 text-sm font-medium mr-2 flex-shrink-0">Suplemento:</span>
                              <span className="text-green-300 text-sm font-semibold text-right">{study.suplemento}</span>
                            </div>
                            <div className="flex flex-col justify-between p-3 bg-green-950/30 rounded-lg border border-green-400/20 min-h-[80px]">
                              <span className="text-gray-400 text-sm font-medium mr-2 flex-shrink-0">Estudio Publicado en:</span>
                              <span className="text-green-300 text-sm font-semibold text-right break-words mt-1">{study.referencia}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-950/30 rounded-lg border border-green-400/20 min-h-[52px]">
                      <span className="text-gray-400 text-sm font-medium">Año:</span>
                              <span className="text-green-300 text-sm font-semibold">{study.año}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-green-950/30 rounded-lg border border-green-400/20 min-h-[60px]">
                              <span className="text-gray-400 text-sm font-medium mr-2 flex-shrink-0">Participantes:</span>
                              <span className="text-green-300 text-sm font-semibold text-right break-words">{study.participantes}</span>
                    </div>
                    </div>
                  </div>
                  
                        <div className="bg-gradient-to-r from-green-400/20 to-green-500/20 border border-green-400/40 p-6 rounded-xl text-center flex flex-col justify-center min-h-[130px]">
                    <div className="text-green-400 font-bold text-xl mb-2">
                            {study.resultado}
                          </div>
                          <div className="text-green-300 text-sm font-medium">{study.descripcion}</div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={handlePrevStudy}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-green-500/80 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNextStudy}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-green-500/80 text-white p-3 rounded-full hover:scale-110 transition-transform shadow-lg z-10"
            >
              <ChevronRight size={24} />
            </button>
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
            <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto">
              Planes personalizados • Dosis exactas • Timing perfecto • Stacks potentes
            </p>
            
            <button
              className="btn-primary text-xl premium-glow px-10 py-4 rounded-2xl shadow-lg flex items-center gap-3 justify-center hover:scale-105 transition-all duration-300 mx-auto"
              type="button"
              onClick={openWizardOrChat}
            >
              <MessageCircle className="mr-2" size={26} />
              <span>¡Habla ahora con AmasBot!</span>
                </button>
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
              <a href="https://amasfungis.com/shop-2/" className="text-gray-400 hover:text-soft-yellow transition-colors font-medium">Tienda</a>
              <a href="#" className="text-gray-400 hover:text-soft-yellow transition-colors font-medium" onClick={e => { e.preventDefault(); setShowContactModal(true); }}>Contacto</a>
              <a href="#" className="text-gray-400 hover:text-soft-yellow transition-colors font-medium">FAQ</a>
            </div>
            
            <div className="flex gap-4">
              <a href="https://www.instagram.com/amasfungis/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-graphite border border-soft-yellow/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-soft-yellow hover:border-soft-yellow/60 transition-colors cursor-pointer" title="Instagram">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-soft-yellow/20">
            <p className="text-gray-500">© 2024 AmasFungis. Todos los derechos reservados.</p>
            <div className="mt-2 flex flex-col items-center justify-center">
              <span style={{fontSize:'0.98rem', fontWeight:600, color:'#bdbdbd', letterSpacing:'0.01em'}}>
                Powered by <a href="https://ksai.agency/" target="_blank" rel="noopener noreferrer" style={{color:'#22e584', fontWeight:700, textDecoration:'none', marginLeft:4, marginRight:4}}>KS AI Agency</a>
                — Landing Pages, AI Chatbots & Automation para negocios modernos.
              </span>
              <button onClick={() => setShowTerms(true)} className="text-xs text-gray-400 hover:text-soft-yellow underline mt-2" style={{fontSize:'0.82rem', fontWeight:500}}>Términos y Condiciones</button>
            </div>
          </div>
        </div>
      </footer>

      {/* FAB flotante para abrir el chat SIEMPRE que showAmasbot sea false */}
      <div style={{position:'fixed',right:24,bottom:24,zIndex:1000}}>
      {!showAmasbot && (
          <button className="amasbot-fab" onClick={openWizardOrChat} title="Abrir chat" style={{padding:0,background:'none',border:'none',boxShadow:'0 2px 12px 0 #0003'}}>
            <img src="/assets/amasbotlogo.png" alt="AmasBot Logo" style={{width:48,height:48,borderRadius:16,boxShadow:'0 2px 12px 0 #0003',background:'#23232a',border:'2px solid #ffe066',objectFit:'cover'}} loading="lazy" />
        </button>
      )}
      </div>

      {/* Renderiza el wizard/carrusel SOLO si onboardingActive es true */}
      {showAmasbot && onboardingActive && (
        <div className="amasbot-chat-modal animate-fade-in" style={{zIndex:2000, position:'fixed', inset:0, background:'rgba(0,0,0,0.7)'}} onClick={e => {
          const target = e.target as HTMLElement;
          if (target && target.classList && target.classList.contains('amasbot-chat-modal')) setShowAmasbot(false);
        }}>
          <div className="amasbot-chat-container flex items-center justify-center" style={{width:'98vw',maxWidth:'1200px',height:'95vh',maxHeight:'99vh', background:'#18181b', borderRadius:24, margin:'auto'}}>
            <div className="w-full flex flex-col items-center">
              {/* Header profesional arriba */}
              <div className="w-full flex flex-col items-center mb-8 mt-4">
                <div className="flex flex-row items-center justify-center gap-2 text-center" style={{fontSize:'0.98rem', fontWeight:600, letterSpacing:'0.04em'}}>
                  <span style={{color:'#bdbdbd', fontWeight:500}}>CHATBOT DESARROLLADO POR</span>
                  <span style={{color:'#ffe066', fontWeight:800, marginLeft:6, marginRight:6}}>AMASFUNGIS</span>
                </div>
                <div style={{marginTop:2, fontSize:'0.85rem', fontWeight:600, color:'#22e584', letterSpacing:'0.01em', display:'flex', alignItems:'center', gap:4, opacity:0.92}}>
                  <a href="https://ksai.agency/" target="_blank" rel="noopener noreferrer" style={{color:'#22e584', fontWeight:700, display:'flex', alignItems:'center', textDecoration:'none', fontSize:'0.93em'}}>
                    <span style={{display:'inline-block',verticalAlign:'middle',marginRight:5}}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'inline',verticalAlign:'middle'}}>
                        <path d="M11.3 1.5L3.5 11.5C3.2 11.9 3.5 12.5 4 12.5H9.1L8.1 18.1C8 18.7 8.7 19.1 9.2 18.7L17 8.7C17.3 8.3 17 7.7 16.5 7.7H11.9L12.9 2.1C13 1.5 12.3 1.1 11.8 1.5H11.3Z" fill="#22e584"/>
                      </svg>
                    </span>
                    Powered by KS AI Agency
                  </a>
                </div>
              </div>
              {/* Paso 0: Conexión */}
              {wizardStep === 'connect' && (
                <div style={{width:'100%',textAlign:'center'}}>
                  <h2 className="text-2xl font-bold mb-6 text-soft-yellow">Conectarse con el chatbot</h2>
                  <div className="max-w-md w-full mx-auto bg-white/5 rounded-xl px-6 py-3 mb-8 text-center text-gray-400 text-sm opacity-90">
                    🤖 <b>AmasBot</b> — Chat de inteligencia artificial enriquecido con estudios científicos.<br/>
                    <span style={{fontStyle:'italic'}}>Fase beta: ¡Ayúdanos a mejorar tu experiencia!</span>
                  </div>
                  <button
                    className="wizard-connecting-btn max-w-xs w-full text-lg px-10 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 mb-8 mx-auto"
                    onClick={() => { setConnecting(true); setTimeout(async () => { try { await fetch('https://unloquiagency.app.n8n.cloud/webhook/chat-register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, chatInput: '' }) }); setWizardStep('name'); } catch (e) { setToastError('No se pudo conectar con el chatbot. Intenta de nuevo.'); } finally { setConnecting(false); } }, 1200); }}
                    disabled={connecting}
                  >
                    {connecting ? (
                      <span className="flex items-center gap-3">
                        <span className="wizard-spinner"></span>
                        <span className="wizard-connecting-text">Conectando...</span>
                      </span>
                    ) : (
                      <span className="wizard-connecting-text">Conectarme con el chatbot</span>
                    )}
                  </button>
                  <p className="text-gray-400 text-center mt-4">Haz clic para iniciar la conexión y comenzar tu experiencia personalizada.</p>
                </div>
              )}
              {/* Paso 1: Nombre */}
              {wizardStep === 'name' && (
                <form className="w-full flex flex-col items-center gap-6 animate-fade-in" onSubmit={async (e) => { e.preventDefault(); if (!onboardingName.trim()) return; setIsSubmittingName(true); try { await fetch('https://unloquiagency.app.n8n.cloud/webhook/chat-register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, chatInput: onboardingName }) }); setWizardStep('email'); } catch (e) { setToastError('No se pudo enviar el nombre. Intenta de nuevo.'); } finally { setIsSubmittingName(false); } }}>
                  <h2 className="text-2xl font-bold mb-4 text-soft-yellow">¿Cómo te llamás?</h2>
                  <div className="max-w-md w-full mx-auto bg-white/5 rounded-xl px-6 py-3 mb-8 text-center text-gray-400 text-sm opacity-90">
                    🧬 <b>Tu privacidad es prioridad.</b> Solo usamos tu nombre para personalizar la conversación.<br/>
                    <span style={{fontStyle:'italic'}}>¿Sabías? AmasBot aprende de miles de papers científicos.</span>
                  </div>
                  <input
                    type="text"
                    className="amasbot-input max-w-xs mx-auto text-center text-lg mb-2"
                    placeholder="Decime tu nombre o apodo..."
                    value={onboardingName}
                    onChange={e => setOnboardingName(e.target.value)}
                    maxLength={40}
                    required
                    autoFocus
                    disabled={isSubmittingName}
                  />
                  <button
                    type="submit"
                    className="wizard-nav-btn max-w-xs w-full text-lg px-10 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 mt-2 mx-auto"
                    disabled={!onboardingName.trim() || isSubmittingName}
                  >
                    {isSubmittingName ? (
                      <span className="flex items-center gap-3">
                        <span className="wizard-nav-spinner"></span>
                        <span className="wizard-nav-text">Enviando...</span>
                      </span>
                    ) : (
                      <span className="wizard-nav-text">Siguiente</span>
                    )}
                  </button>
                </form>
              )}
              {/* Paso 2: Email */}
              {wizardStep === 'email' && (
                <form className="w-full flex flex-col items-center gap-6 animate-fade-in" onSubmit={async (e) => { e.preventDefault(); if (!onboardingEmail.trim()) return; setEmailError(false); setIsSubmittingEmail(true); try { const res = await fetch('https://unloquiagency.app.n8n.cloud/webhook/chat-register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, chatInput: onboardingEmail }) }); let data; try { data = await res.json(); } catch (jsonErr) { setToastError('Error inesperado. Intenta de nuevo.'); setEmailError(true); setIsSubmittingEmail(false); return; } if (data && typeof data.message === 'string' && data.message.includes('correo no parece válido')) { setToastError(data.message); setEmailError(true); setIsSubmittingEmail(false); return; } setWizardStep('chat'); setChatMessages([{ type: 'user', message: onboardingName }, { type: 'user', message: onboardingEmail }]); setConnectionStatus('connected'); setOnboardingActive(false); } catch (e) { setToastError('No se pudo enviar el email. Intenta de nuevo.'); setEmailError(true); } finally { setIsSubmittingEmail(false); } }}>
                  <h2 className="text-2xl font-bold mb-4 text-soft-yellow">¿Cuál es tu email?</h2>
                  <div className="max-w-md w-full mx-auto bg-white/5 rounded-xl px-6 py-3 mb-8 text-center text-gray-400 text-sm opacity-90">
                    🎁 <b>Con tu email te puede aleatoriamente llegar un cupón del 50% si tenés suerte.</b> <br/>
                    <span style={{fontStyle:'italic'}}>¡Probá tu suerte ahora!</span>
                  </div>
                  <input
                    type="email"
                    className={`amasbot-input max-w-xs mx-auto text-center text-lg mb-2 ${emailError ? 'border-red-500 ring-2 ring-red-400' : ''}`}
                    placeholder="Ingresá tu email..."
                    value={onboardingEmail}
                    onChange={e => { setOnboardingEmail(e.target.value); setEmailError(false); }}
                    maxLength={60}
                    required
                    autoFocus
                    disabled={isSubmittingEmail}
                  />
                  <button
                    type="submit"
                    className="wizard-nav-btn max-w-xs w-full text-lg px-10 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 mt-2 mx-auto"
                    disabled={!onboardingEmail.trim() || isSubmittingEmail}
                  >
                    {isSubmittingEmail ? (
                      <span className="flex items-center gap-3">
                        <span className="wizard-nav-spinner"></span>
                        <span className="wizard-nav-text">Comenzando chat...</span>
                      </span>
                    ) : (
                      <span className="wizard-nav-text">Comenzar chat</span>
                    )}
                  </button>
                </form>
              )}
              {/* Fallback visible para depuración */}
              {!(wizardStep === 'connect' || wizardStep === 'name' || wizardStep === 'email' || wizardStep === 'chat') && (
                <div style={{color:'white',background:'red',padding:40}}>ERROR: Wizard en estado inesperado: {wizardStep}</div>
              )}
              {/* Toast de error */}
              {toastError && (
                <div className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-lg font-semibold animate-fade-in flex items-center gap-4">
                  {toastError}
                  <button className="ml-2 text-white/80 hover:text-white font-bold" onClick={() => setToastError('')}>✕</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Renderiza el chat normal SOLO si showAmasbot es true y onboardingActive es false */}
      {showAmasbot && !onboardingActive && (
        <div className="amasbot-chat-modal animate-fade-in" onClick={handleModalClick}>
          <div className="amasbot-chat-container" style={{width:'98vw',maxWidth:'1200px',height:'95vh',maxHeight:'99vh'}}>
            <div className="amasbot-chat-header" style={{display:'flex',alignItems:'center',gap:16}}>
              <img src="/assets/amasbotlogo.png" alt="AmasBot Logo" style={{width:38,height:38,borderRadius:12}} loading="lazy" />
              <div className="amasbot-header-title" style={{fontWeight:500,fontSize:'0.9rem',color:'#bdbdbd',letterSpacing:0.2}}>
                Chatbot desarrollado por AmasFungis
              </div>
              <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:12}}>
                <a
                  href="https://amasfungis.com/shop-2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1 rounded-lg border border-[#23232a] bg-[#23232a] text-soft-yellow font-semibold text-sm hover:bg-soft-yellow hover:text-carbon transition-all duration-200 shadow-sm"
                  style={{fontSize:'1.05rem', fontWeight:700, letterSpacing:0.2, textDecoration:'none', marginRight:0, minWidth:'120px', textAlign:'center'}}>
                  Ir a la tienda
                </a>
              </div>
              <button className="amasbot-close-btn" onClick={() => setShowAmasbot(false)} title="Cerrar chat" style={{marginLeft:12}}>
                <X size={28} />
              </button>
            </div>
            <div className="amasbot-chat-body flex flex-col" ref={chatBodyRef}>
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`amasbot-bubble ${msg.type === 'user' ? 'amasbot-bubble-user ml-auto' : 'amasbot-bubble-bot mr-auto'}`}
                      style={{ animationDelay: `${index * 0.07}s`, marginLeft: msg.type === 'bot' ? 42 : undefined, marginRight: msg.type === 'user' ? 42 : undefined, maxWidth: '70%' }}
                    >
                      <div className="text-sm">
                        <ReactMarkdown
                          components={{
                            a: ({node, ...props}) => <a {...props} style={{ color: '#3AB7FF', fontWeight: 700, textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" />
                          }}
                        >
                          {typeof msg.message === 'string' ? msg.message : 'Sin respuesta del bot.'}
                        </ReactMarkdown>
                      </div>
                      {msg.imageUrl && (
                        <img src={msg.imageUrl} alt="Imagen del bot" className="mt-2 rounded-lg max-w-full" style={{borderRadius:24, maxHeight:220, objectFit:'contain', background:'#23232a', border:'1px solid #23232a'}} loading="lazy" />
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="amasbot-typing">
                      <span className="amasbot-avatar-bot">
                        <img src="/assets/amasbotlogo.png" alt="AmasBot Logo" style={{width: '100%', height: '100%'}} loading="lazy" />
                      </span>
                      <span>AmasBot está escribiendo</span>
                      <span className="amasbot-typing-dots">
                        <span></span><span></span><span></span>
                      </span>
                    </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Chips de sugerencias */}
            {connectionStatus === 'connected' && (
              <div className="mb-2 flex flex-wrap pl-4 ml-2">
                {sugerencias.map((s, i) => (
                  <button key={i} className="amasbot-chip flex items-center gap-2" onClick={() => setInputMessage(s)}>
                    <span role="img" aria-label="Sugerencia" style={{fontSize:'1.2em'}}>💡</span>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {/* Botón scroll to bottom */}
            {showScrollBtn && (
              <button className="amasbot-scroll-bottom-btn visible" onClick={() => chatEndRef.current.scrollIntoView({ behavior: 'smooth' })} title="Bajar al último mensaje">
                <ArrowDown size={24} />
              </button>
            )}
            <div className="amasbot-input-row">
              {connectionStatus !== 'idle' && (
                <>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => {
                      if (e.target.value.length <= 1000) setInputMessage(e.target.value);
                    }}
                    onKeyPress={(e) => !pendingRequestId && e.key === 'Enter' && handleSendMessage()}
                    placeholder="Escribe tu pregunta… (máx 1000 caracteres)"
                    className="amasbot-input"
                    disabled={connectionStatus !== 'connected' || !!pendingRequestId}
                  />
                  <button
                    className={`amasbot-send-btn`}
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || connectionStatus !== 'connected' || !!pendingRequestId}
                    title="Enviar"
                  >
                    <Send size={22} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Renderiza el toast de error si existe */}
      {toastError && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 text-lg font-semibold animate-fade-in">
          {toastError}
          <button className="ml-4 text-white/80 hover:text-white font-bold" onClick={() => setToastError('')}>✕</button>
        </div>
      )}

      {/* Modal de contacto */}
      {showContactModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 animate-fade-in" onClick={e => { if (e.target === e.currentTarget) setShowContactModal(false); }}>
          <form className="bg-[#19191c] rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6" style={{minWidth:320}} onSubmit={handleContactSubmit}>
            <h2 className="text-2xl font-bold text-soft-yellow mb-2 text-center">Contacto</h2>
            <input 
              type="text" 
              required 
              maxLength={40} 
              placeholder="Tu nombre o apodo" 
              className="amasbot-input max-w-xs mx-auto text-center text-lg" 
              value={contactForm.name}
              onChange={e => setContactForm(prev => ({ ...prev, name: e.target.value }))}
            />
            <input 
              type="email" 
              required 
              maxLength={60} 
              placeholder="Tu email" 
              className="amasbot-input max-w-xs mx-auto text-center text-lg" 
              value={contactForm.email}
              onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
            />
            <input 
              type="text" 
              required 
              maxLength={80} 
              placeholder="Asunto" 
              className="amasbot-input max-w-xs mx-auto text-center text-lg" 
              value={contactForm.subject}
              onChange={e => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
            />
            <textarea 
              required 
              maxLength={600} 
              placeholder="Escribe tu mensaje..." 
              className="amasbot-input max-w-xs mx-auto text-center text-lg min-h-[100px]" 
              style={{resize:'vertical'}}
              value={contactForm.message}
              onChange={e => setContactForm(prev => ({ ...prev, message: e.target.value }))}
            />
            <button 
              type="submit" 
              disabled={isSending}
              className="btn-primary max-w-xs w-full text-lg px-10 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 mt-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Enviando...' : 'Enviar mensaje'}
            </button>
            <button type="button" className="text-gray-400 hover:text-soft-yellow text-sm mt-2 mx-auto" onClick={() => setShowContactModal(false)}>Cancelar</button>
            
            {contactSuccess && (
              <div className="text-green-400 text-center text-sm animate-fade-in">
                ¡Mensaje enviado exitosamente!
              </div>
            )}
          </form>
        </div>
      )}

      {/* Modal de Términos y Condiciones */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
          <div className="bg-carbon border border-soft-yellow/30 rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative overflow-y-auto max-h-[92vh]">
            <button onClick={() => setShowTerms(false)} className="absolute top-3 right-4 text-gray-400 hover:text-soft-yellow text-xl font-bold">×</button>
            <h2 className="text-soft-yellow text-lg font-bold mb-3 text-center">Política de Privacidad y Términos</h2>
            <div className="text-xs text-gray-300 leading-tight space-y-2" style={{fontSize:'0.82rem', maxHeight:'76vh', overflowY:'auto', textAlign:'justify'}}>
              <p>La presente sección tiene por objeto establecer exhaustivamente los términos, condiciones, limitaciones y alcances bajo los cuales serán gestionados, tratados, procesados, almacenados y, eventualmente, utilizados todos aquellos datos personales e informaciones conexas, siempre que éstas no revistan carácter sensible en virtud de la normativa aplicable, los cuales fueran proporcionados de manera libre, voluntaria y espontánea por los usuarios mediante el uso de formularios digitales, sistemas de interacción automatizada —incluyendo, pero no limitándose estrictamente a, módulos conversacionales o asistentes virtuales dotados de inteligencia artificial avanzada—, o cualquier otro mecanismo, tecnología, funcionalidad o recurso que la plataforma ponga a disposición del público en general y/o usuarios específicos, siempre en estricta conformidad con la legislación vigente, normativa aplicable en materia de protección de datos personales, privacidad y tratamiento automatizado de información, así como las mejores prácticas actualmente reconocidas dentro del ámbito tecnológico, digital e informático.</p>
              <p>En consideración al objetivo esencial y fundacional de mejorar continuamente la calidad, la eficiencia, la pertinencia, la relevancia y la eficacia general de los servicios ofrecidos, la plataforma podrá recolectar y registrar, mediante procesos de análisis automatizados o semiautomatizados, diferentes categorías de información, incluyendo, aunque sin limitarse exclusivamente, a datos personales identificativos, datos de contacto, preferencias generales o particulares, comportamiento histórico y/o patrones recurrentes de navegación, localización geográfica derivada directa o indirectamente de la interacción, así como cualquier dato, información o preferencia inferida mediante análisis algorítmicos complejos de las interacciones específicas mantenidas en tiempo real o en forma diferida con los diferentes módulos, secciones o funcionalidades dispuestas a tales efectos, almacenándose y procesándose dicha información en sistemas informáticos destinados exclusivamente a la innovación constante, optimización del desempeño, adecuación progresiva del servicio digital prestado y personalización avanzada de la experiencia general del usuario.</p>
              <p>La utilización de tecnologías de seguimiento, tales como cookies, píxeles de seguimiento, balizas web, huellas digitales del navegador o del dispositivo, almacenamiento local o tecnologías de naturaleza similar y análoga, será considerada imprescindible a los efectos de garantizar una experiencia de navegación fluida, adecuada, personalizada y relevante, así como para efectuar análisis estadísticos en términos agregados y anónimos respecto de las modalidades de uso del sitio y sus servicios, contribuyendo con ello al perfeccionamiento y eficiencia operativa general de la plataforma y sus funcionalidades accesorias.</p>
              <p>Asimismo, se declara expresamente que el simple acto continuado de acceder, permanecer, navegar, interactuar o brindar información de cualquier tipo en la plataforma implicará, sin necesidad de acto adicional alguno, una aceptación tácita y consentimiento implícito por parte del usuario respecto de los términos, condiciones, limitaciones y alcances establecidos en la presente sección, incluyendo, de modo particular, aunque no excluyente, la autorización para la utilización indirecta de sus datos personales y preferencias a los fines del desarrollo progresivo de servicios adicionales, comunicaciones relevantes o sugerencias alineadas a intereses y expectativas inferidos mediante métodos automatizados de procesamiento de datos.</p>
              <p>Con independencia de lo expuesto, se reconoce plenamente al usuario la facultad, en todo momento y sin limitación alguna, de ejercer sus derechos legalmente reconocidos sobre los datos suministrados, especialmente, aunque no limitadamente, los derechos de acceso, rectificación, cancelación, oposición, limitación del tratamiento, portabilidad y revocación del consentimiento inicialmente otorgado, mediante solicitud expresa cursada por los canales habilitados oportunamente al efecto y que se encuentran detallados debidamente en el sitio web correspondiente, comprometiéndose la plataforma a dar trámite y resolución conforme las prescripciones legales y plazos establecidos en la normativa aplicable.</p>
              <p>Asimismo, y en la medida en que resulte pertinente en función de la operación tecnológica desplegada, los datos proporcionados por los usuarios podrán ser transferidos, almacenados, tratados o procesados total o parcialmente en jurisdicciones diferentes del país de origen del usuario, utilizando infraestructuras digitales o servicios en la nube proporcionados por terceros, garantizando en todos los casos la adopción de estándares de protección adecuados y reconocidos internacionalmente en materia de privacidad y tratamiento de datos personales, permaneciendo dichos datos almacenados exclusivamente durante el tiempo estrictamente necesario para cumplir con las finalidades originales o aquellas derivadas directa o indirectamente de la relación contractual o comercial entablada, salvo disposición legal en contrario.</p>
              <p>Es fundamental señalar expresamente que la información, respuestas, recomendaciones, sugerencias o cualquier contenido generado por sistemas automatizados, incluyendo asistentes virtuales o módulos de inteligencia artificial, tienen un carácter eminentemente orientativo, preliminar y no vinculante, debiendo ser interpretados en todos los casos como indicaciones generales que no revisten exhaustividad, certeza absoluta ni actualización inmediata, renunciando la plataforma a cualquier tipo de responsabilidad respecto de interpretaciones erróneas, decisiones tomadas, acciones emprendidas o cualquier consecuencia directa o indirecta que pudiera derivarse de la aplicación práctica de dicha información, recomendándose en todo caso la verificación pertinente ante profesionales debidamente acreditados, particularmente ante decisiones de carácter técnico, sanitario, financiero, legal, comercial o de índole análoga.</p>
              <p>Finalmente, la plataforma declara solemnemente su compromiso irrestricto en aplicar las medidas técnicas, organizativas y humanas más adecuadas y eficaces disponibles en la actualidad para garantizar la seguridad, confidencialidad e integridad de los datos recolectados y almacenados, debiendo notificar oportunamente a los usuarios ante incidentes relevantes que pudieran afectar dichos datos, conforme lo prescripto en la normativa legal vigente.</p>
              <p>Esta política podrá ser objeto de modificaciones, actualizaciones o adecuaciones periódicas, que serán publicadas en la plataforma, constituyendo la continuidad en su uso posterior a dichas modificaciones la plena aceptación tácita de los términos revisados.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
