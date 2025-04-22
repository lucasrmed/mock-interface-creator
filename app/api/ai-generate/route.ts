import { NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import OpenAI from "openai"

// Substitua a função GET atual por esta versão simplificada
export async function GET() {
  try {
    // Retornar um JSON simples sem tentar acessar variáveis de ambiente
    // ou fazer qualquer operação que possa falhar
    return new Response(
      JSON.stringify({
        status: "ok",
        message: "API disponível",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Erro no endpoint GET:", error)
    // Garantir que sempre retornamos um JSON válido, mesmo em caso de erro
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Erro interno no servidor",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

export async function POST(request: Request) {
  try {
    // Obter o corpo da requisição
    const body = await request.json().catch(() => ({}))
    const { prompt, maxTokens = 500 } = body

    // Log para debug
    console.log("Recebida requisição para Grok com prompt:", prompt?.substring(0, 50) + "...")

    if (!prompt) {
      return NextResponse.json({ error: "Prompt é obrigatório" }, { status: 400 })
    }

    // Verificar se a chave da API está configurada
    if (!process.env.XAI_API_KEY) {
      console.error("Chave da API Grok não configurada")
      return NextResponse.json(
        { error: "Chave da API Grok não configurada. Configure a variável de ambiente XAI_API_KEY." },
        { status: 500 },
      )
    }

    try {
      // Método 1: Usando o AI SDK
      console.log("Chamando API Grok usando AI SDK...")

      // Usar o modelo correto para o Grok - "grok-2-1212"
      const result = await generateText({
        model: xai("grok-2-1212"),
        prompt,
        maxTokens,
        temperature: 0.5,
      })

      // Verificar a resposta da API e garantir que temos um conteúdo válido
      const text = result.text || ""

      if (!text || text.trim() === "") {
        console.error("Resposta vazia do Grok")

        // Tentar o método alternativo com OpenAI client
        console.log("Tentando método alternativo com OpenAI client...")
        return await useOpenAIClient(prompt, maxTokens)
      }

      // Adicionar um log para debug
      console.log("Resposta do Grok recebida com sucesso:", text.substring(0, 50) + "...")

      return NextResponse.json({ text })
    } catch (grokError: any) {
      // Log detalhado do erro
      console.error("Erro na chamada à API do Grok com AI SDK:", grokError)

      // Tentar o método alternativo com OpenAI client
      console.log("Tentando método alternativo com OpenAI client...")
      try {
        return await useOpenAIClient(prompt, maxTokens)
      } catch (openaiError: any) {
        console.error("Erro também no método alternativo:", openaiError)

        // Fornecer uma resposta de fallback para não interromper o fluxo do usuário
        const fallbackResponse = getFallbackResponse(prompt)

        if (fallbackResponse) {
          console.log("Usando resposta de fallback")
          return NextResponse.json({
            text: fallbackResponse,
            warning: "Usando resposta de fallback devido a um erro na API do Grok",
          })
        }

        // Se não tiver fallback, retorna o erro
        return NextResponse.json(
          {
            error: "Erro ao chamar a API do Grok: " + (openaiError.message || "Erro desconhecido"),
            details: openaiError.message || "Detalhes não disponíveis",
          },
          { status: 500 },
        )
      }
    }
  } catch (error: any) {
    console.error("Erro ao processar requisição para Grok:", error)

    // Retornar mensagem de erro mais detalhada
    return NextResponse.json(
      {
        error: "Erro ao processar requisição",
        details: error.message || "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

// Função para usar o cliente OpenAI configurado para xAI
async function useOpenAIClient(prompt: string, maxTokens: number) {
  try {
    const client = new OpenAI({
      apiKey: process.env.XAI_API_KEY as string,
      baseURL: "https://api.x.ai/v1",
    })

    const completion = await client.chat.completions.create({
      model: "grok-2-latest",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em APIs RESTful e desenvolvimento de software.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.5,
    })

    const text = completion.choices[0].message.content || ""

    if (!text || text.trim() === "") {
      throw new Error("Resposta vazia do Grok via OpenAI client")
    }

    console.log("Resposta do Grok via OpenAI client recebida com sucesso:", text.substring(0, 50) + "...")

    return NextResponse.json({ text })
  } catch (error: any) {
    console.error("Erro na chamada à API do Grok via OpenAI client:", error)
    throw error
  }
}

// Função para gerar respostas de fallback quando a API falha
function getFallbackResponse(prompt: string): string | null {
  const promptLower = prompt.toLowerCase()

  if (promptLower.includes("login") || promptLower.includes("autenticação")) {
    return "API de autenticação de usuários com validação de credenciais e geração de token JWT."
  } else if (promptLower.includes("usuário") || promptLower.includes("perfil")) {
    return "API de gerenciamento de perfil de usuário com dados pessoais e preferências."
  } else if (promptLower.includes("cobran") || promptLower.includes("pagamento")) {
    return "API de gerenciamento de cobranças com detalhes de fatura e status de transação."
  }

  // Se não encontrar um padrão conhecido, retorna null para indicar que não há fallback
  return null
}
