import React, { useState, useContext } from 'react';
import girl from '../assets/girl.png';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext.jsx';
import axios from 'axios';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData, serverUrl } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      navigate('/');
    } catch (error) {
      console.log(error);
      setUserData(null);
      setErr(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-no-repeat bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${girl})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000060] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-5 px-6 rounded-2xl"
        onSubmit={handleSignIn}
      >
        <h1 className="text-white text-3xl font-semibold mb-6">
          Sign In to <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        {/* Password */}
        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-lg relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-full outline-none bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg pr-12"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-white cursor-pointer"
          >
            {showPassword ? (
              <IoIosEyeOff className="w-6 h-6" />
            ) : (
              <IoIosEye className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Error */}
        {err && <p className="text-red-500 text-base">*{err}</p>}

        {/* Button */}
        <button
          type="submit"
          className="min-w-[150px] h-[60px] mt-5 text-black font-semibold bg-white rounded-full text-lg"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Link */}
        <p
          className="text-white text-lg cursor-pointer"
          onClick={() => navigate('/signup')}
        >
          Want to create a new account?{" "}
          <span className="text-blue-400">Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
