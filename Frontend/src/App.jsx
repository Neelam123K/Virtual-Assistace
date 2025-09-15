import React, { useContext, useEffect } from "react";
import SignUp from "./Pages/SingUp.jsx";
import SignIn from "./Pages/SingIn.jsx";
import Customize from "./Pages/Customize.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import { UserDataContext } from "./Context/UserContext.jsx";
import Home from "./Pages/Home.jsx";
import Customize2 from "./Pages/Customize2.jsx";

function App() {
  const { userData } = useContext(UserDataContext);

  useEffect(() => {
    console.log("user Data", userData);
  }, [userData]);

  return (
     <div>
      <Routes>
        <Route
          path="/"
          element={(userData?.assistantImage && userData?.assistantName) ? <Home /> : <Navigate to={"/customize"}/>}/>
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to={"/"}/>}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to={"/"} />}
        />
        <Route
          path="/customize"
          element={userData ? <Customize /> : <Navigate to={"/signup"} />}
        />
        <Route
          path="/customize2"
          element={userData ? <Customize2 /> : <Navigate to={"/signup"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
