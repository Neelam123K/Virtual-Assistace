import React, { useState, useContext } from 'react';
import girl from '../assets/girl.png';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/userContext';
import axios from 'axios';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { value } = useContext(UserDataContext);
  const navigation = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const result = await axios.post(`${value.serverUrl}/api/auth/singup`, {
        name,
        email,
        password,
      }, { withCredentials: true });

      console.log(result.data);
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[90%] max-w-6xl h-[90%] shadow-2xl rounded-2xl flex overflow-hidden bg-white">
        {/* Left Side - Image */}
        <div className="hidden md:flex w-1/2 bg-black relative">
          <img src={girl} alt="girl" className="object-cover w-full h-full opacity-80" />
          <div className="absolute bottom-6 left-6 text-white text-xl font-bold">Virtual Assistant</div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center relative">
          <h1 className="text-3xl font-bold text-center mb-6">
            Register to <span className="text-blue-500">Virtual Assistance</span>
          </h1>

          <form onSubmit={handleSignUp} className="space-y-5">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 px-4 py-3 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 px-4 py-3 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border border-gray-300 px-4 py-3 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute top-3 right-4 text-xl cursor-pointer text-gray-600">
                {showPassword ? (
                  <IoIosEyeOff onClick={() => setShowPassword(false)} />
                ) : (
                  <IoIosEye onClick={() => setShowPassword(true)} />
                )}
              </div>
            </div>

            {err && <p className="text-red-500 text-sm">* {err}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white text-lg rounded-full hover:bg-blue-600 transition"
            >
              Sign Up
            </button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer font-medium"
                onClick={() => navigation('/singin')}
              >
                Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
