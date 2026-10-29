import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicOnlyRoute from "./components/common/PublicOnlyRoute";

import Splash from "./pages/Splash";
import Home from "./pages/Home";
import MyPage from "./pages/mypage/MyPage";
import Profile from "./pages/mypage/Profile";
import Notifications from "./pages/mypage/Notifications";
import Payments from "./pages/mypage/Payments";
import CreditCharge from "./pages/payments/CreditCharge";
import CreditChargeSuccess from "./pages/payments/CreditChargeSuccess";
import CreditChargeFailure from "./pages/payments/CreditChargeFailure";
import PurchaseHistoryPage from "./pages/mypage/PurchaseHistoryPage";
import Recordings from "./pages/mypage/Recordings";
import SavedConversations from "./pages/mypage/SavedConversations";
import ReportArchive from "./pages/mypage/ReportArchive";
import Account from "./pages/mypage/Account";
import Support from "./pages/mypage/Support";
import Contact from "./pages/mypage/Contact";
import Policies from "./pages/mypage/Policies";
import ServiceTerms from "./pages/mypage/ServiceTerms";
import PersonalInformationConsent from "./pages/mypage/PersonalInformationConsent";
import VoiceInformationConsent from "./pages/mypage/VoiceInformationConsent";
import PrivacyPolicy from "./pages/mypage/PrivacyPolicy";
import PaymentRefundPolicy from "./pages/mypage/PaymentRefundPolicy";
import RecordingAnalysisGuide from "./pages/mypage/RecordingAnalysisGuide";
import Faq from "./pages/mypage/Faq";
import FaqRecording from "./pages/mypage/FaqRecording";
import FaqService from "./pages/mypage/FaqService";
import FaqPayment from "./pages/mypage/FaqPayment";
import FaqAccount from "./pages/mypage/FaqAccount";
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
import AnalysisRecord from "./pages/analysis/AnalysisRecord";
import AnalysisType from "./pages/analysis/AnalysisType";
import AnalysisRelation from "./pages/analysis/AnalysisRelation";
import AnalysisLoading from "./pages/analysis/AnalysisLoading";
import AnalysisSpeaker from "./pages/analysis/AnalysisSpeaker";
//report
import ReportPage from "./pages/report/ReportPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />

        <Route path="/analysis" element={<AnalysisStart />} />
        <Route path="/analysis/record" element={<AnalysisRecord />} />
        <Route path="/analysis/type" element={<AnalysisType />} />
        <Route path="/analysis/relation" element={<AnalysisRelation />} />
        <Route path="/analysis/loading" element={<AnalysisLoading />} />
        <Route path="/analysis/speaker" element={<AnalysisSpeaker />} />

        <Route path="/report/:reportId" element={<ReportPage />} />

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
        <Route path="/mypage/recordings/reports" element={<ReportArchive />} />
        <Route path="/mypage/account" element={<Account />} />
        <Route path="/mypage/support" element={<Support />} />
        <Route path="/mypage/support/contact" element={<Contact />} />
        <Route path="/mypage/support/policies" element={<Policies />} />
        <Route
          path="/mypage/support/policies/terms"
          element={<ServiceTerms />}
        />
        <Route
          path="/mypage/support/policies/personal-information"
          element={<PersonalInformationConsent />}
        />
        <Route
          path="/mypage/support/policies/voice-information"
          element={<VoiceInformationConsent />}
        />
        <Route
          path="/mypage/support/policies/privacy"
          element={<PrivacyPolicy />}
        />
        <Route
          path="/mypage/support/policies/payment-refund"
          element={<PaymentRefundPolicy />}
        />
        <Route
          path="/mypage/support/policies/recording-analysis"
          element={<RecordingAnalysisGuide />}
        />
        <Route path="/mypage/support/faq" element={<Faq />} />
        <Route
          path="/mypage/support/faq/recording"
          element={<FaqRecording />}
        />
        <Route path="/mypage/support/faq/service" element={<FaqService />} />
        <Route path="/mypage/support/faq/payment" element={<FaqPayment />} />
        <Route path="/mypage/support/faq/account" element={<FaqAccount />} />
        <Route path="/payments" element={<CreditCharge />} />
        <Route path="/payments/success" element={<CreditChargeSuccess />} />
        <Route path="/payments/failure" element={<CreditChargeFailure />} />
        <Route path="/payments/fail" element={<CreditChargeFailure />} />
      </Route>

      <Route path="/oauth/kakao/callback" element={<KakaoCallbackPage />} />
      <Route path="/oauth/google/callback" element={<GoogleCallbackPage />} />
      <Route element={<PublicOnlyRoute />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />
      </Route>

      <Route path="/onboarding/nickname" element={<Nickname />} />
      <Route path="/onboarding/consent" element={<Consent />} />
      <Route path="/onboarding/voice" element={<VoiceRegister />} />
    </Routes>
  );
}

export default App;
