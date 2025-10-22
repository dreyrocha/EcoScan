import type { Pool, QueryResult } from "pg";
import { sql } from "../../../config/sqlTag";

export interface ScanHistory {
  id_scan: string;
  id_user: string;
  material_type: string;
  confidence: number;
  scanned_at: Date;
}

export const findByUserId =
  (pool: Pool) => async (id_user: string): Promise<ScanHistory[]> => {
    const query = sql`
      SELECT 
        id_scan, 
        id_user, 
        material_type, 
        confidence, 
        scanned_at AT TIME ZONE 'UTC' AT TIME ZONE 'America/Belem' as scanned_at
      FROM scan_history
      WHERE id_user = $1
      ORDER BY scanned_at DESC;
    `;
    const result: QueryResult<ScanHistory> = await pool.query(query, [id_user]);
    return result.rows;
  };