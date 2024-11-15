import React from 'react'

function Button({
    children,
    type = 'Button',
    bgColor = 'bg-blue-600',
    textColor = 'text-white',
    className = '',
    ...props
}) {
  return (
    <button className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className} sm:px-2`} {...props}>
        {children}
    </button>
  )
}

export default Button