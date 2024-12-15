import React from 'react';

const Modal = ({ showModal, closeModal, children }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center ${showModal ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-md shadow-lg relative">
        <button className="absolute top-0 right-0 mt-4 mr-4 text-black" onClick={closeModal}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
