import { Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Home from "./pages/Home";
import MyPage from "./pages/mypage/MyPage";
import Profile from "./pages/mypage/Profile";
//auth
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
//onboarding
import Nickname from "./pages/onboarding/Nickname";
import Consent from "./pages/onboarding/Consent";
import KakaoCallbackPage from "./pages/auth/KakaoCallbackPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage/profile" element={<Profile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth/kakao/callback" element={<KakaoCallbackPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/onboarding/nickname" element={<Nickname />} />
      <Route path="/onboarding/consent" element={<Consent />} />
    </Routes>
  );
}

export default App;
