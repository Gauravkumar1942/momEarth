import React from 'react'

import Mail from 'lucide-react/dist/esm/icons/mail.js';
import Phone from 'lucide-react/dist/esm/icons/phone.js';
import MapPin from 'lucide-react/dist/esm/icons/map-pin.js';
import  Heart from 'lucide-react/dist/esm/icons/heart.js';
import './footerHeartbeat.css'

const Footer = () => {

  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 bg-gradient-to-b from-green-900 to-green-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Account Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Account</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block pr-3">Orders</li>
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block p-3">Wishlist</li>
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block p-3">Cart</li>
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block pl-3">Refund</li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">About MomEarth</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block pr-3">Contact Us</li>
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block p-3">About Us</li>
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block p-3">Terms and Condition</li>
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block pl-3">Privacy Policy</li>
            </ul>
          </div>

          {/* Socials Section */}
          <div className={``}>
            <h3 className="text-lg font-bold mb-4 text-white">Socials</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block pr-3">Instagram</li>
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block p-3">Facebook</li>
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block p-3">Twitter</li>
              <li className="cursor-pointer hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block pl-3">YouTube</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <Mail className="text-xl text-gray-400 mt-0.5 group-hover:text-white transition-colors" />
                <a 
                  href="mailto:anandkumar9473182722@gmail.com" 
                  className="text-sm text-gray-300 hover:text-white transition-colors break-all"
                >
                  anandkumar9473182722@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <Phone className="text-xl text-gray-400 mt-0.5 group-hover:text-white transition-colors" />
                <a 
                  href="tel:+91960628796" 
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  +91 960628796
                </a>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin className="text-xl text-gray-400 mt-0.5 group-hover:text-white transition-colors" />
                <span className="text-sm text-gray-300">
                  123, Patel Nagar, South Delhi 110011
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} MomEarth. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="text-red-500 heartbeat fill-red-500" />
              <span>in India for India by an Indian</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer