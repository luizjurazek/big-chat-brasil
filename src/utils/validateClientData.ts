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
  if (!name) {
    errors.push("O nome do cliente é obrigatório.");
  }
  if (!email) {
    errors.push("O email do cliente é obrigatório.");
  } else {
    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Formato de email inválido.");
    }
  }
  if (!phone) {
    errors.push("O telefone do cliente é obrigatório.");
  }
  if (!cpf) {
    errors.push("O CPF do cliente é obrigatório.");
  } else {
    // Validar formato do CPF
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      errors.push("Formato de CPF inválido. Use o formato xxx.xxx.xxx-xx");
    }
  }
  if (!responsible) {
    errors.push("O responsável é obrigatório.");
  }
  if (!cnpj) {
    errors.push("O CNPJ é obrigatório.");
  } else {
    // Validar formato do CNPJ
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!cnpjRegex.test(cnpj)) {
      errors.push("Formato de CNPJ inválido. Use o formato xx.xxx.xxx/xxxx-xx");
    }
  }
  if (!company_name) {
    errors.push("O nome da empresa é obrigatório.");
  }
  if (!type_plan || !["pre-pago", "pos-pago"].includes(type_plan)) {
    errors.push("O tipo de plano deve ser 'pre-pago' ou 'pos-pago'.");
  }

  // Return errors if found or null if doesnt
  return errors.length > 0 ? errors : null;
}

export default validateClienteData;
