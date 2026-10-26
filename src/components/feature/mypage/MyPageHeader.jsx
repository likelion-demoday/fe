import AppHeader from "../../common/AppHeader";

const MyPageHeader = ({ onBack, title = "마이페이지", titleClassName = "text-display" }) => {
  return (
    <AppHeader title={title} titleClassName={titleClassName} onBack={onBack} />
  );
};

export default MyPageHeader;
