import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ButtonPrimary from "@/components/Button/ButtonPrimary.jsx";
import ButtonSecondary from "@/components/Button/ButtonSecondary.jsx";
import "./Residue.css";
import imageCompression from 'browser-image-compression';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../../context/AuthContex.jsx";
import AuthRedirectModal from '../../components/AuthRedirectModal/AuthRedirectModal.jsx';
import MaterialSelectionModal from '../../components/MaterialSelectionModal/MaterialSelectionModal.jsx';

const MATERIAL_INFO = {
  'Plástico': { color: 'Vermelho', mensagem: 'Lave as embalagens para remover restos de alimentos. Tampas podem ser recicladas junto com as garrafas.' },
  'Papel': { color: 'Azul', mensagem: 'Papéis e papelões devem estar secos e limpos. Evite amassar, apenas dobre.' },
  'Vidro': { color: 'Verde', mensagem: 'O vidro é 100% reciclável! Lave os potes e garrafas. Se estiverem quebrados, embale-os em jornal para proteger os coletores.' },
  'Metal': { color: 'Amarelo', mensagem: 'Latas de alumínio e aço são altamente recicláveis. Lave as latas de alimentos e amasse-as.' },
  'Orgânico': { color: 'Marrom', mensagem: 'Restos de frutas, cascas e vegetais podem virar adubo através da compostagem.' },
  'Eletrônico': { color: 'Laranja', nomeLixeira: 'Resíduos Perigosos', mensagem: 'NUNCA descarte no lixo comum! Procure pontos de coleta específicos para resíduos perigosos.' },
  'Rejeito': { color: 'Cinza', mensagem: 'Este resíduo é considerado rejeito. Descarte no lixo comum.' }
};
const OBJECT_TO_MATERIALS_MAP = {
    'bottle': ["Plástico", "Vidro", "Metal"], 'cup': ["Plástico", "Vidro"], 'wine glass': ["Vidro"], 'fork': ["Metal", "Plástico"],
    'knife': ["Metal", "Plástico"], 'spoon': ["Metal", "Plástico"], 'bowl': ["Vidro", "Plástico"], 'vase': ["Vidro", "Plástico"],
    'book': ["Papel"], 'scissors': ["Metal"], 'tv': ["Eletrônico"], 'laptop': ["Eletrônico"], 'mouse': ["Eletrônico"],
    'remote': ["Eletrônico"], 'keyboard': ["Eletrônico"], 'cell phone': ["Eletrônico"], 'microwave': ["Eletrônico"],
    'toaster': ["Eletrônico"], 'clock': ["Eletrônico"], 'hair drier': ["Eletrônico"], 'banana': ["Orgânico"], 'apple': ["Orgânico"],
    'orange': ["Orgânico"], 'backpack': ["Rejeito"], 'trash': ["Rejeito"]
};
const traducaoClasses = {
    'bottle': 'Garrafa', 'wine glass': 'Taça de Vinho', 'cup': 'Copo', 'fork': 'Garfo', 'knife': 'Faca', 'spoon': 'Colher',
    'bowl': 'Tigela', 'vase': 'Vaso', 'book': 'Livro', 'scissors': 'Tesoura', 'tv': 'Televisão', 'laptop': 'Portátil',
    'mouse': 'Rato', 'remote': 'Controle Remoto', 'keyboard': 'Teclado', 'cell phone': 'Telemóvel', 'microwave': 'Micro-ondas',
    'toaster': 'Torradeira', 'clock': 'Relógio', 'hair drier': 'Secador de Cabelo', 'trash': 'Rejeito',
    'banana': 'Banana', 'apple': 'Maçã', 'orange': 'Laranja', 'backpack': 'Mochila'
};
const coresCss = { 'Vermelho': '#e74c3c', 'Azul': '#3498db', 'Verde': '#2ecc71', 'Amarelo': '#f1c40f', 'Marrom': '#964B00', 'Laranja': '#f39c12', 'Cinza': '#95a5a6' };
const ALL_MATERIALS = Object.keys(MATERIAL_INFO);
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result?.toString().split(',')[1] || null);
    reader.onerror = error => reject(error);
});

const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
};

function ResiduePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const backendBaseUrl = import.meta.env.VITE_API_URL;

    const [allDetections, setAllDetections] = useState([]);
    const [displayResults, setDisplayResults] = useState([]);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const fileInputRef = useRef(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const canvasRef = useRef(null);
    const [foundEnterprises, setFoundEnterprises] = useState([]);

    useEffect(() => {
        const fetchEnterprises = async () => {
            if (displayResults.length > 0) {
                const mainMaterial = displayResults[0].possibleMaterials[0]?.material;
                if (mainMaterial && mainMaterial !== 'Rejeito') {
                    try {
                        const response = await axios.get(`${backendBaseUrl}/enterprise/search?type=${mainMaterial}`);
                        setFoundEnterprises(response.data);
                    } catch (err) {
                        console.error("Erro ao buscar empresas:", err);
                        setFoundEnterprises([]);
                    }
                } else {
                    setFoundEnterprises([]);
                }
            }
        };
        fetchEnterprises();
    }, [displayResults, backendBaseUrl]);

    useEffect(() => {
        if (allDetections.length > 0 && canvasRef.current && previewUrl) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = previewUrl;
            img.onload = () => {
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                const maxWidth = canvas.parentElement.clientWidth * 0.9;
                const maxHeight = 400;
                let width = maxWidth; let height = width / aspectRatio;
                if (height > maxHeight) { height = maxHeight; width = height * aspectRatio; }
                canvas.width = width; canvas.height = height;
                const scaleX = canvas.width / img.naturalWidth;
                const scaleY = canvas.height / img.naturalHeight;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                allDetections.forEach(res => {
                    const [xmin, ymin, xmax, ymax] = res.bbox;
                    const color = coresCss[res.mainMaterialInfo.color] || '#2ecc71';
                    ctx.strokeStyle = color; ctx.lineWidth = 4;
                    ctx.strokeRect(xmin * scaleX, ymin * scaleY, (xmax - xmin) * scaleX, (ymax - ymin) * scaleY);
                    const label = `${res.translatedName} (${res.confidence}%)`;
                    ctx.fillStyle = color; ctx.font = 'bold 18px Arial';
                    const textWidth = ctx.measureText(label).width;
                    ctx.fillRect(xmin * scaleX, (ymin * scaleY) - 25, textWidth + 10, 25);
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(label, (xmin * scaleX) + 5, (ymin * scaleY) - 5);
                });
            };
        }
    }, [allDetections, previewUrl]);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        if (previewUrl) { URL.revokeObjectURL(previewUrl); }
        setAllDetections([]); setDisplayResults([]); setError(null); setLoading(true); setFoundEnterprises([]);
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        try {
            const compressedFile = await imageCompression(selectedFile, options);
            setFile(compressedFile); setPreviewUrl(URL.createObjectURL(compressedFile));
        } catch (err) {
            setError("Não foi possível processar esta imagem. Tente outra."); setFile(null); setPreviewUrl(null);
        } finally { setLoading(false); }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true); setError(null);
        try {
            const imageBase64Data = await toBase64(file);
            const backendAnalyzeUrl = `${backendBaseUrl}/api/analyze`;
            const response = await axios.post(backendAnalyzeUrl, { imageBase64: imageBase64Data }, { withCredentials: true });
            const predictions = response.data.predictions;
            if (predictions && predictions.length > 0) {
                const processedResults = predictions.map(p => {
                    const detectedClass = p.class.toLowerCase();
                    const materialCategories = OBJECT_TO_MATERIALS_MAP[detectedClass] || ["Rejeito"];
                    const allMaterialInfo = materialCategories.map(cat => ({ material: cat, ...MATERIAL_INFO[cat] }));
                    return {
                        confidence: (p.confidence * 100).toFixed(2),
                        bbox: p.bbox, translatedName: traducaoClasses[detectedClass] || detectedClass,
                        possibleMaterials: allMaterialInfo, mainMaterialInfo: allMaterialInfo[0]
                    };
                });
                const uniqueResultsMap = new Map();
                processedResults.forEach(result => {
                    if (!uniqueResultsMap.has(result.translatedName) || parseFloat(result.confidence) > parseFloat(uniqueResultsMap.get(result.translatedName).confidence)) {
                        uniqueResultsMap.set(result.translatedName, result);
                    }
                });
                setAllDetections(processedResults);
                const uniqueAndSorted = Array.from(uniqueResultsMap.values()).sort((a, b) => b.confidence - a.confidence);
                setDisplayResults(uniqueAndSorted);
            } else {
                setError('Nenhum objeto da nossa lista de interesse foi detectado na imagem.');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Erro ao contactar o servidor.';
            setError(`Erro ${err.response?.status || ''}: ${errorMsg}`);
        } finally { setLoading(false); }
    };

    const handleReset = () => {
        setFile(null); setAllDetections([]); setDisplayResults([]); setFoundEnterprises([]);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null); setLoading(false); setError(null); setIsSaveModalOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    
    const handleChooseFileClick = () => { if (!user) setIsAuthModalOpen(true); else fileInputRef.current.click(); };
    const handleCameraClick = () => { if (!user) setIsAuthModalOpen(true); else navigate('/live'); };
    const handleOpenSaveModal = () => setIsSaveModalOpen(true);

    const handleConfirmSave = async (selectedMaterial) => {
        setIsSaveModalOpen(false); // Fecha o modal imediatamente
        const mainResult = allDetections[0];

        if (!user || !selectedMaterial || selectedMaterial === "Rejeito" || !mainResult) {
            handleReset(); // Se a condição falhar, apenas reinicia a página
            return;
        }

        try { 
            const confidenceToSave = parseFloat(mainResult.confidence) / 100;
            await axios.post(`${backendBaseUrl}/history`, { 
                material_type: selectedMaterial, 
                confidence: confidenceToSave 
            }, { withCredentials: true });
            
            // Se for bem-sucedido, reinicia a página
            handleReset();

        } catch (historyError) { 
            console.error("Não foi possível guardar o scan no histórico:", historyError);
          
            setError(`Falha ao salvar o scan: ${historyError.response?.data?.message || historyError.message}`);
        }
    };

    const mainResultForModal = allDetections.length > 0 ? allDetections[0] : null;

    return (
        <>
            <main>
                <section className="residue-section">
                    <div className="container residue-content">
                        {!previewUrl && displayResults.length === 0 && (
                           <>
                                <div className="residue-text">
                                    <h1>O que vamos reciclar hoje?</h1>
                                    <p>Aponte a câmera para um item ou escolha uma imagem da galeria para a análise.</p>
                                </div>
                                <div className="residue-buttons">
                                    <input type="file" accept="image/*" onChange={handleFileChange} id="file-upload" style={{ display: 'none' }} ref={fileInputRef} />
                                    <ButtonSecondary onClick={handleCameraClick}>Usar câmera</ButtonSecondary>
                                    <ButtonPrimary onClick={handleChooseFileClick}>Escolher da galeria</ButtonPrimary>
                                </div>
                            </>
                        )}
                        {previewUrl && displayResults.length === 0 && (
                            <div className="residue-preview-container">
                                <h1>Imagem Selecionada</h1>
                                <img src={previewUrl} alt="Preview do resíduo" className="residue-image-preview" />
                                <div className="residue-buttons">
                                    <ButtonSecondary onClick={handleReset} disabled={loading}>Cancelar</ButtonSecondary>
                                    <ButtonPrimary onClick={handleUpload} disabled={loading}>
                                        {loading ? 'Analisando...' : 'Analisar Imagem'}
                                    </ButtonPrimary>
                                </div>
                            </div>
                        )}
                        {displayResults.length > 0 && (
                            <div className="residue-result-container">
                                <h1>Resultado da Análise</h1>
                                <canvas ref={canvasRef} className="residue-image-preview result-image" />
                                {displayResults.map((result, index) => (
                                    <div key={index} className="predictions-list">
                                        <h2>Sugestão: {result.translatedName}</h2>
                                        <p className="analysis-text">
                                            Este objeto pode ser de <strong>{result.possibleMaterials.length}</strong> {result.possibleMaterials.length > 1 ? 'materiais' : 'material'}:
                                        </p>
                                        <div className="material-options-grid">
                                            {result.possibleMaterials.map((info) => (
                                                <div key={info.material} className="material-option-card">
                                                    <div className="material-option-header">
                                                        <h3>{info.material} (Lixeira {info.nomeLixeira || info.color})</h3>
                                                        <FontAwesomeIcon icon={faRecycle} className="icon-color-live" style={{ color: coresCss[info.color] || '#95a5a6' }} />
                                                    </div>
                                                    <p className="material-option-tip">{info.mensagem}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <small className="confidence-disclaimer">
                                            Confiança da IA: {result.confidence}%.
                                        </small>
                                    </div>
                                ))}
                                {foundEnterprises.length > 0 && (
                                    <div className="enterprise-list-section">
                                        <h2 className="enterprise-list-title">
                                            <FontAwesomeIcon icon={faBuilding} /> Pontos de Coleta de {displayResults[0].possibleMaterials[0]?.material} Próximos
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
                                <div className="confirmation-buttons">
                                    <ButtonSecondary onClick={handleReset}>Analisar Outra Imagem</ButtonSecondary>
                                    <ButtonPrimary onClick={handleOpenSaveModal} disabled={!user}>Salvar no Dashboard</ButtonPrimary>
                                </div>
                            </div>
                        )}
                        {error && <p className="residue-error">{error}</p>}
                    </div>
                </section>
            </main>
            <AuthRedirectModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            {mainResultForModal && (
                <MaterialSelectionModal
                    isOpen={isSaveModalOpen}
                    onClose={() => setIsSaveModalOpen(false)}
                    onConfirm={handleConfirmSave}
                    detectedItemName={mainResultForModal.translatedName}
                    categories={mainResultForModal.possibleMaterials.map(m => m.material)}
                />
            )}
        </>
    );
}

export default ResiduePage;