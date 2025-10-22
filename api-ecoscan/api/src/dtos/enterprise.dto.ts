import { z } from "zod";

// DTO para criar uma Enterprise
export const createEnterpriseSchema = z.object({
  nameEnterprise: z.string().min(1, "Nome da empresa é obrigatório"),
  companyName: z.string().optional(),
  cnpj: z.string().min(1, "CNPJ é obrigatório"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  address: z.string().min(1, "Endereço é obrigatório"),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Email inválido").optional(),
  contactPhone: z.string().optional(),
  wasteType: z.string().min(1, "Tipo de resíduo é obrigatório"),
  scheduleFrequency: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type EnterpriseDataDTO = z.infer<typeof createEnterpriseSchema>;

// DTO para ID da Enterprise
export const idEnterpriseSchema = z.object({
  id: z.string().uuid("ID da empresa inválido"),
});

export type IdEnterpriseDTO = z.infer<typeof idEnterpriseSchema>;

// --- CORREÇÃO AQUI ---
// O schema de login agora espera tanto o cnpj como a password.
export const enterpriseLoginSchema = z.object({
  cnpj: z.string().min(1, "CNPJ é obrigatório"),
  password: z.string().min(6, "Senha é obrigatória"),
});

export type EnterpriseLoginDTO = z.infer<typeof enterpriseLoginSchema>;

// DTO para atualizar uma Enterprise
export const updateEnterpriseSchema = z.object({
  idEnterprise: z.string().uuid("ID da empresa inválido"),
  nameEnterprise: z.string().optional(),
  companyName: z.string().optional(),
  cnpj: z.string().optional(),
  address: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Email inválido").optional(),
  contactPhone: z.string().optional(),
  wasteType: z.string().optional(),
  scheduleFrequency: z.string().optional(),
  updatedAt: z.date().default(() => new Date()),
});

export type UpdateEnterpriseDTO = z.infer<typeof updateEnterpriseSchema>;