// gemini.js
import axios from 'axios';

const geminiResponse = async (command, assistantName, userName) => {
 try {
   const apiUrl = process.env.GEMINI_API_URL;
   
   if (!apiUrl) {
     throw new Error("GEMINI_API_URL not found in environment variables");
   }
   
   const prompt = `You are a virtual assistant named ${assistantName}, created by ${userName}. 
You are not Google. You behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object in this format:
{
 "type": "category_type",
 "userinput": "user's original input",
 "response": "your response text"
}

User input: "${command}"`;

   const result = await axios.post(apiUrl, {
     contents: [
       {
         parts: [{ text: prompt }]
       }
     ]
   }, {
     headers: { 
       "Content-Type": "application/json"
     },
     timeout: 10000
   });

   const responseText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text;
   return responseText;

 } catch (error) {
   console.error("Error in geminiResponse:", error.message);
   console.error("Error response:", error.response?.data);
   throw error;
 }
};

export default geminiResponse;