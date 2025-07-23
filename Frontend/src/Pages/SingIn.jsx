import React, {useState, useContext} from 'react';
import girl from '../assets/girl.png';
import { IoIosEye} from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/userContext';
import axios from 'axios';
function SingIn(){
  const [showPassword, setShowPassword] = useState(false);
  const {value} = useContext(UserDataContext);
  const navigation = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const handleSingIn=async (e)=> {
    e.preventDefault()
    setErr("")
    setLoading(true);

    try {
      let result=await axios.post(`${value.serverUrl}/api/auth/singin`,{ 
        email,password
      },{withCredentials: true}
      );
        console.log(result.data)
        setLoading(false);
    } catch (error) {
      console.error(error);
      setErr(error.response.data.message );
    }
  }
  return (
   <div
  className="w-full h-[100vh] bg-no-repeat bg-center flex justify-center items-center"
  style={{
    backgroundImage: `url(${girl})`,
    backgroundSize: 'contain'}}>
  <form className='w-[90%] h-[600px] max-w-[500px] bg-[#0000060] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]' onSubmit={handleSingIn}>
    <h1 className='text-white text-[30px] font-semibold mb-[30px]'>Sing In to <span className='text-blue-400'> Virtual Assistance </span> </h1>
<input type="text" placeholder='Email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setEmail(e.target.value)}value={email}/>
<div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] '>
  <input type={showPassword?"text":"password"} placeholder='Password' className='w-full h-full outline-none bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setPassword(e.target.value)}value={password}/>
  {!setShowPassword && <IoIosEye className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursior-pointer' onClick={()=>setShowPassword(true)}/>}
    {!setShowPassword && <IoIosEyeOff className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white] cursior-pointer' onClick={()=>setShowPassword(false)}/>}  
</div>
{err.length>0 && <p className='text-red-500 text-[17px]'>*{err}</p>}
<button className='min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]' disabled={loading}>Sing In</button>

<p className='text-[white] text-[18px] cursor-pointer' onClick={() => {
navigation('/singup')
}}>Want to create a new account ? <span className='text-blue-900'>Sing Up</span></p>
  </form>
</div>

  );
}

export default SingIn; 