// import { AnimatePresence, motion } from 'framer-motion';
// import React from 'react'
// import { useEffect, useState } from 'react';
// import { FaChevronDown, FaCross, FaCut, FaEquals, FaRupeeSign, FaTimes } from 'react-icons/fa';
// import { FaX } from 'react-icons/fa6';
// import {  FiX } from 'react-icons/fi';
// import PopUp  from './PopUp';
// import Spinner from './Spinner';

// import { useNavigate } from 'react-router-dom';

// const Cart = () => {
//  const [loading, setLoading] = useState(true);
//  const [data, setData] = useState([]);
//  const [sizeVisible, setSizeVisible] = useState(false);
//  const [qVisible, setQVisible] = useState(false);
//  const navigate = useNavigate();
//  const [message, setMessage] = useState("Removed From Cart");
//  const [isVisible, setIsVisible] = useState(false);
//  const [activePid, setActivePid] = useState();
//  const [activeSize, setActiveSize]  = useState();
//  const [activeQuantity, setActiveQuantity]  = useState();
//  const sizeArr = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
//  const quantityArr = [1,2,3,4,5,6,7,8,9,10];
//   useEffect(() => {
//     let cartDetail = JSON.parse(localStorage.getItem('CartDetail')) || [];
//     if(cartDetail){
//       setLoading(false);
//       Array.isArray(cartDetail) ? setData(cartDetail) : setData([cartDetail]);
//     }

//     // const wishlist = JSON.parse(localStorage.getItem('Wishlist')) || ['01', '02', '03'];

//     // fetch('http://localhost:3000/cart').then(res => res.json()).then(response => {
//     //     console.log("Server response:", response);
//     //     setData(response);
//     //   }).catch(err => console.error('Fetch error:', err));
//   }, []);

//   function handleNavigateToProductDetail(pid){
//     setLoading(true);
//     navigate(`/products/pid/${pid}`)
//   }
//   function sizePopUp(e, pid, size){
//     e.stopPropagation();
//     setActivePid(pid);
//     setActiveSize(size);
//     setSizeVisible(true);
//     setQVisible(false);
//   }
  
//   function quantityPopUp(e,pid, quantity){
//     e.stopPropagation();
//     setSizeVisible(false);
//     setQVisible(true);
//     setActivePid(pid)
//     setActiveQuantity(quantity);
//   }
//   function alterSize(e, size){
//     // const size  = e.target.dataset.size;
//     // alert(size);
//     e.stopPropagation();
//     setActiveSize(size);
//     const oldCart = JSON.parse(localStorage.getItem('CartDetail'));
//     const updatedCart = oldCart.map((obj) => {
//       if(obj.pid === activePid){
//         return {...obj, size: size}
//       }
//       return obj;
//     })
//     // alert(updatedCart);
//     localStorage.setItem('CartDetail', JSON.stringify(updatedCart));
//     setSizeVisible(false);
//     // setActivePid('');
//     // setActiveSize('');
//     Array.isArray(updatedCart) ? setData(updatedCart) : setData([updatedCart]);
//   }


//   function alterQuantity(e, quantity){
//     e.stopPropagation();
//     setActiveQuantity(quantity);
//  const oldCart = JSON.parse(localStorage.getItem('CartDetail'));
//     const updatedCart = oldCart.map((obj) => {
//       if(obj.pid === activePid){
//         return {...obj, quantity: quantity}
//       }
//       return obj;
//     })
//     // alert(updatedCart);
//     localStorage.setItem('CartDetail', JSON.stringify(updatedCart));
//     setQVisible(false);
//     // setActivePid('');
//     // setActiveSize('');
//     Array.isArray(updatedCart) ? setData(updatedCart) : setData([updatedCart]);
//   }
//   function deleteFromCart( pid){
//     // e.stopPropagation();

//     const oldCart  = JSON.parse(localStorage.getItem('CartDetail')) || [];
//     const updatedCart = oldCart.filter((obj) => obj.pid !== pid);
//     localStorage.setItem('CartDetail', JSON.stringify(updatedCart));
    
//     setData(updatedCart);
//     setMessage('Removed from Cart');
//     setIsVisible(true);
   
    
    
//   }
//   if (loading) return <div className='flex justify-center items-center'><Spinner  size='lg' color='blue'  /></div>;
//   if(data.length === 0) return <div className='flex justify-center items-center px-8 py-3 border-1 border-gray-500 rounded-2xl my-30 max-w-[300px] mx-auto transition hover:scale-110 duration-300 ease-in-out '><h3 className='text-md font-medium cursor-pointer'>Your Cart is Empty  !!!</h3></div>;
//   return (
//     <>
//       <div className='relative flex flex-col justify-center items-center w-full h-auto bg-gray-50 px-0 '>
//            <div className=' relative grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-3 gap-5 p-0 lg:w-[80%] xl:w-[80%] 2xl:w-[70%] 3xl:w-[60%]'>
//             {Array.isArray(data) && data.map((item) => {
//             return(
//               <div  data-pid={item.pid} className=' relative border-1 border-gray-300 outline-0 rounded-3xl flex flex-row justify-around items-center p-0 m-1 sm:m-3 md:m-4 lg:m-5 xl:m-5 2xl:m-5 3xl:m-5 hover:scale-105 transition-transform duration-300 ease-in-out' key={item.pid}>
              
//               {/* the cut icon to remove the pid from cart from local storage  */}
//               <button
//                onClick={(e) => {
                 
//                 e.stopPropagation();
//                  deleteFromCart(item.pid);
//                }}
//                className='absolute right-1.5 top-1.5 rounded-full  p-2 cursor-pointer z-20
//                '>
//                 <FaX 
              
//                 />
//                 </button>



//                 <img 
//                 onClick={() => handleNavigateToProductDetail(item.pid)}
//                 src={`./assets/${item.image}`} alt={item.pid} className='w-[20%] h-full mx-auto my-0 object-cover aspect-3/4 rounded-2xl cursor-pointer  ' />

//                 <div className=' w-[85%]   flex flex-col justify-start items-start pl-5 m-1 gap-1 sm:m-1 md:m-1 lg:m-1 xl:m-1 2xl:m-1 3xl:m-1 hover:scale-105 transition-transform duration-300 ease-in-out'>
//                   <div>
//                     <h2 className='font-medium text-md'>{item.brand}</h2>
//                     {/* For the rating of the product and also the number of products that have been sold  */}
//                     <div></div>
//                   </div>
//                   <div className='flex flex-row justify-around items-center gap-2 mt-3 '>
//                     {/* size manupulation along with a chevron drop down  */}
//                     <div onClick={(e) => sizePopUp(e, item.pid, item.size)}
//                      className='flex bg-gray-300 flex-row justify-around items-center gap-2 px-1 py-0.5  rounded-lg text-sm'>
//                       {item.size}< FaChevronDown className='text-sm' />
//                     </div>
//                     {/* Below h2 is for name of the product  */}
//                     <h2 className='text-sm'>{item.name}</h2>
//                   </div>
//                   {/* Quantity manupulation and also calculated price accor to the quantity  */}
//                   <div className='flex flex-row justify-around items-center gap-4 mt-3'> 
//                     <h2>{item.price}</h2>
//                     <FiX />
//                     {/* quantity */}
//                     <div
//                     onClick={(e) => quantityPopUp(e,item.pid, item.quantity)} 
//                     className='flex flex-row justify-around items-center bg-gray-300 px-1 py-0.5 rounded-lg gap-2 text-sm'>{item.quantity}<FaChevronDown />
//                     </div>
//                     <FaEquals className='opacity-70' />
//                     <div className='flex flex-row justify-around items-center font-bold text-lg'><FaRupeeSign />{ item.price * item.quantity}</div>
//                   </div>
                 
//                  </div>
//                 {/* here goes the quantity */}
//                 {/* <div className='w-[50%] rounded-2xl border-1 border-gray-300 flex flex-row justify-around items-center p-2 mr-15'>
//                   <FiPlus />
//                   <div>{`${item.quantity}`}</div>
//                   <FiMinus />
//                 </div> */}
//               </div>
//             )
//           })}
//       </div>

//       {/* check out div with all the cost ad the chekc out button  */}
//       <div className='relative border-1 border-gray-300 rounded-2xl bg-transparent w-full mx-auto p-5 max-w-[400px] h-auto flex flex-col justify-center items-center mt-20'>
//         <div className='border-1 border-gray-200 rounded-2xl p-5'>
//           <h3><span>Name : </span>{}</h3>
//           <h3><span>Address : </span>{}</h3>
//           <h3><span>Pincode : </span>{}</h3>
//            <div className='w-full h-auto flex flex-row justify-center items-center pt-5'>
//             <button className='flex flex-row justify-center items-center text-sm font-medium rounded-3xl'>Change</button>
//            </div>
//            </div>
//         <div>
//           <select></select>
//         </div>
//       </div>
//       </div>
//       {/* Pop Up to alter the size as well as the quantity 
//       Here, there will be a pop up div with size say xs, s, m,l lx, xxl. They will be rendered and also the pices according to teh sixe shall be displayed as well. 
//       */}

//       <AnimatePresence>
//         {sizeVisible && (
//           <motion.div
//           initial= {{ opacity: 0, y: 20 }}
//           animate= {{ opacity: 1, y: 4 }}
//           transition={{type: 'spring' ,duration: 0.5, ease: 'easeIn'}}
//           className='fixed flex left-1/2 -translate-x-1/2 bottom-2 w-[98%] min-w-[300px] max-w-[500px] bg-gray-100 border-2 border-blue-500 text-white pt-15 pb-5 px-1 rounded-2xl z-50 shadow-lg '
//           >
//             <div 
//             onClick={() => setSizeVisible(false)}
//             className={` `}>
//               <FaX className={`absolute top-2 right-2 cursor-pointer text-gray-700`} />
//             </div>

//             <div  data-pid={activePid} className={`relative flex flex-row justify-start items-center overflow-x-auto w-full mx-auto gap-5`}>
//                {sizeArr.map((size) => (
//               <div id="sizePopUpDiv"
//               onClick={(e) => alterSize(e, size)}
//                key={size}
//                data-size={size} 
//                className={`flex flex-row justify-around items-center py-2  w-full px-5 rounded-2xl text-black  ${activeSize === size ? 'bg-blue-500 border-0 text-white font-medium' : 'bg-transparent border-1 border-blue-500'} `}>
//                 <span className='cursor-pointer'>{size}</span>
               
//               </div>
//             ))}
//             </div>
           

//         </motion.div>
//         )}
//       </AnimatePresence>
      
      
//       <AnimatePresence>
//         {qVisible && (
//           <motion.div
//           initial= {{ opacity: 0, y: 20 }}
//           animate= {{ opacity: 1, y: 4 }}
//           transition={{type: 'spring' ,duration: 0.5, ease: 'easeIn'}}
//           className='fixed flex left-1/2 -translate-x-1/2 bottom-2 w-[98%] min-w-[300px] max-w-[900px] bg-gray-100 border-2 border-blue-500 text-white pt-15 pb-5 px-1 rounded-2xl z-50 shadow-lg '
         
//           >
//                <div 
//             onClick={() => setQVisible(false)}
//             className={` `}>
//               <FaX className={`absolute top-2 right-2 cursor-pointer text-gray-700 hover:scale-3d transition-transform duration-200 ease-initial`} />
//             </div>

//             <div  data-pid={activePid} className={`relative flex flex-row justify-start items-center overflow-x-auto w-full mx-auto gap-5`}>
//                {quantityArr.map((quantity) => (
//               <div 
//               onClick={(e) => alterQuantity(e, quantity)}
//                key={quantity}
//                data-size={quantity} 
//                className={`flex flex-row justify-around items-center py-2  w-full px-5 rounded-2xl text-black  ${activeQuantity === quantity ? 'bg-blue-500 border-0 text-white font-medium' : 'bg-transparent border-1 border-blue-500'} `}>
//                 <span className='cursor-pointer'>{quantity}</span>
               
//               </div>
//             ))}
//             </div>

//         </motion.div>
//         )}
//       </AnimatePresence>
      



//       {/* Pop Up to alert the remval of the rpoduct fro teh cart LS */}
//      <PopUp message={message} isVisible={isVisible} onHide={() => setIsVisible(false)} />
//     </>

//     // <>
      
//     // </>
//   )
// }

// export default Cart







import { AnimatePresence, motion } from 'framer-motion';
import React from 'react'
import { useEffect, useState } from 'react';
// import { FaChevronDown, FaRupeeSign, FaShoppingCart } from 'react-icons/fa';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import IndianRupee from 'lucide-react/dist/esm/icons/indian-rupee.js';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart.js';

import X from 'lucide-react/dist/esm/icons/x.js';

import PopUp  from './PopUp';
import Spinner from './Spinner';
import { getSizesByPid } from '../utils/sizeData';

import { useNavigate } from 'react-router-dom';
import { validateUserDetails } from '../utils/validateUserDetails';
import { dispatchCartEvent, CART_EVENTS } from '../utils/cartWishlistEvents';

const Cart = () => {
  const navigate = useNavigate();
  
  //  scroll to top on component mount and validate user registration
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Check if user is registered
    let userDetails = {};
    try {
      const detail = localStorage.getItem('detail');
      userDetails = detail ? JSON.parse(detail) : {};
    } catch (e) {
      userDetails = {};
    }
    
    const validation = validateUserDetails(userDetails);
    if (!validation.isValid) {
      // Redirect to register page if user is not properly registered
      navigate('/register');
    }
  }, [navigate]);




 const [loading, setLoading] = useState(true);
 const [data, setData] = useState([]);
 const [sizeVisible, setSizeVisible] = useState(false);
 const [qVisible, setQVisible] = useState(false);
//  const navigate = useNavigate();
 const [message, setMessage] = useState("Removed From Cart");
 const [isVisible, setIsVisible] = useState(false);
 const [activePid, setActivePid] = useState();
 const [activeSize, setActiveSize]  = useState();
 const [activeQuantity, setActiveQuantity]  = useState();
 const [userDetails, setUserDetails] = useState({});
//  const sizeArr = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
 
 const quantityArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
 const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDropdown, setPaymentDropdown] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Available coupons
  const availableCoupons = [
    // { code: 'SAVE10', discount: 10, type: 'percentage' },
    // { code: 'FLAT50', discount: 50, type: 'flat' },
    // { code: 'WELCOME20', discount: 20, type: 'percentage' }
  ];

  // Calculate totals
  const subtotal = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // const tax = subtotal * 0.18; // 18% tax
  const deliveryCharge = subtotal > 249 ? 0 : 50; // Free delivery for orders above 200
  
  let discount = 0;
  if (appliedCoupon) {
    // discount = appliedCoupon.type === 'percentage' 
    //   ? (subtotal * appliedCoupon.discount / 100) 
    //   : appliedCoupon.discount;
  }
  
  // const total = subtotal + tax + deliveryCharge - discount;
  const total = subtotal + deliveryCharge

  function applyCoupon() {
    const coupon = availableCoupons.find(c => c.code === couponCode.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      setMessage('Coupon Applied Successfully!');
      setIsVisible(true);
    } else {
      setMessage('Invalid Coupon Code');
      setIsVisible(true);
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
  }

  function generateUniqueOrderId(index) {
    // Generate unique order ID with timestamp + index + random
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MOMECOD${timestamp}${index}${randomStr}`;
  }

  function handleCheckout() {
    if (!paymentMethod) {
      setMessage('Please select a payment method');
      setIsVisible(true);
      return;
    }
    
    // Validate user details using the state variable
    const validation = validateUserDetails(userDetails);
    
    if (!validation.isValid) {
      setMessage(validation.message);
      setIsVisible(true);
      
      // Redirect to register page after showing message
      setTimeout(() => {
        navigate('/register');
      }, 2000);
      return;
    }
    
    if (paymentMethod === 'cod') {
      const orderDate = new Date().toISOString();
      
      // Calculate return expiry date (7 days from order date)
      // const returnExpiryDate = new Date(new Date(orderDate).getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString();
      
      // Create order array - one entry per product
      const ordersArray = data.map((item, index) => ({
        phone: userDetails.phone || '',
        pid: item.pid,
        brandName: item.brand,
        image_url: item.image,
        // returnExchange: Number(item.returnable) === 1 && Number(item.exchangable) === 1 ? "both" : Number(item.returnable) === 0 && Number(item.exchangable) === 1 ? "exchange" : 'none' ,
        isReturnable: Number(item.returnable) || 0,
        isExchangeable: Number(item.exchangeable) || 0,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        orderID: generateUniqueOrderId(index),
        orderDate: orderDate,
        returnExpiryDate: 0,
        pincode: userDetails.pincode || '',
        address: userDetails.address || '',
        orderStatus: 'on',
        returnable: true,
        returnAlert: false,
        deliveryStatus: 'Ordered',
        trackingID: 0,
        productName: item.name,
        name: userDetails.name || '',
      }));
      
      // Send order data to server
      fetch('http://localhost:3000/orders/insertOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ordersArray)
      })
      .then(res => res.json())
      .then(response => {
        console.log(response);
        
        if (response.success) {
          setMessage(`✓ Order placed successfully! ${response.insertedCount} product(s) ordered.`);
          setIsVisible(true);
          // Clear cart from localStorage after successful insertion
          localStorage.removeItem('CartDetail');
          setData([]);
          setPaymentMethod('');
          // Optionally redirect to orders page after a delay
          setOrderSuccess(true);
          setTimeout(() => {
            navigate('/orders');
          }, 2000);
        } else {
          setMessage(`Order placement failed: ${response.message}`);
          setIsVisible(true);
          console.log(response.message);
          
        }
      })
      .catch(error => {
        setMessage(`Error placing order: ${error.message}`);
        setIsVisible(true);
      });
      
    } else if (paymentMethod === 'online') {
      setMessage('Redirecting to payment gateway...');
      setIsVisible(true);
      // Handle online payment
    }
  }
  
  useEffect(() => {
    let cartDetail = JSON.parse(localStorage.getItem('CartDetail')) || [];
    if(cartDetail){
      setLoading(false);
      Array.isArray(cartDetail) ? setData(cartDetail) : setData([cartDetail]);
    }
    
    // Load user details
    try {
      const detail = localStorage.getItem('detail');
      const details = detail ? JSON.parse(detail) : {};
      setUserDetails(details);
    } catch (e) {
      setUserDetails({});
    }

    // const wishlist = JSON.parse(localStorage.getItem('Wishlist')) || ['01', '02', '03'];

    // fetch('http://localhost:3000/cart').then(res => res.json()).then(response => {
    //     console.log("Server response:", response);
    //     setData(response);
    //   }).catch(err => console.error('Fetch error:', err));
  }, []);

  function handleNavigateToProductDetail(pid){
    setLoading(true);
    navigate(`/products/pid/${pid}`)
  }
  function sizePopUp(e, pid, size){
    e.stopPropagation();
    setActivePid(pid);
    setActiveSize(size);
    setSizeVisible(true);
    setQVisible(false);
  }
  
  function quantityPopUp(e,pid, quantity){
    e.stopPropagation();
    setSizeVisible(false);
    setQVisible(true);
    setActivePid(pid)
    setActiveQuantity(quantity);
  }
  function alterSize(e, size){
    // const size  = e.target.dataset.size;
    // alert(size);
    e.stopPropagation();
    setActiveSize(size);
    const oldCart = JSON.parse(localStorage.getItem('CartDetail'));
    const updatedCart = oldCart.map((obj) => {
      if(obj.pid === activePid){
        return {...obj, size: size}
      }
      return obj;
    })
    // alert(updatedCart);
    localStorage.setItem('CartDetail', JSON.stringify(updatedCart));
    setSizeVisible(false);
    // setActivePid('');
    // setActiveSize('');
    Array.isArray(updatedCart) ? setData(updatedCart) : setData([updatedCart]);
    
    // Dispatch cart update event
    dispatchCartEvent(CART_EVENTS.SIZE_UPDATED, { pid: activePid, size, cartCount: updatedCart.length });
  }


  function alterQuantity(e, quantity){
    e.stopPropagation();
    setActiveQuantity(quantity);
 const oldCart = JSON.parse(localStorage.getItem('CartDetail'));
    const updatedCart = oldCart.map((obj) => {
      if(obj.pid === activePid){
        return {...obj, quantity: quantity}
      }
      return obj;
    })
    // alert(updatedCart);
    localStorage.setItem('CartDetail', JSON.stringify(updatedCart));
    setQVisible(false);
    // setActivePid('');
    // setActiveSize('');
    Array.isArray(updatedCart) ? setData(updatedCart) : setData([updatedCart]);
    
    // Dispatch cart update event
    dispatchCartEvent(CART_EVENTS.QUANTITY_UPDATED, { pid: activePid, quantity, cartCount: updatedCart.length });
  }
  function deleteFromCart( pid){
    // e.stopPropagation();

    const oldCart  = JSON.parse(localStorage.getItem('CartDetail')) || [];
    const updatedCart = oldCart.filter((obj) => obj.pid !== pid);
    localStorage.setItem('CartDetail', JSON.stringify(updatedCart));
    
    setData(updatedCart);
    setMessage('Removed from Cart');
    setIsVisible(true);
    
    // Dispatch cart update event
    dispatchCartEvent(CART_EVENTS.ITEM_REMOVED, { pid, cartCount: updatedCart.length });
  }
  if (loading) return <div className='flex justify-center items-center'><Spinner  size='lg' color='blue'  /></div>;
   if(data.length === 0) {
     return (
       <div className='flex flex-col justify-center items-center min-h-[60vh] px-4'>
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className='text-center'>
           <ShoppingCart className='text-6xl text-gray-300 mx-auto mb-4' />
           <h2 className='text-2xl font-bold text-gray-700 mb-2'>Your Cart is Empty</h2>
           <p className='text-gray-500 mb-6'>Add your favorite items here</p>
           <button 
             onClick={() => navigate('/')}
             className='bg-green-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors'>
             Continue Shopping
           </button>
         </motion.div>
       </div>
     );
   }
  return (
    <>
      {/* Desktop & Tablet Layout */}
      <div className='hidden md:flex relative flex-row justify-center items-start w-full min-h-screen bg-green-100 px-4 py-6 gap-6'>
           {/* Left Side - Scrollable Cart Items */}
           <div className='w-full lg:w-[60%] xl:w-[65%] h-[calc(100vh-100px)] overflow-y-auto pr-2'>
            <h2 className='text-2xl font-bold mb-4 sticky top-0 bg-green-100 py-2 z-10'>Shopping Cart ({data.length} items)</h2>
            <div className='flex flex-col gap-4'>
            {Array.isArray(data) && data.map((item) => (
              <div  data-pid={item.pid} className='relative bg-gradient-to-r from-green-100 to-green-200 border-1 border-green-300 outline-0 rounded-2xl flex flex-row justify-between items-center p-4 hover:shadow-lg transition-all duration-300 ease-in-out' key={item.pid}>
              
              <button
               onClick={(e) => {
                e.stopPropagation();
                deleteFromCart(item.pid);
               }}
               className='absolute right-2 top-2 rounded-full p-2 cursor-pointer hover:bg-gray-100'>
                <X className='text-gray-600' />
              </button>

              <img 
                onClick={() => handleNavigateToProductDetail(item.pid)}
                src={`./assets/${item.image}`} alt={item.pid} className='w-24 h-32 object-cover rounded-xl cursor-pointer' />

              <div className='flex-1 flex flex-col justify-start items-start pl-4 gap-2'>
                <h2 className='font-semibold text-lg'>{item.brand}</h2>
                <h3 className='text-sm text-gray-600'>{item.name}</h3>
                
                <div className='flex flex-row items-center gap-3 mt-2'>
                  <div onClick={(e) => sizePopUp(e, item.pid, item.size)}
                     className='flex bg-green-200 flex-row items-center gap-2 px-3 py-1 rounded-lg text-sm cursor-pointer hover:bg-green-300'>
                    Size: {item.size} <ChevronDown className='text-xs' />
                  </div>
                  
                  <div onClick={(e) => quantityPopUp(e, item.pid, item.quantity)} 
                    className='flex flex-row items-center bg-green-200 px-3 py-1 rounded-lg gap-2 text-sm cursor-pointer hover:bg-green-300'>
                    Qty: {item.quantity} <ChevronDown className='text-xs' />
                  </div>
                </div>
                
                <div className='flex flex-row items-center gap-2 mt-2 font-bold text-lg'>
                  <IndianRupee className='text-base' />
                  {item.price * item.quantity}
                </div>
              </div>
            </div>
          ))}
            </div>
           </div>

           {/* Right Side - Static Checkout Details */}
           <div className='w-full lg:w-[40%] xl:w-[35%] sticky top-6 self-start'>
            <div className='bg-green-100 border-1 border-green-300 rounded-2xl p-6 shadow-md'>
              <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
              
              {/* User Details Section */}
              <div className='mb-6 p-4 bg-green-200 border border-green-300 rounded-xl'>
                <h3 className='text-sm font-semibold text-green-900 mb-3'>Delivery Address</h3>
                <div className='space-y-2 text-sm mb-3'>
                  <div>
                    <span className='text-gray-600'>Name:</span>
                    <p className='font-medium text-gray-900'>{userDetails.name || 'N/A'}</p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Phone:</span>
                    <p className='font-medium text-gray-900'>{userDetails.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Address:</span>
                    <p className='font-medium text-gray-900'>{userDetails.address || 'N/A'}</p>
                  </div>
                  <div>
                    <span className='text-gray-600'>Pincode:</span>
                    <p className='font-medium text-gray-900'>{userDetails.pincode || 'N/A'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/register')}
                  className='w-full bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm'
                >
                  Change
                </button>
              </div>
              
              {/* Price Breakdown */}
              <div className='space-y-3 mb-4'>
                <div className='flex justify-between text-gray-700'>
                  <span>Subtotal</span>
                  <span className='flex items-center'><IndianRupee className='text-sm' />{subtotal.toFixed(2)}</span>
                </div>
                
                {/* <div className='flex justify-between text-gray-700'>
                  <span>Tax (18%)</span>
                  <span className='flex items-center'><IndianRupee className='text-sm' />{tax.toFixed(2)}</span>
                </div> */}
                
                <div className='flex justify-between text-gray-700'>
                  <span>Delivery Charge</span>
                  <span className='flex items-center'>
                    {deliveryCharge === 0 ? (
                      <span className='text-green-600 font-medium'>FREE</span>
                    ) : (
                      <><IndianRupee className='text-sm' />{deliveryCharge}</>
                    )}
                  </span>
                </div>
                
                {/* {appliedCoupon && (
                  <div className='flex justify-between text-green-600 font-medium'>
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className='flex items-center'>- <IndianRupee className='text-sm' />{discount.toFixed(2)}</span>
                  </div>
                )} */}
                
                <div className='border-t pt-3 flex justify-between text-lg font-bold'>
                  <span>Total</span>
                  <span className='flex items-center'><IndianRupee className='text-sm' />{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon Section */}
              {/* <div className='mb-4'> */}
                {/* <h3 className='text-sm font-semibold mb-2'>Have a Coupon?</h3> */}
                {/* {!appliedCoupon ? (
                  <div className='flex gap-2'>
                    <input 
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className='flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500'
                    />
                    <button 
                      onClick={applyCoupon}
                      className='px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600'>
                      Apply
                    </button>
                  </div>
                ) : ( */}
                  {/* // <div className='flex items-center justify-between bg-green-50 border border-green-300 rounded-lg p-3'>
                  //   <span className='text-green-700 font-medium'>{appliedCoupon.code} applied!</span>
                  //   <button onClick={removeCoupon} className='text-red-500 hover:text-red-700'> */}
                      {/* <X className='text-xs' /> */}
                    {/* </button> */}
                  {/* </div> */}
                {/* )} */}
                
                {/* Available Coupons */}
                {/* <div className='mt-3'>
                  <p className='text-xs text-gray-500 mb-2'>Available Coupons:</p>
                  <div className='space-y-1'>
                    {availableCoupons.map((coupon) => (
                      <div key={coupon.code} className='text-xs bg-gray-50 p-2 rounded border border-gray-200'>
                        <span className='font-medium'>{coupon.code}</span> - {coupon.type === 'percentage' ? `${coupon.discount}% off` : `₹${coupon.discount} off`}
                      </div>
                    ))}
                  </div>
                </div> */}
              {/* </div> */}

              {/* Payment Method */}
              <div className='mb-4'>
                <h3 className='text-sm font-semibold mb-2'>Payment Method</h3>
                <div className='space-y-2'>
                  {/* <label className='flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50'>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className='mr-3'
                    />
                    <span>Online Payment (UPI/Card/Net Banking)</span>
                  </label> */}
                  
                  <label className='flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50'>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className='mr-3'
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                onClick={handleCheckout}
                className='w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors'>
                {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Checkout'}
              </button>
            </div>
           </div>
      </div>

      {/* Mobile & Tablet Layout */}
      <div className='md:hidden relative flex flex-col w-full min-h-screen bg-green-100'>
        {/* Scrollable Cart Items */}
        <div className='flex-1 overflow-y-auto px-4 py-4 pb-32'>
          <h2 className='text-xl font-bold mb-4'>Shopping Cart ({data.length})</h2>
          <div className='space-y-4'>
            {Array.isArray(data) && data.map((item) => (
              <div  data-pid={item.pid} className='relative bg-gradient-to-r from-green-100 to-green-200 border border-gray-300 rounded-2xl p-3 shadow-sm' key={item.pid}>
                <button
                 onClick={(e) => {
                  e.stopPropagation();
                  deleteFromCart(item.pid);
                 }}
                 className='absolute right-2 top-2 p-1.5 hover:bg-gray-100 rounded-full'>
                  <X className='text-xs text-green-950' />
                </button>

                <div className='flex gap-3'>
                  <img 
                    onClick={() => handleNavigateToProductDetail(item.pid)}
                    src={`./assets/${item.image}`} alt={item.pid} className='w-20 h-24 object-cover rounded-lg' />

                  <div className='flex-1'>
                    <h3 className='font-semibold text-sm'>{item.brand}</h3>
                    <p className='text-xs text-gray-600 mb-2'>{item.name}</p>
                    
                    <div className='flex gap-2 mb-2'>
                      <div onClick={(e) => sizePopUp(e, item.pid, item.size)}
                        className='flex items-center gap-1 bg-green-200 px-2 py-1 rounded text-xs'>
                        Size: {item.size} <ChevronDown className='text-xs' />
                      </div>
                      
                      <div onClick={(e) => quantityPopUp(e, item.pid, item.quantity)} 
                        className='flex items-center bg-green-200 px-2 py-1 rounded text-xs'>
                        Qty: {item.quantity} <ChevronDown className='text-xs' />
                      </div>
                    </div>
                    
                    <div className='flex items-center gap-1 font-bold'>
                      <IndianRupee className='text-sm' />
                      {item.price * item.quantity}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scrollable Order Summary for Mobile */}
          <div className='mt-6 bg-gradient-to-r from-green-100 to-green-200 border rounded-2xl p-4 mb-4'>
            <h3 className='font-bold mb-3'>Order Summary</h3>
            
            {/* User Details Section Mobile */}
            <div className='mb-4 p-3 bg-gradient-to-r from-green-100 to-green-200 border border-green-200 rounded-lg'>
              <h4 className='text-xs font-semibold text-green-900 mb-2'>Delivery Address</h4>
              <div className='space-y-1 text-xs mb-2'>
                <div>
                  <span className='text-gray-600'>Name:</span>
                  <p className='font-medium text-gray-900'>{userDetails.name || 'N/A'}</p>
                </div>
                <div>
                  <span className='text-gray-600'>Phone:</span>
                  <p className='font-medium text-gray-900'>{userDetails.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className='text-gray-600'>Address:</span>
                  <p className='font-medium text-gray-900'>{userDetails.address || 'N/A'}</p>
                </div>
                <div>
                  <span className='text-gray-600'>Pincode:</span>
                  <p className='font-medium text-gray-900'>{userDetails.pincode || 'N/A'}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/register')}
                className='w-full bg-green-600 text-white py-1.5 px-2 rounded text-xs hover:bg-green-700 transition-colors font-medium'
              >
                Change
              </button>
            </div>
            
            <div className='space-y-2 text-sm mb-4'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span className='flex items-center'><IndianRupee className='text-xs' />{subtotal.toFixed(2)}</span>
              </div>
              {/* <div className='flex justify-between'>
                <span>Tax (18%)</span>
                <span className='flex items-center'><IndianRupee className='text-xs' />{tax.toFixed(2)}</span>
              </div> */}
              <div className='flex justify-between'>
                <span>Delivery</span>
                <span>{deliveryCharge === 0 ? <span className='text-green-600 font-medium'>FREE</span> : <span className='flex items-center'><IndianRupee className='text-xs' />{deliveryCharge}</span>}</span>
              </div>
              {appliedCoupon && (
                <div className='flex justify-between text-green-600'>
                  <span>Discount</span>
                  <span className='flex items-center'>- <IndianRupee className='text-xs' />{discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Coupon Section Mobile */}
            {/* <div className='mb-4'>
              {!appliedCoupon ? (
                <div className='flex gap-2'>
                  <input 
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className='flex-1 px-3 py-2 border rounded-lg text-sm'
                  />
                  <button onClick={applyCoupon} className='px-4 py-2 bg-green-500 text-white rounded-lg text-sm'>
                    Apply
                  </button>
                </div>
              ) : (
                <div className='flex items-center justify-between bg-green-50 border border-green-300 rounded-lg p-2'>
                  <span className='text-sm text-green-700 font-medium'>{appliedCoupon.code}</span>
                  <button onClick={removeCoupon} className='text-red-500'><X className='text-xs' /></button>
                </div>
              )}
            </div> */}


          </div>
        </div>

        {/* Fixed Bottom Payment Bar */}
        <div className='fixed bottom-0 left-0 right-0 bg-gradient-to-r from-green-100 to-green-200 border-t-2 shadow-lg p-4 z-40'>
          <div className='flex justify-between items-center mb-3'>
            <span className='text-sm font-medium'>Total Amount:</span>
            <span className='text-xl font-bold flex items-center'><IndianRupee className='text-sm' />{total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={() => setPaymentDropdown(!paymentDropdown)}
            className='w-full bg-gradient-to-r from-green-100 to-green-200 py-2 rounded-lg mb-2 flex justify-between items-center px-4'>
            <span className='text-sm'>{paymentMethod ? (paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment') : 'Select Payment Method'}</span>
            <ChevronDown className={`text-sm transition-transform ${paymentDropdown ? 'rotate-180' : ''}`} />
          </button>

          <button 
            onClick={handleCheckout}
            className='w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700'>
            {paymentMethod === 'cod' ? 'Place Order' : 'Checkout'}
          </button>
        </div>

        {/* Payment Method Dropdown for Mobile */}
        <AnimatePresence>
          {paymentDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className='fixed bottom-0 left-0 right-0 bg-white border-t-2 rounded-t-3xl shadow-2xl p-6 z-50'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-bold text-lg'>Select Payment Method</h3>
                <button onClick={() => setPaymentDropdown(false)}>
                  <X className='text-gray-600' />
                </button>
              </div>
              
              <div className='space-y-3'>
                {/* <label className='flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50'>
                  <input 
                    type="radio" 
                    name="payment-mobile" 
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentDropdown(false);
                    }}
                    className='mr-3'
                  />
                  <div>
                    <div className='font-medium'>Online Payment</div>
                    <div className='text-xs text-gray-500'>UPI / Card / Net Banking</div>
                  </div>
                </label> */}
                
                <label className='flex items-center p-4 border-2 rounded-xl cursor-pointer hover:bg-gray-50'>
                  <input 
                    type="radio" 
                    name="payment-mobile" 
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setPaymentDropdown(false);
                    }}
                    className='mr-3'
                  />
                  <div>
                    <div className='font-medium'>Cash on Delivery</div>
                    <div className='text-xs text-gray-500'>Pay when you receive</div>
                  </div>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* check out div with all the cost ad the chekc out button  */}
      {/* <div className='relative border-1 border-gray-300 rounded-2xl bg-transparent w-full mx-auto p-5 max-w-[400px] h-auto flex flex-col justify-center items-center mt-20'>
        <div className='border-1 border-gray-200 rounded-2xl p-5'>
          <h3><span>Name : </span>{}</h3>
          <h3><span>Address : </span>{}</h3>
          <h3><span>Pincode : </span>{}</h3>
           <div className='w-full h-auto flex flex-row justify-center items-center pt-5'>
            <button className='flex flex-row justify-center items-center text-sm font-medium rounded-3xl'>Change</button>
           </div>
           </div>
        <div>
          <select></select>
        </div>
      </div> */}
      
      
      {/* Pop Up to alter the size as well as the quantity 
      Here, there will be a pop up div with size say xs, s, m,l lx, xxl. They will be rendered and also the pices according to teh sixe shall be displayed as well. 
      */}

      <AnimatePresence>
        {sizeVisible && (
          <motion.div
          initial= {{ opacity: 0, y: 20 }}
          animate= {{ opacity: 1, y: 4 }}
          transition={{type: 'spring' ,duration: 0.5, ease: 'easeIn'}}
          className='fixed flex left-1/2 -translate-x-1/2 bottom-2 w-[98%] min-w-[300px] max-w-[500px] bg-green-100 border-2 border-green-500 text-white pt-15 pb-5 px-1 rounded-2xl z-50 shadow-lg '
          >
            <div 
            onClick={() => setSizeVisible(false)}
            className={` `}>
              <X className={`absolute top-2 right-2 cursor-pointer text-green-950`} />
            </div>

            <div  data-pid={activePid} className={`relative flex flex-row justify-start items-center overflow-x-auto w-full mx-auto gap-5`}>
               {getSizesByPid(String(activePid)).map((size) => (
              <div id="sizePopUpDiv"
              onClick={(e) => alterSize(e, size)}
               key={size}
               data-size={size} 
               className={`flex flex-row justify-around items-center py-2  w-full px-5 rounded-2xl text-black  ${activeSize === size ? 'bg-green-500 border-0 text-white font-medium' : 'bg-transparent border-1 border-green-500'} `}>
                <span className='cursor-pointer'>{size}</span>
               
              </div>
            ))}
            </div>
           

        </motion.div>
        )}
      </AnimatePresence>
      
      
      <AnimatePresence>
        {qVisible && (
          <motion.div
          initial= {{ opacity: 0, y: 20 }}
          animate= {{ opacity: 1, y: 4 }}
          transition={{type: 'spring' ,duration: 0.5, ease: 'easeIn'}}
          className='fixed flex left-1/2 -translate-x-1/2 bottom-2 w-[98%] min-w-[300px] max-w-[900px] bg-green-100 border-2 border-green-500 text-white pt-15 pb-5 px-1 rounded-2xl z-50 shadow-lg '
         
          >
               <div 
            onClick={() => setQVisible(false)}
            className={` `}>
              <X className={`absolute top-2 right-2 cursor-pointer text-green-950 hover:scale-3d transition-transform duration-200 ease-initial`} />
            </div>

            <div  data-pid={activePid} className={`relative flex flex-row justify-start items-center overflow-x-auto w-full mx-auto gap-5`}>
               {quantityArr.map((quantity) => (
              <div 
              onClick={(e) => alterQuantity(e, quantity)}
               key={quantity}
               data-size={quantity} 
               className={`flex flex-row justify-around items-center py-2  w-full px-5 rounded-2xl text-black  ${activeQuantity === quantity ? 'bg-green-500 border-0 text-white font-medium' : 'bg-transparent border-1 border-green-500'} `}>
                <span className='cursor-pointer'>{quantity}</span>
               
              </div>
            ))}
            </div>

        </motion.div>
        )}
      </AnimatePresence>
      
        {/* Order Success */}

        {orderSuccess && (
           <AnimatePresence>
    <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.3 }}
             className='fixed inset-0 w-full h-full bg-green-500 flex justify-center items-center z-[9999]'>

             <motion.div
               initial={{ scale: 0, rotate: -180 }}
               animate={{ scale: 1, rotate: 0 }}
               transition={{ 
                 type: "spring",
                 stiffness: 200,
                 damping: 15,
                 delay: 0.2
               }}
               className='flex flex-col justify-center items-center gap-8'>

               {/* Animated Check Circle - BIGGER */}
               <motion.div
                 animate={{ 
                   scale: [1, 1.15, 1],
                 }}
                 transition={{ 
                   duration: 1.5,
                   repeat: Infinity,
                   repeatType: "reverse"
                 }}>
                 <CheckCircle className='text-white w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px] lg:w-[350px] lg:h-[350px] xl:w-[400px] xl:h-[400px]' style={{ filter: 'drop-shadow(0 30px 30px rgba(0, 0, 0, 0.4))' }} />
               </motion.div>
               
               {/* Order Successful Text */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className='text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center px-4'>
                  Order Successful!
                </motion.h1>

              </motion.div>

              </motion.div>
            </AnimatePresence>
          )}


      {/* Pop Up to alert the remval of the rpoduct fro teh cart LS */}
     <PopUp message={message} isVisible={isVisible} onHide={() => setIsVisible(false)} />
    </>

    // <>
      
    // </>
  )
}

export default Cart