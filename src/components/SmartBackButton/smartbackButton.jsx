import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const SmartBackButton = ({ fallback = "/" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  
const handleBack = () => {
  if (location.state?.from) {
    navigate(location.state.from);
  } else if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate("/"); // ultimate fallback
  }
};

  return <FiArrowLeft className="back-icon" onClick={handleBack} />;
};

export default SmartBackButton;
