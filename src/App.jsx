import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Splash from "./pages/Splash";
import Home from "./pages/Home";
import MyPage from "./pages/mypage/MyPage";
import Profile from "./pages/mypage/Profile";
import Notifications from "./pages/mypage/Notifications";
import Payments from "./pages/mypage/Payments";
import CreditCharge from "./pages/payments/CreditCharge";
import PurchaseHistoryPage from "./pages/mypage/PurchaseHistoryPage";
import Recordings from "./pages/mypage/Recordings";
import SavedConversations from "./pages/mypage/SavedConversations";
import Account from "./pages/mypage/Account";
import Support from "./pages/mypage/Support";
//auth
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
//onboarding
import Nickname from "./pages/onboarding/Nickname";
import Consent from "./pages/onboarding/Consent";
import VoiceRegister from "./pages/onboarding/VoiceRegister";
import KakaoCallbackPage from "./pages/auth/KakaoCallbackPage";
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage";
//analysis
import AnalysisStart from "./pages/analysis/AnalysisStart";
import AnalysisPartner from "./pages/analysis/AnalysisPartner";
import AnalysisRecord from "./pages/analysis/AnalysisRecord";
import AnalysisType from "./pages/analysis/AnalysisType";
import AnalysisRelation from "./pages/analysis/AnalysisRelation";
import AnalysisLoading from "./pages/analysis/AnalysisLoading";
import AnalysisSpeaker from "./pages/analysis/AnalysisSpeaker";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/profile" element={<Profile />} />

        <Route path="/mypage/notifications" element={<Notifications />} />
        <Route path="/mypage/payments" element={<Payments />} />
        <Route
          path="/mypage/payments/history"
          element={<PurchaseHistoryPage />}
        />
        <Route path="/mypage/recordings" element={<Recordings />} />
        <Route
          path="/mypage/recordings/conversations"
          element={<SavedConversations />}
        />
        <Route path="/mypage/account" element={<Account />} />
        <Route path="/mypage/support" element={<Support />} />
        <Route path="/payments" element={<CreditCharge />} />
      </Route>

      <Route path="/oauth/kakao/callback" element={<KakaoCallbackPage />} />
      <Route path="/oauth/google/callback" element={<GoogleCallbackPage />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />

      <Route path="/onboarding/nickname" element={<Nickname />} />
      <Route path="/onboarding/consent" element={<Consent />} />
      <Route path="/onboarding/voice" element={<VoiceRegister />} />

      <Route path="/analysis" element={<AnalysisStart />} />
      <Route path="/analysis/partner" element={<AnalysisPartner />} />
      <Route path="/analysis/record" element={<AnalysisRecord />} />
      <Route path="/analysis/type" element={<AnalysisType />} />
      <Route path="/analysis/relation" element={<AnalysisRelation />} />
      <Route path="/analysis/loading" element={<AnalysisLoading />} />
      <Route path="/analysis/speaker" element={<AnalysisSpeaker />} />
    </Routes>
  );
}

export default App;
