
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 


import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart.js';
import Heart from 'lucide-react/dist/esm/icons/heart.js';
import Star from 'lucide-react/dist/esm/icons/star.js';

import X from 'lucide-react/dist/esm/icons/x.js';
import { motion, AnimatePresence } from 'framer-motion';

const PopUp = React.lazy(() => import('./PopUp'));
import Spinner from './Spinner';
import { dispatchWishlistEvent, dispatchCartEvent, WISHLIST_EVENTS, CART_EVENTS } from '../utils/cartWishlistEvents';

const Wishlist = () => {

  
    //  scroll to top on component mount
    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, []);

      
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('Wishlist')) || []);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    if(wishlist.length === 0){
      setData([]);
      setLoading(false);
    } else {
      fetch('http://localhost:3000/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({wishlist})
      }).then(res => res.json()).then(response => {
        console.log("Server response on Wishlist page:", response);
        setData(response);
        if(response.message === 'empty') setData([]);
        setLoading(false);
      }).catch(err => console.error('Fetch error:', err));
    }
  }, [wishlist]);

  function handleNavigateToProductDetail(pid){
    navigate(`/products/pid/${pid}`);
  }

  function handleAddToCart(e, pid, image, brand, name, price){
    e.stopPropagation();
    const oldCart = JSON.parse(localStorage.getItem('CartDetail')) || [];
    if(oldCart.some(obj => obj.pid === pid)) {
      removeFromWishlist(e, pid);
      setMessage('Already in Cart');
      setIsVisible(true);
      return;
    } else {
      const objToPush = {
        pid, image, brand, name, price, quantity: 1, size: 'S'
      }
      oldCart.push(objToPush);
      localStorage.setItem('CartDetail', JSON.stringify(oldCart));
      removeFromWishlist(e, pid);
      setMessage('Added to Cart');
      setIsVisible(true);
      
      // Dispatch events
      dispatchCartEvent(CART_EVENTS.ITEM_ADDED, { pid, cartCount: oldCart.length });
      dispatchWishlistEvent(WISHLIST_EVENTS.ITEM_REMOVED, { pid, wishlistCount: oldCart.length - 1 });
    }
  }

  function removeFromWishlist(e, pid){
    e.stopPropagation();
    const oldWishlist = JSON.parse(localStorage.getItem('Wishlist')) || [];
    const newWishlist = oldWishlist.filter(item => item !== pid);
    setWishlist(newWishlist);
    setMessage('Removed from Wishlist');
    setIsVisible(true);
    console.log('Product removed from wishlist:', pid);
    localStorage.setItem('Wishlist', JSON.stringify(newWishlist));
    
    // Dispatch wishlist update event
    dispatchWishlistEvent(WISHLIST_EVENTS.ITEM_REMOVED, { pid, wishlistCount: newWishlist.length });
  }

  if(data.length === 0) {
    return (
      <div className='flex flex-col justify-center items-center min-h-[60vh] px-4 bg-green-100'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center'>
          <Heart className='text-6xl text-gray-300 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-700 mb-2'>Your Wishlist is Empty</h2>
          <p className='text-gray-500 mb-6'>Save your favorite items here</p>
          <button 
            onClick={() => navigate('/')}
            className='bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors'>
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {loading ? (
        <div className='flex justify-center items-center min-h-[60vh]'>
          <Spinner size='lg' color='blue' />
        </div>
      ) : (
        <div className='relative px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 py-8 bg-green-100'>
          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>My Wishlist</h1>
            <p className='text-gray-600'>{data.length} {data.length === 1 ? 'item' : 'items'} saved</p>
          </div>

          {/* Grid Layout */}
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6'>
            <AnimatePresence>
              {Array.isArray(data) && data.map(({brand, pid, price, image_url, productname, rating, count}) => (
                <motion.div
                  key={pid}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleNavigateToProductDetail(pid)}
                  onMouseEnter={() => setHoveredItem(pid)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className='group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100'>
                  
                  {/* Action Buttons - Top Right */}
                  <div className='absolute top-3 right-3 z-20 flex flex-col gap-2'>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => removeFromWishlist(e, pid)}
                      className='bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-red-50 transition-colors'>
                      <X className='text-gray-700 hover:text-red-600 text-lg' />
                    </motion.button>
                    
                    {/* <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleAddToCart(e, pid, image_url, brand, productname, price)}
                      className='bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-green-50 transition-colors'>
                      <ShoppingCart className='text-gray-700 hover:text-green-600 text-lg' />
                    </motion.button> */}
                  </div>

                  {/* Product Image */}
                  <div className='relative overflow-hidden'>
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className='w-full h-auto object-cover aspect-3/4 rounded-t-2xl'
                      src={`/assets/${image_url}`}
                      alt={productname}
                    />
                    
                    {/* Rating Badge */}
                    {rating > 0 && count > 0 && <div className='absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-md flex items-center gap-2'>
                      <Star className='text-yellow-400 text-xs' />
                      <span className='text-sm font-bold text-gray-800'>{rating}</span>
                      <div className='w-px h-4 bg-gray-300'></div>
                      <span className='text-xs font-semibold text-gray-600'>{count}</span>
                    </div>}

                    {/* Hover Overlay - Add to Cart */}
                    <AnimatePresence>
                      {hoveredItem === pid && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
                          <button
                            onClick={(e) => handleAddToCart(e, pid, image_url, brand, productname, price)}
                            className='w-full bg-white text-gray-900 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors'>
                            <ShoppingCart className='text-sm' />
                            <span>Add to Cart</span>
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>    
                  </div>

                  {/* Product Details */}
                  <div className='p-3 sm:p-4'>
                    <h2 className='font-semibold text-sm sm:text-base text-gray-800 mb-1 truncate'>
                      {brand}
                    </h2>
                    <h3 className='text-xs sm:text-sm text-gray-600 mb-2 truncate'>
                      {productname}
                    </h3>
                    <div className='flex items-center justify-between'>
                      <span className='text-lg sm:text-xl font-bold text-gray-900'>
                        ₹{price}
                      </span>
                      <span className='text-xs text-green-600 font-medium'>In Stock</span>
                    </div>
                  </div>

                  {/* Quick Add to Cart Button - Mobile */}
                  <div className='lg:hidden border-t border-gray-100'>
                    <button
                      onClick={(e) => handleAddToCart(e, pid, image_url, brand, productname, price)}
                      className='w-full py-3 text-green-600 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-50 transition-colors'>
                      <ShoppingCart className='text-xs' />
                      Move to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Move All to Cart Button */}
          {data.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-10 flex justify-center'>
              <button
                onClick={() => {
                  data.forEach(item => {
                    const oldCart = JSON.parse(localStorage.getItem('CartDetail')) || [];
                    if(!oldCart.some(obj => obj.pid === item.pid)) {
                      oldCart.push({
                        pid: item.pid,
                        image: item.image_url,
                        brand: item.brand,
                        name: item.productname,
                        price: item.price,
                        quantity: 1,
                        size: 'S'
                      });
                    }
                    localStorage.setItem('CartDetail', JSON.stringify(oldCart));
                  });
                  localStorage.setItem('Wishlist', JSON.stringify([]));
                  setWishlist([]);
                  setMessage('All items moved to cart!');
                  setIsVisible(true);
                }}
                className='bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2'>
                <ShoppingCart />
                Move All to Cart
              </button>
            </motion.div>
          )}
        </div>
      )}

      <PopUp 
        message={message}
        isVisible={isVisible}
        onHide={() => setIsVisible(false)}
      />
    </>
  );
};

export default Wishlist;