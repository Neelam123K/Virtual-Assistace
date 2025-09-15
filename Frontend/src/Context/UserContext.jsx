import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserDataContext = createContext({});

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null); 
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("Current user:", result.data);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

 const getGeminiResponse = async (message) => {
  try {
    const res = await axios.post(
      `${serverUrl}/api/user/asktoassistant`,
      { prompt: message },
      { withCredentials: true }
    );

    let data = res.data;

    // If backend sends string with ```json, clean it
    if (typeof data === "string") {
      try {
        data = data.replace(/```json|```/g, "").trim();
        data = JSON.parse(data);
      } catch (err) {
        console.error("JSON parse error:", err);
        return null;
      }
    }

    
    return {
      type: data.type,
      userInput: data.userinput || data.userInput || "",
      response: data.response || "",
    };
  } catch (error) {
    console.error("Gemini fetch error:", error);
    return null;
  }
};


  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl, userData,setUserData,backendImage,setBackendImage,frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage, getGeminiResponse
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;