"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Check, Copy, Play, Sparkles } from "lucide-react";

export default function Home() {
  const [mockDescription, setMockDescription] = useState("");
  const [callType, setCallType] = useState("GET");
  const [endpoint, setEndpoint] = useState("/api/mock");
  const [parameters, setParameters] = useState("");
  const [mockGenerated, setMockGenerated] = useState(false);
  const [requestBody, setRequestBody] = useState(
    '{\n  "usuario": "exemplo",\n  "senha": "senha123"\n}'
  );
  const [responseBody, setResponseBody] = useState(
    '{\n  "status": "sucesso",\n  "mensagem": "Login realizado com sucesso",\n  "token": "abc123xyz"\n}'
  );
  const [testResponse, setTestResponse] = useState("");
  const [copiedRequest, setCopiedRequest] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [isParametersAILoading, setIsParametersAILoading] = useState(false);
  const [isRequestAILoading, setIsRequestAILoading] = useState(false);
  const [isResponseAILoading, setIsResponseAILoading] = useState(false);

  const callOpenAI = async (
    prompt: string,
    maxTokens?: number
  ): Promise<string> => {
    try {
      const response = await fetch("/api/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error("Erro ao chamar a API OpenAI:", error);

      const promptLower = prompt.toLowerCase();

      if (
        promptLower.includes("login") ||
        promptLower.includes("autenticação")
      ) {
        return "API de autenticação de usuários com validação de credenciais e geração de token";
      } else if (
        promptLower.includes("cobran") ||
        promptLower.includes("pagamento")
      ) {
        return "API de gerenciamento de cobranças com detalhes de fatura e status de pagamento";
      } else if (
        promptLower.includes("usuario") ||
        promptLower.includes("perfil")
      ) {
        return "API de perfil de usuário com dados pessoais e preferências";
      } else if (
        promptLower.includes("json") &&
        promptLower.includes("requisição")
      ) {
        return '{\n  "param1": "valor1",\n  "param2": "valor2"\n}';
      } else if (
        promptLower.includes("json") &&
        promptLower.includes("resposta")
      ) {
        return '{\n  "status": "sucesso",\n  "dados": {\n    "id": "123",\n    "nome": "Exemplo"\n  }\n}';
      } else if (promptLower.includes("parâmetros")) {
        return "Entrada: parâmetros relevantes\nSaída: dados estruturados";
      } else {
        return "API personalizada para sua aplicação com dados estruturados";
      }
    }
  };

  const generateMock = async (
    description = mockDescription,
    method = callType,
    useAI = false
  ) => {
    if (!description) return;

    const endpointPath = "/api/" + description.toLowerCase().split(" ")[0];
    setEndpoint(endpointPath);

    if (useAI) {
      setIsAILoading(true);
      try {
        const requestPrompt = `
          Crie um objeto JSON para uma requisição ${method} para um endpoint ${endpointPath}.
          A API é para: ${description}
          Parâmetros/dados mencionados: ${parameters}
          
          Retorne apenas o JSON válido, sem explicações ou comentários adicionais.
          Formate o JSON com indentação de 2 espaços.
        `;

        const responsePrompt = `
          Crie um objeto JSON para uma resposta de API para um endpoint ${method} ${endpointPath}.
          A API é para: ${description}
          Parâmetros/dados mencionados: ${parameters}
          
          Retorne apenas o JSON válido, sem explicações ou comentários adicionais.
          Formate o JSON com indentação de 2 espaços.
          Inclua dados realistas e detalhados.
        `;

        const requestResult = await callOpenAI(requestPrompt, 1000);
        const responseResult = await callOpenAI(responsePrompt, 1000);

        try {
          JSON.parse(requestResult);
          JSON.parse(responseResult);

          setRequestBody(requestResult);
          setResponseBody(responseResult);
        } catch (e) {
          console.error("Erro ao analisar JSON gerado pela IA:", e);
          generateDefaultMock(description, method);
        }
      } catch (error) {
        console.error("Erro ao gerar mock com IA:", error);
        generateDefaultMock(description, method);
      } finally {
        setIsAILoading(false);
      }
    } else {
      generateDefaultMock(description, method);
    }

    setMockDescription(description);
    setCallType(method);
    setMockGenerated(true);
  };

  const generateDefaultMock = (description: string, method: string) => {
    let sampleRequest = "";
    let sampleResponse = "";

    if (description.toLowerCase().includes("login")) {
      sampleRequest = '{\n  "usuario": "exemplo",\n  "senha": "senha123"\n}';
      sampleResponse =
        '{\n  "status": "sucesso",\n  "mensagem": "Login realizado com sucesso",\n  "token": "abc123xyz"\n}';
    } else if (
      description.toLowerCase().includes("cobran") ||
      description.toLowerCase().includes("billing")
    ) {
      sampleRequest = method === "GET" ? "" : '{\n  "idCobranca": "123456"\n}';
      sampleResponse =
        '{\n  "id": "123456",\n  "valor": 159.99,\n  "data": "2025-04-07",\n  "status": "pendente",\n  "cliente": {\n    "nome": "João Silva",\n    "id": "cust_987654"\n  }\n}';
    } else if (
      description.toLowerCase().includes("usuario") ||
      description.toLowerCase().includes("usuário")
    ) {
      sampleRequest =
        method === "GET"
          ? ""
          : '{\n  "nome": "João Silva",\n  "email": "joao@exemplo.com"\n}';
      sampleResponse =
        '{\n  "id": "usr_123",\n  "nome": "João Silva",\n  "email": "joao@exemplo.com",\n  "dataCadastro": "2025-01-15"\n}';
    } else if (description.toLowerCase().includes("produto")) {
      sampleRequest =
        method === "GET"
          ? ""
          : '{\n  "nome": "Produto Exemplo",\n  "preco": 99.90\n}';
      sampleResponse =
        '{\n  "id": "prod_456",\n  "nome": "Produto Exemplo",\n  "preco": 99.90,\n  "estoque": 50,\n  "categoria": "Eletrônicos"\n}';
    } else {
      sampleRequest =
        method === "GET"
          ? ""
          : '{\n  "param1": "valor1",\n  "param2": "valor2"\n}';
      sampleResponse =
        '{\n  "status": "sucesso",\n  "dados": {\n    "id": "123",\n    "nome": "Exemplo",\n    "criadoEm": "2025-04-07T15:24:09Z"\n  }\n}';
    }

    setRequestBody(sampleRequest);
    setResponseBody(sampleResponse);
  };

  const handleTest = () => {
    setIsTestLoading(true);
    setTestResponse("");

    setTimeout(() => {
      try {
        let result = responseBody;

        if (callType === "POST" && requestBody.trim()) {
          try {
            const reqData = JSON.parse(requestBody);
            if (
              mockDescription.toLowerCase().includes("login") &&
              reqData.usuario &&
              reqData.senha
            ) {
              result = JSON.stringify(
                {
                  status: "sucesso",
                  mensagem: `Login realizado com sucesso para ${reqData.usuario}`,
                  token: "abc123xyz_" + Date.now().toString().slice(-4),
                },
                null,
                2
              );
            }
          } catch (e) {}
        }

        setTestResponse(result);
      } catch (error) {
        setTestResponse(
          JSON.stringify({ erro: "Erro ao processar requisição" }, null, 2)
        );
      } finally {
        setIsTestLoading(false);
      }
    }, 1000);
  };

  const copyToClipboard = (
    text: string,
    setCopied: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAIAssist = async () => {
    setIsAILoading(true);

    try {
      const prompt = `
        Você é um especialista em APIs RESTful.
        Com base na seguinte descrição, forneça uma descrição técnica detalhada para uma API:
        "${mockDescription || "API genérica"}"
        
        Sua resposta deve ser uma descrição técnica concisa (máximo 2 linhas) que explique claramente o propósito e funcionalidade da API.
        Não inclua introduções ou explicações adicionais, apenas a descrição técnica.
      `;

      const text = await callOpenAI(prompt, 200);
      setMockDescription(text.trim());

      handleParametersAIAssist();
    } catch (error) {
      console.error("Erro ao gerar descrição com IA:", error);
      const userInput = mockDescription.toLowerCase();

      let aiSuggestion = "";
      if (userInput.includes("login") || userInput.includes("autenticação")) {
        aiSuggestion =
          "API de autenticação de usuários com validação de credenciais, geração de token JWT, controle de sessão e verificação em duas etapas";
        setCallType("POST");
      } else if (
        userInput.includes("cobran") ||
        userInput.includes("pagamento") ||
        userInput.includes("fatura")
      ) {
        aiSuggestion =
          "API de gerenciamento de cobranças com detalhes de fatura, histórico de pagamentos, status de transação e métodos de pagamento";
        setCallType(userInput.includes("lista") ? "GET" : "POST");
      } else if (
        userInput.includes("usuario") ||
        userInput.includes("usuário") ||
        userInput.includes("perfil")
      ) {
        aiSuggestion =
          "API de perfil de usuário com dados pessoais, preferências, configurações de conta e histórico de atividades";
        setCallType(userInput.includes("atualiza") ? "POST" : "GET");
      } else {
        aiSuggestion =
          "API personalizada para " +
          (mockDescription || "sua aplicação") +
          " com dados estruturados e endpoints RESTful";
      }

      setMockDescription(aiSuggestion);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleParametersAIAssist = async () => {
    if (!mockDescription) {
      return;
    }

    setIsParametersAILoading(true);

    try {
      const prompt = `
        Você é um especialista em APIs RESTful.
        Com base na seguinte descrição de API: "${mockDescription}"
        E método HTTP: ${callType}
        
        Liste os parâmetros de entrada e saída que esta API deve ter.
        Formato:
        Entrada: [lista de parâmetros de entrada]
        Saída: [lista de parâmetros de saída]
        
        Seja específico e detalhado, mas conciso.
      `;

      const text = await callOpenAI(prompt, 300);
      setParameters(text.trim());
    } catch (error) {
      console.error("Erro ao gerar parâmetros com IA:", error);
      const lowerDesc = mockDescription.toLowerCase();

      let suggestedParams = "";
      if (lowerDesc.includes("login") || lowerDesc.includes("autenticação")) {
        suggestedParams =
          "Entrada: email, senha\nSaída: token, nome do usuário, perfil";
      } else if (
        lowerDesc.includes("cobran") ||
        lowerDesc.includes("pagamento")
      ) {
        suggestedParams =
          "Entrada: id do cliente, valor, data de vencimento\nSaída: id da cobrança, status, link de pagamento";
      } else if (
        lowerDesc.includes("usuario") ||
        lowerDesc.includes("perfil")
      ) {
        suggestedParams =
          "Entrada: id do usuário\nSaída: nome, email, telefone, endereço, preferências";
      } else {
        suggestedParams =
          "Entrada: parâmetros relevantes para sua API\nSaída: dados estruturados conforme necessidade";
      }

      setParameters(suggestedParams);
    } finally {
      setIsParametersAILoading(false);
    }
  };

  const handleRequestAIAssist = async () => {
    if (!mockDescription) {
      return;
    }

    setIsRequestAILoading(true);

    try {
      const prompt = `
        Crie um objeto JSON para uma requisição ${callType} para um endpoint ${endpoint}.
        A API é para: ${mockDescription}
        Parâmetros/dados mencionados: ${parameters}
        
        Retorne apenas o JSON válido, sem explicações ou comentários adicionais.
        Formate o JSON com indentação de 2 espaços.
        Inclua dados realistas e detalhados.
      `;

      const text = await callOpenAI(prompt, 500);

      try {
        JSON.parse(text);
        setRequestBody(text);
      } catch (e) {
        console.error("JSON inválido retornado pela IA:", e);
      }
    } catch (error) {
      console.error("Erro ao gerar corpo da requisição com IA:", error);
    } finally {
      setIsRequestAILoading(false);
    }
  };

  const handleResponseAIAssist = async () => {
    if (!mockDescription) {
      return;
    }

    setIsResponseAILoading(true);

    try {
      const prompt = `
        Crie um objeto JSON para uma resposta de API para um endpoint ${callType} ${endpoint}.
        A API é para: ${mockDescription}
        Parâmetros/dados mencionados: ${parameters}
        Corpo da requisição: ${requestBody}
        
        Retorne apenas o JSON válido, sem explicações ou comentários adicionais.
        Formate o JSON com indentação de 2 espaços.
        Inclua dados realistas e detalhados.
      `;

      const text = await callOpenAI(prompt, 1000);

      try {
        JSON.parse(text);
        setResponseBody(text);
      } catch (e) {
        console.error("JSON inválido retornado pela IA:", e);
      }
    } catch (error) {
      console.error("Erro ao gerar corpo da resposta com IA:", error);
    } finally {
      setIsResponseAILoading(false);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="mb-8 border-gray-200 dark:border-gray-800">
        <CardHeader className="bg-gray-100 dark:bg-gray-800 rounded-t-lg">
          <CardTitle className="text-2xl text-gray-900 dark:text-gray-100">
            Gerador de Mock de API
          </CardTitle>
          <CardDescription className="text-gray-400">
            Crie mocks de API personalizados e teste-os instantaneamente.
            Perfeito para desenvolvimento e testes de frontend.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {!mockGenerated ? (
            <div className="space-y-6">
              <div>
                <Label htmlFor="mockDescription" className="text-gray-400">
                  Qual funcionalidade ou tela você precisa simular?
                </Label>
                <div className="relative">
                  <Textarea
                    id="mockDescription"
                    placeholder="ex.: interface de login, detalhes de cobrança, perfil de usuário"
                    value={mockDescription}
                    onChange={(e) => setMockDescription(e.target.value)}
                    className="mt-1 border-gray-200 dark:border-gray-800 focus:ring-cyan-500 focus:border-cyan-500 pr-10"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="absolute right-2 top-[calc(50%+0.5rem)] transform -translate-y-1/2 bg-cyan-500 hover:bg-cyan-400 h-8 w-8 p-0"
                    onClick={handleAIAssist}
                    title="Assistente de IA"
                    disabled={isAILoading}
                  >
                    {isAILoading ? (
                      <div className="h-4 w-4 border-2 border-t-transparent border-gray-900 rounded-full animate-spin"></div>
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-gray-400">
                  Qual tipo de chamada de API você deseja simular?
                </Label>
                <RadioGroup
                  value={callType}
                  onValueChange={setCallType}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="GET"
                      id="get"
                      className="text-cyan-500"
                    />
                    <Label htmlFor="get" className="text-gray-200">
                      GET
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="POST"
                      id="post"
                      className="text-cyan-500"
                    />
                    <Label htmlFor="post" className="text-gray-200">
                      POST
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="parameters" className="text-gray-400">
                  Quais parâmetros/dados o endpoint deve receber e retornar?
                </Label>
                <div className="relative">
                  <Textarea
                    id="parameters"
                    placeholder="ex.: para login: usuário e senha; para cobrança: ID da cobrança, valor, data, etc."
                    value={parameters}
                    onChange={(e) => setParameters(e.target.value)}
                    className="mt-1 border-gray-200 dark:border-gray-800 focus:ring-cyan-500 focus:border-cyan-500 pr-10"
                  />
                  <Button
                    type="button"
                    size="sm"
                    className="absolute right-2 top-[calc(50%+0.5rem)] transform -translate-y-1/2 bg-cyan-500 hover:bg-cyan-400 h-8 w-8 p-0"
                    onClick={handleParametersAIAssist}
                    title="Gerar parâmetros com IA"
                    disabled={isParametersAILoading || !mockDescription}
                  >
                    {isParametersAILoading ? (
                      <div className="h-4 w-4 border-2 border-t-transparent border-gray-900 rounded-full animate-spin"></div>
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => generateMock()}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200"
                >
                  Gerar Mock Simples
                </Button>
                <Button
                  onClick={() => generateMock(mockDescription, callType, true)}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-gray-900"
                  disabled={isAILoading}
                >
                  {isAILoading ? (
                    <>
                      <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-gray-900 rounded-full animate-spin"></div>
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Gerar com IA
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-100">
                  Detalhes do Mock
                </h3>
                <p className="text-sm text-gray-400 mt-1">{mockDescription}</p>

                <div className="mt-4 grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400">Endpoint</Label>
                      <div className="bg-gray-800 p-2 rounded mt-1 text-sm font-mono text-cyan-200">
                        {endpoint}
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Método HTTP</Label>
                      <div className="bg-gray-800 p-2 rounded mt-1 text-sm font-mono text-cyan-200">
                        {callType}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-800" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-100">
                    Exemplo de Requisição
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRequestAIAssist}
                      className="text-gray-400 hover:text-cyan-500"
                      title="Gerar com IA"
                      disabled={isRequestAILoading}
                    >
                      {isRequestAILoading ? (
                        <div className="h-4 w-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(requestBody, setCopiedRequest)
                      }
                      className="text-gray-400 hover:text-cyan-500"
                    >
                      {copiedRequest ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-md p-4">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-gray-200">
                    {`${callType} ${endpoint} HTTP/1.1
Content-Type: application/json

${requestBody}`}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-100">
                    Exemplo de Resposta
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResponseAIAssist}
                      className="text-gray-400 hover:text-cyan-500"
                      title="Gerar com IA"
                      disabled={isResponseAILoading}
                    >
                      {isResponseAILoading ? (
                        <div className="h-4 w-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(responseBody, setCopiedResponse)
                      }
                      className="text-gray-400 hover:text-cyan-500"
                    >
                      {copiedResponse ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-md p-4">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-gray-200">
                    {responseBody}
                  </pre>
                </div>
              </div>

              <Separator className="bg-gray-800" />

              <h3 className="text-lg font-medium mb-4 text-gray-100">
                Teste seu Mock
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testRequestBody" className="text-gray-400">
                      Corpo da Requisição
                    </Label>
                    <Textarea
                      id="testRequestBody"
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="font-mono border-gray-800 bg-gray-900 text-gray-200 focus:ring-cyan-500 focus:border-cyan-500"
                      rows={8}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400">
                      Resposta da Requisição
                    </Label>
                    <div className="bg-gray-800 rounded-md p-4 h-[calc(100%-2rem)] min-h-[200px] overflow-auto">
                      {testResponse ? (
                        <pre className="text-sm font-mono whitespace-pre-wrap text-gray-200">
                          {testResponse}
                        </pre>
                      ) : (
                        <p className="text-sm text-gray-400">
                          Envie uma requisição para ver a resposta
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleTest}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-900"
                  size="lg"
                  disabled={isTestLoading}
                >
                  {isTestLoading ? (
                    <>
                      <div className="h-4 w-4 mr-2 border-2 border-t-transparent border-gray-900 rounded-full animate-spin"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Enviar Requisição
                    </>
                  )}
                </Button>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setMockGenerated(false)}
                  variant="outline"
                  className="flex-1 border-gray-800 text-gray-200 hover:bg-gray-800 hover:text-cyan-500"
                >
                  Criar Novo Mock
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
