// Size data for different products mapped by product ID (pid)
// Different products have different size formats:
// - Clothing: S, M, L, XL, XXL
// - Footwear: 6, 7, 8, 9, 10, 11, 12
// - Beverages/Liquids: 100ml, 250ml, 500ml, 1L

export const sizeData = {
  // Clothing (S, M, L, XL, XXL format)
  '01': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  '2000': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  '3000': ['S', 'M', 'L', 'XL'],
  '04': ['XS', 'S', 'M', 'L', 'XL', 'XXL'],

  // Footwear (shoe sizes)
  
  '005': ['6', '7', '8', '9', '10', '11', '12'],
  '006': ['6', '7', '8', '9', '10', '11', '12'],
  '007': ['5', '6', '7', '8', '9', '10', '11', '12'],

  // Beverages/Liquids (volume in ml)
  '008': ['100ml', '250ml', '500ml', '1L'],
  '009': ['100ml', '200ml', '500ml'],
  // '006': ['100ml', '200ml', '500ml'],
  // '007': ['100ml', '200ml', '500ml'],
  // '008': ['100ml', '200ml', '500ml'],
  // '009': ['100ml', '200ml', '500ml'],
  '1000': ['250ml', '500ml', '1L', '2L'],
  
  // Add more products as needed
  // Format: 'pid': ['size1', 'size2', 'size3', ...]
};

// Function to get sizes for a specific product
export const getSizesByPid = (pid) => {
  return sizeData[pid] || ['S', 'M', 'L', 'XL', 'XXL']; // Default to clothing sizes if not found
};

// Function to format size objects for rendering
export const formatSizeObject = (sizes) => {
  return sizes.map((size) => ({
    size: size,
    selected: size === sizes[0], // First size is selected by default
  }));
};
