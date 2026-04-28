



import React, { lazy, Suspense } from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'

// import { useSearchParser } from '../hooks/useSearchParser';
import { onCartEvent, onWishlistEvent, CART_EVENTS, WISHLIST_EVENTS } from '../utils/cartWishlistEvents';



import Heart from 'lucide-react/dist/esm/icons/heart.js';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart.js';
import Menu from 'lucide-react/dist/esm/icons/menu.js'; // FaBars
import Home from 'lucide-react/dist/esm/icons/home.js';
import Book from 'lucide-react/dist/esm/icons/book.js';
import Phone from 'lucide-react/dist/esm/icons/phone.js'; // FaPhoneAlt
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag.js';
import User from 'lucide-react/dist/esm/icons/user.js';
import Search from 'lucide-react/dist/esm/icons/search.js';
import X from 'lucide-react/dist/esm/icons/x.js';

// Lazy load framer-motion components
const motion = {
  div: lazy(() => import('framer-motion').then(mod => ({ default: mod.motion.div }))),
  aside: lazy(() => import('framer-motion').then(mod => ({ default: mod.motion.aside }))),
};
const AnimatePresence = lazy(() => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })));

// Icon placeholder component for loading state
const IconPlaceholder = () => <div className="w-5 h-5 bg-gray-600 rounded animate-pulse" />;

const Header = () => {

  const navigation = useNavigate();
  const location = useLocation();
  // const { buildSearchUrl } = useSearchParser();
  const [isOpen, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [register, setRegister] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

  // Color configuration - change these values to update all icon and text colors globally
  const NAV_COLORS = {
    activeIcon: 'text-green-500',
    activeName: 'text-green-500',
    inactiveIcon: 'text-green-100',
    inactiveName: 'text-green-100',
    hoverIcon: 'hover:text-green-500',
    hoverName: 'hover:text-green-500'
  };

  // Sidebar data - we'll load icons dynamically
  const sidebarData = [
    { id: 1, name: 'Home', path: '/', iconName: 'Home' },
    { id: 2, name: 'Orders', path: '/orders', iconName: 'Book' },
    { id: 3, name: 'Contact Us', path: '/contactus', iconName: 'Phone' },
    { id: 4, name: 'Wishlist', path: '/wishlist', iconName: 'Heart' },
    { id: 5, name: 'Cart', path: '/cart', iconName: 'ShoppingBag' },
    { id: 6, name: 'About Us', path: '/aboutus', iconName: 'User' },
    { id: 7, name: 'Return Policy', path: '/returnpolicy', iconName: 'Book' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const filter = {};
  const [searchQuery, setSearchQuery] = useState('');
  const words = searchQuery.toLowerCase().trim().split(/\s+/);

  const color = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'orange', 'brown', 'gray', 'cyan', 'magenta'];
  const season = ['summer', 'winter', 'spring', 'fall', 'autumn'];
  const material = ['cotton', 'silk', 'polyester', 'wool', 'linen', 'denim', 'leather'];
  const gender = ['men', 'women', 'unisex', 'kids'];
  const product_type = ['shirt', 'tshirt', 'pants', 'jeans', 'shorts', 'skirt', 'dress', 'jacket', 'coat', 'sweater', 'hoodie'];

  const usedWords = new Set(); // Track which words were matched

  // The checking and assigning filters
  words.forEach((word) => {
    if (color.includes(word)) {
      filter.color = word;
      usedWords.add(word);
    } else if (season.includes(word)) {
      filter.season = word;
      usedWords.add(word);
    } else if (material.includes(word)) {
      filter.material = word;
      usedWords.add(word);
    } else if (gender.includes(word)) {
      filter.gender = word;
      usedWords.add(word);
    } else if (product_type.includes(word)) {
      filter.product_type = word;
      usedWords.add(word);
    }
  });

  // Get remaining words that weren't matched
  const remainingWordsList = words.filter(word => !usedWords.has(word));
  filter.remainingWords = remainingWordsList.join(' ');

  function handleSearch(e) {
    e.preventDefault();
    navigate('/products/search', { state: { filter, searchQuery } });
    // setSearchQuery('');
    setSearchOpen(false);
  }

  // Update cart and wishlist counts
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('CartDetail')) || [];
    const wishlistItems = JSON.parse(localStorage.getItem('Wishlist')) || [];
    
    let userDetails = {};
    try {
      const detail = localStorage.getItem('detail');
      userDetails = detail ? JSON.parse(detail) : {};
    } catch (e) {
      userDetails = {};
    }
    
    setCartCount(cartItems.length);
    setWishlistCount(wishlistItems.length);
    
    // Check if user is logged in (has details)
    if (userDetails && userDetails.name && userDetails.phone) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);
  
  // Listen to cart events for immediate updates
  useEffect(() => {
    const unsubscribeCartAdded = onCartEvent(CART_EVENTS.ITEM_ADDED, (event) => {
      const { cartCount } = event.detail;
      setCartCount(cartCount);
    });
    
    const unsubscribeCartRemoved = onCartEvent(CART_EVENTS.ITEM_REMOVED, (event) => {
      const { cartCount } = event.detail;
      setCartCount(cartCount);
    });
    
    const unsubscribeCartUpdated = onCartEvent(CART_EVENTS.CART_UPDATED, () => {
      const cartItems = JSON.parse(localStorage.getItem('CartDetail')) || [];
      setCartCount(cartItems.length);
    });
    
    return () => {
      unsubscribeCartAdded();
      unsubscribeCartRemoved();
      unsubscribeCartUpdated();
    };
  }, []);
  
  // Listen to wishlist events for immediate updates
  useEffect(() => {
    const unsubscribeWishlistAdded = onWishlistEvent(WISHLIST_EVENTS.ITEM_ADDED, (event) => {
      const { wishlistCount } = event.detail;
      setWishlistCount(wishlistCount);
    });
    
    const unsubscribeWishlistRemoved = onWishlistEvent(WISHLIST_EVENTS.ITEM_REMOVED, (event) => {
      const { wishlistCount } = event.detail;
      setWishlistCount(wishlistCount);
    });
    
    const unsubscribeWishlistUpdated = onWishlistEvent(WISHLIST_EVENTS.WISHLIST_UPDATED, (event) => {
      const wishlistItems = JSON.parse(localStorage.getItem('Wishlist')) || [];
      setWishlistCount(wishlistItems.length);
    });
    
    return () => {
      unsubscribeWishlistAdded();
      unsubscribeWishlistRemoved();
      unsubscribeWishlistUpdated();
    };
  }, []);
  
  // Get user details from localStorage safely
  const userDetails = (() => {
    try {
      const detail = localStorage.getItem('detail');
      return detail ? JSON.parse(detail) : {};
    } catch (e) {
      return {};
    }
  })();

  // Close sidebar when route changes
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  function handleSidebar() {
    setOpen(!isOpen);
  }

  function handleNavigation(path) {
    navigation(path);
    setOpen(false);
  }

 

  function clearSearch() {
    setSearchQuery('');
  }

  function handleRegister() {
    setOpen(false);
    navigation('/register');
  }

  const isActive = (path) => location.pathname === path;

  // Motion wrapper component for hover effects
  const MotionWrapper = ({ children, className }) => (
    <Suspense fallback={<div className={className}>{children}</div>}>
      <motion.div
        whileHover={{ scale: 1.25, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        className={className}
      >
        {children}
      </motion.div>
    </Suspense>
  );

  return (
    <>
      <header 
        className={`fixed z-30 left-0 right-0 top-0 transition-all duration-300  ${
          scrolled ? 'bg-green-950 shadow-lg' : 'bg-green-900' 
        }`}
      >
        <div className="flex flex-row justify-between items-center text-white p-4 max-w-7xl mx-auto">
          
          <div className='flex flex-row items-center gap-4 md:gap-6'>
            <button 
              onClick={handleSidebar}
              className='lg:hidden hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200'
              aria-label="Open menu"
            >
              <Suspense fallback={<IconPlaceholder />}>
                <Menu className='text-xl' />
              </Suspense>
            </button>

            <h1 
              className='text-green-100 font-bold text-2xl sm:text-3xl md:text-4xl cursor-pointer hover:text-green-400 transition-colors duration-200' 
              onClick={() => navigation('/')}
            >
              MomEarth
            </h1>
          </div>

          <div className='hidden lg:flex flex-1 max-w-lg mx-3'>
            <form onSubmit={handleSearch} className='relative w-full'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search products, brands, categories...'
                className='w-full py-3 px-5 pr-12 bg-transparent text-green-400 placeholder-green-400 border-1 border-green-600 rounded-full focus:outline-none focus:border-green-300 focus:bg-transparent transition-all duration-200'
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className='absolute right-12 top-1/2 -translate-y-1/2 bg-green-800 text-green-500 hover:text-white transition-colors rounded-full p-2 mr-3'
                >
                  <Suspense fallback={<IconPlaceholder />}>
                    <X className='text-xl text-green-600' />
                  </Suspense>
                </button>
              )}
              <button
                type="submit"
                className='absolute right-3 top-1/2 -translate-y-1/2 bg-green-800 hover:bg-green-500 p-2 rounded-full transition-colors'
              >
                <Suspense fallback={<IconPlaceholder />}>
                  <Search className='text-lg text-green-600' />
                </Suspense>
              </button>
            </form>
          </div>

          <nav className='hidden lg:flex'>
            <ul className='flex flex-row gap-8 xl:gap-10 items-center'>
              <li 
                className={`relative group flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  isActive('/') ? NAV_COLORS.activeIcon : `${NAV_COLORS.inactiveIcon} ${NAV_COLORS.hoverIcon}`
                }`}
                onClick={() => navigation('/')}
              >
                <MotionWrapper className='text-2xl mb-1'>
                  <Suspense fallback={<IconPlaceholder />}>
                    <Home className='text-xl' />
                  </Suspense>
                </MotionWrapper>
                <span className={`text-xs font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap ${
                  isActive('/') ? NAV_COLORS.activeName : `${NAV_COLORS.inactiveName} ${NAV_COLORS.hoverName}`
                }`}>
                  Home
                </span>
              </li>

              <li 
                className={`relative group flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  isActive('/orders') ? NAV_COLORS.activeIcon : `${NAV_COLORS.inactiveIcon} ${NAV_COLORS.hoverIcon}`
                }`}
                onClick={() => navigation('/orders')}
              >
                <MotionWrapper className='text-2xl mb-1'>
                  <Suspense fallback={<IconPlaceholder />}>
                    <Book className='w-6 h-6' />
                  </Suspense>
                </MotionWrapper>
                <span className={`text-xs font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap ${
                  isActive('/orders') ? NAV_COLORS.activeName : `${NAV_COLORS.inactiveName} ${NAV_COLORS.hoverName}`
                }`}>
                  Orders
                </span>
              </li>

              <li 
                className={`relative group flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  isActive('/contactus') ? NAV_COLORS.activeIcon : `${NAV_COLORS.inactiveIcon} ${NAV_COLORS.hoverIcon}`
                }`}
                onClick={() => navigation('/contactus')}
              >
                <MotionWrapper className='text-2xl mb-1'>
                  <Suspense fallback={<IconPlaceholder />}>
                    <Phone className='w-6 h-6' />
                  </Suspense>
                </MotionWrapper>
                <span className={`text-xs font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap ${
                  isActive('/contactus') ? NAV_COLORS.activeName : `${NAV_COLORS.inactiveName} ${NAV_COLORS.hoverName}`
                }`}>
                  Contact
                </span>
              </li>
              
              <li 
                className={`relative group flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  isActive('/wishlist') ? NAV_COLORS.activeIcon : `${NAV_COLORS.inactiveIcon} ${NAV_COLORS.hoverIcon}`
                }`}
                onClick={() => navigation('/wishlist')}
              >
                <MotionWrapper className='text-2xl mb-1 relative'>
                  <Suspense fallback={<IconPlaceholder />}>
                    <Heart className='w-6 h-6' />
                  </Suspense>
                  {wishlistCount > 0 && (
                    <span className='absolute -top-2 -right-3 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg'>
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </MotionWrapper>
                <span className={`text-xs font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap ${
                  isActive('/wishlist') ? NAV_COLORS.activeName : `${NAV_COLORS.inactiveName} ${NAV_COLORS.hoverName}`
                }`}>
                  Wishlist
                </span>
              </li>

              <li 
                className={`relative group flex flex-col items-center cursor-pointer transition-all duration-300 ${
                  isActive('/cart') ? NAV_COLORS.activeIcon : `${NAV_COLORS.inactiveIcon} ${NAV_COLORS.hoverIcon}`
                }`}
                onClick={() => navigation('/cart')}
              >
                <MotionWrapper className='text-2xl mb-1 relative'>
                  <Suspense fallback={<IconPlaceholder />}>
                    <ShoppingBag className='w-6 h-6' />
                  </Suspense>
                  {cartCount > 0 && (
                    <span className='absolute -top-2 -right-3 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg'>
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </MotionWrapper>
                <span className={`text-xs font-semibold tracking-wide transition-colors duration-300 whitespace-nowrap ${
                  isActive('/cart') ? NAV_COLORS.activeName : `${NAV_COLORS.inactiveName} ${NAV_COLORS.hoverName}`
                }`}>
                  Cart
                </span>
              </li>
            </ul>
          </nav>

          <div className='flex lg:hidden flex-row items-center gap-4'>
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className='hover:bg-gray-700 p-2 rounded-lg transition-colors duration-200'
            >
              <Suspense fallback={<IconPlaceholder />}>
                <Search className='text-xl' />
              </Suspense>
            </button>
            
            <button 
              onClick={() => navigation('/wishlist')}
              className={`relative p-2 rounded-lg transition-colors duration-200 ${
                isActive('/wishlist') ? `${NAV_COLORS.activeIcon} hover:bg-gray-700` : `${NAV_COLORS.inactiveIcon} hover:bg-gray-700 ${NAV_COLORS.hoverIcon}`
              }`}
            >
              <Suspense fallback={<IconPlaceholder />}>
                <Heart className='w-6 h-6' />
              </Suspense>
              {wishlistCount > 0 && (
                <span className='absolute top-0 right-0 bg-green-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center'>
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => navigation('/cart')}
              className={`relative p-2 rounded-lg transition-colors duration-200 ${
                isActive('/cart') ? `${NAV_COLORS.activeIcon} hover:bg-gray-700` : `${NAV_COLORS.inactiveIcon} hover:bg-gray-700 ${NAV_COLORS.hoverIcon}`
              }`}
            >
              <Suspense fallback={<IconPlaceholder />}>
                <ShoppingBag className='w-6 h-6' />
              </Suspense>
              {cartCount > 0 && (
                <span className='absolute top-0 right-0 bg-green-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center'>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <Suspense fallback={null}>
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='lg:hidden overflow-hidden bg-gray-900 border-t border-gray-700'
              >
                <form onSubmit={handleSearch} className='p-4'>
                  <div className='relative'>
                    <input
                      type='text'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder='Search products...'
                      autoFocus
                      className='w-full py-3 px-5 pr-12 bg-gray-700 text-gray-200 placeholder-gray-400 border-2 border-gray-600 rounded-full focus:outline-none focus:border-indigo-500 transition-all'
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className='absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white'
                      >
                        <Suspense fallback={<IconPlaceholder />}>
                          <X className='text-xl' />
                        </Suspense>
                      </button>
                    )}
                    <button
                      type="submit"
                      className='absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full transition-colors'
                    >
                      <Suspense fallback={<IconPlaceholder />}>
                        <Search className='text-lg' />
                      </Suspense>
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </header>

      <Suspense fallback={null}>
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleSidebar}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
              />

              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 h-screen w-72 bg-white shadow-2xl z-50 flex flex-col"
              >
                <div className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center'>
                  <h2 className='text-2xl font-bold'>momE</h2>
                  <button 
                    onClick={handleSidebar}
                    className='hover:bg-white/20 p-2 rounded-lg transition-colors'
                    aria-label="Close menu"
                  >
                    <Suspense fallback={<IconPlaceholder />}>
                      <X className='text-2xl' />
                    </Suspense>
                  </button>
                </div>

                {isLoggedIn ? (
                  <div className='p-6 border-b border-gray-200'>
                    <div className='flex items-center gap-3 mb-4'>
                      <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center'>
                        <Suspense fallback={<IconPlaceholder />}>
                          <User className='text-indigo-600 text-xl' />
                        </Suspense>
                      </div>
                      <div>
                        <p className='font-semibold text-gray-800'>{userDetails.name}</p>
                        <p className='text-sm text-gray-500'>{userDetails.phone}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigation('/register')}
                      className='w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm'
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className='p-6 border-b border-gray-200'>
                    <p className='text-gray-600 mb-3'>Welcome to momE!</p>
                    <button 
                      onClick={handleRegister}
                      className='w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium'
                    >
                      Sign In / Register
                    </button>
                  </div>
                )}

                <nav className='flex-1 overflow-y-auto py-4'>
                  <ul className='space-y-1'>
                    {sidebarData.map(({ id, name, path, iconName }) => {
                      const IconComponent = {
                        Home, Book, Phone, Heart, ShoppingBag, User
                      }[iconName];
                      
                      return (
                        <li key={id}>
                          <button
                            onClick={() => handleNavigation(path)}
                            className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-200 ${
                              isActive(path)
                                ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                                : 'text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'
                            }`}
                          >
                            <span className='text-xl'>
                              <Suspense fallback={<IconPlaceholder />}>
                                {IconComponent && <IconComponent />}
                              </Suspense>
                            </span>
                            <span className='font-medium'>{name}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className='p-6 border-t border-gray-200 bg-gray-50'>
                  <p className='text-xs text-gray-500 text-center'>
                    © 2024 momE. All rights reserved.
                  </p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </Suspense>

      <div className='h-[60px] sm:h-[0px] md:h-[0px] ' />
    </>
  )
}

export default Header