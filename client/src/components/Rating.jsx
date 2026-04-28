import React, { useState, useEffect, useRef } from 'react';

const Star = React.lazy(() => import('lucide-react/dist/esm/icons/star.js'));
const ChevronLeft = React.lazy(() => import('lucide-react/dist/esm/icons/chevron-left.js'));
const ChevronRight = React.lazy(() => import('lucide-react/dist/esm/icons/chevron-right.js'));
import Spinner from './Spinner';

const Rating = ({ pid }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reviewScrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isReviewHovered, setIsReviewHovered] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch reviews on component mount
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/products/review/${pid}`)
      .then(response => response.json())
      .then(data => {
        const reviewsArray = Array.isArray(data) ? data : data.data || [];
        setReviews(reviewsArray);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reviews:', err);
        setError(err);
        setLoading(false);
      });
  }, [pid]);

  // Update arrow visibility for review container
  useEffect(() => {
    const reviewContainer = reviewScrollRef.current;
    if (!reviewContainer) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = reviewContainer;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    reviewContainer.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => reviewContainer.removeEventListener('scroll', handleScroll);
  }, [reviews]);

  // Handle wheel scroll for horizontal scrolling on desktop
  useEffect(() => {
    const reviewContainer = reviewScrollRef.current;
    if (!reviewContainer) return;

    const handleWheel = (e) => {
      e.preventDefault();
      reviewContainer.scrollLeft += e.deltaY;
    };

    reviewContainer.addEventListener('wheel', handleWheel);

    return () => {
      reviewContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Handle touch events for mobile swiping
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const reviewContainer = reviewScrollRef.current;
    if (!reviewContainer) return;

    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    reviewContainer.scrollLeft += diff;
    setStartX(currentX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Scroll review container
  const scrollReviews = (direction) => {
    const reviewContainer = reviewScrollRef.current;
    if (!reviewContainer) return;

    const reviewWidth = reviewContainer.querySelector('[data-review]')?.offsetWidth || 320;
    const scrollAmount = direction === 'left' ? -reviewWidth - 16 : reviewWidth + 16;

    reviewContainer.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className='flex items-center gap-1'>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            size={16}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <Spinner size='lg' color='blue' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='border-1 border-gray-500 rounded-2xl px-10 py-5 w-[95%] mx-auto flex justify-center items-center'>
        <h2 className='font-light text-2xl text-black'>Error loading reviews</h2>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className='border-1 border-gray-500 rounded-2xl px-10 py-5 w-[95%] mx-auto flex justify-center items-center'>
        <h2 className='font-light text-2xl text-black'>No reviews yet</h2>
      </div>
    );
  }

  return (
    <div className='w-[95%] md:w-full mx-auto my-8'>
      <div className='border-1 border-gray-500 rounded-2xl py-5 px-5 w-full'>
        <h2 className='text-2xl font-bold mb-6 mx-3'>Customer Reviews</h2>

        {/* Reviews Container */}
        <div
          className='relative'
          onMouseEnter={() => setIsReviewHovered(true)}
          onMouseLeave={() => setIsReviewHovered(false)}
        >
          <div
            ref={reviewScrollRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className='flex flex-row overflow-x-auto gap-4 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory'
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                data-review
                className='flex-shrink-0 w-full sm:w-80 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 snap-center'
              >
                {/* User Name */}
                <h3 className='font-semibold text-lg text-gray-800 mb-2 truncate'>
                  {review.name || 'Anonymous'}
                </h3>

                {/* Star Rating */}
                <div className='mb-4'>
                  {renderStars(review.rating)}
                </div>

                {/* Review Text */}
                <p className='text-gray-700 text-sm leading-relaxed line-clamp-4 h-fit'>
                  {review.review || 'No text review'}
                </p>

                {/* Rating Badge */}
                <div className='mt-4 inline-block'>
                  <span className='bg-blue-500 text-white text-xs font-bold rounded-full px-3 py-1'>
                    {review.rating} / 5
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow for Desktop */}
          {showLeftArrow && isReviewHovered && (
            <button
              onClick={() => scrollReviews('left')}
              className='hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-200 z-10 border border-gray-300 items-center justify-center'
              aria-label='Scroll reviews left'
            >
              <ChevronLeft className='text-gray-800 text-lg' />
            </button>
          )}

          {/* Right Arrow for Desktop */}
          {showRightArrow && isReviewHovered && (
            <button
              onClick={() => scrollReviews('right')}
              className='hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all duration-200 z-10 border border-gray-300 items-center justify-center'
              aria-label='Scroll reviews right'
            >
              <ChevronRight className='text-gray-800 text-lg' />
            </button>
          )}
        </div>

        {/* Mobile Instructions */}
        <p className='text-xs text-gray-500 text-center mt-4 sm:hidden'>
          Swipe to see more reviews
        </p>
      </div>
    </div>
  );
};

export default Rating;