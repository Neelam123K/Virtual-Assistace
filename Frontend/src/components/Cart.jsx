import React,{useContext} from "react";
import { UserDataContext } from "../Context/UserContext";

function Cart({ image }) {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontedImage,
    setFrontendImage,
    SelectedImage,
    setSelectedImage,
  } = useContext( UserDataContext );
  return (
    <div
      className={`w-[150px] h-[20px] lg:w-[150px] h-[250px] bg-[#03036] border-2 border-[blue] rounded-2xl overflow-hidden hower:shadow-lg hover:shadow-blue-950 cursor-pointer hover:border-4 hower: border-white ${ SelectedImage == image? "border-4 hower: border-white shadow-2xl shadow-blue-950": null }`}onClick={() => {setSelectedImage(image)
        setBackendImage(null);
        setFrontendImage(null)
      }}>
      <img src={image} className="w-full h-full object-cover " />
    </div>
  );
}

export default Cart;
