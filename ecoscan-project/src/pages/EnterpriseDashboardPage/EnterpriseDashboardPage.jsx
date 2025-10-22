import React, { useState, useEffect } from 'react';
import { useEnterpriseAuth } from '../../context/EnterpriseAuthContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './EnterpriseDashboardPage.css';
import { FaTrash } from 'react-icons/fa';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal.jsx';
import DoughnutChart from '../../components/DoughnutChart/DoughnutChart.jsx';

const wasteTypes = ["Plástico", "Papel", "Vidro", "Metal", "Eletrônico", "Orgânico"];
const wasteTypeColors = {
  'Plástico': 'rgba(236, 112, 99, 0.8)',
  'Papel': 'rgba(93, 173, 226, 0.8)',
  'Vidro': 'rgba(88, 214, 141, 0.8)',
  'Metal': 'rgba(244, 208, 63, 0.8)',
  'Eletrônico': 'rgba(230, 126, 34, 0.8)',
  'Orgânico': 'rgba(175, 96, 26, 0.8)',
};

function EnterpriseDashboardPage() {
  const { enterprise } = useEnterpriseAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const [collections, setCollections] = useState([]);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [wasteType, setWasteType] = useState(wasteTypes[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (enterprise) {
      const fetchCollections = async () => {
        try {
          const response = await axios.get(`${apiUrl}/collections/${enterprise.idEnterprise}`);
          setCollections(response.data);
        } catch (err) {
          setError("Não foi possível carregar o histórico.");
        }
      };
      fetchCollections();
    }
  }, [enterprise, apiUrl]);

  useEffect(() => {
    if (collections.length > 0) {
      const totals = collections.reduce((acc, collection) => {
        const amount = parseFloat(collection.amount_collected_kg);
        acc[collection.waste_type] = (acc[collection.waste_type] || 0) + amount;
        return acc;
      }, {});

      const labels = Object.keys(totals);
      const data = Object.values(totals);
      const backgroundColors = labels.map(label => wasteTypeColors[label] || '#95a5a6');

      setChartData({
        labels,
        datasets: [{
          label: ' kg Coletados',
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        }]
      });
    } else {
        setChartData({ labels: [], datasets: [] });
    }
  }, [collections]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const handleSubmitCollection = async (e) => {
    e.preventDefault();
    if (!amount || !date || !wasteType) { setError("Por favor, preencha todos os campos."); return; }
    setLoading(true); setError('');
    try {
      const newCollectionData = {
        id_enterprise: enterprise.idEnterprise,
        amount_collected_kg: parseFloat(amount),
        collection_date: date,
        waste_type: wasteType,
      };
      const response = await axios.post(`${apiUrl}/collections`, newCollectionData);
      setCollections([response.data, ...collections].sort((a, b) => new Date(b.collection_date) - new Date(a.collection_date)));
      setAmount('');
    } catch (err) {
      setError("Falha ao registar a coleta. Tente novamente.");
    } finally { setLoading(false); }
  };

  const handleOpenDeleteModal = (collectionId) => {
    setCollectionToDelete(collectionId);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteCollection = async () => {
    if (!collectionToDelete) return;
    try {
      await axios.delete(`${apiUrl}/collections/${collectionToDelete}`);
      setCollections(collections.filter(col => col.id_collection !== collectionToDelete));
    } catch (err) {
      setError("Falha ao excluir o registo. Tente novamente.");
    } finally {
      setIsConfirmModalOpen(false);
      setCollectionToDelete(null);
    }
  };

  if (!enterprise) {
    return <Navigate to="/login-enterprise" />;
  }

  return (
    <>
      <div className="enterprise-dashboard-page">
        <h1 className="page-title">Painel da Empresa</h1>
        <div className="dashboard-columns">
          <div className="profile-column">
            <div className="profile-card">
              <div className="profile-header">
                <h2>{enterprise.nameEnterprise}</h2> 
              </div>
              <div className="profile-body">
                <div className="profile-item">
                  <span className="profile-item-label">CNPJ</span>
                  <span className="profile-item-value">{enterprise.cnpj}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-item-label">Principal Resíduo Coletado</span>
                  <span className="profile-item-value">{enterprise.wasteType}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-item-label">Endereço (Localização)</span>
                  <span className="profile-item-value">{enterprise.address}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-item-label">Email de Contato</span>
                  <span className="profile-item-value">{enterprise.contactEmail || 'Não informado'}</span>
                </div>
              </div>
            </div>

            {/* --- GRÁFICO MOVIDO PARA A COLUNA ESQUERDA --- */}
            {collections.length > 0 && (
              <div className="chart-section">
                <h3>Resumo de Coletas</h3>
                <DoughnutChart chartData={chartData} />
              </div>
            )}
          </div>

          <div className="collection-column">
            <div className="collection-manager">
              <div className="form-section">
                <h3>Adicionar Nova Coleta</h3>
                <form onSubmit={handleSubmitCollection} className="collection-form">
                  <div className="form-group">
                    <label htmlFor="wasteType">Tipo de Resíduo</label>
                    <select id="wasteType" value={wasteType} onChange={(e) => setWasteType(e.target.value)} required>
                        {wasteTypes.map(type => (<option key={type} value={type}>{type}</option>))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="amount">Quantidade Coletada (kg)</label>
                    <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Ex: 50.5" step="0.1" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Data da Coleta</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  {error && <p className="form-error-collection">{error}</p>}
                  <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'A Adicionar...' : 'Adicionar Registo'}
                  </button>
                </form>
              </div>

              <div className="collection-history">
                <h4>Histórico de Coletas</h4>
                {collections.length > 0 ? (
                  <ul className="collection-list">
                    {collections.map(col => (
                      <li key={col.id_collection} className="collection-item">
                        <div className="collection-info">
                          <span>{col.waste_type}</span>
                          <span className="collection-details">Data: {formatDate(col.collection_date)} - {col.amount_collected_kg} kg</span>
                        </div>
                        <button onClick={() => handleOpenDeleteModal(col.id_collection)} className="delete-button"><FaTrash /></button>
                      </li>
                    ))}
                  </ul>
                ) : (<p className="no-collections">Nenhum registo de coleta encontrado.</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteCollection}
        message="Tem certeza que deseja excluir este registo?"
      />
    </>
  );
}

export default EnterpriseDashboardPage;