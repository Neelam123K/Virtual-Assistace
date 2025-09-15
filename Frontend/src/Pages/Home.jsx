import React, { useContext, useEffect, useState, useRef } from "react";
import { UserDataContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif"
import userImg from "../assets/user.jpg"
function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("")
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.error(error);
    }
  };
// ✅ Start recognition safely
  const startRecognition = () => {
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch (error) {
        if (!error.message.includes("start")){
          console.error("Recognition error:", error);
        }
        }
      }
  // ✅ Speak function
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if(hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("")
      isSpeakingRef.current = false;
      startRecognition();
    };
    synth.speak(utterance);
  };
// ✅ Handle commands
  const handleCommand = (data) => {
    const { type, userInput, response } = data;
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
        window.open(
          `https://www.youtube.com/results?search_query=${query}`,
          "_blank"
        );
        break;
      default:
        console.log("Unknown command:", type);
    }
  };
  // ✅ Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    console.log(recognition)
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    const isRecognizingRef={current:false}

    const safeRecognition=()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        try{
          recognition.start();
          console.log("Recognition requested to start");
        } catch (err) { 
          if(err.name !== "InvalidStateError"){
            console.error("start error:", err);
          }
        }
      }
    }

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      // Restart only if not speaking
      if (!isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition()
        }, 1000); 
      }
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("")
        setUserText(transcript)
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response)
        setUserText("")
      }
    };

    // Start listening first time
    startRecognition();

    // Fallback check
    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        startRecognition();
      }
    }, 10000);

    return () => {
      recognition.stop();
      recognition.abort();
      setListening(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
    };
  }, [getGeminiResponse, userData]);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-[#001f33] to-[#004466] flex flex-col gap-[50px] justify-center items-center">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute top-[20px] right-[20px] bg-white rounded-full text-[19px] cursor-pointer hover:bg-gray-200 transition"
      >
        Log Out
      </button>

      {/* Customize Button */}
      <button
        onClick={() => navigate("/customize")}
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute top-[100px] right-[20px] bg-white rounded-full text-[19px] cursor-pointer px-[20px] py-[10px] hover:bg-gray-200 transition"
      >
        Customize your Assistant
      </button>

      {/* Assistant Card */}
      <div className="w-[300px] h-[400px] flex flex-col items-center overflow-hidden rounded-3xl shadow-lg bg-[#002233]">
        <img
          src={userData?.assistantImage || "/default-image.png"}
          alt="Assistant"
          className="w-full h-[80%] object-cover"
        />
        <h1 className="text-white text-lg font-semibold mt-4">
          I'm {userData?.assistantName || "Your Assistant"}
        </h1>
        {!aiText &&  <img src={userImg} alt="" className="w-[200px]"/>}
        {aiText &&  <img src={aiImg} alt="" className="w-[200px]"/>}
       <h1>{userText?userText:aiText?aiText:null}</h1>
      </div>
    </div>
  );
}

export default Home;