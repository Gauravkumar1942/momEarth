import React, { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const Register = () => {


  
    //  scroll to top on component mount
    useEffect(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }, []);




  // states for the register form
  const [registerOpen, setRegisterOpen] = useState(true);
  const [name, setName] = useState('');
  const [address, setAddress]  = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode]  = useState('');
  const navigate =  useNavigate();

  // here goes all the onChange function that actually changes the name, address, phone and the pincode 

  function handleName(e){
    setName(e.target.value)
  }
  function handleAddress(e){
    setAddress(e.target.value)
  }
  // function handlePhone(e){
  //   // The phone number has to be sanitised before getting accepted as the real phone number
  //   // The number should not have +91 
  //   // It can have 91 ( as some  Indian numbers are written with 91 at the starting )
  //   // It has to be only numeric
  //   // It has to be 10 digit but some numers are longer as well like some are 12 digits so will acept the numbrs upto 12 digits 
  //   // So first clean the number to accept only numbers, then slice it to 12 digits max
  //   const cleanedPhone = e.target.value.replace(/\D/g, '').slice(0, 12);
  //   setPhone(cleanedPhone);
  // }


  function handlePhone(e) {
  // 1. Remove ONLY the '+' and any non-numeric characters
  // This handles the "+91" if they ignore your instruction
  let val = e.target.value.replace(/\D/g, '');

  // 2. If they typed +91 at the start, remove ONLY that specific 91 
  // ONLY if the total length is 12 (meaning 91 + 10 digits)
  if (val.length === 12 && val.startsWith('91')) {
    val = val.slice(2);
  }

  // 3. Set the state (limit to 10 for standard Indian SMS delivery)
  // If you are 100% sure you need 12 digits for your region, change 10 to 12.
  setPhone(val.slice(0, 10)); 
}
  function handlePincode(e){
    // First clean the poincode to accept only numbers, it has to be numeric, only 6 numers that too no spaces between the numbers and nothing but numbers 
    // Only then set the pincode
    const cleanedPincode = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(cleanedPincode);
    // 
    // setPincode(e.target.value)
  }
  
  // register the user Function goes down here 

  function registerUser(){
    if(name && address && phone && pincode){
      const detail = {name, address, phone, pincode };
      localStorage.setItem('detail', JSON.stringify(detail));
      setRegisterOpen(false);
      navigate(-1);
    }else{
      alert('Enter all the Details !!!');
    }
    
  }

  // function goBack(){
  //   navigate(-1);
  // }
 
  return (
   <>
   {registerOpen &&  <div className= {`relative border-1 border-gray-500 rounded-2xl bg-smokewhite p-5 w-[90%] mx-auto my-20 max-w-[300px] shadow-lg shadow-gray-300`}>
      {/* <div onClick={goBack} className='cursor-pointer z-50'>
        <FiX 
      // onClick={alert('Hey')}
      // onClick={goBack}
      className={`absolute right-6 top-6 font-extralight text-xl  
      `} /><FiX />
      </div> */}
      <div className={`relative mb-auto `}>

        {/* the register title  */}
        <h3 className={`flex flex-row justify-center items-center font-medium `}>Register</h3>

        <input
        placeholder='Enter Name'
        onChange={(e) => handleName(e)}
        required
        className={`relative border-1 border-gray-400 rounded-lg bg-transparent p-2 mt-10 w-full mx-auto  `}
        value={name} name='Gaurav' />
        
        <input
        placeholder='Enter Address'
        onChange={(e) => handleAddress(e)}
        required={true}
        className={`relative border-1 border-gray-400 rounded-lg bg-transparent p-2 mt-10 w-full mx-auto  `}
        value={address} name='Gaurav' />

         <div className={`relative flex flex-row justify-center items-center gap-2 mt-10`}> 
          <input disabled={true} value={`+91`} readOnly={true}
          className={`border-1 border-gray-500 rounded-lg bg-transparent p-2 w-[20%]`}
          />

            <input
            placeholder='Enter Phone'
            onChange={(e) => handlePhone(e)}
            required={true}
            className={`relative border-1 border-gray-400 rounded-lg bg-transparent p-2  w-full mx-auto  `}
            value={phone} name='Gaurav' />
        </div>
        
        <input
        placeholder='Enter Pincode'
        onChange={(e) => handlePincode(e)}
        required={true}
        className={`relative border-1 border-gray-400 rounded-lg bg-transparent p-2 mt-10 w-full mx-auto  `}
        value={pincode} name='Gaurav' />
        

       
        



       
      </div>
       <button
       onClick={registerUser}
       className={`relative border-0 outline-0 flex flex-row justify-center items-center bg-green-600 bottom-1 mt-8  w-[90%] mx-auto py-2 rounded-3xl text-white`} >Register</button>
    </div>}

   </>
  )
}

export default Register












