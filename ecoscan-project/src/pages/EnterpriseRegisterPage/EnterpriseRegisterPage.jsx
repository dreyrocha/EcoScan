import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./EnterpriseRegisterPage.css";
import axios from "axios";
import SuccessModal from "../../components/SuccessModal/SuccessModal.jsx"; 

function EnterpriseRegisterPage() {
  const [formData, setFormData] = useState({
    nameEnterprise: "",
    cnpj: "",
    password: "", // O estado para a senha
    address: "",
    contactEmail: "",
    contactPhone: "",
    wasteType: "Plástico",
  });
  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    if (formData.password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await axios.post(`${apiUrl}/enterprise`, formData);
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error("Erro no cadastro da empresa:", err);
      const errorMsg = err.response?.data?.message || "Não foi possível realizar o cadastro. Tente novamente.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/login-enterprise');
  };

  return (
    <>
      <div className="register-page">
        <div className="register-container">
          <div className="form-toggle">
            <Link to="/register" className="toggle-option">Sou Usuário</Link>
            <Link to="/register-enterprise" className="toggle-option active">Sou Empresa</Link>
          </div>
          <form className="register-form" onSubmit={handleSubmit}>
            <h2>Crie sua Conta de Empresa</h2>

            <div className="input-group">
              <label htmlFor="nameEnterprise">Nome da Empresa</label>
              <input type="text" id="nameEnterprise" name="nameEnterprise" placeholder="Digite o nome da sua empresa" value={formData.nameEnterprise} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="cnpj">CNPJ</label>
              <input type="text" id="cnpj" name="cnpj" placeholder="Digite o CNPJ" value={formData.cnpj} onChange={handleChange} required />
            </div>

            {/* --- CAMPOS DE SENHA ADICIONADOS AO FORMULÁRIO --- */}
            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Crie uma senha (mín. 6 caracteres)" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirme sua Senha</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                placeholder="Digite a senha novamente" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
            {/* --- FIM DOS CAMPOS DE SENHA --- */}

            <div className="input-group">
              <label htmlFor="address">Endereço</label>
              <input type="text" id="address" name="address" placeholder="Rua, Número, Bairro, Cidade" value={formData.address} onChange={handleChange} required />
            </div>
            
            <div className="input-group">
              <label htmlFor="wasteType">Principal Tipo de Resíduo Coletado</label>
              <select id="wasteType" name="wasteType" value={formData.wasteType} onChange={handleChange} required>
                <option value="Plástico">Plástico</option>
                <option value="Papel">Papel</option>
                <option value="Vidro">Vidro</option>
                <option value="Metal">Metal</option>
                <option value="Eletrônico">Eletrônico</option>
                <option value="Orgânico">Orgânico</option>
                <option value="Todos">Todos os Tipos</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="contactEmail">Email de Contato</label>
              <input type="email" id="contactEmail" name="contactEmail" placeholder="Digite o email de contato" value={formData.contactEmail} onChange={handleChange} />
            </div>

            {error && <p className="form-error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar Empresa'}
            </button>
          </form>
        </div>
      </div>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        title="Cadastro Realizado!"
        message="Sua conta de empresa foi criada com sucesso."
      />
    </>
  );
}

export default EnterpriseRegisterPage;