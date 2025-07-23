import React from 'react';
import SignUp from './Pages/SingUp.jsx';
import SignIn from './Pages/SingIn.jsx';

import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Routes>
        <Route path='/singup' element={<SignUp/>}/>
        <Route path='/singin' element={<SignIn/>}/>
      </Routes>
    </div>
  );
}

export default App;
