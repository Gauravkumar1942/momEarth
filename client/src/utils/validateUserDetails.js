// Validation utility for user details
export const validateUserDetails = (details) => {
  if (!details) {
    return {
      isValid: false,
      message: 'User details not found. Please register first.'
    };
  }

  // Check if name exists and is at least 3-4 characters
  if (!details.name || details.name.trim().length < 3) {
    return {
      isValid: false,
      message: 'Name must be at least 3 characters long.'
    };
  }

  // Check if address exists and is at least 5-7 characters
  if (!details.address || details.address.trim().length < 5) {
    return {
      isValid: false,
      message: 'Address must be at least 5 characters long.'
    };
  }

  // Check if pincode exists and is exactly 6 digits
  if (!details.pincode || !/^\d{6}$/.test(details.pincode)) {
    return {
      isValid: false,
      message: 'Pincode must be exactly 6 digits.'
    };
  }

  // Check if phone exists and is exactly 10 digits
  if (!details.phone || !/^\d{10}$/.test(details.phone)) {
    return {
      isValid: false,
      message: 'Phone number must be exactly 10 digits.'
    };
  }

  return {
    isValid: true,
    message: 'All details are valid.'
  };
};
