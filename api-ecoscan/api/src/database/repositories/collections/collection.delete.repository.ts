import type { Pool } from "pg";
import { sql } from "../../../config/sqlTag";

export const remove = (pool: Pool) => async (id_collection: string): Promise<boolean> => {
    const query = sql`DELETE FROM waste_collections WHERE id_collection = $1;`;
    const result = await pool.query(query, [id_collection]);
    return (result.rowCount ?? 0) > 0;
};