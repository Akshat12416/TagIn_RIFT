import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Mission = () => {
  const sectionRef = useRef(null);
  const missionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaButtonsRef = useRef(null);
  const imageRef = useRef(null);
  const nfcBadgeRef = useRef(null);
  const imageTitleRef = useRef(null);
  const imageSubtitleRef = useRef(null);
  const imageButtonsRef = useRef(null);
  const watchRef = useRef(null);
  const tapIndicatorRef = useRef(null);
  const floatingElementsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Mission content animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(missionRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    )
    .fromTo(titleRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.5"
    )
    .fromTo(subtitleRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.7"
    )
    .fromTo(featuresRef.current.children, 
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.2, ease: "back.out(1.7)" }, "-=0.5"
    )
    .fromTo(ctaButtonsRef.current.children, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.3"
    );

    // Image animations
    gsap.fromTo(imageRef.current, 
      { opacity: 0, scale: 0.8, x: 100 },
      { 
        opacity: 1, 
        scale: 1, 
        x: 0, 
        duration: 1.2, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    const imageTl = gsap.timeline({
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top 60%",
        toggleActions: "play none none reverse"
      }
    });

    imageTl.fromTo(nfcBadgeRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
    )
    .fromTo(imageTitleRef.current, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3"
    )
    .fromTo(imageSubtitleRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4"
    )
    .fromTo(imageButtonsRef.current.children, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }, "-=0.2"
    );

    gsap.fromTo(watchRef.current, 
      { opacity: 0, scale: 0, rotation: 180 },
      { 
        opacity: 1, 
        scale: 1, 
        rotation: 0, 
        duration: 1, 
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: watchRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    gsap.fromTo(tapIndicatorRef.current, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: tapIndicatorRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Continuous animations
    gsap.to(floatingElementsRef.current, {
      y: -20,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.5
    });

    gsap.to(watchRef.current, {
      boxShadow: "0 10px 30px rgba(96, 165, 250, 0.3)",
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(tapIndicatorRef.current, {
      scale: 1.05,
      duration: 1.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleButtonHover = (e, isEntering) => {
    gsap.to(e.currentTarget, { 
      scale: isEntering ? 1.05 : 1, 
      duration: 0.3, 
      ease: "power2.out" 
    });
  };

  const handleFeatureHover = (e, isEntering) => {
    gsap.to(e.currentTarget, { 
      scale: isEntering ? 1.02 : 1, 
      backgroundColor: isEntering ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
      duration: 0.3, 
      ease: "power2.out" 
    });
  };

  return (
    <section 
      ref={sectionRef} 
      className="py-20 bg-gradient-to-br from-purple-400 via-blue-400 to-pink-300 px-8"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="pr-8">
          <div 
            ref={missionRef}
            className="inline-block bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-white/20 backdrop-blur-sm"
          >
            Mission
          </div>
          
          <h2 
            ref={titleRef}
            className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Fighting global product counterfeiting with smart technology
          </h2>
          
          <p 
            ref={subtitleRef}
            className="text-xl text-white/80 leading-relaxed mb-12"
          >
            Counterfeiting costs global economies billions each year. Our platform provides a robust solution to verify and protect product authenticity.
          </p>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div 
              className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm cursor-pointer"
              onMouseEnter={(e) => handleFeatureHover(e, true)}
              onMouseLeave={(e) => handleFeatureHover(e, false)}
            >
              <h4 className="text-white font-semibold mb-2">The problem</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Fake products damage brands and risk consumer safety worldwide.
              </p>
            </div>
            <div 
              className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm cursor-pointer"
              onMouseEnter={(e) => handleFeatureHover(e, true)}
              onMouseLeave={(e) => handleFeatureHover(e, false)}
            >
              <h4 className="text-white font-semibold mb-2">Our solution</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Blockchain and RFID technology create an unbreakable verification system for manufacturers and consumers.
              </p>
            </div>
          </div>

          <div ref={ctaButtonsRef} className="flex gap-4">
            <a 
              href="#start" 
              className="px-8 py-4 rounded-full font-semibold text-white bg-gray-900 hover:bg-gray-800 shadow-lg transition-all duration-300"
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              Learn more
            </a>
            <a 
              href="#contact" 
              className="px-8 py-4 rounded-full font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              Contact sales
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div 
          ref={imageRef}
          className="relative h-[600px] rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Floating Elements */}
          <div 
            ref={el => floatingElementsRef.current[0] = el}
            className="absolute top-[10%] left-[10%] w-16 h-16 rounded-full bg-white/5 border border-white/20"
          />
          <div 
            ref={el => floatingElementsRef.current[1] = el}
            className="absolute top-[70%] right-[20%] w-10 h-10 rounded-full bg-white/5 border border-white/20"
          />
          <div 
            ref={el => floatingElementsRef.current[2] = el}
            className="absolute bottom-[15%] left-[15%] w-20 h-20 rounded-full bg-white/5 border border-white/20"
          />
          
          {/* Main Content */}
          <div className="text-center z-10 relative px-8">

          </div>

          

          {/* Tap Indicator */}
          <div 
            ref={tapIndicatorRef}
            className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 bg-white/10 text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/20 backdrop-blur-sm"
          >
            Tap to verify
          </div>

          {/* Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")`
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Mission;


{/* Watch Visual */}
        //   <div 
        //     ref={watchRef}
        //     className="absolute top-[20%] right-[15%] w-48 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-xl border-2 border-white/30"
        //   >
        //     <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
        //       AUTHENTIC
        //     </div>
        //   </div>