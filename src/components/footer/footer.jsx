import { FiSearch, FiInfo } from "react-icons/fi";
import { TbChartBar } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLeaderboard = location.pathname.includes("leaderboard");
  const isHelp = location.pathname.includes("helpFAQ") || location.pathname.includes("faq");
  const isExplore = !isLeaderboard && !isHelp; // Everything else highlights search

  return (
    <footer className="footer">
      <FiSearch
        className={`iconFooter ${isExplore ? "active" : ""}`}
        onClick={() => navigate("/")}
      />
      {/* <TbChartBar
        className={`iconFooter ${isLeaderboard ? "active" : ""}`}
        onClick={() => navigate("/leaderboard")}
      /> */}
      <FiInfo
        className={`iconFooter ${isHelp ? "active" : ""}`}
        onClick={() => navigate("/helpFAQ")}
      />
    </footer>
  );
};

export default Footer;
