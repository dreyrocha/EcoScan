import type { Pool } from "pg";
import { sql } from "../../../config/sqlTag";

export const create =
  (pool: Pool) =>
  async (
    id_user: string,
    material_type: string,
    confidence: number
    // O parâmetro id_enterprise foi removido daqui
  ): Promise<void> => {
    // A query agora insere apenas os 3 campos corretos
    const query = sql`
      INSERT INTO scan_history (id_user, material_type, confidence)
      VALUES ($1, $2, $3);
    `;
    // Passa apenas os 3 valores para o banco de dados
    await pool.query(query, [id_user, material_type, confidence]);
  };