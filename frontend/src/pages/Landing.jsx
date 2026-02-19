import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Navbar from "../components/Navbar";
import nikebg from "../assets/nikebg.png";
import watchbg from "../assets/watchbg.png";
import RotatingTextWithBorder from "../components/RotatingTextWithBorder";
import handbagbg from "../assets/handbagbg.png";
import ScrollVelocity from '../components/ScrollVelocity';
import SubscriptionPlans from "../components/SubscriptionPlans";

const Landing = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
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
  }, []);

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

  const portfolioItems = [
    {
      image: "/4lwtwkdzmwqsb6mpjcdyehzww-jpg.png",
      badge: "Framer",
      title: "Strida",
      bgColor: "bg-[#541006]",
      textColor: "text-white",
    },
    {
      image: "/3axweqxiiymcgqpjzlseszlm4ge-jpg.png",
      badge: "Personal",
      title: "Nitro Template",
      bgColor: "bg-[#070707]",
      textColor: "text-[#ffe9e0]",
    },
    {
      image: "/bhkdcq8hvgsm0a8jr7meqtsu62c-jpg.png",
      badge: "Personal",
      title: "Haze Template",
      bgColor: "bg-[#0f0fb6]",
      textColor: "text-[#eeb5ff]",
    },
    {
      image: "/ryrooafrgvfoecfhd3qtq9retuc-jpg.png",
      badge: "Personal",
      title: "Nick Stepuk",
      bgColor: "bg-[#1f2d30]",
      textColor: "text-[#c8c7c5]",
    },
  ];

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
    <div className="w-full bg-black min-h-screen">
      <Navbar />
      <section className="w-full bg-white">
        <div className="w-full max-w-8xl mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="h-screen pt-20 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-20 relative flex items-center">
            <div className="flex items-start justify-between gap-12">
              <div className="flex-1 relative z-10">


                <div className="space-y-4 md:space-y-6 mb-6 md:mb-9">
                  <h1 className="font-semibold text-black text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight max-w-4xl">
                    Authenticate any<br /><RotatingTextWithBorder 
                                  texts={["Sneakers", "Watches", "Handbags"]} 
                                  rotationInterval={2500} 
                                /> with just a Tap.
                  </h1>

                  <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-md">
                    Embedded an NFC Chip, Link it to tamper-proof blockchain records, and give buyers instant trust from their phone- no App required.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link to="/user-login">
                  <Button className="bg-black hover:bg-gray-900 text-white px-6 py-6 rounded-2xl shadow-xl transition-all">
                    Get Started
                  </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-gray-50 text-black px-6 py-6 rounded-2xl border-gray-200 transition-all"
                  >
                    Contact
                  </Button>
                </div>
              </div>

              {/* Carousel Section */}
              <div className="hidden lg:block w-80 h-96 absolute right-12 top-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  {carouselImages.map((image, index) => {
                    const style = getImageStyle(index);
                    return (
                      <div
                        key={index}
                        className={`absolute rounded-2xl overflow-hidden transition-all duration-700 ease-in-out ${style.className}`}
                        style={{
                          transform: style.transform,
                          opacity: style.opacity,
                          zIndex: style.zIndex
                        }}
                      >
                        <img
                          src={image}
                          alt={`Carousel ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
             
  

            </div>
            
          </div>


          {/* <div className="pb-12 md:pb-16 lg:pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {portfolioItems.map((item, index) => (
                <Card
                  key={index}
                  className="relative aspect-square overflow-hidden border-0 rounded-2xl"
                >
                  <CardContent className="p-0 h-full">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                    <div className="flex flex-col justify-between h-full relative p-3 md:p-4">
                      <div className="flex justify-end">
                        <Badge className="bg-white text-black text-xs md:text-sm px-3 md:px-4 py-1 rounded-full border border-gray-200">
                          {item.badge}
                        </Badge>
                      </div>
                      <div
                        className={`${item.bgColor} p-4 md:p-6 lg:p-8 rounded-xl opacity-90`}
                      >
                        <h3
                          className={`${item.textColor} text-lg md:text-xl lg:text-2xl font-normal`}
                        >
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div> */}
          {/* <ScrollVelocity
  texts={['Tagin ⟡', 'Tagin ⟡']} 
  velocity={100} 
  className="custom-scroll-text relative max-w- py-1"
/> */}

<SubscriptionPlans/>

          <div className="pb-12 pt-40 md:pb-16 lg:pb-20">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-black leading-tight">
                    Helping happy people to launch faster and grow bigger
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    My mission it to ethically help people to reach their goals
                    and speed up the publishing workflow. From idea to
                    execution, I provide them assets that erase the struggle
                    between idea and launch.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="bg-white hover:bg-gray-50 text-black px-5 py-3 rounded-2xl border-gray-200 mt-6 lg:mt-8 w-full lg:w-auto transition-all"
                >
                  More about me
                </Button>
              </div>
              <div className="flex-1">
                <div className="aspect-video lg:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: "url(/vt5kn0de1uhapuzt5if6bwcrle-png.png)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pb-12 md:pb-16 lg:pb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-black mb-6 md:mb-9">
              Ventures and links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {ventures.map((venture, index) => (
                <Card
                  key={index}
                  className="bg-neutral-100 rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="flex items-center gap-4 md:gap-6 p-4 md:p-6">
                    <div className="w-14 h-14 md:w-16 md:h-16 lg:w-[72px] lg:h-[72px] bg-white rounded-full flex-shrink-0" />
                    <div>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-normal text-black">
                        {venture.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-500">
                        {venture.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="pb-12 md:pb-16 lg:pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 md:mb-9">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-black">
                New in Store
              </h2>
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 text-black px-5 py-3 rounded-2xl border-gray-200 transition-all"
              >
                Visit Store
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {storeProducts.map((product, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <Card className="bg-neutral-100 rounded-2xl overflow-hidden border-0">
                    <CardContent className="p-0 relative aspect-[3/4]">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${product.image})` }}
                      />
                      <div className="absolute top-4 right-4 flex items-center gap-1">
                        {product.badge && (
                          <Badge
                            className={`${product.badgeColor} ${product.badgeTextColor} text-xs md:text-sm px-3 md:px-4 py-1 rounded-full border border-gray-200`}
                          >
                            {product.badge}
                          </Badge>
                        )}
                        <Badge className="bg-white text-black text-xs md:text-sm px-3 md:px-4 py-1 rounded-full border border-gray-200">
                          {product.price}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-normal text-black mb-1">
                      {product.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-500">
                      {product.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pb-12 md:pb-16 lg:pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 md:mb-12 lg:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-black">
                Latest posts
              </h2>
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 text-black px-5 py-3 rounded-2xl border-gray-200 transition-all"
              >
                Visit Blog
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {blogPosts.map((post, index) => (
                <article key={index} className="flex flex-col gap-4 md:gap-6">
                  <div
                    className="w-full aspect-square rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                  <div>
                    <h3 className="text-lg md:text-xl lg:text-2xl font-normal text-black mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                      <span>{post.category}</span>
                      <span className="opacity-25">×</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div id="contact" className="pb-12 md:pb-16 lg:pb-20">
            <Card className="bg-neutral-100 rounded-2xl border border-gray-200">
              <CardContent className="flex flex-col items-center justify-center gap-6 md:gap-9 px-6 md:px-12 lg:px-24 xl:px-40 py-12 md:py-16">
                <div className="flex flex-col items-center gap-4 md:gap-6 max-w-2xl text-center">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 bg-[#ffffff01] rounded-full overflow-hidden shadow-lg">
                    <div className="absolute inset-0 rounded-full bg-[url(/awm23ikhnjkikygfnucfe5k-jpg-1.png)] bg-cover bg-center" />
                    <div className="absolute inset-0 rounded-full border-4 border-black" />
                  </div>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-black">
                    Let's be in touch!
                  </h2>
                  <p className="text-base md:text-lg lg:text-xl font-medium text-gray-500 leading-relaxed">
                    Feel free to contact me if having any questions. I'm
                    available for new projects or just for chatting.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button className="bg-black hover:bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl transition-all">
                    Follow me on X
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white hover:bg-gray-50 text-black px-5 py-3 rounded-2xl border-gray-200 transition-all"
                  >
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="w-full bg-black text-white">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 xl:px-32 py-12 md:py-16 lg:py-20">
          <div className="mb-8 md:mb-12">
            <img
              className="w-full h-auto"
              alt="Container"
              src="/container.svg"
            />
          </div>

          <div className="w-full h-px bg-white opacity-30 mb-8 md:mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              <nav className="flex items-center gap-4 md:gap-6">
                <a
                  href="#"
                  className="text-[#00ff8c] text-sm md:text-base hover:underline"
                >
                  Get Template
                </a>
                <div className="w-1 h-1 bg-white opacity-50 rounded-full" />
                <a
                  href="#"
                  className="text-white opacity-50 text-sm md:text-base hover:opacity-100 transition-opacity"
                >
                  Visit Store
                </a>
              </nav>
              <div className="text-2xl md:text-4xl lg:text-5xl font-medium opacity-25">
                easyfast.design
              </div>
            </div>

            <nav className="grid grid-cols-3 gap-6 md:gap-8">
              <div className="space-y-3 md:space-y-4">
                <div className="text-white text-sm md:text-base font-normal">
                  Personal
                </div>
                <div className="space-y-2">
                  {footerLinks.personal.map((link, index) => (
                    <div key={index}>
                      <a
                        href="#"
                        className={`block text-xs md:text-sm ${
                          link.active
                            ? "text-white"
                            : "text-white opacity-50 hover:opacity-100"
                        } transition-opacity`}
                      >
                        {link.label}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="text-white text-sm md:text-base font-normal">
                  Portfolio
                </div>
                <div className="space-y-2">
                  {footerLinks.portfolio.map((link, index) => (
                    <div key={index}>
                      <a
                        href="#"
                        className={`block text-xs md:text-sm ${
                          link.active
                            ? "text-white"
                            : "text-white opacity-50 hover:opacity-100"
                        } transition-opacity`}
                      >
                        {link.label}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="text-white text-sm md:text-base font-normal">
                  Sales
                </div>
                <div className="space-y-2">
                  {footerLinks.sales.map((link, index) => (
                    <div key={index}>
                      <a
                        href="#"
                        className={`block text-xs md:text-sm ${
                          link.active
                            ? "text-white"
                            : "text-white opacity-50 hover:opacity-100"
                        } transition-opacity`}
                      >
                        {link.label}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
