import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContex.jsx";
import "./DashboardPage.css";
import { FaRecycle, FaShoppingBag, FaWineBottle, FaCog, FaHistory, FaLeaf, FaBuilding } from "react-icons/fa";
import DynamicTipCard from "../../components/DynamicTipCard/DynamicTipCard.jsx";
import DoughnutChart from "../../components/DoughnutChart/DoughnutChart.jsx";

const dashboardConfig = {
  'Papel': { icon: <FaRecycle />, colorClass: 'card-color-azul' },
  'Plástico': { icon: <FaShoppingBag />, colorClass: 'card-color-vermelho' },
  'Vidro': { icon: <FaWineBottle />, colorClass: 'card-color-verde' },
  'Metal': { icon: <FaCog />, colorClass: 'card-color-amarelo' },
  'Eletrônico': { icon: <FaCog />, colorClass: 'card-color-laranja' },
  'Orgânico': { icon: <FaLeaf />, colorClass: 'card-color-marrom' },
};

const wasteTypeColors = {
  'Plástico': 'rgba(236, 112, 99, 0.8)',
  'Papel': 'rgba(93, 173, 226, 0.8)',
  'Vidro': 'rgba(88, 214, 141, 0.8)',
  'Metal': 'rgba(244, 208, 63, 0.8)',
  'Eletrônico': 'rgba(230, 126, 34, 0.8)',
  'Orgânico': 'rgba(175, 96, 26, 0.8)',
};

const dashboardItemsOrder = ["Papel", "Plástico", "Vidro", "Metal", "Eletrônico", "Orgânico"];

const DASHBOARD_INFO = {
  'Plástico': { tip: 'Lave as embalagens para remover restos de alimentos e amasse-as para economizar espaço.', binColorName: 'Vermelho', binColorHex: '#e74c3c' },
  'Papel': { tip: 'Mantenha os papéis secos e limpos. Evite amassar, apenas dobre para facilitar a triagem.', binColorName: 'Azul', binColorHex: '#3498db' },
  'Papelão': { tip: 'Desmonte as caixas de papelão para otimizar o espaço na coleta seletiva.', binColorName: 'Azul', binColorHex: '#3498db' },
  'Vidro': { tip: 'Lave os potes e garrafas. Se estiverem quebrados, embale-os em jornal para proteger os coletores.', binColorName: 'Verde', binColorHex: '#2ecc71' },
  'Metal': { tip: 'Latas de alumínio e aço são altamente recicláveis. Lave-as e amasse-as se possível.', binColorName: 'Amarelo', binColorHex: '#f1c40f' },
  'Orgânico': { tip: 'Restos de alimentos podem virar um adubo rico em nutrientes para suas plantas através da compostagem.', binColorName: 'Marrom', binColorHex: '#964B00' },
  'Eletrônico': { tip: 'Nunca descarte no lixo comum! Procure pontos de coleta específicos ou locais de devolução.', binColorName: 'Laranja', binColorHex: '#f39c12' },
};

function DashboardPage() {
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materialCounts, setMaterialCounts] = useState({});
  const [topMaterial, setTopMaterial] = useState(null);
  const [foundEnterprises, setFoundEnterprises] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          const response = await axios.get(`${apiUrl}/history`, { withCredentials: true });
          setHistory(response.data);
        } catch (error) {
          setError("Não foi possível carregar o seu histórico.");
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [user, apiUrl]);

  useEffect(() => {
    if (history.length > 0) {
      const categoryGroupMap = { 'Biodegradável': 'Orgânico', 'Papelão': 'Papel' };
      const counts = history.reduce((acc, item) => {
        const material = categoryGroupMap[item.material_type] || item.material_type;
        acc[material] = (acc[material] || 0) + 1;
        return acc;
      }, {});
      setMaterialCounts(counts);
      if (Object.keys(counts).length > 0) {
        const top = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        setTopMaterial(top);
      } else {
        setTopMaterial(null);
      }
    } else {
      setMaterialCounts({});
      setTopMaterial(null);
    }
  }, [history]); 

  useEffect(() => {
    const fetchEnterprises = async () => {
        if (topMaterial && topMaterial !== 'Rejeito') {
            try {
                const response = await axios.get(`${apiUrl}/enterprise/search?type=${topMaterial}`);
                setFoundEnterprises(response.data);
            } catch (err) {
                setFoundEnterprises([]);
            }
        } else {
            setFoundEnterprises([]);
        }
    };
    fetchEnterprises();
  }, [topMaterial, apiUrl]);

  useEffect(() => {
    const counts = materialCounts;
    if (Object.keys(counts).length > 0) {
      const labels = Object.keys(counts);
      const data = Object.values(counts);
      const backgroundColors = labels.map(label => wasteTypeColors[label] || '#95a5a6');
      setChartData({
        labels,
        datasets: [{
          label: ' Scans',
          data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        }]
      });
    } else {
      setChartData({ labels: [], datasets: [] });
    }
  }, [materialCounts]);

  const tipInfo = topMaterial ? DASHBOARD_INFO[topMaterial] : null;

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Seu Dashboard</h1>
      <DynamicTipCard
        material={topMaterial}
        tip={tipInfo?.tip}
        binInfo={tipInfo ? { name: tipInfo.binColorName, color: tipInfo.binColorHex } : null}
      />
      <div className="dashboard-layout">
        <div className="left-column">
          <div className="dashboard-grid">
            {dashboardItemsOrder.map((itemTitle) => {
              const config = dashboardConfig[itemTitle];
              const count = materialCounts[itemTitle] || 0;
              return (
                <div key={itemTitle} className={`category-card ${config.colorClass}`}>
                  <div className="card-icon">{config.icon}</div>
                  <p className="card-title">{itemTitle}</p>
                  <div className="card-count-container">
                    <span className="card-count-label">Scans:</span>
                    <span className="card-count-value">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {history.length > 0 && (
            <div className="chart-section">
              <h3>Resumo de Scans</h3>
              {/* --- CORREÇÃO AQUI --- */}
              <DoughnutChart chartData={chartData} unit="Scans" />
            </div>
          )}
        </div>
        <div className="right-column">
          {foundEnterprises.length > 0 && (
            <div className="enterprise-list-section">
                <h2 className="enterprise-list-title">
                    <FaBuilding /> Pontos de Coleta de {topMaterial}
                </h2>
                <ul className="enterprise-list">
                    {foundEnterprises.map(enterprise => (
                        <li key={enterprise.idEnterprise} className="enterprise-list-item">
                            <span className="enterprise-name">{enterprise.nameEnterprise}</span>
                            <span className="enterprise-address">{enterprise.address}</span>
                            <span className="enterprise-contact">Contato: {enterprise.contactEmail || 'Não informado'}</span>
                        </li>
                    ))}
                </ul>
            </div>
          )}
          <div className="history-section">
            <h2 className="history-title">
              <FaHistory /> Histórico de Scans
            </h2>
            {loading && <p>Carregando histórico...</p>}
            {error && <p className="history-error">{error}</p>}
            {!loading && !error && (
              history.length > 0 ? (
                <ul className="history-list">
                  {history.map((item) => (
                    <li key={item.id_scan} className="history-item">
                      <span className="history-material">{item.material_type}</span>
                      <span className="history-date">
                        {(() => {
                          const date = new Date(item.scanned_at.replace(' ', 'T'));
                          return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleString('pt-BR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          });
                        })()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="history-empty">Nenhum scan encontrado. Inicie sessão para ver o seu histórico!</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;