import React, { useState } from "react";
import authService from "../firebase/auth.js";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice.js";
import { Button, Input, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError("");
    console.log("data: ", data);
    try {
      const userData = await authService.createAccount(data);
      if (userData) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(login(userData))
          navigate("/");
      }
    } catch (error) {
      setError(error.message);
    }
    finally{
      document.signup_form.reset();
    }
  }

  return (
    <div>
      <div
        className={`mx-auto w-full max-w-lg rounded-xl px-10 pt-4 pb-8 border border-white/80 sm:max-w-80`}
      >
        
        <div className="mb-2 flex justify-center">
          <span className="inline-block">
            <Logo />
          </span>
        </div>
        
        <h2 className="text-center text-xl font-bold leading-tight">
          Sign up to create account
        </h2>
        
        <p className="mt-2 text-center text-base text-white/70">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all text-blue-400 duration-200 hover:underline"
          >
            LogIn
          </Link>
        </p>
        
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form name="signup_form" onSubmit={handleSubmit(create)} className="mt-8">
          <div className="space-y-5">
            <Input
                label="Full Name: "
                placeholder="Enter your full name"
                {...register("name", {
                  required: true,
                })}
              />
            <Input
              label="Email: "
              placeholder="Enter your Email"
              type="Email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password:"
              placeholder="Enter your password"
              type="password"
              {...register("password", {
                required: true,
              })}
            />
            <Button 
              type="submit" 
              className="w-full
                    bg-gradient-to-r from-[#9B00FF] from-20% to-[#FD1199] to-100%"
              children="Create Account" />
          </div>
        </form>

      </div>
    </div>
  );

}

export default Signup
