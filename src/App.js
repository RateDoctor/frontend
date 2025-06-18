import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from './components/singIn/singin.jsx';
import SignUp from './components/singUp/singup.jsx';
import Upload from './components/uploadFile/uploadfile.jsx';
import Welcome from './components/welcome/welcome.jsx';
import Logout from './components/logout/logout.jsx';
import ForgotPassword from './components/forgot-password/forgotPassword.jsx';
import AddDoctor from './components/addDoctor/addDoctor.jsx';
import CreateUniversity from './/components/createUniversity/createUniversity.jsx';
import HelpFAQ from './components/HelpFAQ/Helpfaq.jsx';
import SupervisorDrProfile from './components/supervisorDrProfile/supervisorDrProfile.jsx';
import UniversityProfile from './components/universityPage/universityPage.jsx';
import RateSupervisor from './components/rateSupervisor/ratesupervisor.jsx';
import LeaderBoard from './components/leaderboard/leaderboard.jsx';

import Explore from './components/explore/explore.jsx';
import Settings from "./pages/Settings/settings.jsx";
import ChangeEmail from './pages/changeEmail/changeEmail.jsx';
import ChangePassword from "./pages/changePassword/changePassword.jsx";
import SavedDoctors  from "./pages/savedDoctors/savedDoctors.jsx";
import ContactUs  from "./pages/contactUs/contactUs.jsx";
import MyRatings from './components/myRatings/myRatings.jsx';
import EditRating from './components/editRating/editRating.jsx';
// import SearchResults from "./components/searchBar/searchResults.jsx";



function App() {
  return (
<Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/upload" element={<Upload />} /> 
        <Route path="/welcome" element={<Welcome />} /> 
        <Route path="/logout" element={<Logout />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} /> 
        <Route path="/addDoctor" element={<AddDoctor />} /> 
        <Route path="/helpFAQ" element={<HelpFAQ />} /> 
        <Route path="/create-university" element={<CreateUniversity />} /> 
        <Route path="/supervisor-dr-profile" element={<SupervisorDrProfile />} /> 
        <Route path="/university-profile" element={<UniversityProfile />} /> 
        <Route path="/leaderboard" element={<LeaderBoard />} /> 
        <Route path="/rate-supervisor" element={<RateSupervisor />} /> 
        <Route path="/" element={<Explore />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/change-email" element={<ChangeEmail />} /> 
        <Route path="/settings/change-password" element={<ChangePassword />} />
        <Route path="/saved-doctors" element={<SavedDoctors />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/my-ratings" element={<MyRatings />} />
        <Route path="/edit-rating/:id" element={<EditRating />} />
        {/* <Route path="/results" element={<SearchResults />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
