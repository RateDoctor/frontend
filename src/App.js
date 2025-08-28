import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from './layouts/layout.jsx';
import SignIn from './components/singIn/singin.jsx';
import SingUp from './components/singUp/singup.jsx';
// import Upload from './components/UploadFile/UploadFile.jsx';
// import Verify from './components/verify/verify.jsx'
import RequestAdminAccess from './components/RequestAdminAccess/RequestAdminAccess.jsx';
import Checking from './components/checking/checking.jsx';
import Welcome from './components/welcome/welcome.jsx';
import Logout from './components/logout/logout.jsx';
import ForgotPassword from './components/forgot-password/forgotPassword.jsx';
import ResetPassword from './components/ResetPassword/ResetPassword.jsx'
import AddDoctor from './components/addDoctor/addDoctor.jsx';
import CreateUniversity from './/components/createUniversity/createUniversity.jsx';
import HelpFAQ from './components/HelpFAQ/Helpfaq.jsx';
import AdminDrProfile from './components/adminDrProfile/adminDrProfile.jsx';
import UniversityProfile from './components/universityPage/universityPage.jsx';
import RateAdmins from './components/rateAdmin/rateAdmin.jsx';
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
import TermsFr from "./pages/terms/terms.js";
// DASHBOARD COMPONENTS

import PrivateRoutes from "./utils/PrivateRoutes.jsx";
// import AdminRoute from "./utils/AdminRoute.jsx";
import DashboardLayout from "./layouts/dashLayout/DashboardLayout.jsx";

import UsersPage from "./pages/Dashboard/UsersPage.jsx";
import AdminsPage from "./pages/Dashboard/AdminsPage.jsx";
import University from "./pages/Dashboard/UniversityPage.jsx";
import Feedback from "./pages/Dashboard/DoctorFeedbackPage.jsx";
import Doctor from "./pages/Dashboard/DoctorsPage.jsx";  
import { AuthProvider } from "./utils/AuthProvider.jsx";

function App() {
  return (
<Router>
  <AuthProvider>
      <Routes>
         <Route path="/" element={<Layout />}>
             {/* Public */}
             <Route index element={<Explore />} />
             <Route path="/university/:universityId" element={<UniversityProfile />} /> 
             <Route path="/login" element={<SignIn />} />
             <Route path="/singup" element={<SingUp />} />
             <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route path="/reset-password/:token" element={<ResetPassword />} />
             <Route path="/unauthorized" element={<Unauthorized />} />
             <Route path="/terms" element={<TermsFr />} />
              

      
         <Route element={<PrivateRoutes />}>
            <Route path="/checking" element={<Checking />} /> 
            {/* <Route path="/upload" element={<Upload />} />  */}
            <Route path="/welcome" element={<Welcome />} /> 
            <Route path="/welcome/:token" element={<Welcome />} />
            <Route path="/logout" element={<Logout />} /> 
            <Route path="/forgot-password" element={<ForgotPassword />} /> 
            <Route path="/addDoctor" element={<AddDoctor />} /> 
            <Route path="/helpFAQ" element={<HelpFAQ />} /> 
            <Route path="/create-university" element={<CreateUniversity />} /> 
            <Route path="/admin-dr-profile/:doctorId" element={<AdminDrProfile />} />
            <Route path="/request-admin-access" element={<RequestAdminAccess />} /> 
            <Route path="/leaderboard" element={<LeaderBoard />} /> 
            <Route path="/rate-admin" element={<RateAdmins />} /> 
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/change-email" element={<ChangeEmail />} /> 
            <Route path="/settings/change-password" element={<ChangePassword />} />
            <Route path="/saved-doctors" element={<SavedDoctors />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/my-ratings/:doctorId" element={<MyRatings />} />
            <Route path="/my-ratings" element={<MyRatings />} />
            <Route path="/edit-rating/:doctorId" element={<EditRating />} />

              {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="/dashboard/doctors" element={<Doctor />} />
              <Route path="/dashboard/universities" element={<University />} />
              <Route path="/dashboard/feedbacks" element={<Feedback />} />
              <Route path="/dashboard/admins" element={<AdminsPage />} />
              <Route path="/dashboard/users" element={<UsersPage />} />
            </Route>


            {/* <Route path="/results" element={<SearchResults />} /> */}
          </Route>
         </Route>
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
