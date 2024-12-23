import React from 'react';

export const Spinner = () => {
  return (
    <div className="flex justify-center items-center w-full mt-10">
      <div className="w-8 h-8 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};
