import React, { useContext, useState } from "react";
import { UserDataContext } from "../Context/UserContext.jsx";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(UserDataContext);

  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    try {
      setLoading(true);

      let formData = new FormData();

      formData.append("assistantName", assistantName);

      if (backendImage && backendImage instanceof File) {
        formData.append("assistantImage", backendImage);
      } else if (selectedImage) {
        console.log("Selected Image URL:", selectedImage);
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update result:", result.data);
      setLoading(false);
      setUserData(result.data);
      setUserData(result.data);
      navigate("/"); 
    } catch (error) {
      setLoading(false);
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-[#001f33] to-[#004466] flex flex-col justify-center items-center p-[20px]">
      <IoIosArrowRoundBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px]"
        onClick={() => navigate("/customize")}
      />

      {/* Title */}
      <h1 className="text-white mb-10 text-3xl md:text-4xl font-bold text-center">
        Give Your <span className="text-cyan-400">Assistant</span> Name
      </h1>

      {/* Input */}
      <input
        type="text"
        placeholder="e.g. Reeruru"
        className="w-full max-w-[500px] h-[60px] outline-none border-2 border-cyan-400 bg-transparent text-white placeholder-gray-400 px-6 rounded-full text-lg shadow-md focus:border-cyan-300 focus:shadow-cyan-500 focus:shadow-lg transition-all duration-300"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {/* Button */}
      {assistantName && (
        <button
          className="min-w-[300px] h-[60px] mt-10 px-6 text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-lg shadow-lg hover:from-blue-600 hover:to-cyan-500 transition-transform transform hover:scale-105"
          disabled={loading}
          onClick={handleUpdateAssistant}
        >
          {loading ? "Loading..." : "Customize Your Virtual Partner 🚀"}
        </button>
      )}
    </div>
  );
}

export default Customize2;
