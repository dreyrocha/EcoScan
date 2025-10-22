import type { Pool } from "pg";
import { sql } from "../../../config/sqlTag";

export const create = (pool: Pool) => async (
    id_enterprise: string,
    amount_collected_kg: number,
    collection_date: string,
    waste_type: string
) => {
    const query = sql`
        INSERT INTO waste_collections (id_enterprise, amount_collected_kg, collection_date, waste_type)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const result = await pool.query(query, [id_enterprise, amount_collected_kg, collection_date, waste_type]);
    return result.rows[0];
};