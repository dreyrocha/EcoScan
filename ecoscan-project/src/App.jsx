import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Header from "@/components/Header/Header.jsx";
import Footer from "@/components/Footer/Footer.jsx";
import ResiduePage from "./pages/Residue/ResiduePage.jsx";
import SobrePage from "./pages/SobrePage/SobrePage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import LivePage from "./pages/LivePage/Live.jsx"; 
import EnterpriseRegisterPage from "./pages/EnterpriseRegisterPage/EnterpriseRegisterPage.jsx";
import EnterpriseLoginPage from "./pages/EnterpriseLoginPage/EnterpriseLoginPage.jsx";
import EnterpriseDashboardPage from "./pages/EnterpriseDashboardPage/EnterpriseDashboardPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/adicionar-residuo" element={<ResiduePage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/register-enterprise" element={<EnterpriseRegisterPage />} />
          <Route path="/login-enterprise" element={<EnterpriseLoginPage />} />
          <Route path="/enterprise-dashboard" element={<EnterpriseDashboardPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;