import React from 'react';
const Spinner = ({ size = 'md', color = 'current' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4'
  };
  
  const colors = {
    current: 'border-current',
    blue: 'border-blue-500',
    red: 'border-red-500',
    green: 'border-green-500'
  };
  
  return (
    <div 
      className={`inline-block animate-spin rounded-full border-solid ${sizes[size]} ${colors[color]} border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default Spinner;
// Usage
{/* <Spinner size="md" color="blue" /> */}