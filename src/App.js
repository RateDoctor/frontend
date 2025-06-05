import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './components/singIn/singin.jsx';
import SignUp from './components/singUp/singup.jsx';
import Upload from './components/uploadFile/uploadfile.jsx';
import Explore from './components/explore/explore.jsx';



function App() {
  return (
  <BrowserRouter>
      {/* <SignUp /> */}
      {/* <SignIn/> */}
      {/* <Upload/> */}
      <Explore/>


  </BrowserRouter>
  );
}

export default App;
