import React, { useEffect } from 'react';

const Frontend = () => {
  useEffect(() => {
    console.log('📘 Frontend page rendered');
  }, []);

  return (
    <div>
      🚀 Welcome to Frontend Development!
    </div>
  );
};

export default Frontend;
