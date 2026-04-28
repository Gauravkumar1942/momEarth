import React, { useEffect, useState, lazy } from 'react'
import Spinner from './Spinner';
// import { FaX, FaStar, FaMapPin, FaCheck, FaBox, FaTruck, FaHouse } from 'react-icons/fa6';
// import { Package, Truck, MapPin, Star, XCircle, RefreshCw } from 'lucide-react';
import './blink.css'
import { AnimatePresence  } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getSizesByPid } from '../utils/sizeData.js';

import X from 'lucide-react/dist/esm/icons/x.js';
import Star from 'lucide-react/dist/esm/icons/star.js';
import Check from 'lucide-react/dist/esm/icons/check.js';
import Box from 'lucide-react/dist/esm/icons/box.js';
import Truck from 'lucide-react/dist/esm/icons/truck.js';
import House from 'lucide-react/dist/esm/icons/house.js';
import Package from 'lucide-react/dist/esm/icons/package.js';
import MapPin from 'lucide-react/dist/esm/icons/map-pin.js';
import XCircle from 'lucide-react/dist/esm/icons/x-circle.js';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw.js';


const Motion = lazy(() => import('framer-motion').then(module => ({ default: module.motion.div })));

const Orders = () => {



  
    //  scroll to top on component mount
    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
      }, []);

  const navigate = useNavigate();
  const detail = localStorage.getItem('detail') ? JSON.parse(localStorage.getItem('detail')) : null;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewBoxVisible, setReviewBoxVisible] = useState(false);
  const [cancelBoxVisible, setCancelBoxVisible] = useState(false);
  const [phone ,setPhone] = useState(detail ? detail.phone : '');
 
  const statusCodes = ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];
  const [activeOrderDetail, setActiveOrderDetail] = useState({});
  const [ratingAndReview, setRatingAndReview] = useState({ rating: 0, review: '' });
  const [returnPopUp, setReturnPopUp] = useState(false);
  const [returnExchangePopUp, setReturnExchangePopUp] = useState(false);
  const [showExchangeSizes, setShowExchangeSizes] = useState(false);

  useEffect(() => {
    if(detail === null){
      navigate('/register');
      return;
    }
    setPhone(detail.phone);
    fetch('http://localhost:3000/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    })
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setOrders(data) : setOrders([data]))
      .catch(err => console.log(err, 'The Error'))
      .finally(() => setLoading(false));
  }, []);

  function handleCancelClick(e, pid, phone, orderID, size, name, address, pincode, productName, brandName, price, quantity) {
    e.stopPropagation();
    setActiveOrderDetail({ pid, phone, orderID, size, name, address, pincode, productName, brandName, price, quantity });
    setCancelBoxVisible(true);
  }

  // Going to the product page on clicking the product image
  // const navigate =  useNavigate();
  function handleProductClick(pid) {
    setLoading(true);
    // window.location.href = `/products/pid/${pid}`;
    navigate(`/products/pid/${pid}`);
  }

  function cancelOrder() {
    console.log(activeOrderDetail);
    
    fetch('http://localhost:3000/orders/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pid: activeOrderDetail.pid, phone: activeOrderDetail.phone, orderID: activeOrderDetail.orderID, size: activeOrderDetail.size, name: activeOrderDetail.name, address: activeOrderDetail.address, pincode: activeOrderDetail.pincode, productName: activeOrderDetail.productName, brandName: activeOrderDetail.brandName, price: activeOrderDetail.price, quantity: activeOrderDetail.quantity })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(orders.filter(order => order.pid !== activeOrderDetail.pid));
        }
      })
      .catch(err => console.log(err, 'The Error'))
      .finally(() => setCancelBoxVisible(false));
  }

  function handleSubmitReview(e) {
    
    e.preventDefault();
    fetch('http://localhost:3000/orders/reviews/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pid: activeOrderDetail.pid,
        phone: activeOrderDetail.phone,
        rating: ratingAndReview.rating,
        review: ratingAndReview.review,
        name: detail.name ?? 'Unknown User'                         // Please chnage this ot the original name of the users 
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          alert('Review submitted successfully');
        }
      })
      .catch(err => console.log(err, 'The Error'))
      .finally(() => {
        setRatingAndReview({ rating: 0, review: '' });
        setReviewBoxVisible(false);
      });
  }

  function handleReturnExchange(e, pid, phone, orderID, size, name, address, pincode, productName, brandName, price, quantity) {
    e.preventDefault();
    e.stopPropagation();
    fetch('http://localhost:3000/orders/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pid, phone, orderID, size, name, address, pincode, productName, brandName, price, quantity })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Return/Exchange request submitted successfully');
        }
      })
      .catch(err => console.log(err, 'The Error'))
      .finally(() => {
        setReturnPopUp(false);
        setActiveOrderDetail({});
      });
  }

   // Getting the exchanged Size from the User so that we can do the backend task. 
  function handleExchangeSize(e) {
    e.preventDefault();
    // alert(e.target.dataset.size);
    setActiveOrderDetail({ ...activeOrderDetail, selectedSize: String(e.target.dataset.size) });
    // let us also change the color of the selected size in the modal.

    

   

  }



  // Handling the exchange from the Users. Taking the pid and fetching the size array from the imported util js fetchSizesByPid function and then we will pop up the size selection dialog box and then we will handle the exchange based on the selected size and the pid and phone number of the user.
  function handleExchange(e) {
    // alert("Exchange functionality is coming soon! We are working hard to implement it. Stay tuned for updates. Your order details: " + JSON.stringify(exchangeDetails));
    // setReturnExchangePopUp(false);
    // setShowExchangeSizes(true);


     // wwriting the backedn logic for the insertion of the exchnaged size into the table of the database
    fetch('http://localhost:3000/orders/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pid: activeOrderDetail.pid, phone: activeOrderDetail.phone, orderID: activeOrderDetail.orderID, size: activeOrderDetail.size,  selectedSize: activeOrderDetail.selectedSize })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Exchange request submitted successfully');
      }
    })
    .catch(err => console.log(err, 'The Error'))
    .finally(() => {
      setShowExchangeSizes(false);
      setActiveOrderDetail({});
    });
  }

  const getStatusIcon = (index) => {
    const icons = [Box, Truck, Truck, House];
    return icons[index];
  };

  if (loading) return (
    <div className='min-h-screen flex justify-center items-center bg-gray-50'>
      <Spinner size='lg' color='blue' />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-100 py-8 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">{orders.length} {orders.length === 1 ? 'order' : 'orders'} found</p>
      </div>

      {/* Orders Container */}
      <div className={`max-w-7xl mx-auto transition-all duration-300 ${reviewBoxVisible || cancelBoxVisible || returnPopUp ? 'blur-sm pointer-events-none' : ''}`}>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm p-12 mt-10">
            <Package className="w-20 h-20 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500">Start shopping to see your orders here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...orders].reverse().map((order, index) => (
              <Motion
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-green-100 to-green-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Order Card */}
                <div className="relative p-6">
                  {/* Cancel Button */}
                  {order.deliveryStatus !== 'Delivered' && (
                    <button
                      onClick={(e) => handleCancelClick(e, order.pid, order.phone, order.orderID, order.size, order.name, order.address, order.pincode, order.productName, order.brandName, order.price, order.quantity)}
                      className="absolute top-4 right-4 p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors group z-10"
                    >
                      <X className="text-red-500 text-sm group-hover:scale-110 transition-transform" />
                    </button>
                   
                    
                  )}




                   {/* // here we will give the status like Order Returned and Order Exchanged and may be the cancelled onse as well. */}
                    {order.deliveryStatus === 'Delivered' && [...String(order.returnAlert)][0] === "r".toLowerCase() && (
                      <div className={`absolute top-4 right-4 bg-red-400 text-sm text-gray-100 rounded-2xl px-3 py-1 font-medium`}>Returned</div>
                       )}

                       {order.deliveryStatus === 'Delivered' && [...String(order.returnAlert)][1] === "x".toLowerCase() && (
                      <div className={`absolute top-4 right-4 bg-red-400 text-sm text-gray-100 rounded-2xl px-3 py-1 font-medium`}>Exchanged</div>
                       )}
                  {/* Product Info */}
                  <div className="flex gap-4 mb-6">
                    <img
                      src={`./assets/${order.image_url}`}
                      alt={order.productName}
                      className="w-24 h-24 object-cover rounded-xl border-2 border-gray-100"
                      onClick={() => handleProductClick(order.pid)}
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{order.brandName}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{order.productName}</p>
                      <div className="flex gap-3 text-sm">
                        <span className="text-gray-600">Qty: <span className="font-semibold text-gray-500">{order.quantity}</span></span>
                        <span className="text-gray-600">Size: <span className="font-semibold text-gray-500">{order.size}</span></span>
                        <span className="text-indigo-600 font-semibold">₹{order.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Date and ID */}
                  <div className="mb-4 text-xs text-gray-500 space-y-1">
                    <p>Order ID: <span className="font-semibold text-gray-700">{order.orderID}</span></p>
                    <p>Order Date: {new Date(order.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(order.orderDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  {/* Status Progress - FIXED */}
                  <div className="mb-6">
                    <div className="relative flex justify-between items-start">
                      {statusCodes.map((status, idx) => {
                        const Icon = getStatusIcon(idx);
                        const isCompleted = statusCodes.indexOf(order.deliveryStatus) >= idx;
                        const isCurrent = statusCodes.indexOf(order.deliveryStatus) === idx;

                        return (
                          <div key={idx} className="flex flex-col items-center relative" style={{ flex: '1' }}>
                            {/* Circle */}
                            <div className={`w-5 h-5 p-1 rounded-full flex items-center justify-center transition-all duration-300 z-10 relative ${
                              isCompleted 
                                ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                                : 'bg-gray-200'
                            } ${isCurrent ? 'ring-4 ring-green-200 animate-pulse' : ''}`}>
                              {isCompleted ? (
                                <Check className="text-white text-xs" />
                              ) : (
                                <Icon className="text-gray-400 text-xs" />
                              )}
                            </div>

                            {/* Connecting Line */}
                            {idx !== statusCodes.length - 1 && (
                              <div 
                                className={`absolute top-2.5 h-0.5 transition-all duration-300 ${
                                  statusCodes.indexOf(order.deliveryStatus) > idx 
                                    ? 'bg-green-500' 
                                    : 'bg-gray-200'
                                }`} 
                                style={{ 
                                  left: 'calc(50% + 20px)',
                                  right: 'calc(-50% + 20px)',
                                  width: 'auto'
                                }}
                              />
                            )}

                            {/* Label - FIXED: Now directly below circle */}
                            <span className={`text-[9px] sm:text-[10px] mt-2 text-center font-medium leading-tight ${
                              isCompleted ? 'text-green-600' : 'text-gray-400'
                            }`} style={{ maxWidth: '60px', wordWrap: 'break-word' }}>
                              {status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-xl p-3 mb-4">
                    <div className="flex gap-2">
                      <MapPin className="w-4 h-4 text-green-900 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-gray-700 space-y-1 flex-1">
                        <p>{order.address}</p>
                        <p>{order.name}</p>
                        <p>Pincode: {order.pincode}</p>
                        <p>Phone: {order.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - FIXED: Smaller on mobile */}
                  {order.deliveryStatus === 'Delivered' && (
                    <div className="flex gap-2 sm:gap-3">
                      <button
                        onClick={() => {
                          setReviewBoxVisible(true);
                          setActiveOrderDetail({ pid: order.pid, phone: order.phone, size: order.size });
                        }}
                        className="flex-1 bg-gradient-to-r from-green-700 to-green-700 hover:from-green-800 hover:to-green-800 text-white font-semibold py-2 sm:py-3 px-2 sm:px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Rate & Review</span>
                        <span className="sm:hidden">Rate</span>
                      </button>
                        {/* {console.log(order.returnable, 'Returnable')} */}
                      { Number(order.returnable) === 1 && [...String(order.returnAlert)].length === 1 &&  (<button
                      
                        onClick={() => {
                          // Once this is clicked, we have to pop up the exchange and return dialog box 
                          setReturnExchangePopUp(true);
                          // setReturnPopUp(true);
                          setActiveOrderDetail({ pid: order.pid, phone: order.phone, orderID: order.orderID, size: order.size });
                        }}
                        
                        className={`flex-1 bg-gradient-to-r from-green-700 to-green-700 hover:from-green-800 hover:to-green-800 text-white font-semibold py-2 sm:py-3 px-2 sm:px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm`}
                      >
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                        {Number(order.isReturnable) === 1 && ' Return '}{Number(order.isExchangeable) === 1 && '/ Exchange'}
                      </button>)}
                    </div>
                  )}
                </div>
              </Motion>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewBoxVisible && (
          <>
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewBoxVisible(false)}
              className="fixed inset-0 bg-transparent bg-opacity-70 z-40"
            />
            <Motion
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-gradient-to-r from-green-100 to-green-200 rounded-2xl shadow-2xl z-50 p-8"
            >
              <button
                onClick={() => {setReviewBoxVisible(false); setRatingAndReview({ rating: 0, review: '' })}}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="text-green-950 text-sm" />
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Rate & Review</h2>

              {/* Star Rating */}
              <div className="flex justify-center gap-3 mb-8">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setRatingAndReview({ ...ratingAndReview, rating: index + 1 })}
                    className="focus:outline-none transform hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`text-3xl ${
                        ratingAndReview.rating >= index + 1 ? 'text-green-400 fill-green-400' : 'text-gray-400'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>

              {/* Review Text */}
              <textarea
                value={ratingAndReview.review}
                onChange={(e) => setRatingAndReview({ ...ratingAndReview, review: e.target.value })}
                placeholder="Share your experience with this product..."
                className="w-full border-2 border-green-200 focus:border-green-500 rounded-xl p-4 h-32 resize-none focus:outline-none transition-colors text-green-800 mb-6"
              />

              {/* Submit Button */}
              <button
                onClick={handleSubmitReview}
                className="w-full bg-gradient-to-r from-green-700 to-green-700 hover:from-green-800 hover:to-green-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Submit Review
              </button>
            </Motion>
          </>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {cancelBoxVisible && (
          <>
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelBoxVisible(false)}
              className="fixed inset-0 bg-transparent bg-opacity-70 z-40"
            />
            <Motion
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-gradient-to-r from-green-100 to-green-200 rounded-2xl shadow-2xl z-50 p-8"
            >
              <button
                onClick={() => setCancelBoxVisible(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="text-green-950 text-sm" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to cancel this order?</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCancelBoxVisible(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={cancelOrder}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            </Motion>
          </>
        )}
      </AnimatePresence>

      {/* Return/Exchange Modal */}
      <AnimatePresence>
        {returnPopUp && (
          <>
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReturnPopUp(false)}
              className="fixed inset-0 bg-transparent bg-opacity-70 z-40"
            />
            <Motion
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-gradient-to-r from-green-100 to-green-200 rounded-2xl shadow-2xl z-50 p-8"
            >
              <button
                onClick={() => setReturnPopUp(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="text-green-950 text-sm" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Return Product?</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to return this product?</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setReturnPopUp(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => handleReturnExchange(e, activeOrderDetail.pid, activeOrderDetail.phone, activeOrderDetail.orderID, activeOrderDetail.size, activeOrderDetail.name, activeOrderDetail.address, activeOrderDetail.pincode, activeOrderDetail.productName, activeOrderDetail.brandName, activeOrderDetail.price, activeOrderDetail.quantity)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </Motion>
          </>
        )}
      </AnimatePresence>


      {/* Here we are going to pop up the return/exchange modal */}
       <AnimatePresence>
        {returnExchangePopUp && (
          <>
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReturnPopUp(false)}
              className="fixed inset-0 bg-transparent bg-opacity-70 z-40"
            />
            <Motion
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-gradient-to-r from-green-100 to-green-200 rounded-2xl shadow-2xl z-50 p-8"
            >
              <button
                onClick={() => setReturnExchangePopUp(false)}
                className="absolute top-4 right-4 p-2 hover:bg-green-100 rounded-full transition-colors"
              >
                <X className="text-green-950 text-sm" />
              </button>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Return/Exchange Product?</h3>
                <p className="text-gray-600 mb-6">Do you want to return or exchange this product?</p>

                <div className="flex gap-3">
                  <button
                    onClick={() =>{  setReturnExchangePopUp(false); setReturnPopUp(true);}}
                    className="flex-1 border-2 border-green-300 text-green-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Return Order
                  </button>
                  <button
                    // onClick={(e) => handleReturnExchange(e, activeOrderDetail.pid, activeOrderDetail.phone)}
                    // onClick={() => console.log("Exchange Button is clicked and we will handle it soon !!", activeOrderDetail)}
                    onClick={() => { setReturnExchangePopUp(false); setShowExchangeSizes(true); }}
                    
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    Exchange Order
                  </button>
                </div>
              </div>
            </Motion>
          </>
        )}
      </AnimatePresence>


      {/*  Here we are rendering the size selection dialog for exchange  */}

      <AnimatePresence>
        {showExchangeSizes && (
           <>
            <Motion
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReturnPopUp(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />
            <Motion
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-8"
            >
              <button
                onClick={() => setShowExchangeSizes(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="text-gray-600 text-sm" />
              </button>

              <div className="text-center">
                {/* <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"> */}
                  {/* <RefreshCw className="w-8 h-8 text-indigo-600" /> */}
                  {/* <h3>Please select a size</h3> */}
                {/* </div> */}
                
                <h3 className="text-xl font-bold text-gray-900 mb-5">Select Size</h3>
                {/* <p className="text-gray-600 mb-6">Do you want to return or exchange this product?</p> */}

                <div className="flex flex-col align-center justify-around gap-3 ">

                  {/* Here we will have to render the array of sizes */}

                  {/* <button
                    onClick={() =>{  setReturnExchangePopUp(false); setReturnPopUp(true);}}
                    className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Return Order
                  </button> */}


                  <div className='flex flex-row justify-around align-items gap-3 relative mb-5'
                       onClick={(e) => handleExchangeSize(e)}
                  >
                    {getSizesByPid(activeOrderDetail.pid).map(size => (
                      <button
                        data-size = {size}
                        disabled={activeOrderDetail.size === size}
                        key={size}
                        // onClick={() => console.log("Size selected:", size)}
                        className={`flex-1 border-2 border-green-300 text-green-700 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors ${activeOrderDetail.size === size ? 'border-green-500 bg-green-50 cursor-not-allowed' : ''} disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed`}
                      >
                        {/* {activeOrderDetail.size !== size && size} */}
                        {size}
                      </button>
                    ))}
                  </div>
                  <button
                    // onClick={(e) => handleReturnExchange(e, activeOrderDetail.pid, activeOrderDetail.phone)}
                    // onClick={() => console.log("Exchange Button is clicked and we will handle it soon !!", activeOrderDetail)}
                    onClick={(e) => handleExchange(e)}
                    
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    {`Confirm Exchange to Size ${activeOrderDetail.selectedSize ?? ``}`}
                  </button>
                </div>
              </div>
            </Motion>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;

// import React, { useEffect, useState, lazy } from 'react';
// import Spinner from './Spinner';
// import './blink.css';
// import { AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { getSizesByPid } from '../utils/sizeData.js';

// // Lazy load icons
// import X from 'lucide-react/dist/esm/icons/x.js';
// import Star from 'lucide-react/dist/esm/icons/star.js';
// import Check from 'lucide-react/dist/esm/icons/check.js';
// import Box from 'lucide-react/dist/esm/icons/box.js';
// import Truck from 'lucide-react/dist/esm/icons/truck.js';
// import House from 'lucide-react/dist/esm/icons/house.js';
// import Package from 'lucide-react/dist/esm/icons/package.js';
// import MapPin from 'lucide-react/dist/esm/icons/map-pin.js';
// import XCircle from 'lucide-react/dist/esm/icons/x-circle.js';
// import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw.js';
// import Search from 'lucide-react/dist/esm/icons/search.js';

// const Motion = lazy(() => import('framer-motion').then(module => ({ default: module.motion.div })));

// const FILTERS = ['All', 'Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];
// const TIMELINE_STEPS = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
// const STATUS_CODES = ['Ordered', 'Shipped', 'Out for Delivery', 'Delivered'];

// const STATUS_CONFIG = {
//   Ordered: {
//     label: 'Ordered',
//     badgeClass: 'bg-green-100 text-green-700',
//     overlay: false,
//   },
//   Shipped: {
//     label: 'Shipped',
//     badgeClass: 'bg-blue-100 text-blue-700',
//     overlay: false,
//   },
//   'Out for Delivery': {
//     label: 'Out for Delivery',
//     badgeClass: 'bg-amber-100 text-amber-700',
//     overlay: false,
//   },
//   Delivered: {
//     label: 'Delivered',
//     badgeClass: 'bg-green-100 text-green-700',
//     overlay: false,
//   },
//   'Cancelled': {
//     label: 'Cancelled',
//     badgeClass: 'bg-gray-200 text-gray-500',
//     overlay: true,
//     stampClass: 'border-gray-400 text-gray-400',
//   },
//   'Returned': {
//     label: 'Returned',
//     badgeClass: 'bg-red-100 text-red-500',
//     overlay: true,
//     stampClass: 'border-red-400 text-red-400',
//   },
// };

// const Orders = () => {
//   const navigate = useNavigate();
//   const detail = localStorage.getItem('detail') ? JSON.parse(localStorage.getItem('detail')) : null;
  
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeFilter, setActiveFilter] = useState('All');
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Modal states
//   const [reviewBoxVisible, setReviewBoxVisible] = useState(false);
//   const [cancelBoxVisible, setCancelBoxVisible] = useState(false);
//   const [returnOrExchangePopUp, setReturnOrExchangePopUp] = useState(false);
//   const [returnExchangeType, setReturnExchangeType] = useState(null); // 'return' or 'exchange'
//   const [showReturnExchangeOptions, setShowReturnExchangeOptions] = useState(false);
  
//   const [phone, setPhone] = useState(detail ? detail.phone : '');
//   const [activeOrderDetail, setActiveOrderDetail] = useState({});
//   const [ratingAndReview, setRatingAndReview] = useState({ rating: 0, review: '' });
//   const [selectedNewSize, setSelectedNewSize] = useState(null);
//   const [processedOrderIds, setProcessedOrderIds] = useState([]);

//   // Fetch orders on mount
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
    
//     if (detail === null) {
//       navigate('/register');
//       return;
//     }
    
//     setPhone(detail.phone);
//     fetch('http://localhost:3000/orders', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ phone: detail.phone })
//     })
//       .then(res => res.json())
//       .then(data => {
//         const ordersArray = Array.isArray(data) ? data : [data];
//         setOrders(ordersArray);
//       })
//       .catch(err => console.log(err, 'The Error'))
//       .finally(() => setLoading(false));
//   }, []);

//   // Filter and search logic
//   const getFilteredOrders = () => {
//     let filtered = orders;
    
//     if (activeFilter !== 'All') {
//       filtered = filtered.filter(o => o.deliveryStatus === activeFilter);
//     }
    
//     if (searchTerm) {
//       filtered = filtered.filter(o => 
//         o.orderID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         o.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         o.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
    
//     return filtered;
//   };

//   const getFilterCount = (filterName) => {
//     if (filterName === 'All') return orders.length;
//     return orders.filter(o => o.deliveryStatus === filterName).length;
//   };

//   // Handle product click
//   const handleProductClick = (pid) => {
//     navigate(`/products/pid/${pid}`);
//   };

//   // Handle cancel order
//   const handleCancelClick = (e, order) => {
//     e.stopPropagation();
//     setActiveOrderDetail({ pid: order.pid, phone: order.phone, orderID: order.orderID });
//     setCancelBoxVisible(true);
//   };

//   const cancelOrder = () => {
//     fetch('http://localhost:3000/orders/cancel', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ pid: activeOrderDetail.pid, phone: activeOrderDetail.phone })
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           setOrders(orders.filter(order => order.pid !== activeOrderDetail.pid));
//           alert('Order cancelled successfully');
//         }
//       })
//       .catch(err => console.log(err, 'The Error'))
//       .finally(() => {
//         setCancelBoxVisible(false);
//         setActiveOrderDetail({});
//       });
//   };

//   // Handle review submission
//   const handleSubmitReview = (e) => {
//     e.preventDefault();
//     if (ratingAndReview.rating === 0) {
//       alert('Please select a rating');
//       return;
//     }
    
//     fetch('http://localhost:3000/orders/reviews/submit', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         pid: activeOrderDetail.pid,
//         phone: activeOrderDetail.phone,
//         rating: ratingAndReview.rating,
//         review: ratingAndReview.review,
//         name: detail?.name || 'Customer'
//       })
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.message || data.success) {
//           alert('Review submitted successfully');
//         }
//       })
//       .catch(err => console.log(err, 'The Error'))
//       .finally(() => {
//         setRatingAndReview({ rating: 0, review: '' });
//         setReviewBoxVisible(false);
//         setActiveOrderDetail({});
//       });
//   };

//   // Handle return/exchange
//   const handleReturnExchangeClick = (e, order) => {
//     e.stopPropagation();
//     setActiveOrderDetail({ 
//       pid: order.pid, 
//       phone: order.phone, 
//       orderID: order.orderID,
//       currentSize: order.size,
//       isReturnable: order.isReturnable,
//       isExchangeable: order.isExchangeable
//     });
    
//     const hasReturn = Number(order.isReturnable) === 1;
//     const hasExchange = Number(order.isExchangeable) === 1;
    
//     if (hasReturn && hasExchange) {
//       // Show option to choose between return and exchange
//       setShowReturnExchangeOptions(true);
//     } else if (hasReturn) {
//       setReturnExchangeType('return');
//       setReturnOrExchangePopUp(true);
//     } else if (hasExchange) {
//       setReturnExchangeType('exchange');
//       setReturnOrExchangePopUp(true);
//     }
//   };

//   const handleReturnExchange = () => {
//     // For exchange, validate that a new size is selected
//     if (returnExchangeType === 'exchange' && !selectedNewSize) {
//       alert('Please select a new size for exchange');
//       return;
//     }

//     // Build the request body based on type
//     const requestBody = {
//       pid: activeOrderDetail.pid,
//       phone: activeOrderDetail.phone,
//       orderID: activeOrderDetail.orderID,
//       type: returnExchangeType
//     };

//     // If exchange, add the combined sizes
//     if (returnExchangeType === 'exchange') {
//       requestBody.sizeChange = `${activeOrderDetail.currentSize}-${selectedNewSize}`;
//     }

//     fetch('http://localhost:3000/orders/return', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(requestBody)
//     })
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           alert(`${returnExchangeType === 'return' ? 'Return' : 'Exchange'} request submitted successfully`);
//           // Add this order to processed list to hide the return button
//           setProcessedOrderIds([...processedOrderIds, activeOrderDetail.orderID]);
//           setShowReturnExchangeOptions(false);
//         }
//       })
//       .catch(err => console.log(err, 'The Error'))
//       .finally(() => {
//         setReturnOrExchangePopUp(false);
//         setShowReturnExchangeOptions(false);
//         setReturnExchangeType(null);
//         setSelectedNewSize(null);
//         setActiveOrderDetail({});
//       });
//   };

//   const getStatusIcon = (index) => {
//     const icons = [Box, Truck, Truck, House];
//     return icons[index];
//   };

//   if (loading) {
//     return (
//       <div className='min-h-screen flex justify-center items-center bg-gray-50'>
//         <Spinner size='lg' color='blue' />
//       </div>
//     );
//   }

//   const filteredOrders = getFilteredOrders();

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-10">
//       <div className="max-w-4xl mx-auto">
        
//         {/* Header */}
//         <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
//           <div>
            
//             <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Orders</h1>
//             {/* <p className="text-sm text-gray-400 mt-1">{orders.length} orders placed</p> */}
//           </div>
          
//           {/* Search Box */}
//           {/* <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm">
//             <Search className="text-gray-400 w-4 h-4" />
//             <input
//               placeholder="Search orders..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="outline-none text-sm text-gray-600 bg-transparent w-44 placeholder-gray-300"
//             />
//           </div> */}
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex flex-wrap gap-2 mb-6">
//           {FILTERS.map((f) => {
//             const count = getFilterCount(f);
//             const isActive = activeFilter === f;
//             return (
//               <button
//                 key={f}
//                 onClick={() => setActiveFilter(f)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer ${
//                   isActive
//                     ? 'bg-gray-900 text-white border-gray-900'
//                     : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
//                 }`}
//               >
//                 {f}
//                 <span
//                   className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
//                     isActive
//                       ? 'bg-white/20 text-white'
//                       : 'bg-gray-100 text-gray-400'
//                   }`}
//                 >
//                   {count}
//                 </span>
//               </button>
//             );
//           })}
//         </div>

//         {/* Orders List */}
//         <div className="flex flex-col gap-4">
//           {filteredOrders.length === 0 ? (
//             <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm p-12">
//               <Package className="w-20 h-20 text-gray-300 mb-4" />
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
//               <p className="text-gray-500">Start shopping to see your orders here!</p>
//             </div>
//           ) : (
//             [...filteredOrders].reverse().map((order, index) => {
//               const cfg = STATUS_CONFIG[order.deliveryStatus];
//               const isDimmed = cfg?.overlay;
//               const canShowReview = order.deliveryStatus === 'Delivered';
//               const canCancel = order.deliveryStatus !== 'Cancelled' && order.deliveryStatus !== 'Returned' && order.deliveryStatus !== 'Delivered';
//               const hasReturn = Number(order.isReturnable) === 1;
//               const hasExchange = Number(order.isExchangeable) === 1;
//               const isReturnable = Number(order.returnable) === 1;
//               const canShowReturnExchange = canShowReview && isReturnable && (hasReturn || hasExchange);

//               return (
//                 <Motion
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className={`relative rounded-2xl border overflow-hidden shadow-sm transition-all ${
//                     isDimmed
//                       ? 'bg-gray-100 border-gray-200 grayscale opacity-75'
//                       : 'bg-white border-gray-200 hover:shadow-md'
//                   }`}
//                 >
//                   {/* Stamp Overlay for cancelled/returned */}
//                   {isDimmed && (
//                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
//                       <span
//                         className={`border-4 rounded-lg px-5 py-1.5 text-2xl font-black tracking-[0.2em] font-mono -rotate-12 opacity-50 ${cfg.stampClass}`}
//                       >
//                         {order.deliveryStatus.toUpperCase()}
//                       </span>
//                     </div>
//                   )}

//                   {/* Card Top - Product Info */}
//                   <div className="flex gap-4 p-5 items-start">
//                     {/* Product Image */}
//                     <div
//                       onClick={() => handleProductClick(order.pid)}
//                       className="w-16 h-16 shrink-0 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-xl cursor-pointer hover:shadow-md transition-shadow"
//                     >
//                       <img
//                         src={`./assets/${order.image_url}`}
//                         alt={order.productName}
//                         className="w-full h-full object-cover rounded-xl"
//                       />
//                     </div>

//                     {/* Product Details */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
//                         <span className="text-xs text-gray-400 font-mono tracking-wider">
//                           {order.orderID}
//                         </span>
//                         <span
//                           className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${cfg.badgeClass}`}
//                         >
//                           {cfg.label}
//                         </span>
//                       </div>

//                       <p
//                         className={`text-base font-bold mb-0.5 ${
//                           isDimmed ? 'text-gray-400' : 'text-gray-900'
//                         }`}
//                       >
//                         {order.brandName}
//                       </p>
//                       <p className="text-xs text-gray-600 mb-2 line-clamp-1">{order.productName}</p>

//                       <div className="flex flex-wrap gap-1.5">
//                         <span className="text-xs bg-gray-100 text-gray-500 rounded-md px-2 py-0.5 font-medium">
//                           Qty: {order.quantity}
//                         </span>
//                         <span className="text-xs bg-gray-100 text-gray-500 rounded-md px-2 py-0.5 font-medium">
//                           Size: {order.size}
//                         </span>
//                         <span className="text-xs font-semibold text-indigo-600">
//                           ₹{order.price?.toLocaleString('en-IN')}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Divider */}
//                   <div className="border-t border-gray-100 mx-5" />

//                   {/* Card Bottom - Price and Actions */}
//                   <div className="flex flex-wrap justify-between items-center gap-4 px-5 py-4">
//                     <div>
//                       <p
//                         className={`text-xl font-extrabold tracking-tight ${
//                           isDimmed ? 'text-gray-400' : 'text-gray-900'
//                         }`}
//                       >
//                         ₹{(order.quantity * order.price)?.toLocaleString('en-IN')}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', { 
//                           year: 'numeric', 
//                           month: 'short', 
//                           day: 'numeric' 
//                         })}
//                       </p>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex gap-2 flex-wrap justify-end">
//                       {canShowReview && (
//                         <>
//                           <button
//                             onClick={() => {
//                               setReviewBoxVisible(true);
//                               setActiveOrderDetail({ pid: order.pid, phone: order.phone });
//                             }}
//                             className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors cursor-pointer"
//                           >
//                             <Star className="w-3 h-3 inline mr-1" />
//                             Rate
//                           </button>
//                           {canShowReturnExchange && !processedOrderIds.includes(order.orderID) && (
//                             <button
//                               onClick={(e) => handleReturnExchangeClick(e, order)}
//                               className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
//                             >
//                               <RefreshCw className="w-3 h-3 inline mr-1" />
//                               {hasReturn && hasExchange ? 'Return/Exchange' : hasReturn ? 'Return' : 'Exchange'}
//                             </button>
//                           )}
//                         </>
//                       )}
//                       {canCancel && !canShowReview && (
//                         <button
//                           onClick={(e) => handleCancelClick(e, order)}
//                           className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
//                         >
//                           <X className="w-3 h-3 inline mr-1" />
//                           Cancel Order
//                         </button>
//                       )}
//                       {/* {!canShowReview && !isDimmed && (
//                         <button className="border border-gray-300 text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
//                           Track Order
//                         </button>
//                       )} */}
//                       {isDimmed && (
//                         <button className="border border-gray-200 text-gray-400 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer">
//                           View Details
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   {/* Timeline - Status Progress */}
//                   {order.deliveryStatus !== 'Cancelled' && order.deliveryStatus !== 'Returned' && (
//                     <div className="px-5 pb-5">
//                       <div className="relative flex justify-between items-start">
//                         {STATUS_CODES.map((status, idx) => {
//                           const Icon = getStatusIcon(idx);
//                           const isCompleted = STATUS_CODES.indexOf(order.deliveryStatus) >= idx;
//                           const isCurrent = STATUS_CODES.indexOf(order.deliveryStatus) === idx;

//                           return (
//                             <div key={idx} className="flex flex-col items-center relative" style={{ flex: '1' }}>
//                               {/* Connecting Line */}
//                               {idx !== STATUS_CODES.length - 1 && (
//                                 <div
//                                   className={`absolute top-2.5 h-0.5 transition-all duration-300 ${
//                                     STATUS_CODES.indexOf(order.deliveryStatus) > idx
//                                       ? 'bg-green-500'
//                                       : 'bg-gray-200'
//                                   }`}
//                                   style={{
//                                     left: 'calc(50% + 20px)',
//                                     right: 'calc(-50% + 20px)',
//                                     width: 'auto'
//                                   }}
//                                 />
//                               )}

//                               {/* Circle Dot */}
//                               <div
//                                 className={`w-5 h-5 p-1 rounded-full flex items-center justify-center transition-all duration-300 z-10 relative ${
//                                   isCompleted
//                                     ? 'bg-green-500 shadow-lg shadow-green-500/50'
//                                     : 'bg-gray-200'
//                                 } ${isCurrent ? 'ring-4 ring-green-200 animate-pulse' : ''}`}
//                               >
//                                 {isCompleted ? (
//                                   <Check className="text-white text-xs" />
//                                 ) : (
//                                   <Icon className="text-gray-400 text-xs" />
//                                 )}
//                               </div>

//                               {/* Status Label */}
//                               <span
//                                 className={`text-[9px] sm:text-[10px] mt-2 text-center font-medium leading-tight ${
//                                   isCompleted ? 'text-green-600' : 'text-gray-400'
//                                 }`}
//                                 style={{ maxWidth: '60px', wordWrap: 'break-word' }}
//                               >
//                                 {status}
//                               </span>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   {/* Address Section */}
//                   <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-b-2xl p-4 sm:p-5">
//                     <div className="flex gap-3">
//                       <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
//                       <div className="text-xs text-gray-700 space-y-1 flex-1">
//                         <p className="font-semibold">{order.name}</p>
//                         <p>{order.address}</p>
//                         <p>Pincode: {order.pincode}</p>
//                         <p>Phone: {order.phone}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </Motion>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* Review Modal */}
//       <AnimatePresence>
//         {reviewBoxVisible && (
//           <>
//             <Motion
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setReviewBoxVisible(false)}
//               className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             />
//             <Motion
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//               className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-8"
//             >
//               <button
//                 onClick={() => setReviewBoxVisible(false)}
//                 className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X className="text-gray-600 w-5 h-5" />
//               </button>

//               <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Rate & Review</h2>

//               {/* Star Rating */}
//               <div className="flex justify-center gap-3 mb-8">
//                 {[...Array(5)].map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setRatingAndReview({ ...ratingAndReview, rating: index + 1 })}
//                     className="focus:outline-none transform hover:scale-110 transition-transform"
//                   >
//                     <Star
//                       className={`w-8 h-8 ${
//                         ratingAndReview.rating >= index + 1
//                           ? 'text-yellow-400 fill-yellow-400'
//                           : 'text-gray-300'
//                       } transition-colors`}
//                     />
//                   </button>
//                 ))}
//               </div>

//               {/* Review Text */}
//               <textarea
//                 value={ratingAndReview.review}
//                 onChange={(e) => setRatingAndReview({ ...ratingAndReview, review: e.target.value })}
//                 placeholder="Share your experience with this product..."
//                 className="w-full border-2 border-gray-200 focus:border-indigo-500 rounded-xl p-4 h-32 resize-none focus:outline-none transition-colors text-gray-800 mb-6"
//               />

//               {/* Submit Button */}
//               <button
//                 onClick={handleSubmitReview}
//                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg"
//               >
//                 Submit Review
//               </button>
//             </Motion>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Cancel Order Confirmation Modal */}
//       <AnimatePresence>
//         {cancelBoxVisible && (
//           <>
//             <Motion
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setCancelBoxVisible(false)}
//               className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             />
//             <Motion
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//               className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-8"
//             >
//               <button
//                 onClick={() => setCancelBoxVisible(false)}
//                 className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X className="text-gray-600 w-5 h-5" />
//               </button>

//               <div className="text-center">
//                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <XCircle className="w-8 h-8 text-red-500" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
//                 <p className="text-gray-600 mb-6">Are you sure you want to cancel this order? This action cannot be undone.</p>

//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setCancelBoxVisible(false)}
//                     className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
//                   >
//                     Keep Order
//                   </button>
//                   <button
//                     onClick={cancelOrder}
//                     className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors"
//                   >
//                     Cancel Order
//                   </button>
//                 </div>
//               </div>
//             </Motion>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Return/Exchange Options Modal (if both available) */}
//       <AnimatePresence>
//         {showReturnExchangeOptions && (
//           <>
//             <Motion
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setShowReturnExchangeOptions(false)}
//               className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             />
//             <Motion
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//               className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-8"
//             >
//               <button
//                 onClick={() => setShowReturnExchangeOptions(false)}
//                 className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X className="text-gray-600 w-5 h-5" />
//               </button>

//               <div className="text-center">
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">Choose an Option</h3>
//                 <p className="text-gray-600 mb-6">What would you like to do with this product?</p>

//                 <div className="flex flex-col gap-3">
//                   {Number(activeOrderDetail.isReturnable) === 1 && (
//                     <button
//                       onClick={() => {
//                         setReturnExchangeType('return');
//                         setShowReturnExchangeOptions(false);
//                         setReturnOrExchangePopUp(true);
//                       }}
//                       className="w-full border-2 border-red-500 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-50 transition-colors"
//                     >
//                       <X className="w-4 h-4 inline mr-2" />
//                       Return Product
//                     </button>
//                   )}
//                   {Number(activeOrderDetail.isExchangeable) === 1 && (
//                     <button
//                       onClick={() => {
//                         setReturnExchangeType('exchange');
//                         setShowReturnExchangeOptions(false);
//                         setReturnOrExchangePopUp(true);
//                         // Here we have put the exchange order API call so that we can insert the new demand by the user like new size or perhaps color. We can write a function and then we can make the alert in table as exchange and then we can have a separate table for the exchnaged products and there we can insrt hte lattest demand from the users . 
//                         // handleExchange(activeOrderDetail.)
//                       }}
//                       className="w-full border-2 border-indigo-600 text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition-colors"
//                     >
//                       <RefreshCw className="w-4 h-4 inline mr-2" />
//                       Exchange Product
//                     </button>
//                   )}
//                   {/* <button
//                     onClick={() => setShowReturnExchangeOptions(false)}
//                     className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
//                   >
//                     Cancel
//                   </button> */}
//                 </div>
//               </div>
//             </Motion>
//           </>
//         )}
//       </AnimatePresence>

//       {/* Return/Exchange Confirmation Modal */}
//       <AnimatePresence>
//         {returnOrExchangePopUp && (
//           <>
//             <Motion
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={() => setReturnOrExchangePopUp(false)}
//               className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             />
//             <Motion
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.9 }}
//               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//               className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-md bg-white rounded-2xl shadow-2xl z-50 p-8"
//             >
//               <button
//                 onClick={() => setReturnOrExchangePopUp(false)}
//                 className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X className="text-gray-600 w-5 h-5" />
//               </button>

//               <div className="text-center">
//                 <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <RefreshCw className="w-8 h-8 text-indigo-600" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">
//                   {returnExchangeType === 'return' ? 'Return Product?' : 'Exchange Product?'}
//                 </h3>
//                 <p className="text-gray-600 mb-6">
//                   {returnExchangeType === 'return'
//                     ? 'Are you sure you want to return this product? Our team will contact you shortly.'
//                     : 'Are you sure you want to exchange this product? Please select your preferred size.'}
//                 </p>

//                 {/* Size Selection for Exchange */}
//                 {returnExchangeType === 'exchange' && (
//                   <div className="mb-6">
//                     <h4 className="text-sm font-semibold text-gray-900 mb-3 text-left">Current Size: <span className="text-indigo-600">{activeOrderDetail.currentSize}</span></h4>
//                     <h4 className="text-sm font-semibold text-gray-900 mb-3">Select New Size:</h4>
//                     <div className="grid grid-cols-3 gap-2">
//                       {getSizesByPid(activeOrderDetail.pid).map((size) => (
//                         <button
//                           key={size}
//                           onClick={() => setSelectedNewSize(size)}
//                           className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
//                             selectedNewSize === size
//                               ? 'bg-indigo-600 text-white border-2 border-indigo-600'
//                               : 'bg-gray-100 text-gray-700 border-2 border-gray-100 hover:border-indigo-300'
//                           }`}
//                         >
//                           {size}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setReturnOrExchangePopUp(false)}
//                     className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleReturnExchange}
//                     className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-colors"
//                   >
//                     Confirm {returnExchangeType === 'return' ? 'Return' : 'Exchange'}
//                   </button>
//                 </div>
//               </div>
//             </Motion>
//           </>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Orders;