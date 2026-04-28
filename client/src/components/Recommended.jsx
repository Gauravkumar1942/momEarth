import React, { useEffect, useState, useRef } from 'react'
// import { FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// import { FaStar } from 'react-icons/fa6';
// import { FiHeart } from 'react-icons/fi';

const Star = React.lazy(() => import('lucide-react/dist/esm/icons/star.js'));
const FaChevronLeft = React.lazy(() => import('lucide-react/dist/esm/icons/chevron-left.js'));
const FaChevronRight = React.lazy(() => import('lucide-react/dist/esm/icons/chevron-right.js'));





import { useNavigate } from 'react-router-dom';


function Recommended({detail}) {
    // priority of fetching the products 
    // 1. Brand + type + gender + color 
    // 2. type + gender + color
    // 3. type + gender
    // 4. gender
  
    const { brand = 'Levis', color = 'black', gender = 'men', type = 'suit' } = detail;
    const [one, setOne] = useState([]);
    const [two, setTwo] = useState([]);
    const [three, setThree] = useState([]);
    const [four, setFour] = useState([]);
    
    // Refs for scroll containers
    const scrollOneRef = useRef(null);
    const scrollTwoRef = useRef(null);
    const scrollThreeRef = useRef(null);
    const scrollFourRef = useRef(null);

    // Hover states for each section
    const [isOneHovered, setIsOneHovered] = useState(false);
    const [isTwoHovered, setIsTwoHovered] = useState(false);
    const [isThreeHovered, setIsThreeHovered] = useState(false);
    const [isFourHovered, setIsFourHovered] = useState(false);

    // Arrow visibility states
    const [oneLeftArrow, setOneLeftArrow] = useState(false);
    const [oneRightArrow, setOneRightArrow] = useState(false);
    const [twoLeftArrow, setTwoLeftArrow] = useState(false);
    const [twoRightArrow, setTwoRightArrow] = useState(false);
    const [threeLeftArrow, setThreeLeftArrow] = useState(false);
    const [threeRightArrow, setThreeRightArrow] = useState(false);
    const [fourLeftArrow, setFourLeftArrow] = useState(false);
    const [fourRightArrow, setFourRightArrow] = useState(false);

    const navigate = useNavigate();

    // Scroll handler function
    const updateArrowVisibility = (scrollRef, setLeftArrow, setRightArrow) => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setLeftArrow(scrollLeft > 10);
        setRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    // Scroll function
    const handleScroll = (scrollRef, direction) => {
        if (!scrollRef.current) return;
        const scrollAmount = direction === 'left' ? -400 : 400;
        scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        fetch('http://localhost:3000/reco/one',{
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({ brand, color, gender, productType: type })
        })
        .then(res => {
            console.log("Response", res);
            
          if(!res.ok){
            setOne([]);
            return [];
          }
          return res.json();
        })
        .then(data => {
            console.log("Data : ", data);
            
            if(!Array.isArray(data) || data.length === 0) {
                setOne([]);
                return;
            }
            else setOne(data);
        })
        .catch((err) => console.error('The Error', err)
        )
        .finally(() => console.log('Final One')
        )
    }, [brand, color, gender, type]);
    
    useEffect(() => {
        fetch('http://localhost:3000/reco/two', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({productType: type, gender: gender, color: color})
        })
        .then(res => {
            if(!res.ok) {
                setTwo([]);
                return;
            };
            return res.json();
        })
        .then(data => {
            if(!Array.isArray(data) || data.length === 0) setTwo([]);
            setTwo(data);
        })
        .catch((err) => console.error('The Error', err)
        )
        .finally(() => console.log('Final')
        )
    }, [type, gender, color]);
    
    
    useEffect(() => {
        fetch('http://localhost:3000/reco/three',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({productType: type, gender: gender})
        })
        .then(res => {
            if(!res.ok){
                setThree([]);
                return;
            }
                return res.json();
        })
        .then(data => {
            if(!Array.isArray(data) || data.length === 0) {
                setThree([]);
            }
            else{
                setThree(data);
            }

        })
        .catch((err) => console.error('The Error', err)
        )
        .finally(() => console.log('Final')
        )
    }, [type, gender]);
    
    useEffect(() => {
        fetch('http://localhost:3000/reco/four',{
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({gender: gender})
        })
        .then(res => {
            if(!res.ok){
                setFour([]);
                return;
            };
            return res.json();
        })
        .then(data => {
            if(!Array.isArray(data) || data.length === 0){
                setFour([]);
                return;
            }else{
                setFour(data);
            }
        })
        .catch((err) => console.error('The Error', err)
        )
        .finally(() => console.log('Final')
        )
    }, [gender]);

    // Setup scroll listeners for each section
    useEffect(() => {
        const scrollOne = scrollOneRef.current;
        if (!scrollOne) return;

        const handleScrollOne = () => updateArrowVisibility(scrollOneRef, setOneLeftArrow, setOneRightArrow);
        scrollOne.addEventListener('scroll', handleScrollOne);
        handleScrollOne(); // Initial check

        return () => scrollOne.removeEventListener('scroll', handleScrollOne);
    }, [one]);

    useEffect(() => {
        const scrollTwo = scrollTwoRef.current;
        if (!scrollTwo) return;

        const handleScrollTwo = () => updateArrowVisibility(scrollTwoRef, setTwoLeftArrow, setTwoRightArrow);
        scrollTwo.addEventListener('scroll', handleScrollTwo);
        handleScrollTwo();

        return () => scrollTwo.removeEventListener('scroll', handleScrollTwo);
    }, [two]);

    useEffect(() => {
        const scrollThree = scrollThreeRef.current;
        if (!scrollThree) return;

        const handleScrollThree = () => updateArrowVisibility(scrollThreeRef, setThreeLeftArrow, setThreeRightArrow);
        scrollThree.addEventListener('scroll', handleScrollThree);
        handleScrollThree();

        return () => scrollThree.removeEventListener('scroll', handleScrollThree);
    }, [three]);

    useEffect(() => {
        const scrollFour = scrollFourRef.current;
        if (!scrollFour) return;

        const handleScrollFour = () => updateArrowVisibility(scrollFourRef, setFourLeftArrow, setFourRightArrow);
        scrollFour.addEventListener('scroll', handleScrollFour);
        handleScrollFour();

        return () => scrollFour.removeEventListener('scroll', handleScrollFour);
    }, [four]);
    
    function goToDetailPage(pid){
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        navigate(`/products/pid/${pid}`);
    }
    
  return (
    <>
        {/* Section One */}
        <h4 className='pl-5 font-medium text-xl'>{one.length > 0 && one[0].brand ? `More from ${one[0].brand}` : ''}</h4>
        <div 
            className='relative'
            onMouseEnter={() => setIsOneHovered(true)}
            onMouseLeave={() => setIsOneHovered(false)}
        >
            <div 
                ref={scrollOneRef}
                className='p-5 flex flex-row justify-start items-center gap-5 w-auto mx-auto overflow-x-auto overscroll-y-auto snap-x scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
            >
                {Array.isArray(one) && one.map((item, index) => {
                    return (
                        <div onClick={() => goToDetailPage(item.pid)}
                        key={index} className='flex-none w-[35vw] sm:w-[22vw] md:w-[18vw] lg:w-[13vw] xl:w-[10vw] 2xl:w-[5vw] 3xl:w-[3vw] 4xl:w-[2vw] bg-transparent flex flex-col justify-center items-center rounded-2xl outline-0 transform hover:scale-105 transition duration-200 ease-in-out cursor-pointer'>
                            <div className='relative flex flex-col justify-center items-center'>
                               { item.rating > 0 && item.count > 0 &&  <div className='absolute flex flex-row justify-center items-center gap-3 bottom-1'>
                                    <div className='flex flex-row justify-center items-center opacity-70 bg-gray-300 rounded-3xl px-2'>
                                        <h5 className='text-black font-medium pr-0.5 text-[13px]'>{Number(item.rating).toFixed(1)}</h5>
                                        <Star className='text-sm fill-green-500 text-green-500' size={15} />
                                        <h5 className='text-black font-medium ml-1 border-l-1 pl-1 border-gray-800 text-[13px]'>{item.count}</h5>
                                    </div>
                                                                        </div>
                                }
                                <img 
                                    className='rounded-2xl object-cover w-full aspect-3/4' 
                                    src={`/assets/${item.image_url}`} 
                                    alt={item.productname}
                                />
                            </div>
                            <div className='flex flex-col justify-center items-center p-3'>
                                <h3 className='text-md font-medium'>{item.brand}</h3>
                                <h5 className='text-sm font-normal line-clamp-1 overflow-hidden text-ellipsis'>{item.productname}</h5>
                                <h3 className='text-md font-semibold'>{item.price}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Arrow Buttons for Section One */}
            {oneLeftArrow && isOneHovered && (
                <button
                    onClick={() => handleScroll(scrollOneRef, 'left')}
                    className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm'
                >
                    <FaChevronLeft className='text-gray-800 text-xl' />
                </button>
            )}
            {oneRightArrow && isOneHovered && (
                <button
                    onClick={() => handleScroll(scrollOneRef, 'right')}
                    className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm'
                >
                    <FaChevronRight className='text-gray-800 text-xl' />
                </button>
            )}
        </div>

        {/* Section Two */}
        <h4 className='pl-5 font-medium text-xl'>{two.length > 0 && two[0].color && two[0].product_type ? `More ${two[0].color} ${two[0].product_type}` : ''}</h4>
        <div 
            className='relative'
            onMouseEnter={() => setIsTwoHovered(true)}
            onMouseLeave={() => setIsTwoHovered(false)}
        >
            <div 
                ref={scrollTwoRef}
                className='p-5 flex flex-row justify-start items-center gap-5 w-auto mx-auto overflow-x-auto overscroll-y-auto snap-x scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
            >
                {Array.isArray(two) && two.map((item, index) => {
                    return (
                        <div onClick={() => goToDetailPage(item.pid)}
                        key={index} className='flex-none w-[35vw] sm:w-[22vw] md:w-[18vw] lg:w-[13vw] xl:w-[10vw] 2xl:w-[5vw] 3xl:w-[3vw] 4xl:w-[2vw] bg-transparent flex flex-col justify-center items-center rounded-2xl outline-0 transform hover:scale-105 transition duration-200 ease-in-out cursor-pointer'>
                            <div className='relative flex flex-col justify-center items-center'>
                                { item.rating > 0 && item.count > 0 &&  <div className='absolute flex flex-row justify-center items-center gap-3 bottom-1'>
                                    <div className='flex flex-row justify-center items-center opacity-70 bg-gray-300 rounded-3xl px-2'>
                                        <h5 className='text-black font-medium pr-0.5 text-[13px]'>{Number(item.rating).toFixed(1)}</h5>
                                         <Star className='text-sm fill-green-500 text-green-500' size={15} />
                                        <h5 className='text-black font-medium ml-1 border-l-1 pl-1 border-gray-800 text-[13px]'>{item.count}</h5>
                                    </div>
                                                                        </div>
                                }
                                <img 
                                    className='rounded-2xl object-cover w-full aspect-3/4' 
                                    src={`/assets/${item.image_url}`}
                                    alt={item.productname}
                                />
                            </div>
                            <div className='flex flex-col justify-center items-center p-3'>
                                <h3 className='text-md font-medium'>{item.brand}</h3>
                                <h5 className='text-sm font-normal line-clamp-1 overflow-hidden text-ellipsis'>{item.productname}</h5>
                                <h3 className='text-md font-semibold'>{item.price}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Arrow Buttons for Section Two */}
            {twoLeftArrow && isTwoHovered && (
                <button
                    onClick={() => handleScroll(scrollTwoRef, 'left')}
                    className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm'
                >
                    <FaChevronLeft className='text-gray-800 text-xl' />
                </button>
            )}
            {twoRightArrow && isTwoHovered && (
                <button
                    onClick={() => handleScroll(scrollTwoRef, 'right')}
                    className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm'
                >
                    <FaChevronRight className='text-gray-800 text-xl' />
                </button>
            )}
        </div>
        
        {/* Section Three */}
        <h4 className='pl-5 font-medium text-xl'>{three.length > 0 && three[0].brand ? `${three[0].product_type} for ${three[0].gender}` : ''}</h4>
        <div 
            className='relative'
            onMouseEnter={() => setIsThreeHovered(true)}
            onMouseLeave={() => setIsThreeHovered(false)}
        >
            <div 
                ref={scrollThreeRef}
                className='p-5 flex flex-row justify-start items-center gap-5 w-auto mx-auto overflow-x-auto overscroll-y-auto snap-x scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
            >
                {Array.isArray(three) && three.map((item, index) => {
                   return (
                        <div onClick={() => goToDetailPage(item.pid)}
                        key={index} className='flex-none w-[35vw] sm:w-[22vw] md:w-[18vw] lg:w-[13vw] xl:w-[10vw] 2xl:w-[5vw] 3xl:w-[3vw] 4xl:w-[2vw] bg-transparent flex flex-col justify-center items-center rounded-2xl outline-0 transform hover:scale-105 transition duration-200 ease-in-out cursor-pointer'>
                            <div className='relative flex flex-col justify-center items-center'>
                               { item.rating > 0 && item.count > 0 &&  <div className='absolute flex flex-row justify-center items-center gap-3 bottom-1'>
                                    <div className='flex flex-row justify-center items-center opacity-70 bg-gray-300 rounded-3xl px-2'>
                                        <h5 className='text-black font-medium pr-0.5 text-[13px]'>{Number(item.rating).toFixed(1)}</h5>
                                         <Star className='text-sm fill-green-500 text-green-500' size={15} />
                                        <h5 className='text-black font-medium ml-1 border-l-1 pl-1 border-gray-800 text-[13px]'>{item.count}</h5>
                                    </div>
                                                                        </div>
                                }
                                <img 
                                    className='rounded-2xl object-cover w-full aspect-3/4' 
                                    src={`/assets/${item.image_url}`}
                                    alt={item.productname}
                                />
                            </div>
                            <div className='flex flex-col justify-center items-center p-3'>
                                <h3 className='text-md font-medium'>{item.brand}</h3>
                                <h5 className='text-sm font-normal line-clamp-1 overflow-hidden text-ellipsis'>{item.productname}</h5>
                                <h3 className='text-md font-semibold'>{item.price}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Arrow Buttons for Section Three */}
            {threeLeftArrow && isThreeHovered && (
                <button
                    onClick={() => handleScroll(scrollThreeRef, 'left')}
                    className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm'
                >
                    <FaChevronLeft className='text-gray-800 text-xl' />
                </button>
            )}
            {threeRightArrow && isThreeHovered && (
                <button
                    onClick={() => handleScroll(scrollThreeRef, 'right')}
                    className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm'
                >
                    <FaChevronRight className='text-gray-800 text-xl' />
                </button>
            )}
        </div>

        {/* Section Four */}
        <h4 className='pl-5 font-medium text-xl'>{four.length > 4 && four[0].brand ? `Loved by ${four[0].gender}` : ''}</h4>
        <div 
            className='relative'
            onMouseEnter={() => setIsFourHovered(true)}
            onMouseLeave={() => setIsFourHovered(false)}
        >
            <div 
                ref={scrollFourRef}
                className='p-5 flex flex-row justify-start items-center gap-5 w-auto mx-auto overflow-x-auto overscroll-y-auto snap-x scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'
            >
                {Array.isArray(four) && four.map((item, index) => {
                    return (
                        <div onClick={() => goToDetailPage(item.pid)}
                        key={index} className='flex-none w-[35vw] sm:w-[22vw] md:w-[18vw] lg:w-[13vw] xl:w-[10vw] 2xl:w-[5vw] 3xl:w-[3vw] 4xl:w-[2vw] bg-transparent flex flex-col justify-center items-center rounded-2xl outline-0 transform hover:scale-105 transition duration-200 ease-in-out cursor-pointer'>
                            <div className='relative flex flex-col justify-center items-center'>
                                { item.rating > 0 && item.count > 0 &&  <div className='absolute flex flex-row justify-center items-center gap-3 bottom-1'>
                                    <div className='flex flex-row justify-center items-center opacity-70 bg-gray-300 rounded-3xl px-2'>
                                        <h5 className='text-black font-medium pr-0.5 text-[13px]'>{Number(item.rating).toFixed(1)}</h5>
                                        <Star className='text-sm fill-green-500 text-green-500' size={15} />
                                        <h5 className='text-black font-medium ml-1 border-l-1 pl-1 border-gray-800 text-[13px]'>{item.count}</h5>
                                    </div>
                                                                        </div>
                                }
                                <img 
                                    className='rounded-2xl object-cover w-full aspect-3/4' 
                                    src={`/assets/${item.image_url}`}
                                    alt={item.productname}
                                />
                            </div>
                            <div className='flex flex-col justify-center items-center p-3'>
                                <h3 className='text-md font-medium'>{item.brand}</h3>
                                <h5 className='text-sm font-normal line-clamp-1 overflow-hidden text-ellipsis'>{item.productname}</h5>
                                <h3 className='text-md font-semibold'>{item.price}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Arrow Buttons for Section Four */}
            {fourLeftArrow && isFourHovered && (
                <button
                    onClick={() => handleScroll(scrollFourRef, 'left')}
                    className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm'
                >
                    <FaChevronLeft className='text-gray-800 text-xl' />
                </button>
            )}
            {fourRightArrow && isFourHovered && (
                <button
                    onClick={() => handleScroll(scrollFourRef, 'right')}
                    className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 z-10 backdrop-blur-sm'
                >
                    <FaChevronRight className='text-gray-800 text-xl' />
                </button>
            )}
        </div>
    </>
  )
}

export default Recommended