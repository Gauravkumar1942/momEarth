import React from 'react'
import { useState, useEffect, lazy, Suspense, useRef } from 'react'
// import {  FaCartPlus } from 'react-icons/fa6'
// import { FaSyncAlt } from 'react-icons/fa';



import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart.js';
import Trash from 'lucide-react/dist/esm/icons/trash.js';
import Check from 'lucide-react/dist/esm/icons/check.js';
import IndianRupee from 'lucide-react/dist/esm/icons/indian-rupee.js';
import Star from 'lucide-react/dist/esm/icons/star.js';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left.js';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.js';
import Minus from 'lucide-react/dist/esm/icons/minus.js';
import Plus from 'lucide-react/dist/esm/icons/plus.js';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw.js';
import X from 'lucide-react/dist/esm/icons/x.js';
import Heart from 'lucide-react/dist/esm/icons/heart.js';
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign.js';





 
import { useParams } from 'react-router-dom'
import Spinner from './Spinner';
import { getSizesByPid, formatSizeObject } from '../utils/sizeData';
import { dispatchWishlistEvent, dispatchCartEvent, WISHLIST_EVENTS, CART_EVENTS } from '../utils/cartWishlistEvents';
const PopUp = lazy(() => import('./PopUp'));
const Rating = lazy(() => import('./Rating'));
const Recommended = lazy(() => import('./Recommended'));




const BuyNow = lazy(() => import('./BuyNow'));
 
//lazy loading some of the component that we don't immediately need while rendering the page 

const Productdetail = () => {

  
  


  const { pid } = useParams();
  const [detail, setDetail] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(getSizesByPid(String(pid))[0]); // i changed the size from "S" to ''
  const [pincode, setPincode] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const pincodeAllowed = ['110001', '110002', '110003', '802219']; 
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState('');

  const [isBuyNowOpen, setBuyNowOpen]  = useState(false);
  
  // Image gallery scroll states
  const imageScrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isImageHovered, setIsImageHovered] = useState(false);

  // Size scroll states
  const sizeScrollRef = useRef(null);
  const [showSizeLeftArrow, setShowSizeLeftArrow] = useState(false);
  const [showSizeRightArrow, setShowSizeRightArrow] = useState(false);
  const [isSizeHovered, setIsSizeHovered] = useState(false);
 
  // const isReturnable = true; // Example value, replace with actual data

  const [sizeObj, setSizeObj] = useState([]);



    //  scroll to top on component mount
    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, [pid]);





      

  // Fetch and set pincode from localStorage on component mount
  useEffect(() => {
    try {
      const detail = localStorage.getItem('detail');
      if (detail) {
        const userDetails = JSON.parse(detail);
        if (userDetails && userDetails.pincode) {
          setPincode(userDetails.pincode);
        }
      }
    } catch (e) {
      // Handle JSON parse error silently
    }
  }, []);

  useEffect(() => {
    // Load sizes based on product ID when data is available
    if (data && data.length > 0) {
      const sizes = getSizesByPid(String(data[0].pid));
      setSizeObj(formatSizeObject(sizes));
      // Set the first size as default
      setSize(sizes[0]);
    }
  }, [data, pid]);


  useEffect(() => {
    
    setLoading(true);
    fetch(`http://localhost:3000/products/pid/${pid}`)
      .then(response => response.json())
      .then(data => {
        setData(Array.isArray(data) ? data : [data]);
        setLoading(false);
        
          // console.log("Data : ", data[0].brand);
          //   console.log("Data : ", data[0].color);
          //   console.log("Data : ", data[0].gender);
          //   console.log("Data : ", data[0].product_type); 
      })
      .catch(err => {
        // console.log('Cannot find anything', err);
        setError(err);
        setLoading(false);
      })
  }, [pid]);

  useEffect(() => {

     // RESET states first - this is the key!
  setIsWishlisted(false);
  setIsAddedToCart(false);
    // updating the wishlist and cart state based on local storage
    const wishlist = JSON.parse(localStorage.getItem('Wishlist')) || [];
    if( wishlist.includes(pid)) {
      setIsLoading(true);
      setTimeout(() => {
        setIsWishlisted(true);
        setIsLoading(false);
      }, 1500);
    }

    const cartDetail = JSON.parse(localStorage.getItem('CartDetail')) || [];
    const inCart = cartDetail.some(item => item.pid === pid);
    if(inCart){
      setIsCartLoading(true);
      setTimeout(() => {
        setIsAddedToCart(true);
        setIsCartLoading(false);
      }, 300);
    }


  },[pid]);

  useEffect(() => {
    setTimeout(() => {
      if(data && data.length  > 0 && data[0] ){
         setDetail({brand: data[0].brand, color: data[0].color, gender: data[0].gender, type: data[0].product_type})  ;
    
      }
    }, 1000);
     
           
  }, [data]);


useEffect(() => {
  const imageGallery = imageScrollRef.current;
  if (!imageGallery) return;

  const handleWheel = (e) => {
    e.preventDefault();
    imageGallery.scrollLeft += e.deltaY;
  };

  imageGallery.addEventListener('wheel', handleWheel);

  return () => {
    imageGallery.removeEventListener('wheel', handleWheel);
  };
}, []);

// Update arrow visibility for image gallery
useEffect(() => {
  const imageGallery = imageScrollRef.current;
  if (!imageGallery) return;

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = imageGallery;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  imageGallery.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  return () => imageGallery.removeEventListener('scroll', handleScroll);
}, [data]);

// Update arrow visibility for size container
useEffect(() => {
  const sizeContainer = sizeScrollRef.current;
  if (!sizeContainer) return;

  const checkSizeScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = sizeContainer;
    setShowSizeLeftArrow(scrollLeft > 0);
    setShowSizeRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  sizeContainer.addEventListener('scroll', checkSizeScroll);
  checkSizeScroll(); // Initial check

  // Also check on window resize
  window.addEventListener('resize', checkSizeScroll);

  return () => {
    sizeContainer.removeEventListener('scroll', checkSizeScroll);
    window.removeEventListener('resize', checkSizeScroll);
  };
}, [data]);

// Image scroll functions
const scrollImages = (direction) => {
  const imageGallery = imageScrollRef.current;
  if (!imageGallery) return;

  const imageWidth = imageGallery.querySelector('img').offsetWidth;
  const scrollAmount = direction === 'left' ? -imageWidth - 8 : imageWidth + 8; // +8 for gap
  
  imageGallery.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  });
};

// Size scroll functions
const scrollSizes = (direction) => {
  const sizeContainer = sizeScrollRef.current;
  if (!sizeContainer) return;

  const sizeItem = sizeContainer.querySelector('[data-size]');
  const itemWidth = sizeItem ? sizeItem.offsetWidth + 40 : 100; // +40 for margin
  const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
  
  sizeContainer.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  });
};

  
  function handleWishlist(pid){
    setIsLoading(true);
    if(isWishlisted){
      // take the wishlist array from the local storage and then toggle the pid inside the array
      const wishlist = JSON.parse(localStorage.getItem('Wishlist'));
      const updatedWishlist = wishlist.filter(item => item !== pid);
    
      localStorage.setItem('Wishlist', JSON.stringify(updatedWishlist));
      setPopUpMessage('Product removed from wishlist');
      setIsPopUpVisible(true);
      
      // Dispatch wishlist event
      dispatchWishlistEvent(WISHLIST_EVENTS.ITEM_REMOVED, { pid, wishlistCount: updatedWishlist.length });
    }
    if(!isWishlisted){
      // add the pid to the wishlist array in the local storage
      const wishlist = JSON.parse(localStorage.getItem('Wishlist')) || [];
     if(!wishlist.includes(pid)){

       const updatedWishlist = [...wishlist, pid];
       localStorage.setItem('Wishlist', JSON.stringify(updatedWishlist));
       
       // Dispatch wishlist event
       dispatchWishlistEvent(WISHLIST_EVENTS.ITEM_ADDED, { pid, wishlistCount: updatedWishlist.length });
     }

      setPopUpMessage('Product added to wishlist');
      setIsPopUpVisible(true);
    }
    setTimeout(() => setIsLoading(false) , 1000);
    setIsWishlisted(prev => !prev);
  }

function handleCart(pid, image, brand, name, price, quantity, size){
  
  let cartDetail = JSON.parse(localStorage.getItem('CartDetail'));
  if(cartDetail) {
    if(isAddedToCart){
      setIsCartLoading(true);
      // remove the item from the cart
      setTimeout(() => {
      const updatedCartDetail = cartDetail.filter(item => item.pid !== pid);
      localStorage.setItem('CartDetail', JSON.stringify(updatedCartDetail));
      setPopUpMessage('Product removed from cart');
      setIsPopUpVisible(true);
      setIsAddedToCart(false);
      setIsCartLoading(false);
      
      // Dispatch cart event
      dispatchCartEvent(CART_EVENTS.ITEM_REMOVED, { pid, cartCount: updatedCartDetail.length });
      }, 300);
      
    }else{
      setIsCartLoading(true);
      // add the item to the cart
      const newItem = {
        pid,
        image: image,
        brand,
        name: name,
        price,
        quantity,
        size
      };
      setTimeout(() => {
      cartDetail.push(newItem);
      localStorage.setItem('CartDetail', JSON.stringify(cartDetail));
      setPopUpMessage('Product added to cart');
      setIsPopUpVisible(true);
     
      setIsAddedToCart(true);
      setIsCartLoading(false);
      
      // Dispatch cart event
      dispatchCartEvent(CART_EVENTS.ITEM_ADDED, { pid, cartCount: cartDetail.length });
      }, 300);
     
    }
  }else{
    // the cart detail from the Local storage is null/not found
    setIsCartLoading(true);
    const cartDetail = [];
    const newItem = {
        pid,
        image: image,
        brand,
        name: name,
        price,
        quantity,
        size
      };
    cartDetail.push(newItem);
    localStorage.setItem('CartDetail',JSON.stringify(cartDetail));
    setIsCartLoading(false);
    setPopUpMessage('Product added to cart');
    setIsPopUpVisible(true);
     
    setIsAddedToCart(true);
    
    // Dispatch cart event
    dispatchCartEvent(CART_EVENTS.ITEM_ADDED, { pid, cartCount: cartDetail.length });

  }


}


function handleSize(e){

  if(e.target && e.target.dataset.size){
    setSize(e.target.dataset.size);
  }

  

}

  if (loading) return <div className='flex justify-center items-center'><Spinner  size='lg' color='blue'  /></div>;
  if (error) return  <div className='border-0 border-gray-500 rounded-2xl px-10 py-5 w-[95%] mx-auto flex justify-center items-center '><h2 className='font-ligth text-2xl text-black'>Loading Error</h2></div>;
  if (data.length === 0) return <div className='border-0 border-gray-500 rounded-2xl px-10 py-5 w-[95%] mx-auto flex justify-center items-center '><h2 className='font-ligth text-2xl text-black'>No Product Found</h2></div>;

  return (
    <>
      <div className={`lg:mx-20 xl:mx-45 2xl:mx-60 3xl:mx-70 ${isBuyNowOpen ? 'pointer-events-none opacity-70' : ''} ${isBuyNowOpen ? 'pointer-events-none blur-2xl' : ''}`}>
        {data.map((item) => (
          
          <div key={item.pid} className=' relative w-[95%] md:w-[99%] md:gap-1 mx-auto my-2  md:flex md:flex-row lg:flex lg:flex-row xl:flex xl:flex-row 2xl:flex 2xl:flex-row 3xl:flex 3xl:flex-row gap-3 lg:gap-5 xl:gap-10 2xl:gap-15 3xl:gap-20'>
            
            {/* Image Gallery with Navigation Arrows */}
            <div 
              className='relative w-full sm:w-[70%] md:h-[70%] md:pt-5 md:w-[50%] lg:w-[50%] lg:h-[80%] h-[80%] mx-auto lg:sticky md:sticky xl:sticky 2xl:sticky 3xl:sticky pt-8 bottom-2 top-1'
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <div
                id='imageScroll'
                ref={imageScrollRef}
                className='flex flex-row overflow-x-auto gap-2 rounded-2xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full h-full'
              >
                <img className='rounded-2xl my-2 w-full object-cover flex-shrink-0'
                  fetchPriority='high'
                  loading='eager'
                  src={`/assets/${item.image_url}`} 
                  alt={item.productname} 
                  data-pid={item.pid}
                />
                <img className='rounded-2xl my-2 w-full object-cover flex-shrink-0'
                  loading='lazy'
                  src={`/assets/${item['image_1']}`} 
                  alt={item.productname} 
                />
                <img className='rounded-2xl my-2 w-full object-cover flex-shrink-0'
                  loading='lazy'
                  src={`/assets/${item['image_2']}`} 
                  alt={item.productname} 
                />
                <img className='rounded-2xl my-2 w-full object-cover flex-shrink-0'
                  loading='lazy'
                  src={`/assets/${item['image_3']}`} 
                  alt={item.productname} 
                />
                <img className='rounded-2xl my-2 w-full object-cover flex-shrink-0'
                  loading='lazy'
                  src={`/assets/${item['image_4']}`} 
                  alt={item.productname} 
                />
              </div>

              {/* Left Arrow Button */}
              {showLeftArrow && isImageHovered && (
                <button
                  onClick={() => scrollImages('left')}
                  className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm'
                >
                  <ChevronLeft className='text-gray-800 text-xl' />
                </button>
              )}

              {/* Right Arrow Button */}
              {showRightArrow && isImageHovered && (
                <button
                  onClick={() => scrollImages('right')}
                  className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm'
                >
                  <ChevronRight className='text-gray-800 text-xl' />
                </button>
              )}
            </div>

            <div className=' lg:w-[40%] xl:w-[40%] 2xl:w-[40%] 3xl:w-[40%] md:w-[45%] md:pt-5  '>   
                <div className='border-1 border-gray-500 my-1 rounded-2xl p-2 gap-3 flex flex-col '>
                  
                  <div className='flex flex-center items-center'>
                    {/* brand name and rating */}
                    <h2 className='text-xl  font-medium mx-3'>{item.brand}</h2>
                    {/* Rating beside the brand name */}
                      {item.count > 0 && item.rating > 0 && <div className='border-0 rounded-2xl p-1 mx-2 bg-gray-300 outline-0 pointer-events-none cursor-auto w-[100px] flex flex-row justify-center items-center '>
                        {Number(item.rating).toFixed(1)}<Star className='text-green-500 ml-1 mr-1 fill-green-500' size={15} /> <div className='border-l-1 border-gray-700 h-[100] px-1'>{item.count}</div>
                      </div>}
                  </div>
                  <p className='  mx-3'>{item.productname}</p>
                  <h2 className='text-lg font-medium  mx-3  flex items-center'><IndianRupee className='font-extralight text-md' />{item.price}</h2>
                </div>
                  
                    <div className='border-1 border-gray-500 rounded-2xl py-2 px-5 w-full mx-auto my-3 flex flex-row justify-center items-center'>
                      <h3 className='font-medium text-lg'>Quantity : </h3>
                      <div className='flex flex-row justify-between items-center w-[50%] max-w-xs mx-auto my-2'>
                        
                        <Plus  onClick={() => setQuantity(prev => prev + 1)} className='cursor-pointer hover:text-blue-600 transition' />
                          <span className='text-lg font-medium'>{quantity}</span>
                        <Minus onClick={() => setQuantity(prev => prev > 1 ? prev - 1 : 1)} className='cursor-pointer hover:text-blue-600 transition' />
                      </div>
                      <RefreshCw className='opacity-50 cursor-pointer hover:opacity-100 transition' onClick={() => setQuantity(1)} />
                    </div>

                    {/* Size Container with Navigation Arrows */}
                    <div 
                      className='border-1 border-gray-500 rounded-2xl py-2 px-0 w-full mx-auto my-3'
                      onMouseEnter={() => setIsSizeHovered(true)}
                      onMouseLeave={() => setIsSizeHovered(false)}
                    >
                      <h2 className='text-lg font-medium mx-5 my-3'>Size</h2>
                      <div className='relative'>
                        <div 
                          ref={sizeScrollRef}
                          onClick={handleSize}
                          className='overflow-x-auto scrollbar-hide mx-0 flex flex-row justify-start items-center w-full my-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
                        >
                          {sizeObj.map((obj) => (
                            <div 
                              key={obj.size}
                              data-size={obj.size}
                              className={`flex-shrink-0 ${obj.size === size ? 'bg-blue-500 border-0 text-white font-semibold ' : 'bg-transparent border-1 border-gray-400'} rounded-2xl text-black shadow-amber-100 mx-3 my-3 px-7 py-2 cursor-pointer transition duration-300 ease-in hover:scale-105`}
                            >
                              {obj.size}
                            </div>
                          ))}
                        </div>

                        {/* Left Arrow for Size */}
                        {showSizeLeftArrow && isSizeHovered && (
                          <button
                            onClick={() => scrollSizes('left')}
                            className='absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 z-10'
                          >
                            <ChevronLeft className='text-gray-800 text-sm' />
                          </button>
                        )}

                        {/* Right Arrow for Size */}
                        {showSizeRightArrow && isSizeHovered && (
                          <button
                            onClick={() => scrollSizes('right')}
                            className='absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 z-10'
                          >
                            <ChevronRight className='text-gray-800 text-sm' />
                          </button>
                        )}
                      </div>
                    </div>

                <div className='relative flex border-0 border-gray-500 rounded-2xl py-0 px-0 w-full mx-auto my-3'>
                  <input 
                  placeholder='Enter Pincode'
                  inputMode='numeric'
                  onChange={(e) => setPincode(e.target.value)}
                  value={pincode}
                  maxLength={6}
                   
                  className={`no-spinner w-full mx-0 my-0 border-1  ${ pincode.length === 6 ? pincodeAllowed.includes(pincode) ? 'border-1 border-green-500 bg-green-200' : 'border-1 border-red-500 bg-red-200' : 'border-1 border-gray-900'} outline-0 rounded-2xl  px-4 py-4`} />

                  {pincode.length === 6 && (<div className="absolute right-20 top-5">
                    <Check className= {`${ pincodeAllowed.includes(pincode) ? '' : 'hidden' } rounded-full bg-green-600 text-white font-medium size-5 p-1 `}/>
                    <X className= {`${ pincode.length === 6 ? pincodeAllowed.includes(pincode) ? 'hidden' : '' : 'hidden' } rounded-full bg-red-600 text-white font-medium size-5 p-1 `}/>
                  </div>)}
                </div>


                {/*  COD  and the weather the product is Returnable or not and that is Exchangeable or Not  */}

                    <div className='flex flex-col relative border-1 border-gray-500 rounded-2xl py-3 px-2 w-full mx-auto my-3 gap-3'>
                       {/* COD  */}
                      <div className="flex flex-row items-center gap-2 mx-2">
                        <span>
                          <DollarSign className='inline-block mr-1 text-lg text-green-800 rounded-full bg-green-200 p-0.5' />
                        </span>
                        <h2 className='text-sm font-semibold'>Cash on Delivery Available</h2>
                      </div>

                      {/* Returnable and Exchangeable */}
                      <div className=" flex flex-row items-center gap-2 mx-2">
                        <span>
                          <RefreshCw className={`inline-block mr-1 text-lg ${Number(item.returnable) === 1 ? 'text-green-800' : 'text-gray-400'} bg-green-200 rounded-full p-0.5` } />
                        </span>
                        <h2 className='text-sm font-semibold'>{Number(item.returnable) === 1 && Number(item.exchangeable) === 1 && '7 days Return / Exchange Policy' }{Number(item.returnable) === 0 && Number(item.exchangeable) === 0 && 'No Return / Exchange Available'}{Number(item.returnable) === 0 && Number(item.exchangeable) === 1 && '7 days (only) Exchange Available'}</h2>
                      </div>
                     
                    </div>
{/* 
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 w-fit">
  <div className="bg-emerald-500 rounded-full p-1">
    <DollarSign className="text-white text-xs" />
  </div>
  <span className="text-xs font-bold uppercase tracking-wide">
    Cash on Delivery Available
  </span>
</div>





                    <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
      isReturnable ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'
    }`}>
      {isReturnable ? (
        <>
          <div className="bg-green-500 p-2 rounded-full shadow-sm">
            <RefreshCw className="text-white text-lg" />
          </div>
          <div>
            <p className="text-sm font-bold text-green-800 uppercase tracking-tight">
              Easy Returns & Exchange
            </p>
            <p className="text-xs text-green-600">7-day hassle-free return policy</p>
          </div>
        </>
      ) : (
        <>
          <div className="bg-gray-400 p-2 rounded-full shadow-sm">
            <FiSlash className="text-white text-lg" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700 uppercase tracking-tight">
              Final Sale
            </p>
            <p className="text-xs text-gray-500">Non-returnable for hygiene/safety</p>
          </div>
        </>
      )}
    </div> */}


                  <div className='z-50 w-full mx-auto rounded-2xl my-3'>
                    <div className='flex flex-row justify-between items-center w-full mx-auto py-2'>
                      <div 
                        onClick={() => handleWishlist(item.pid)}
                        className={`flex items-center justify-center w-[15%]  p-4 cursor-pointer`}>
                        {isLoading ? <Spinner size='sm' color='blue' /> : <Heart className={`${isWishlisted ? 'text-[5rem]  fill-red-800 border-0 text-red-800' : 'text-[5rem]  fill-gray-500 text-gray-500'} transition-all duration-200 hover:scale-110`} />  }
                      </div>
      
                      <button
                       onClick={() => setBuyNowOpen(true)}
                       className='flex justify-center items-center w-[60%] bg-indigo-700 hover:bg-indigo-800 text-white text-lg font-medium rounded-2xl py-3 transition-all duration-200 hover:scale-102'>
                        Buy Now
                      </button>
      

                      <div
                        onClick={() => handleCart(item.pid, item.image_url, item.brand, item.productname, item.price, quantity, size)}
                        className={`flex items-center justify-center w-[15%]  p-4 cursor-pointer`}>
                          {isCartLoading ? <Spinner size='sm' color='blue' /> : isAddedToCart ? <Trash className='text-[5rem] cursor-pointer transition-all duration-200 hover:scale-110 hover:text-red-600' /> : <ShoppingCart className='text-[5rem] cursor-pointer transition-all duration-200 hover:scale-110 hover:text-blue-600'/>} 
                      </div>
                    </div>
                  </div>

                <div className='border-1 border-gray-500 rounded-2xl py-2 px-5 w-full mx-auto my-3'>
                  <div>
                    <ul className='list-disc list-inside'>
                      <li className='py-5 font-medium' >Country of Origin: {item.country_of_origin}</li>
                      <li className='py-5'>{item['1feature']}</li>
                      <li className='py-5'>{item['2feature']}</li>
                      <li className='py-5'>{item['3feature']}</li>
                      <li className='py-5'>{item['4feature']}</li>
                      <li className='py-5'>{item.material}</li>
                      <li className='py-5'>{item.care}</li>
                    </ul>
                  </div>
                </div>

                
            </div>
        
          </div>
        ) )  }

        <PopUp 
          message={popUpMessage}
          isVisible={isPopUpVisible}
          onHide={() => setIsPopUpVisible(false)}
        />  
        
      </div>
           
      

{/* Lazy loading of customer reviews section */}
<div className={`w-[90%] mx-auto pt-20 ${isBuyNowOpen ? 'pointer-events-none blur-2xl' : ''}`}>
  <Suspense fallback={
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  }>
    <Rating pid={pid} />
  </Suspense>
</div>

{/* Lazy loading of recommended products section */}
<div className={`w-[90%] mx-auto pt-20 ${isBuyNowOpen ? 'pointer-events-none blur-2xl' : ''}`}>
  <Suspense fallback={
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  }>
    <Recommended detail={detail} />
  </Suspense>
</div>

{/* Lazy loading of Buy Now component */}
{isBuyNowOpen && (
  <Suspense fallback={
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
    </div>
  }>
    <BuyNow 
      onClose={() => {
        setBuyNowOpen(false);
      }}
      productDetails={{
        pid: data[0]?.pid,
        brand: data[0]?.brand,
        name: data[0]?.productname,
        image: data[0]?.image_url,
        price: data[0]?.price,
        quantity: quantity,
        size: size
      }}
    />
  </Suspense>
)}

      
    </>
  );
};

export default Productdetail