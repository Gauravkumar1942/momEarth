import React from 'react'
import { lazy, Suspense } from 'react';
import Header from './Header.jsx'
// import Footer from './Footer.jsx'
const Footer = lazy(() => import('./Footer.jsx'));

const Layout = ({ children }) => {
  return (
   <>
      <Header />
        <main className='sm:mt-20 lg:mt25 xl:mt-30 2xl:mt-35 3xl:mt-40 z-20'>
          {children}
        </main>
      <Suspense fallback={<div>Loading Footer...</div>}>
        <Footer />
      </Suspense>
   </>
  )
};

export default Layout