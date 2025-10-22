import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import type { EnterpriseRepository } from "../../database/repositories/enterprise";
import { AppError } from "../../errors/app.error";

export const login =
  (repository: EnterpriseRepository) => async (cnpj: string, password_body: string) => {
    // 1. Busca a empresa pelo CNPJ
    const enterprise = await repository.getEnterpriseByLoginRepository(cnpj);
    
    // 2. Verifica se a empresa existe e se tem uma senha no banco de dados
    if (!enterprise || !enterprise.password) {
        throw new AppError("CNPJ ou senha inválidos", StatusCodes.UNAUTHORIZED);
    }

    // 3. Compara a senha que o utilizador digitou com a senha encriptada do banco
    const isPasswordValid = await bcrypt.compare(password_body, enterprise.password);

    // 4. Se a comparação falhar, lança um erro
    if (!isPasswordValid) {
        throw new AppError("CNPJ ou senha inválidos", StatusCodes.UNAUTHORIZED);
    }

    // 5. Se tudo estiver correto, remove a senha do objeto antes de o devolver
    const { password, ...enterpriseWithoutPassword } = enterprise;
    return enterpriseWithoutPassword;
  };