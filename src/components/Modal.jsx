import React from 'react';

const Modal = ({ showModal, closeModal, children }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-10 ${showModal ? '' : 'hidden'}`}>
      <div className="w-full p-6 rounded-md shadow-lg relative">
        <button className="absolute -top-[20%] right-4 mt-4 mr-4 text-white text-4xl font-extrabold " onClick={closeModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
