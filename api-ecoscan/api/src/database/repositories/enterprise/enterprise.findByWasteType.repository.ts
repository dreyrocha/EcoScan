import type { Pool, QueryResult } from "pg";
import { sql } from "../../../config/sqlTag";
import { EnterpriseEntity } from "../../../entities/enterprise.entity";

export const findByWasteType =
  (pool: Pool) =>
  async (wasteType: string): Promise<EnterpriseEntity[]> => {

    
    const query = sql`

    
      SELECT id_enterprise, name_enterprise, address, waste_type, contact_email, contact_phone
      FROM enterprise
      WHERE waste_type = $1 OR waste_type = 'Todos';
    `;

    const result: QueryResult = await pool.query(query, [wasteType]);
    
    // Retorna um array de empresas (pode estar vazio)
    return result.rows.map(row => new EnterpriseEntity({
      idEnterprise: row.id_enterprise,
      nameEnterprise: row.name_enterprise,
      address: row.address,
      wasteType: row.waste_type,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      createdAt: row.created_at,
    }));
  };