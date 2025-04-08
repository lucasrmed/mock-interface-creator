import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt, maxTokens = 500 } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 })
    }

    let simulatedResponse = ""

    if (prompt.toLowerCase().includes("json") && prompt.toLowerCase().includes("requisição")) {
      if (prompt.toLowerCase().includes("login")) {
        simulatedResponse = '{\n  "usuario": "exemplo@email.com",\n  "senha": "senha123"\n}'
      } else if (prompt.toLowerCase().includes("cobran") || prompt.toLowerCase().includes("pagamento")) {
        simulatedResponse = '{\n  "idCobranca": "123456",\n  "valor": 159.99,\n  "dataVencimento": "2025-05-15"\n}'
      } else if (prompt.toLowerCase().includes("usuario") || prompt.toLowerCase().includes("perfil")) {
        simulatedResponse = '{\n  "id": "usr_123",\n  "nome": "João Silva",\n  "email": "joao@exemplo.com"\n}'
      } else {
        simulatedResponse = '{\n  "param1": "valor1",\n  "param2": "valor2",\n  "timestamp": "2025-04-07T15:24:09Z"\n}'
      }
    } else if (prompt.toLowerCase().includes("json") && prompt.toLowerCase().includes("resposta")) {
      if (prompt.toLowerCase().includes("login")) {
        simulatedResponse =
          '{\n  "status": "sucesso",\n  "mensagem": "Login realizado com sucesso",\n  "token": "abc123xyz",\n  "usuario": {\n    "id": "usr_123",\n    "nome": "João Silva",\n    "email": "joao@exemplo.com"\n  }\n}'
      } else if (prompt.toLowerCase().includes("cobran") || prompt.toLowerCase().includes("pagamento")) {
        simulatedResponse =
          '{\n  "id": "cob_123456",\n  "valor": 159.99,\n  "status": "pendente",\n  "dataVencimento": "2025-05-15",\n  "linkPagamento": "https://exemplo.com/pagar/123456",\n  "cliente": {\n    "id": "cli_789",\n    "nome": "João Silva"\n  }\n}'
      } else if (prompt.toLowerCase().includes("usuario") || prompt.toLowerCase().includes("perfil")) {
        simulatedResponse =
          '{\n  "id": "usr_123",\n  "nome": "João Silva",\n  "email": "joao@exemplo.com",\n  "telefone": "+5511999998888",\n  "endereco": {\n    "rua": "Av. Paulista",\n    "numero": "1000",\n    "cidade": "São Paulo",\n    "estado": "SP"\n  },\n  "preferencias": {\n    "notificacoes": true,\n    "tema": "escuro"\n  }\n}'
      } else {
        simulatedResponse =
          '{\n  "status": "sucesso",\n  "dados": {\n    "id": "123",\n    "nome": "Exemplo",\n    "criadoEm": "2025-04-07T15:24:09Z",\n    "detalhes": {\n      "campo1": "valor1",\n      "campo2": "valor2"\n    }\n  }\n}'
      }
    } else if (
      prompt.toLowerCase().includes("parâmetros") ||
      prompt.toLowerCase().includes("entrada") ||
      prompt.toLowerCase().includes("saída")
    ) {
      if (prompt.toLowerCase().includes("login")) {
        simulatedResponse = "Entrada: email, senha\nSaída: token, dados do usuário, status da autenticação"
      } else if (prompt.toLowerCase().includes("cobran") || prompt.toLowerCase().includes("pagamento")) {
        simulatedResponse =
          "Entrada: id do cliente, valor, data de vencimento\nSaída: id da cobrança, status, link de pagamento, detalhes do pagamento"
      } else if (prompt.toLowerCase().includes("usuario") || prompt.toLowerCase().includes("perfil")) {
        simulatedResponse =
          "Entrada: id do usuário\nSaída: nome, email, telefone, endereço, preferências, histórico de atividades"
      } else {
        simulatedResponse =
          "Entrada: parâmetros relevantes para sua API\nSaída: dados estruturados conforme necessidade da aplicação"
      }
    } else {
      if (prompt.toLowerCase().includes("login") || prompt.toLowerCase().includes("autenticação")) {
        simulatedResponse =
          "API de autenticação de usuários com validação de credenciais, geração de token JWT, controle de sessão e verificação em duas etapas"
      } else if (prompt.toLowerCase().includes("cobran") || prompt.toLowerCase().includes("pagamento")) {
        simulatedResponse =
          "API de gerenciamento de cobranças com detalhes de fatura, histórico de pagamentos, status de transação e métodos de pagamento"
      } else if (prompt.toLowerCase().includes("usuario") || prompt.toLowerCase().includes("perfil")) {
        simulatedResponse =
          "API de perfil de usuário com dados pessoais, preferências, configurações de conta e histórico de atividades"
      } else {
        simulatedResponse =
          "API personalizada com endpoints RESTful para gerenciamento de recursos, autenticação segura e validação de dados"
      }
    }

    return NextResponse.json({ text: simulatedResponse })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({
      text: "API personalizada para gerenciamento de recursos com autenticação e validação de dados",
    })
  }
}

