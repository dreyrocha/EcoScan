import type { Pool } from "pg";
import { sql } from "../../../config/sqlTag";

export const findByEnterprise = (pool: Pool) => async (id_enterprise: string) => {
    const query = sql`
        SELECT * FROM waste_collections
        WHERE id_enterprise = $1
        ORDER BY collection_date DESC;
    `;
    const result = await pool.query(query, [id_enterprise]);
    return result.rows;
};