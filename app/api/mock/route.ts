import { NextResponse } from "next/server"

export async function GET(request: Request) {
  return NextResponse.json({
    status: "sucesso",
    dados: {
      id: "123",
      nome: "Exemplo",
      criadoEm: "2025-04-07T15:24:09Z",
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const url = new URL(request.url)
    const path = url.pathname

    if (body.usuario && body.senha) {
      return NextResponse.json({
        status: "sucesso",
        mensagem: "Login realizado com sucesso",
        token: "abc123xyz",
      })
    } else if (body.idCobranca) {
      return NextResponse.json({
        id: body.idCobranca,
        valor: 159.99,
        data: "2025-04-07",
        status: "pendente",
        cliente: {
          nome: "João Silva",
          id: "cust_987654",
        },
      })
    } else {
      return NextResponse.json({
        status: "sucesso",
        dados: {
          id: "123",
          nome: "Exemplo",
          criadoEm: "2025-04-07T15:24:09Z",
        },
      })
    }
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ erro: "Erro ao processar requisição" }, { status: 500 })
  }
}
