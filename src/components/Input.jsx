import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref){
    const id = useId();
    return (
        <div className='w-full'>
            {label && <label
            className='inline-block mb-1 pl-1'
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`px-3 py-1 text-black outline-none duration-200 w-full ${className}`}
            {...props}
            id={id}
            ref={ref}
            />
        </div>
    )
})

export default Input;