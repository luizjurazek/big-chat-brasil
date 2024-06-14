interface ClienteData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  responsible: string;
  cnpj: string;
  company_name: string;
  type_plan: "pre-pago" | "pos-pago";
  credits_used?: number;
  limit?: number;
}

async function validateClienteData(clienteData: ClienteData): Promise<string[] | null> {
  const { name, email, phone, cpf, responsible, cnpj, company_name, type_plan, credits_used, limit } = clienteData;

  const errors: string[] = [];

  // Verificar campos obrigatórios
  if (!name || typeof name != "string") {
    errors.push("O nome do cliente é obrigatório e precisa ser uma string.");
  }
  if (!email || typeof email != "string") {
    errors.push("O email do cliente é obrigatório e precisa ser uma string.");
  } else {
    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Formato de email inválido.");
    }
  }
  if (!phone || typeof phone != "string") {
    errors.push("O telefone do cliente é obrigatório e precisa ser uma string.");
  }
  if (!cpf || typeof cpf != "string") {
    errors.push("O CPF do cliente é obrigatório e precisa ser uma string.");
  } else {
    // Validar formato do CPF
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      errors.push("Formato de CPF inválido. Use o formato xxx.xxx.xxx-xx");
    }
  }
  if (!responsible || typeof responsible != "string") {
    errors.push("O responsável é obrigatório e precisa ser uma string.");
  }
  if (!cnpj || typeof cnpj != "string") {
    errors.push("O CNPJ é obrigatório  e precisa ser uma string.");
  } else {
    // Validar formato do CNPJ
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!cnpjRegex.test(cnpj)) {
      errors.push("Formato de CNPJ inválido. Use o formato xx.xxx.xxx/xxxx-xx");
    }
  }
  if (!company_name || typeof company_name != "string") {
    errors.push("O nome da empresa é obrigatório e precisa ser uma string.");
  }
  if (!type_plan || !["pre-pago", "pos-pago"].includes(type_plan)) {
    errors.push("O tipo de plano deve ser 'pre-pago' ou 'pos-pago'.");
  }

  // Verificar tipos de dados
  if (credits_used !== undefined && typeof credits_used !== 'number') {
    errors.push("O campo 'credits_used' deve ser um número.");
  }
  if (limit !== undefined && typeof limit !== 'number') {
    errors.push("O campo 'limit' deve ser um número.");
  }

  // Return errors if found or null if doesnt
  return errors.length > 0 ? errors : null;
}

export default validateClienteData;
