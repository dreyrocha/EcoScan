import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import type { EnterpriseDataDTO } from "../../dtos/enterprise.dto";
import { AppError } from "../../errors/app.error";
import type { EnterpriseRepository } from "../../database/repositories/enterprise";
import { EnterpriseEntity } from "../../entities/enterprise.entity";

export const create =
  (enterpriseRepository: EnterpriseRepository) =>
  async ({
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
  }: EnterpriseDataDTO): Promise<EnterpriseEntity> => {
    try {
      const foundEnterprise =
        await enterpriseRepository.getEnterpriseByLoginRepository(cnpj);
      if (foundEnterprise?.cnpj) {
        throw new AppError(
          "Empresa com este CNPJ já existe",
          StatusCodes.BAD_REQUEST,
        );
      }

      const saltRounds = Number.parseInt(process.env.SALT_ROUNDS || "10", 10);
			const hashedPassword = await bcrypt.hash(password, saltRounds);

      const enterpriseEntity = new EnterpriseEntity({
        idEnterprise: uuidv4(),
        nameEnterprise,
        companyName,
        cnpj,
        password: hashedPassword,
        address,
        contactName,
        contactEmail,
        contactPhone,
        wasteType,
        scheduleFrequency,
        createdAt,
        updatedAt,
      });

      const createdEnterprise =
        await enterpriseRepository.createEnterpriseRepository(enterpriseEntity);
      
      const { password: _, ...safeEnterprise } = createdEnterprise;
      return safeEnterprise as EnterpriseEntity;

    } catch (error) {
      throw error;
    }
  };