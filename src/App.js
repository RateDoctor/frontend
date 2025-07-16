import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from './layout/layout.jsx';
import SignIn from './components/singIn/singin.jsx';
import SingUp from './components/singUp/singup.jsx';
// import Upload from './components/UploadFile/UploadFile.jsx';
// import Verify from './components/verify/verify.jsx'
import Checking from './components/checking/checking.jsx';
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
import Unauthorized from "./pages/Unauthorized/Unauthorized.jsx";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import { AuthProvider } from "./utils/AuthProvider.jsx";

function App() {
  return (
<Router>
  <AuthProvider>
      <Routes>
         <Route path="/" element={<Layout />}>

         
             <Route path="/login" element={<SignIn />} />
             <Route path="/singup" element={<SingUp />} />
         
           


         <Route element={<PrivateRoutes />}>
            <Route index element={<Explore />} />
            <Route path="/checking" element={<Checking />} /> 
            {/* <Route path="/upload" element={<Upload />} />  */}
            <Route path="/welcome" element={<Welcome />} /> 
            {/* <Route path="/verify/:token" element={<Verify />} /> */}
            <Route path="/logout" element={<Logout />} /> 
            <Route path="/forgot-password" element={<ForgotPassword />} /> 
            <Route path="/addDoctor" element={<AddDoctor />} /> 
            <Route path="/helpFAQ" element={<HelpFAQ />} /> 
            <Route path="/create-university" element={<CreateUniversity />} /> 
            <Route path="/supervisor-dr-profile/:doctorId" element={<SupervisorDrProfile />} /> 
            <Route path="/university/:universityId" element={<UniversityProfile />} /> 
            <Route path="/leaderboard" element={<LeaderBoard />} /> 
            <Route path="/rate-supervisor" element={<RateSupervisor />} /> 
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/change-email" element={<ChangeEmail />} /> 
            <Route path="/settings/change-password" element={<ChangePassword />} />
            <Route path="/saved-doctors" element={<SavedDoctors />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/my-ratings/:doctorId" element={<MyRatings />} />
            <Route path="/my-ratings" element={<MyRatings />} />
            <Route path="/edit-rating/:doctorId" element={<EditRating />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* <Route path="/results" element={<SearchResults />} /> */}
          </Route>
         </Route>
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
