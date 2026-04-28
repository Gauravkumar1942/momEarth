import React, { useState, useEffect, useRef} from 'react';
import { AnimatePresence , motion } from 'framer-motion';

// import { 
//   FaLeaf, FaSeedling, FaRecycle, FaHeart, FaHandHoldingHeart,
//   FaChevronLeft, FaChevronRight, FaTruck, FaUndo, FaShieldAlt, 
//   FaStar, FaFacebookF, FaInstagram, FaWhatsapp, FaTwitter,
//    FaBolt, FaTree, FaArrowRight
// } from 'react-icons/fa';

import Leaf from 'lucide-react/dist/esm/icons/leaf.js';
import Sprout from 'lucide-react/dist/esm/icons/sprout.js';
import Recycle from 'lucide-react/dist/esm/icons/recycle.js';
import Heart from 'lucide-react/dist/esm/icons/heart.js';
import HandHeart from 'lucide-react/dist/esm/icons/hand-heart.js';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left.js';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.js';
import Truck from 'lucide-react/dist/esm/icons/truck.js';
import Undo from 'lucide-react/dist/esm/icons/undo.js';
import Shield from 'lucide-react/dist/esm/icons/shield.js';
import Star from 'lucide-react/dist/esm/icons/star.js';
import Facebook from 'lucide-react/dist/esm/icons/facebook.js';
import Instagram from 'lucide-react/dist/esm/icons/instagram.js';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle.js'; // WhatsApp alternative
import Twitter from 'lucide-react/dist/esm/icons/twitter.js';
import Zap from 'lucide-react/dist/esm/icons/zap.js'; // Bolt alternative
import Trees from 'lucide-react/dist/esm/icons/trees.js'; // Tree alternative
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';

// Color theme variables - Change these to update the entire theme
const COLORS = {
  primary: '#2d5016',      // Deep forest green
  secondary: '#6b8e23',    // Olive green
  accent: '#8fbc8f',       // Light sea green
  background: '#f8faf5',   // Very light green
  text: '#2c3e1f',         // Dark green text
  textLight: '#5a7247',    // Medium green
  white: '#ffffff',
  lightGreen: '#e8f5e9',
  darkGreen: '#1b3a0f'
};

const Homepage = () => {

  
    //  scroll to top on component mount
    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, []);


      
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideInterval = useRef(null);

  // Category data
  const categories = [
    { name: 'Eco Friendly', icon: <Leaf />, color: COLORS.primary },
    { name: 'Vegan', icon: <Sprout />, color: COLORS.secondary },
    { name: 'Plant Based', icon: <Trees />, color: COLORS.accent },
    { name: 'Recycled', icon: <Recycle />, color: COLORS.primary },
    { name: 'Chemical Free', icon: <Heart />, color: COLORS.secondary },
    { name: 'Handmade', icon: <HandHeart />, color: COLORS.accent }
  ];

  // Hero slider data
  const heroSlides = [
    {
      title: 'Sustainable Living Starts Here',
      subtitle: 'Discover eco-friendly products that make a difference',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200',
      // cta: 'Shop Now'
    },
    {
      title: 'Plant-Based Beauty',
      subtitle: '100% natural ingredients for your daily care',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200',
      // cta: 'Explore'
    },
    {
      title: 'Zero Waste Kitchen',
      subtitle: 'Reduce, reuse, and revolutionize your home',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200',
      // cta: 'Discover'
    }
  ];

  // Product categories showcase
  const productShowcase = [
    { category: 'Kitchenware', count: 8 },
    { category: 'Kids Products', count: 6 },
    { category: 'Women Care', count: 8 },
    { category: 'Bamboo Products', count: 6 },
    { category: 'Vegan Beauty', count: 8 },
    { category: 'Recycled Fashion', count: 6 }
  ];

  // Impact stats
  const impactStats = [
    { icon: <Zap />, value: '1.8M', unit: 'kWh', label: 'Energy Conserved', color: COLORS.secondary },
    { icon: <Trees />, value: '50K', unit: 'Trees', label: 'Equivalent Planted', color: COLORS.accent },
    { icon: <Recycle />, value: '3.2M', unit: 'Kg', label: 'Plastic Reduced', color: COLORS.primary }
  ];

  // Endorsements
  // const endorsements = [
  //   // {
  //   //   logo: '🌍',
  //   //   entity: 'EcoWatch Magazine',
  //   //   message: 'MomEarth is revolutionizing sustainable shopping with their carefully curated eco-friendly products.'
  //   // },
  //   // {
  //   //   logo: '🌱',
  //   //   entity: 'Green Living Awards',
  //   //   message: 'Best Sustainable E-commerce Platform of 2024. Setting new standards in eco-conscious retail.'
  //   // },
  //   // {
  //   //   logo: '♻️',
  //   //   entity: 'Environmental Leader',
  //   //   message: 'A game-changer in making sustainable products accessible to everyone.'
  //   // }
  // ];

  // Auto-slide functionality
  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const startAutoSlide = () => {
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    stopAutoSlide();
    startAutoSlide();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    stopAutoSlide();
    startAutoSlide();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    stopAutoSlide();
    startAutoSlide();
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
  };

  const shareWebsite = (platform) => {
    const url = window.location.href;
    const text = 'Check out MomEarth - Your destination for sustainable living!';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      whatsapp: `https://wa.me/?text=${text} ${url}`,
      instagram: url // Instagram doesn't support direct sharing via URL
    };

    if (platform === 'instagram') {
      alert('Please share this link on Instagram: ' + url);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div style={{ backgroundColor: COLORS.background, minHeight: '100vh' }} className='m-0 p-0'>
      {/* Hero Slider - NO GAP at top */}
      <section className='relative h-[500px] md:h-[600px] overflow-hidden m-3 p-0 rounded-3xl mt-10 lg:mt-30 '
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className='absolute inset-0'>
            <img 
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-r from-black/60 to-transparent'></div>
            
            <div className='absolute inset-0 flex items-center'>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='max-w-2xl'>
                  <h1 className='text-4xl md:text-6xl font-bold text-white mb-4'>
                    {heroSlides[currentSlide].title}
                  </h1>
                  <p className='text-xl md:text-2xl text-white/90 mb-8'>
                    {heroSlides[currentSlide].subtitle}
                  </p>
                  {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='px-8 py-4 rounded-full font-bold text-lg text-white flex items-center gap-2'
                    style={{ backgroundColor: COLORS.primary }}>
                    {heroSlides[currentSlide].cta}
                    <ArrowRight />
                  </motion.button> */}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full transition-all z-10'
          style={{ color: COLORS.primary }}>
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full transition-all z-10'
          style={{ color: COLORS.primary }}>
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10'>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className='w-3 h-3 rounded-full transition-all'
              style={{ 
                backgroundColor: currentSlide === index ? COLORS.white : 'rgba(255,255,255,0.5)',
                width: currentSlide === index ? '2rem' : '0.75rem'
              }}
            />
          ))}
        </div>
      </section>

      {/* Product Showcase by Category */}
      <section className='max-w-7xl mx-auto px-4 py-16'>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className='text-3xl md:text-4xl font-bold text-center mb-12'
          style={{ color: COLORS.text }}>
          Shop by Collection
        </motion.h2>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {productShowcase.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className='bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer'>
              <div className='h-64 relative' style={{ backgroundColor: COLORS.lightGreen }}>
                <div className='absolute inset-0 flex items-center justify-center text-6xl'>
                  {categories[index % categories.length].icon}
                </div>
              </div>
              <div className='p-6'>
                <h3 className='text-2xl font-bold mb-2' style={{ color: COLORS.text }}>
                  {item.category}
                </h3>
                <p className='mb-4' style={{ color: COLORS.textLight }}>
                  {item.count} eco-friendly products
                </p>
                <button 
                  className='flex items-center gap-2 font-semibold hover:gap-3 transition-all'
                  style={{ color: COLORS.primary }}>
                  Explore Collection <ArrowRight />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Knowledge Section */}
      <section className='py-16' style={{ backgroundColor: COLORS.primary, color: COLORS.white }}>
        <div className='max-w-7xl mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4'>
              Our Collective Impact
            </h2>
            <p className='text-xl opacity-90'>
              Every purchase makes a difference. Here's what we've achieved together.
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='text-center'>
                <div className='text-5xl mb-4 flex justify-center' style={{ color: COLORS.accent }}>
                  {stat.icon}
                </div>
                <div className='text-4xl font-bold mb-2'>{stat.value}</div>
                <div className='text-lg mb-1'>{stat.unit}</div>
                <div className='text-sm opacity-80'>{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className='mt-12 p-6 rounded-2xl text-center'
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <p className='text-lg md:text-xl'>
              <strong>When you buy sustainable products</strong>, you're not just making a purchase – 
              you're casting a vote for a healthier planet. Each eco-friendly choice saves water, 
              reduces energy consumption, and decreases plastic waste.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='max-w-7xl mx-auto px-4 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {[
            { icon: <Truck />, title: 'Free Delivery', desc: 'On orders above ₹249' },
            { icon: <Undo />, title: 'Easy Returns', desc: '7-days return/exchange policy' },
            { icon: <Shield />, title: 'Quality Products', desc: '100% authentic & certified' },
            { icon: <Star />, title: 'Premium Support', desc: '24/7 customer service' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className='text-center p-6 rounded-2xl'
              style={{ backgroundColor: COLORS.lightGreen }}>
              <div className='text-4xl mb-4 flex justify-center' style={{ color: COLORS.primary }}>
                {feature.icon}
              </div>
              <h3 className='text-xl font-bold mb-2' style={{ color: COLORS.text }}>
                {feature.title}
              </h3>
              <p style={{ color: COLORS.textLight }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Endorsements */}
      {/* <section className='max-w-7xl mx-auto px-4 py-16'>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className='text-3xl md:text-4xl font-bold text-center mb-12'
          style={{ color: COLORS.text }}>
          Trusted & Endorsed
        </motion.h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {endorsements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className='bg-white p-8 rounded-2xl shadow-lg'>
              <div className='text-5xl mb-4 text-center'>{item.logo}</div>
              <h4 className='text-xl font-bold mb-4 text-center' style={{ color: COLORS.text }}>
                {item.entity}
              </h4>
              <p className='italic text-center' style={{ color: COLORS.textLight }}>
                "{item.message}"
              </p>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* Social Share Section */}
      <section className='py-16' style={{ backgroundColor: COLORS.lightGreen }}>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className='text-3xl md:text-4xl font-bold mb-6'
            style={{ color: COLORS.text }}>
            Spread the Green Revolution
          </motion.h2>
          <p className='text-xl mb-8' style={{ color: COLORS.textLight }}>
            Share MomEarth with your friends and family
          </p>
          
          <div className='flex justify-center gap-4 flex-wrap'>
            {[
              { icon: <Facebook />, name: 'facebook', color: '#1877f2' },
              { icon: <Instagram />, name: 'instagram', color: '#e4405f' },
              { icon: <MessageCircle />, name: 'whatsapp', color: '#25d366' },
              { icon: <Twitter />, name: 'twitter', color: '#1da1f2' }
            ].map((social, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => shareWebsite(social.name)}
                className='w-14 h-14 rounded-full flex items-center justify-center text-white text-xl'
                style={{ backgroundColor: social.color }}>
                {social.icon}
              </motion.button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;