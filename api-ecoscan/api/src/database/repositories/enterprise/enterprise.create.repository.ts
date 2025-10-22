import type { Pool, QueryResult } from "pg";
import { sql } from "../../../config/sqlTag";
import { EnterpriseEntity } from "../../../entities/enterprise.entity";

export const create =
  (pool: Pool) =>
  async ({
    idEnterprise,
    nameEnterprise,
    companyName,
    cnpj,
    password, 
    address,
    contactName,
    contactEmail,
    contactPhone,
    wasteType,
    scheduleFrequency,
    createdAt,
    updatedAt,
  }: EnterpriseEntity): Promise<EnterpriseEntity> => {
   
    const query = sql`
      INSERT INTO enterprise (
        id_enterprise, name_enterprise, company_name, cnpj, password, address,
        contact_name, contact_email, contact_phone, waste_type, schedule_frequency,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;
    `;
    
   
    const values = [
      idEnterprise,
      nameEnterprise,
      companyName,
      cnpj,
      password, 
      address,
      contactName,
      contactEmail,
      contactPhone,
      wasteType,
      scheduleFrequency,
      createdAt,
      updatedAt,
    ];

    const result: QueryResult = await pool.query(query, values);
    const sql_row = result.rows[0];

    
    return new EnterpriseEntity(sql_row);
  };