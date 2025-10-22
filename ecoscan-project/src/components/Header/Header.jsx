import { useState } from 'react';
import './Header.css';
import logoImage from '@/assets/images/Logo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContex.jsx';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext.jsx';
import { FaUserCircle } from 'react-icons/fa';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal.jsx';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { enterprise, logoutEnterprise } = useEnterpriseAuth();

  
  const logoLinkPath = enterprise ? "/enterprise-dashboard" : "/";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const confirmLogout = () => {
    if (user) logout();
    if (enterprise) logoutEnterprise();
    setIsModalOpen(false);
    if (isMenuOpen) toggleMenu(); 
  };

  return (
    <>
      <header className="header">
        <div className="container headerContent">
          {/* Link do logo agora é dinâmico */}
          <Link to={logoLinkPath} className="logo">
            <img src={logoImage} alt="Logo do site" />
          </Link>

          <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Abrir menu" aria-expanded={isMenuOpen}>
            <div className="line" />
            <div className="line" />
            <div className="line" />
          </button>

          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <ul className="navList">
              {user ? (
                <>
                  <li><Link to="/sobre" onClick={toggleMenu}>Sobre</Link></li>
                  <li><Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link></li>
                  <li className="user-profile">
                    <FaUserCircle className="user-icon" />
                    <span className="user-name">{user.name}</span>
                  </li>
                  <li><button onClick={handleLogoutClick} className="logout-button">Sair</button></li>
                </>
              ) : enterprise ? (
                <>
                  <li><Link to="/sobre" onClick={toggleMenu}>Sobre</Link></li>
                  <li><Link to="/enterprise-dashboard" onClick={toggleMenu}>Painel</Link></li>
                  <li className="user-profile">
                    <FaUserCircle className="user-icon" />
                    {/* --- CORREÇÃO DO NOME DA EMPRESA --- */}
                    <span className="user-name">{enterprise.nameEnterprise}</span>
                  </li>
                  <li><button onClick={handleLogoutClick} className="logout-button">Sair</button></li>
                </>
              ) : (
                <>
                  <li><Link to="/sobre" onClick={toggleMenu}>Sobre</Link></li>
                  <li><Link to="/register" onClick={toggleMenu}>Cadastre-se</Link></li>
                  <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmLogout}
        message="Tem certeza que deseja sair?"
      />
    </>
  );
}

export default Header;