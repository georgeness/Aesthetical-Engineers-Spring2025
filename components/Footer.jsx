import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="flex justify-center p-4 text-sm text-gray-600">
      © {currentYear} George Lupo. All rights reserved.
    </div>
  );
};

export default Footer;
