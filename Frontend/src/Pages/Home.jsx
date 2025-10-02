import React, { useContext, useEffect, useState, useRef } from "react";
import { UserDataContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import { FiMenu } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import userImg from "../assets/user.jpg";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);

  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.error(error);
    }
  };

  // ✅ Speak
  const speak = (text) => {
  if (!text || !userData) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";

  let voices = window.speechSynthesis.getVoices();
  const setVoiceAndSpeak = () => {
    voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === "hi-IN");
    if (hindiVoice) utterance.voice = hindiVoice;
    window.speechSynthesis.speak(utterance);
  };

  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
  } else {
    setVoiceAndSpeak();
  }

  isSpeakingRef.current = true;

  utterance.onend = () => {
    isSpeakingRef.current = false;
    setAiText("");
    setTimeout(() => startRecognition(), 800);
  };
};


  // ✅ Handle commands
  const handleCommand = (data) => {
    if (!data) return;

    let { type = "general", userInput = "", response = "" } = data;

    response = response.replace(/```json|```/g, "").trim();

    setAiText(response);
    speak(response);

    const query = encodeURIComponent(userInput);

    switch (type) {
      case "google_search":
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        break;
      case "calculator_open":
        window.open("https://www.google.com/search?q=calculator", "_blank");
        break;
      case "instagram_open":
        window.open("https://www.instagram.com", "_blank");
        break;
      case "facebook_open":
        window.open("https://www.facebook.com", "_blank");
        break;
      case "weather_show":
        window.open("https://www.weather.com", "_blank");
        break;
      case "youtube_search":
      case "youtube_play":
        window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
        break;
      default:
        // Unknown/general command → just speak the response
        console.log("Assistant response:", response);
    }
  };

  // ✅ Setup Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    const startRecognition = () => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition started");
        } catch (e) {
          if (e.name !== "InvalidStateError") console.error(e);
        }
      }
    };

    setTimeout(() => startRecognition(), 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) setTimeout(startRecognition, 1000);
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && isMounted && !isSpeakingRef.current) setTimeout(startRecognition, 1000);
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setUserText("");
      }
    };

    window.speechSynthesis.onvoiceschanged = () => {
      const greeting = new SpeechSynthesisUtterance(`Hello ${userData.name}, what can I help you with?`);
      greeting.lang = "hi-IN";
      window.speechSynthesis.speak(greeting);
    };

    return () => {
      isMounted = false;
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, [userData]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-[#001f33] to-[#004466] flex flex-col justify-center items-center gap-[15px] overflow-hidden">
      
      {/* Hamburger Open */}
      <FiMenu onClick={() => setHam(true)} className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"/>

      {/* Sidebar Menu */}
      <div className={`absolute top-0 w-full h-full bg-black backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start transition-transform duration-300 ${ham ? "translate-x-0" : "-translate-x-full"}`}>
        <RxCross2 onClick={() => setHam(false)} className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"/>
        <button onClick={handleLogout} className="min-w-[150px] h-[60px] mt-[30px] text-[#040720] font-semibold bg-white rounded-full text-[19px] cursor-pointer hover:bg-gray-200 transition">
          Log Out
        </button>
        <button onClick={() => navigate("/customize")} className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer hover:bg-gray-200 transition">
          Customize your Assistant
        </button>
        <div className="w-full h-[1px] bg-gray-400 my-4"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>
        <div className="w-full h-[400px] overflow-y-auto flex flex-col gap-2">
          {userData.history?.map((his, i) => (
            <span key={i} className="text-gray-200 text-[18px] truncate">{his}</span>
          ))}
        </div>
      </div>

      {/* Desktop Buttons */}
      <button onClick={handleLogout} className="hidden lg:block min-w-[150px] h-[60px] absolute top-[20px] right-[20px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer hover:bg-gray-200 transition">
        Log Out
      </button>
      <button onClick={() => navigate("/customize")} className="hidden lg:block min-w-[150px] h-[60px] absolute top-[100px] right-[20px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer px-[20px] py-[10px] hover:bg-gray-200 transition">
        Customize your Assistant
      </button>

      {/* Assistant Card */}
      <div className="w-[300px] h-[400px] flex flex-col items-center overflow-hidden rounded-3xl shadow-lg bg-[#002233]">
        <img src={userData?.assistantImage || "/default-image.png"} alt="Assistant" className="w-full h-[80%] object-cover"/>
        <h1 className="text-white text-lg font-semibold mt-4">
          I'm {userData?.assistantName || "Your Assistant"}
        </h1>
        {!aiText && <img src={userImg} alt="User" className="w-[200px]"/>}
        {aiText && <img src={aiImg} alt="AI" className="w-[200px]"/>}
        <h1 className="text-white text-[18px] font-semibold text-wrap">{userText || aiText}</h1>
      </div>
    </div>
  );
}

export default Home;
