import React, { lazy } from 'react' 
import{ BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './components/Home.jsx'
const Wishlist = lazy(() => import('./components/Wishlist.jsx'))
const Cart = lazy(() => import('./components/Cart.jsx'))
const ProductBrandTile = lazy(() => import('./components/ProductBrandTile.jsx'))
const ProductTypeTile = lazy(() => import('./components/ProductTypeTile.jsx'))
const ProductSearchTile = lazy(() => import('./components/ProductSearchTile.jsx'))
const Productdetail = lazy(() => import('./components/Productdetail.jsx'))
const Orders = lazy(() => import('./components/Orders.jsx'))
const AboutUs = lazy(() => import('./components/AboutUs.jsx'))
const ContactUs = lazy(() => import('./components/ContactUs.jsx'))
const Register = lazy(() => import('./components/Register.jsx'))
// const Profile = lazy(() => import('./components/Profile.jsx'))
// const BuyNow = lazy(() => import('./components/BuyNow.jsx'))
// const Recommended = lazy(() => import('./components/Recommended.jsx'))


import './App.css'


function App() {
  
  // const detail = {
    

  // }

  return (

    <Router>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/wishlist' element={<Wishlist />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/products/brand/:brand' element={<ProductBrandTile />} /> 
          <Route path='/products/type/:productType' element={<ProductTypeTile />} /> 
          <Route path='/products/search' element={<ProductSearchTile />} />
          <Route path='/products/pid/:pid' element={<Productdetail />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/aboutus' element={<AboutUs />} />
          <Route path='/contactus' element={<ContactUs />} />
          <Route path='/register' element={<Register />} />
          {/* <Route path='/profile' element={<Profile />} /> */}
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
