import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { Button, Input, Logo } from "./index";
import { useForm } from "react-hook-form";
import authService from "../firebase/auth.js";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        console.log("usedata:", userData);
        if (userData) {
          console.log("user Exisits");
          dispatch(authLogin(userData));
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
    finally{
      document.login_form.reset();
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`mx-auto w-full max-w-lg rounded-xl px-10 pt-4 pb-8 border border-white/80 sm:max-w-80`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block">
            <Logo />
          </span>
        </div>
        
        <h2 className="text-center text-xl font-bold leading-tight">
          Log in to your account
        </h2>
        
        <p className="mt-2 text-center text-base text-white/70">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all  text-blue-400 duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form name='login_form' onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
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
              children="Login" />
          </div>
        </form>

      </div>
    </div>
  );
}

export default Login;
