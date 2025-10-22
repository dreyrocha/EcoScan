import sys
import json
from PIL import Image
import torch
import torchvision
from torchvision.transforms import functional as F
import io
import base64

# A lista de nomes de classes COCO permanece a mesma
COCO_INSTANCE_CATEGORY_NAMES = [
    '__background__', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus',
    'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'N/A', 'stop sign',
    'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
    'elephant', 'bear', 'zebra', 'giraffe', 'N/A', 'backpack', 'umbrella', 'N/A', 'N/A',
    'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball',
    'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
    'bottle', 'N/A', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl',
    'banana', 'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
    'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'N/A', 'dining table',
    'N/A', 'N/A', 'toilet', 'N/A', 'tv', 'laptop', 'mouse', 'remote', 'keyboard',
    'cell phone', 'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'N/A', 'book',
    'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
]

# --- ALTERAÇÃO AQUI: Adicionamos mais itens de interesse, como a banana ---
objetos_de_interesse = [
    'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'vase',
    'book', 'scissors', 'tv', 'laptop', 'mouse', 'remote', 'keyboard',
    'cell phone', 'microwave', 'toaster', 'clock', 'hair drier',
    'banana', 'apple', 'orange', 'backpack'
]

# Carregamento do modelo
try:
    model = torchvision.models.detection.fasterrcnn_resnet50_fpn(weights="DEFAULT")
    model.eval()
except Exception as e:
    print(json.dumps({"error": f"Falha ao carregar o modelo de IA: {e}"}))
    sys.exit(1)

def detectar_objetos(imagem_base64):
    try:
        image_bytes = base64.b64decode(imagem_base64)
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_tensor = F.to_tensor(pil_image).unsqueeze(0)

        with torch.no_grad():
            predictions = model(image_tensor)[0]

        resultados_filtrados = []
        for box, score, label in zip(predictions['boxes'], predictions['scores'], predictions['labels']):
            class_name = COCO_INSTANCE_CATEGORY_NAMES[label]

            # Filtra apenas por confiança e se o objeto está na nossa lista expandida
            if score > 0.1 and class_name in objetos_de_interesse:
                bbox_list = box.numpy().astype(int).tolist()
                resultados_filtrados.append({
                    "class": class_name,
                    "confidence": float(score),
                    "bbox": bbox_list
                })

        # --- ALTERAÇÃO PRINCIPAL ---
        # Ordena os resultados por confiança
        sorted_results = sorted(resultados_filtrados, key=lambda x: x['confidence'], reverse=True)
        
        # Retorna a LISTA COMPLETA de deteções, não apenas a melhor
        return {"predictions": sorted_results}

    except Exception as e:
        return {"error": f"Erro durante a detecção: {e}"}

if __name__ == "__main__":
    base64_string = sys.stdin.read()
    if not base64_string:
        print(json.dumps({"error": "Nenhuma imagem em base64 fornecida."}))
    else:
        resultado = detectar_objetos(base64_string)
        print(json.dumps(resultado))