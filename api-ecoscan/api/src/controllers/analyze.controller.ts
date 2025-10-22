import type { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import type { BodyRequest } from "../types/httpProps";
import { AppError } from "../errors/app.error";
import { spawn } from "child_process";
import path from "path";

interface AnalyzeRequestBody {
  imageBase64: string;
}

export const analyzeController = async (
  req: BodyRequest<AnalyzeRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      throw new AppError("Imagem (imageBase64) não fornecida.", StatusCodes.BAD_REQUEST);
    }

    const pythonScriptPath = path.join(process.cwd(), 'ia_inference.py');
    const pythonProcess = spawn("python", [pythonScriptPath]);
    
    let resultData = "";
    let errorData = "";

    pythonProcess.stdin.write(imageBase64);
    pythonProcess.stdin.end();
    
    pythonProcess.stdout.on("data", (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`[Backend] Erro no script Python (código ${code}):`, errorData);
        return next(new AppError(`Erro interno ao processar a imagem: ${errorData}`, StatusCodes.INTERNAL_SERVER_ERROR));
      }
      
      try {
        const resultJson = JSON.parse(resultData);
        

        console.log('[Backend] Resposta COMPLETA recebida do script Python (JSON):', JSON.stringify(resultJson, null, 2));

        if (resultJson.error) {
            return next(new AppError(`Erro do script de IA: ${resultJson.error}`, StatusCodes.INTERNAL_SERVER_ERROR));
        }

        if (!resultJson.predictions || resultJson.predictions.length === 0) {
          return res.status(StatusCodes.OK).json({ predictions: [{ class: 'trash', confidence: 1.0, bbox: [0,0,0,0] }] });
        }
        
        res.status(StatusCodes.OK).json(resultJson);

      } catch (parseError) {
        console.error("[Backend] Erro ao fazer parse da resposta do Python:", parseError);
        next(new AppError("Resposta inválida do serviço de IA.", StatusCodes.INTERNAL_SERVER_ERROR));
      }
    });

  } catch (error) {
     console.error("[Backend] Erro no analyzeController:", error);
     next(error);
  }
};