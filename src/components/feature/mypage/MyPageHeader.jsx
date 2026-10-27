import { useNavigate } from "react-router-dom";
import AppHeader from "../../common/AppHeader";

const MyPageHeader = ({ onBack, title = "마이페이지", titleClassName = "text-display" }) => {
  const navigate = useNavigate();
  return (
    <AppHeader title={title} titleClassName={titleClassName} onBack={onBack} onLogoClick={() => navigate("/home")} />
  );
};

export default MyPageHeader;
