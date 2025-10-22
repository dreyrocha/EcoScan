import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "./Live.css";
import * as tf from "@tensorflow/tfjs";
import ButtonPrimary from "@/components/Button/ButtonPrimary";
import ButtonSecondary from "@/components/Button/ButtonSecondary.jsx";
import axios from "axios";
import { useAuth } from "../../context/AuthContex.jsx";
import AuthRedirectModal from "../../components/AuthRedirectModal/AuthRedirectModal.jsx";
import MaterialSelectionModal from "../../components/MaterialSelectionModal/MaterialSelectionModal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecycle, faBuilding } from "@fortawesome/free-solid-svg-icons"; // Adicionado ícone

// Lógica de Mapeamento (a mesma da outra página)
const MATERIAL_INFO = {
  Plástico: {
    color: "Vermelho",
    mensagem:
      "Lave as embalagens para remover restos de alimentos. Tampas podem ser recicladas junto com as garrafas.",
  },
  Papel: {
    color: "Azul",
    mensagem:
      "Papéis e papelões devem estar secos e limpos. Evite amassar, apenas dobre.",
  },
  Vidro: {
    color: "Verde",
    mensagem:
      "O vidro é 100% reciclável! Lave os potes e garrafas. Se estiverem quebrados, embale-os em jornal.",
  },
  Metal: {
    color: "Amarelo",
    mensagem:
      "Latas de alumínio e aço são altamente recicláveis. Lave as latas de alimentos e amasse-as.",
  },
  Orgânico: {
    color: "Marrom",
    mensagem:
      "Restos de frutas, cascas e vegetais podem virar adubo através da compostagem.",
  },
  Eletrônico: {
    color: "Laranja",
    nomeLixeira: "Resíduos Perigosos",
    mensagem:
      "NUNCA descarte no lixo comum! Procure pontos de coleta específicos.",
  },
  Rejeito: {
    color: "Cinza",
    mensagem: "Este resíduo é considerado rejeito. Descarte no lixo comum.",
  },
};
const OBJECT_TO_MATERIALS_MAP = {
  bottle: ["Plástico", "Vidro", "Metal"],
  cup: ["Plástico", "Vidro", "Metal"],
  "wine glass": ["Vidro"],
  fork: ["Metal", "Plástico"],
  knife: ["Metal", "Plástico"],
  spoon: ["Metal", "Plástico"],
  bowl: ["Vidro", "Plástico"],
  vase: ["Vidro", "Plástico"],
  book: ["Papel"],
  scissors: ["Metal"],
  tv: ["Eletrônico"],
  laptop: ["Eletrônico"],
  mouse: ["Eletrônico"],
  remote: ["Eletrônico"],
  keyboard: ["Eletrônico"],
  "cell phone": ["Eletrônico"],
  microwave: ["Eletrônico"],
  toaster: ["Eletrônico"],
  clock: ["Eletrônico"],
  "hair drier": ["Eletrônico"],
  banana: ["Orgânico"],
  apple: ["Orgânico"],
  orange: ["Orgânico"],
  backpack: ["Rejeito"],
  trash: ["Rejeito"],
};
const TRANSLATION_MAP = {
    'bottle': 'Garrafa', 'wine glass': 'Taça de Vinho', 'cup': 'Copo', 'fork': 'Garfo', 'knife': 'Faca', 'spoon': 'Colher',
    'bowl': 'Tigela', 'vase': 'Vaso', 'book': 'Livro', 'scissors': 'Tesoura', 'tv': 'Televisão', 'laptop': 'Portátil',
    'mouse': 'Mouse', 'remote': 'Controle Remoto', 'keyboard': 'Teclado', 'cell phone': 'Celular', 'microwave': 'Micro-ondas',
    'toaster': 'Torradeira', 'clock': 'Relógio', 'hair drier': 'Secador de Cabelo', 'trash': 'Rejeito',
    'banana': 'Banana', 'apple': 'Maçã', 'orange': 'Laranja', 'backpack': 'Mochila'
};
const DETECTABLE_CLASSES = Object.keys(OBJECT_TO_MATERIALS_MAP);
const CORES_CSS = {
  Vermelho: "#e74c3c",
  Azul: "#3498db",
  Verde: "#2ecc71",
  Amarelo: "#f1c40f",
  Marrom: "#964B00",
  Laranja: "#f39c12",
  Cinza: "#95a5a6",
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function LivePage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const animationFrameId = useRef(null);

  const { user, loading: authLoading } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [modelLoaded, setModelLoaded] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [detectedItem, setDetectedItem] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [status, setStatus] = useState(
    "Clique em 'Iniciar Detecção' para começar."
  );
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [displayedResultInfo, setDisplayedResultInfo] = useState(null);

  
  const [foundEnterprises, setFoundEnterprises] = useState([]);

  useEffect(() => {
    const fetchEnterprises = async () => {
      if (displayedResultInfo) {
        const mainMaterial = displayedResultInfo.allTips[0]?.material;
        if (mainMaterial && mainMaterial !== "Rejeito") {
          try {
            const response = await axios.get(
              `${apiUrl}/enterprise/search?type=${mainMaterial}`
            );
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
  }, [displayedResultInfo, apiUrl]);

  useEffect(() => {
    setStatus("Carregando modelo de IA...");
    const currentVideoRef = videoRef.current;
    cocoSsd.load().then((model) => {
      modelRef.current = model;
      setModelLoaded(true);
      setStatus("Clique em 'Iniciar Detecção' para começar.");
    });
    return () => {
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
      if (currentVideoRef && currentVideoRef.srcObject) {
        currentVideoRef.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const detectFrame = async () => {
    if (
      isFrozen ||
      isSaveModalOpen ||
      !modelRef.current ||
      !videoRef.current?.srcObject ||
      videoRef.current.paused
    )
      return;
    try {
      const predictions = await modelRef.current.detect(videoRef.current);
      const wasteDetections = predictions.filter((p) =>
        DETECTABLE_CLASSES.includes(p.class)
      );

      if (wasteDetections.length > 0) {
        const firstItem = wasteDetections[0];
        setIsFrozen(true);
        setDetectedItem(firstItem);
        drawDetections([firstItem]);
        if (videoRef.current) videoRef.current.pause();

        const detectedName =
          TRANSLATION_MAP[firstItem.class] || firstItem.class;
        const categories = OBJECT_TO_MATERIALS_MAP[firstItem.class] || [
          "Rejeito",
        ];
        const allTips = categories.map((material) => ({
          material,
          ...MATERIAL_INFO[material],
        }));

        setDisplayedResultInfo({ name: detectedName, allTips: allTips });
        setStatus(`Objeto analisado: ${detectedName}`);
      } else {
        animationFrameId.current = requestAnimationFrame(detectFrame);
      }
    } catch (error) {
      console.error("Erro durante a detecção:", error);
      animationFrameId.current = requestAnimationFrame(detectFrame);
    }
  };

  const startDetection = async () => {
    setIsCameraOn(true);
    setIsFrozen(false);
    setDetectedItem(null);
    setStatus("Aguardando permissão da câmera...");
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      let rearCameras = videoDevices.filter(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          !device.label.toLowerCase().includes("front")
      );
      let bestCameraId =
        rearCameras.length > 0
          ? (
              rearCameras.find(
                (cam) => !cam.label.toLowerCase().includes("wide")
              ) || rearCameras[0]
            ).deviceId
          : null;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          ...(bestCameraId
            ? { deviceId: { exact: bestCameraId } }
            : { facingMode: "environment" }),
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setStatus("Procurando por resíduos...");
          detectFrame();
        };
      }
    } catch (err) {
      console.error("Erro ao acessar a câmera: ", err);
      setStatus("Permissão da câmera negada ou erro ao iniciar.");
      setIsCameraOn(false);
    }
  };

  const stopDetection = () => {
    if (animationFrameId.current)
      cancelAnimationFrame(animationFrameId.current);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsFrozen(false);
    setDetectedItem(null);
    setDisplayedResultInfo(null);
    setIsSaveModalOpen(false);
    setFoundEnterprises([]); // Limpa a lista de empresas
    setStatus("Clique em 'Iniciar Detecção' para começar.");
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  const drawDetections = (detections) => {
    if (!canvasRef.current || !videoRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.canvas.width = videoRef.current.videoWidth;
    ctx.canvas.height = videoRef.current.videoHeight;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    detections.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;
      const text = `${
        TRANSLATION_MAP[prediction.class] || prediction.class
      } (${Math.round(prediction.score * 100)}%)`;
      const color = "#FF0000";
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.font = "20px Arial";
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.fillText(text, x, y > 20 ? y - 10 : y + height + 20);
    });
  };

  const handleRetryClick = () => {
    stopDetection();
  };
  const handleOpenSaveModal = () => {
    setIsSaveModalOpen(true);
  };
  const handleConfirmSave = async (selectedMaterial) => {
    if (
      user &&
      detectedItem &&
      selectedMaterial &&
      selectedMaterial !== "Rejeito"
    ) {
      try {
        await axios.post(
          `${apiUrl}/history`,
          { material_type: selectedMaterial, confidence: detectedItem.score },
          { withCredentials: true }
        );
        setStatus(`Salvo: ${selectedMaterial}!`);
      } catch (historyError) {
        console.error(
          "Não foi possível guardar o scan da câmera no histórico:",
          historyError
        );
        setStatus("Erro ao salvar.");
      }
    }
    setIsSaveModalOpen(false);
    stopDetection();
  };

  if (!user && !authLoading) {
    return (
      <AuthRedirectModal
        isOpen={isAuthModalOpen}
        onClose={() => navigate("/")}
      />
    );
  }

  return (
    <>
      <main className="live-page">
        <div className="container live-content">
          {!isCameraOn ? (
            <div className="initial-view">
              <div className="initial-view-box">
                <h1>Detector de Resíduos</h1>
                <p>
                  Aponte a câmera para um objeto para identificá-lo e receber
                  dicas de descarte em tempo real.
                </p>
                <div className={`result-panel status-info`}>
                  <p>{status}</p>
                </div>
                <ButtonPrimary onClick={startDetection} disabled={!modelLoaded}>
                  {modelLoaded ? "Iniciar Detecção" : "Carregando IA..."}
                </ButtonPrimary>
              </div>
            </div>
          ) : (
            <>
              <div className="video-container">
                <video ref={videoRef} autoPlay playsInline muted />
                <canvas ref={canvasRef} className="detection-canvas" />
              </div>

              {isFrozen && detectedItem && (
                <div className="disclaimer-box">
                  A confiança da IA é de:{" "}
                  {(detectedItem.score * 100).toFixed(1)}%. Lembre-se, a IA pode
                  cometer erros.
                </div>
              )}
              <div
                className={`result-panel ${
                  displayedResultInfo ? "status-alert" : "status-info"
                }`}
              >
                <p>{status}</p>
              </div>

              {!isFrozen ? (
                <ButtonPrimary onClick={stopDetection}>
                  Parar Detecção
                </ButtonPrimary>
              ) : (
                <div className="confirmation-buttons">
                  <ButtonSecondary onClick={handleRetryClick}>
                    Errado? Tente Novamente
                  </ButtonSecondary>
                  <ButtonPrimary onClick={handleOpenSaveModal} disabled={!user}>
                    Salvar no Dashboard
                  </ButtonPrimary>
                </div>
              )}

              {isFrozen && displayedResultInfo && (
                <div className="predictions-list">
                  <h2>Sugestão: {displayedResultInfo.name}</h2>
                  <p className="analysis-text">
                    Este objeto pode ser de{" "}
                    <strong>{displayedResultInfo.allTips.length}</strong>{" "}
                    {displayedResultInfo.allTips.length > 1
                      ? "materiais"
                      : "material"}
                    :
                  </p>
                  <div className="material-options-grid">
                    {displayedResultInfo.allTips.map((info) => (
                      <div key={info.material} className="material-option-card">
                        <div className="material-option-header">
                          <h3>
                            {info.material} (Lixeira{" "}
                            {info.nomeLixeira || info.color})
                          </h3>
                          <FontAwesomeIcon
                            icon={faRecycle}
                            className="icon-color-live"
                            style={{
                              color: CORES_CSS[info.color] || "#95a5a6",
                            }}
                          />
                        </div>
                        <p className="material-option-tip">{info.mensagem}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {foundEnterprises.length > 0 && (
                <div className="enterprise-list-section">
                  <h2 className="enterprise-list-title">
                    <FontAwesomeIcon icon={faBuilding} /> Pontos de Coleta de{" "}
                    {displayedResultInfo.allTips[0]?.material} Próximos
                  </h2>
                  <ul className="enterprise-list">
                    {foundEnterprises.map((enterprise) => (
                      <li
                        key={enterprise.idEnterprise}
                        className="enterprise-list-item"
                      >
                        <span className="enterprise-name">
                          {enterprise.nameEnterprise}
                        </span>
                        <span className="enterprise-address">
                          {enterprise.address}
                        </span>
                        <span className="enterprise-contact">
                          Contato: {enterprise.contactEmail || "Não informado"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <MaterialSelectionModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        detectedItemName={displayedResultInfo?.name || ""}
        categories={displayedResultInfo?.allTips.map((t) => t.material) || []}
      />
    </>
  );
}

export default LivePage;
