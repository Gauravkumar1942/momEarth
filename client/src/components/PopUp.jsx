import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

const PopUp = ({message, isVisible, onHide}) => {
useEffect(() => {
    if(isVisible){
        const timer =  setTimeout(() => {
        onHide();
    },1500);

        return () => clearTimeout(timer);
    }
   

    
},[isVisible, onHide])
  return (
    
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed flex justify-center items-center left-1/2 -translate-x-1/2 bottom-4 w-auto min-w-[300px] max-w-[400px] bg-green-800 text-white py-4 px-10 rounded-2xl z-50 "
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 4 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: 'spring', duration: 0.5, ease: 'easeOut' }}
                >
                    {message}
                </motion.div>
            )}
           
        </AnimatePresence>

    
  )
}
//  <PopUp message='Product added to cart successfully!' />
export default PopUp