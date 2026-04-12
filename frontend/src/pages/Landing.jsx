import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom"
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import nikebg from "../assets/nikebg.png";
import watchbg from "../assets/watchbg.png";
import RotatingTextWithBorder from "../components/RotatingTextWithBorder";
import handbagbg from "../assets/handbagbg.png";
import ScrollVelocity from '../components/ScrollVelocity';
import SubscriptionPlans from './SubscriptionPlans';
import ModelsSection from "../components/models";
import BentoGridSectionTwo from "../components/BentoGridSectionTwo";
import ScrollHighlightSection from "../components/ScrollHighlightSection";
import PreLoader from "../components/PreLoader";

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [startAnimation, setStartAnimation] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navbarRef = useRef(null);
  const heroRef = useRef(null);

  const carouselImages = [
    nikebg,
    watchbg,
    handbagbg
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  useLayoutEffect(() => {
    if (loading) return;
    if (!navbarRef.current || !heroRef.current) return;

    const tl = gsap.timeline();
    tl.set(navbarRef.current, { autoAlpha: 0, y: -120 });
    tl.set(heroRef.current, { autoAlpha: 0, y: -80 });
    tl.to(navbarRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      clearProps: "all",
    });
    tl.to(heroRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 1.4,
      ease: "power2.out",
      onStart: () => setStartAnimation(true),
      clearProps: "all",
    }, "+=0.35");

    return () => tl.kill();
  }, [loading]);

  const getImageStyle = (index) => {
    const position = (index - currentIndex + carouselImages.length) % carouselImages.length;
    const radius = 200; // Increased radius for larger circle
    const angle = position * (120 * Math.PI / 180) + Math.PI; // 120 degrees apart, shifted by 180 degrees to put active on left
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const centerX = 160; // Center of w-80 (320px) container
    const centerY = 192; // Center of h-96 (384px) container

    if (position === 0) {
      return {
        transform: `translate(${centerX + x}px, ${centerY + y}px) scale(1.2)`,
        opacity: 1,
        zIndex: 2,
        className: 'w-80 h-96'
      };
    } else {
      return {
        transform: `translate(${centerX + x}px, ${centerY + y}px) scale(0.5)`,
        opacity: 0.6,
        zIndex: 1,
        className: 'w-32 h-40'
      };
    }
  };

  const ventures = [
    { title: "EasyFast", description: "No-Code Design Agency" },
    { title: "Template Store", description: "Best Framer Assets" },
    { title: "Music Channel", description: "I compose a little" },
    { title: "Twitter", description: "Work in progress, insights" },
  ];

  const storeProducts = [
    {
      image: "/ojej68bqt9ytvrt3mykyy7sj14-jpg.png",
      badge: "NEW",
      badgeColor: "bg-[#ff4400]",
      badgeTextColor: "text-black",
      price: "$59",
      title: "Bravo",
      description: "A high-converting agency",
    },
    {
      image: "/qxurdh36gpodbk3dtnvsqzwzk-jpg.png",
      badge: "Bestseller",
      badgeColor: "bg-[#ff5900]",
      badgeTextColor: "text-white",
      price: "$69",
      title: "Nitro",
      description: "Portfolio template bestseller",
    },
    {
      image: "/wi932y2dyuujvf4fauurimchu-jpg.png",
      badge: null,
      price: "$59",
      title: "Haze",
      description: "Full-screen horizontal portfolio",
    },
  ];

  const blogPosts = [
    {
      image: "/rzxempdoaqqkm4qtebcmdlxq-png.png",
      title: "Starting and Growing a Career in Web Design",
      category: "Updates",
      date: "Apr 8, 2022",
    },
    {
      image: "/wcteqd2ucgdgw1udlsb1zen2ek-png.png",
      title: "Create a Landing Page That Performs Great",
      category: "Tech",
      date: "Mar 15, 2022",
    },
    {
      image: "/9iilxjxtxq7ekgn2jx9sxmx5nxe-png.png",
      title: "How Can Designers Prepare for the Future?",
      category: "Updates",
      date: "Feb 28, 2022",
    },
  ];

  const footerLinks = {
    personal: [
      { label: "Home", active: true },
      { label: "About", active: false },
      { label: "Contact", active: false },
      { label: "Links in Bio", active: false },
    ],
    portfolio: [
      { label: "Projects", active: false },
      { label: "Project Page", active: false },
      { label: "Blog", active: false },
      { label: "Blog Post", active: false },
    ],
    sales: [
      { label: "Store", active: false },
      { label: "Product Page", active: false },
      { label: "Landing Page", active: false },
      { label: "Course", active: false },
    ],
  };

  return (
    <>
      {loading && <PreLoader onComplete={() => setLoading(false)} />}
      <div className="w-full bg-black min-h-screen landing-text-sm">
        <div ref={navbarRef} style={{ visibility: loading ? "hidden" : "visible" }}>
          <Navbar />
        </div>
        <div ref={heroRef} style={{ visibility: loading ? "hidden" : "visible" }}>
          <ModelsSection startAnimation={startAnimation} />
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <ScrollHighlightSection />
          <BentoGridSectionTwo />
          <SubscriptionPlans />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default LandingPage;