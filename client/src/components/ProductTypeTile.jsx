import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from './Spinner';

const PopUp = React.lazy(() => import('./PopUp'));


const Heart = React.lazy(() => import('lucide-react/dist/esm/icons/heart.js'));
const Star = React.lazy(() => import('lucide-react/dist/esm/icons/star.js'));
const ShoppingCart = React.lazy(() => import('lucide-react/dist/esm/icons/shopping-cart.js'));
import { dispatchWishlistEvent, dispatchCartEvent, WISHLIST_EVENTS, CART_EVENTS } from '../utils/cartWishlistEvents';
import { getSizesByPid } from '../utils/sizeData.js';
const ProductTypeTile = () => {

  

  
    //  scroll to top on component mount
    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, []);

      
      
  const navigate = useNavigate();
  const [detail, setDetail] = useState({});
  const { productType } = useParams();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
  
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem('Wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/products/type/${productType}`)
      .then(res => {
        if (!res.ok) {
          setData([]);
        }
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
          setData([]);
          setFilteredData([]);
        } else {
          setData(data);
          setFilteredData(data);
          setDetail({brand: data.brand, gender: data.gender, color: data.color, type: data.productType})
        }
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setData([]);
        setFilteredData([]);
      })
      .finally(() => setLoading(false));
  }, [productType]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...data];

    // Price filter
    if (priceRange !== 'all') {
      if (priceRange === 'under500') result = result.filter(item => item.price < 500);
      else if (priceRange === '500-1000') result = result.filter(item => item.price >= 500 && item.price <= 1000);
      else if (priceRange === '1000-2000') result = result.filter(item => item.price > 1000 && item.price <= 2000);
      else if (priceRange === 'above2000') result = result.filter(item => item.price > 2000);
    }

    // Sorting
    if (sortBy === 'priceLow') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceHigh') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'popular') result.sort((a, b) => (b.count || 0) - (a.count || 0));

    setFilteredData(result);
  }, [data, sortBy, priceRange]);

  function toggleWishlist(e, pid) {
    e.stopPropagation();
    const oldWishlist = JSON.parse(localStorage.getItem('Wishlist')) || [];
    
    if(oldWishlist.includes(pid)) {
      const newWishlist = oldWishlist.filter(item => item !== pid);
      localStorage.setItem('Wishlist', JSON.stringify(newWishlist));
      setMessage('Removed from Wishlist');
      setIsVisible(true);
      setWishlist(newWishlist);
      
      // Dispatch wishlist event
      dispatchWishlistEvent(WISHLIST_EVENTS.ITEM_REMOVED, { pid, wishlistCount: newWishlist.length });
    } else {
      const newWishlist = [...oldWishlist, pid];
      localStorage.setItem('Wishlist', JSON.stringify(newWishlist));
      setWishlist(newWishlist);
      setMessage('Added to Wishlist');
      setIsVisible(true);
      
      // Dispatch wishlist event
      dispatchWishlistEvent(WISHLIST_EVENTS.ITEM_ADDED, { pid, wishlistCount: newWishlist.length });
    }
  }

  function handleAddToCart(e, pid, image, brand, name, price) {
    e.stopPropagation();
    const oldCart = JSON.parse(localStorage.getItem('CartDetail')) || [];
    
    if(oldCart.some(obj => obj.pid === pid)) {
      setMessage('Already in Cart');
      setIsVisible(true);
      return;
    }
    
    const objToPush = { pid, image, brand, name, price, quantity: 1, size: getSizesByPid(pid)[0] };
    oldCart.push(objToPush);
    localStorage.setItem('CartDetail', JSON.stringify(oldCart));
    setMessage('Added to Cart');
    setIsVisible(true);
    
    // Dispatch cart event
    dispatchCartEvent(CART_EVENTS.ITEM_ADDED, { pid, cartCount: oldCart.length });
  }

  function handleNavigateToProductDetail(e, pid) {
    e.stopPropagation();
    navigate(`/products/pid/${pid}`);
  }

  function isWishlisted(pid) {
    return wishlist.includes(pid);
  }

  if(data.length === 0 && !loading) {
    return (
      <div className='flex flex-col justify-center items-center min-h-[60vh] px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center'>
          <div className='text-6xl text-gray-300 mb-4'>🔍</div>
          <h2 className='text-2xl font-bold text-gray-700 mb-2'>No Products Found</h2>
          <p className='text-gray-500 mb-6'>No products available for "{productType}"</p>
          <button 
            onClick={() => navigate('/')}
            className='bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors'>
            Browse All Products
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
        <div className='relative px-4 sm:px-6 lg:px-10 xl:px-16 2xl:px-20 py-8'>
          {/* Header Section */}
          <div className='mb-8'>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
              <div>
                <h1 className='text-3xl font-bold text-gray-800 mb-2 capitalize'>{productType}</h1>
                <p className='text-gray-600'>{filteredData.length} {filteredData.length === 1 ? 'product' : 'products'} found</p>
              </div>

              {/* Filter & Sort Controls */}
              <div className='flex flex-wrap gap-3'>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'>
                  <option value="default">Sort By</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>

                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className='px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'>
                  <option value="all">All Prices</option>
                  <option value="under500">Under ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-2000">₹1000 - ₹2000</option>
                  <option value="above2000">Above ₹2000</option>
                </select>
              </div>
            </motion.div>

            {/* Active Filters Display */}
            {(sortBy !== 'default' || priceRange !== 'all') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className='flex flex-wrap gap-2 mb-4'>
                {sortBy !== 'default' && (
                  <span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2'>
                    Sorted by: {sortBy === 'priceLow' ? 'Price Low-High' : sortBy === 'priceHigh' ? 'Price High-Low' : sortBy === 'rating' ? 'Rating' : 'Popularity'}
                    <button onClick={() => setSortBy('default')} className='hover:text-blue-900'>✕</button>
                  </span>
                )}
                {priceRange !== 'all' && (
                  <span className='bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2'>
                    Price: {priceRange === 'under500' ? 'Under ₹500' : priceRange === '500-1000' ? '₹500-1000' : priceRange === '1000-2000' ? '₹1000-2000' : 'Above ₹2000'}
                    <button onClick={() => setPriceRange('all')} className='hover:text-blue-900'>✕</button>
                  </span>
                )}
              </motion.div>
            )}
          </div>

          {/* Products Grid */}
          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6'>
            <AnimatePresence>
              {Array.isArray(filteredData) && filteredData.map(({brand, pid, price, image_url, productname, rating, count}) => (
                <motion.div
                  key={pid}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => handleNavigateToProductDetail(e, pid)}
                  onMouseEnter={() => setHoveredItem(pid)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className='group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100'>
                  
                  {/* Wishlist Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => toggleWishlist(e, pid)}
                    className='absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-white transition-all'>
                    <Heart 
                      className='text-lg transition-all'
                      style={{
                        fill: isWishlisted(pid) ? '#ef4444' : 'transparent',
                        stroke: isWishlisted(pid) ? '#ef4444' : '#374151',
                        strokeWidth: 2
                      }} 
                    />
                  </motion.div>

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
                   {count > 0 && rating > 0 && (
                                         <div className='absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-md flex items-center gap-2'>
                                           <span className='text-xs font-semibold text-gray-800'>{rating}</span>
                                           <Star className='text-green-400 text-sm fill-green-400' size={15} />
                                           
                                           <div className='w-px h-4 bg-gray-300'></div>
                                           <span className='text-xs font-semibold text-gray-600'>{count}</span>
                                         </div>
                                       )}

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
                    <h3 className='text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 h-10'>
                      {productname}
                    </h3>
                    <div className='flex items-center justify-between'>
                      <span className='text-lg sm:text-xl font-bold text-gray-900'>
                        ₹{price}
                      </span>
                      {/* {count > 0 && (
                        <span className='text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full'>
                          Popular
                        </span>
                      )} */}
                    </div>
                  </div>

                  {/* Quick Add Button - Mobile */}
                  <div className='lg:hidden border-t border-gray-100'>
                    <button
                      onClick={(e) => handleAddToCart(e, pid, image_url, brand, productname, price)}
                      className='w-full py-3 text-blue-600 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors'>
                      <ShoppingCart className='text-xs' />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* No Results Message */}
          {filteredData.length === 0 && data.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-20'>
              <p className='text-xl text-gray-600 mb-4'>No products match your filters</p>
              <button
                onClick={() => {
                  setSortBy('default');
                  setPriceRange('all');
                }}
                className='text-blue-600 font-semibold hover:underline'>
                Clear all filters
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

      {/* Recommended Products */}
      {/* <div>
        <Recommended detail={detail} />
      </div> */}
    </>
    
  )
}

export default ProductTypeTile