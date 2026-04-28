import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react'

import X from 'lucide-react/dist/esm/icons/x.js';

import { useNavigate } from 'react-router-dom';

import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.js';
// import CreditCard from 'lucide-react/dist/esm/icons/credit-card.js';
import Wallet from 'lucide-react/dist/esm/icons/wallet.js';
import PopUp from './PopUp';
import { validateUserDetails } from '../utils/validateUserDetails';

const BuyNow = ({onClose, productDetails}) => {

 
  const [payMode, setpayMode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let details = {};
  try {
    const detail = localStorage.getItem('detail');
    details = detail ? JSON.parse(detail) : {};
  } catch (e) {
    details = {};
  }
  const navigate  =  useNavigate();
  
  const paymentOptions = [
    { value: 'cod/pod', label: 'Cash on Delivery', icon: Wallet, desc: 'Pay when you receive' },
    // { value: 'Pay Online', label: 'Pay Online', icon: CreditCard, desc: 'UPI, Cards, Net Banking' }
  ];

  const handleSelect = (value) => {
    setpayMode(value);
    setIsOpen(false);
  };

  const selectedOption = paymentOptions.find(opt => opt.value === payMode);

  // Generate unique order ID
  function generateUniqueOrderId() {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MOMECOD${timestamp}${randomStr}`;
  }

  // Handle order placement
  function handleOrder() {
    // Validate user details first
    let userDetails = {};
    try {
      const detail = localStorage.getItem('detail');
      userDetails = detail ? JSON.parse(detail) : {};
    } catch (e) {
      userDetails = {};
    }
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

    if (!payMode) {
      setMessage('Please select a payment method');
      setIsVisible(true);
      return;
    }

    if (payMode === 'cod/pod') {
      setIsLoading(true);
      
      const orderDate = new Date().toISOString();
      
      // Calculate return expiry date (7 days from order date)
      // const returnExpiryDate = new Date(new Date(orderDate).getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString();
      
      // Create order array with single product (matching Cart component format)
      const ordersArray = [{
        phone: userDetails.phone || '',
        pid: productDetails.pid,
        brandName: productDetails.brand,
        image_url: productDetails.image,
        //  returnExchange: Number(productDetails.returnable) === 1 && Number(productDetails.exchangable) === 1 ? "both" : Number(productDetails.returnable) === 0 && Number(productDetails.exchangable) === 1 ? "exchange" : 'none' ,
        isReturnable: productDetails.returnable ? Number(productDetails.returnable) : 0,
        isExchangeable: productDetails.exchangeable ? Number(productDetails.exchangeable) : 0,
        price: productDetails.price,
        quantity: productDetails.quantity,
        size: productDetails.size,
        orderID: generateUniqueOrderId(),
        orderDate: orderDate,
        returnExpiryDate: 0,
        pincode: userDetails.pincode || '',
        address: userDetails.address || '',
        orderStatus: 'on',
        returnable: true,
        returnAlert: false,
        deliveryStatus: 'Ordered',
        trackingID: 0,
        productName: productDetails.name,
        name: userDetails.name || '',
      }];
      
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
          setMessage(`✓ Order placed successfully! Your order ID: ${ordersArray[0].orderID}`);
          setIsVisible(true);
          setIsLoading(false);
          
          // Close modal and redirect after delay
          setTimeout(() => {
            onClose();
            navigate('/orders');
          }, 2000);
        } else {
          setMessage(`Order placement failed: ${response.message}`);
          setIsVisible(true);
          setIsLoading(false);
          console.log(response.message);
        }
      })
      .catch(error => {
        setMessage(`Error placing order: ${error.message}`);
        setIsVisible(true);
        setIsLoading(false);
      });
      
    } else if (payMode === 'Pay Online') {
      setMessage('Redirecting to payment gateway...');
      setIsVisible(true);
      // Handle online payment
    }
  }

  return (
    <>
      <AnimatePresence>
        <motion.div 
        className={`fixed  flex flex-col justify-center items-center  left-1/2 -translate-x-1/2 border-2 border-gray-500 w-[95%] max-w-[300px]  rounded-2xl mx-auto bottom-2 h-[25rem] z-50 bg-white`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5, ease: 'easeOut' }}
        >
          <div className='  relative border-0 border-gray-500 w-[90%] max-w-[350px]  rounded-2xl flex flex-col justify-center items-center mx-auto my-12'>
            <X onClick={onClose} className='absolute top-1 right-1 cursor-pointer hover:text-gray-600 transition' />
        
            <div className='py-5 w-[95%] mx-auto gap-1'>


              <div className='relative  outline-0 bg-transparent rounded-2xl px-2 py-2 flex flex-row justify-center items-center'>
                {/* Custom Select Dropdown */}
                <div className="relative w-full">
                  {/* Custom Select Button */}
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-3 py-2.5 bg-white border-1 border-gray-300 rounded-xl hover:border-indigo-500 transition-all duration-200 flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <div className="flex items-center gap-2">
                      {selectedOption ? (
                        <>
                          <selectedOption.icon className="w-4 h-4 text-indigo-600" />
                          <div className="text-left">
                            <div className="font-medium text-gray-900 text-sm">{selectedOption.label}</div>
                            <div className="text-xs text-gray-500">{selectedOption.desc}</div>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-500 font-medium text-sm">Payment Mode</span>
                      )}
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Options */}
                  {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {paymentOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`w-full px-3 py-2.5 flex items-center gap-2 hover:bg-indigo-50 transition-colors duration-150 ${
                              payMode === option.value ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${
                              payMode === option.value ? 'bg-indigo-100' : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-4 h-4 ${
                                payMode === option.value ? 'text-indigo-600' : 'text-gray-600'
                              }`} />
                            </div>
                            <div className="text-left flex-1">
                              <div className={`font-medium text-sm ${
                                payMode === option.value ? 'text-indigo-900' : 'text-gray-900'
                              }`}>
                                {option.label}
                              </div>
                              <div className="text-xs text-gray-500">{option.desc}</div>
                            </div>
                            {payMode === option.value && (
                              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Close dropdown when clicking outside */}
                  {isOpen && (
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsOpen(false)}
                    />
                  )}
                </div>
              </div>



              
              <div className='relative border-1 border-gray-500 rounded-2xl p-5  mx-auto my-5'>
                <h1 className='text-sm line-clamp-1'><b>Name</b> : {details?.name || 'Not Available'}</h1>
                <h1 className='text-sm line-clamp-1'><b>Address</b> : {details?.address || 'Not Available'}</h1>
                <h1 className='text-sm'><b>Pincode</b> : {details?.pincode || 'Not Available'}</h1>
                <h1 className='text-sm'><b>Phone</b> : {details?.phone || 'Not Available'}</h1>
                <button
                 onClick={() => navigate('/register')}
                 className='pt-5 flex flex-row justify-center items-center w-full font-medium text-indigo border-0 outline-0 transform transition duration-100 ease-in-out relative group'>
                       Change
                                  <span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-indigo-600 group-hover:w-16 transition-all duration-300 ease-out'></span>
                </button>
              </div>
              

              
            </div>

            {payMode === 'Pay Online' ? (<button className=' w-[90%] rounded-2xl flex flex-row justify-center items-center py-3 text-white font-medium border-0 outline-0 bg-indigo-700 text-center mx-auto mb-5 transform hover:scale-102 hover:bg-indigo-800 transition duration-100 ease-in-out ' disabled={isLoading}>Check Out</button>
              ) : (<button onClick={handleOrder} disabled={isLoading} className=' w-[90%] rounded-2xl flex flex-row justify-center items-center py-3 text-white font-medium border-0 outline-0 bg-indigo-700 text-center mx-auto mb-5 transform hover:scale-102 hover:bg-indigo-800 transition duration-100 ease-in-out disabled:opacity-50'>{isLoading ? 'Processing...' : 'Order Now'}</button>)
            } 
            
          </div>
        </motion.div>
        </AnimatePresence>
        
        <PopUp 
          message={message}
          isVisible={isVisible}
          onHide={() => setIsVisible(false)}
        />   
    </>
  )
}

export default BuyNow