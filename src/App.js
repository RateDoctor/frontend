import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import SignIn from './components/singIn/singin.jsx';


function App() {
  return (
  <BrowserRouter>
      <SignIn />
  </BrowserRouter>
  );
}

export default App;
