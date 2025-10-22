import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EnterpriseLoginPage.css';
import axios from 'axios';
import { useEnterpriseAuth } from '../../context/EnterpriseAuthContext'; 

function EnterpriseLoginPage() {
  const [cnpj, setCnpj] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { loginEnterprise } = useEnterpriseAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // --- CORREÇÃO AQUI ---
      // Agora enviamos um objeto com `cnpj` e `password`, como o backend espera.
      const response = await axios.post(`${apiUrl}/enterprise/login`, { cnpj, password });
      
      // Guarda os dados da empresa e redireciona
      loginEnterprise(response.data);
      navigate('/enterprise-dashboard');

    } catch (err) {
      console.error("Erro no login da empresa:", err);
      // A mensagem de erro do backend agora é mais precisa e será exibida
      const errorMsg = err.response?.data?.message || "CNPJ ou senha inválidos. Tente novamente.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-page">
        <div className="login-container">
          <div className="form-toggle">
            <Link to="/login" className="toggle-option">Sou Usuário</Link>
            <Link to="/login-enterprise" className="toggle-option active">Sou Empresa</Link>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login da Empresa</h2>
            <div className="input-group">
              <label htmlFor="cnpj">CNPJ</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                placeholder="Digite o CNPJ da empresa"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
  );
}

export default EnterpriseLoginPage;