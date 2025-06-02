import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './components/singIn/singin.jsx';
import SignUp from './components/singUp/singup.jsx';



function App() {
  return (
  <BrowserRouter>
      <SignUp />
  </BrowserRouter>
  );
}

export default App;
