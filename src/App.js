import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from './components/singIn/singin.jsx';
import SignUp from './components/singUp/singup.jsx';
import Upload from './components/uploadFile/uploadfile.jsx';
import Explore from './components/explore/explore.jsx';
import Settings from "./pages/Settings/settings.jsx";
import ChangeEmail from './pages/changeEmail/changeEmail.jsx';
import ChangePassword from "./pages/changePassword/changePassword.jsx";
import SavedDoctors  from "./pages/savedDoctors/savedDoctors.jsx";
import ContactUs  from "./pages/contactUs/contactUs.jsx";



function App() {
  return (
<Router>
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/change-email" element={<ChangeEmail />} /> 
        <Route path="/settings/change-password" element={<ChangePassword />} />
        <Route path="/saved-doctors" element={<SavedDoctors />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* <Route path="/SignIn-doctors" element={<div>Saved Doctors</div>} />
        <Route path="/SignUp" element={<div>My Ratings</div>} />
        <Route path="/Explore" element={<div>Contact Us</div>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
