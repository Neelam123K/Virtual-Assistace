import React, { useState, useRef, useContext, useEffect } from "react";
import Cart from "../components/Cart.jsx";
import image1 from "../assets/girl.png";
import image2 from "../assets/girl4.png";
import image3 from "../assets/image3.png";
import { RiImageAddLine } from "react-icons/ri";
import { IoIosArrowRoundBack } from "react-icons/io";
import { UserDataContext } from "../Context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

function Customize() {
  // const []
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);

  const navigate = useNavigate();
  const inputImage = useRef();

  useEffect(() => {
    console.log("Selected Image:", selectedImage);
  }, [selectedImage]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    console.log("file:",URL.createObjectURL(file));
    if (file) {
      setBackendImage(file); // raw file for backend
      setFrontendImage(URL.createObjectURL(file)); // preview
      setSelectedImage("input"); // flag that user uploaded an image
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-[#001f33] to-[#004466] flex flex-col items-center p-6">
      <IoIosArrowRoundBack
              className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]"
              onClick={() => navigate("/")}
            />
      {/* Title */}
      <h1 className="text-white mb-10 text-3xl md:text-4xl font-bold text-center">
        Select your Personal <span className="text-cyan-400">Assistant Image</span>
      </h1>

      {/* Image selection */}
      <div className="w-[90%] max-w-[900px] flex justify-center items-center flex-wrap gap-6">
        <Cart image={image1} />
        <Cart image={image2} />
        <Cart image={image3} />

        {/* Upload Image Card */}
        <div
          className={`w-[150px] h-[250px] bg-[#0a0a2e] border-2 border-dashed border-cyan-400 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center
            ${
              selectedImage === "input"
                ? "border-4 border-cyan-300 shadow-xl shadow-cyan-600"
                : "hover:shadow-lg hover:shadow-cyan-500 hover:border-4 hover:border-cyan-200"
            }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {frontendImage ? (
            <img
              src={frontendImage}
              alt="Selected"
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <RiImageAddLine className="text-cyan-300 w-[25px] h-[25px]" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleImage}
        />
      </div>

      {/* Next Button */}
      {selectedImage && (
        <button
          onClick={() => navigate("/customize2")}
          className="min-w-[160px] h-[60px] mt-10 px-6 text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-lg shadow-lg cursor-pointer hover:from-blue-600 hover:to-cyan-500 transition-transform transform hover:scale-105"
        >
          Next →
        </button>
      )}
    </div>
  );
}

export default Customize;
