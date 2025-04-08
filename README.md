# Gerador de Mock de API

Uma aplicação web interativa para criar e testar mocks de API RESTful rapidamente. Este projeto foi desenvolvido para simplificar o processo de desenvolvimento frontend, permitindo que desenvolvedores simulem respostas de API sem depender de um backend real.

![Gerador de Mock de API](/screenshot.png)

## Funcionalidades

- ✨ Geração rápida de mocks de API para diferentes tipos de requisições (GET, POST)
- 🚀 Simulação de chamadas de API com respostas personalizadas
- 🧠 Geração assistida por IA para corpos de requisição e resposta
- 📋 Copiar facilmente JSONs para usar em seu código
- 🔄 Suporte para visualização de resposta em tempo real

## Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **React** - Biblioteca para construção de interfaces
- **Tailwind CSS** - Framework CSS para estilização
- **shadcn/ui** - Componentes de UI reutilizáveis
- **TypeScript** - Tipagem estática para JavaScript

## Instalação

1. Clone este repositório:
   \`\`\`bash
   git clone https://github.com/seu-usuario/mock-api-tester.git
   cd mock-api-tester
   \`\`\`

2. Instale as dependências:
   \`\`\`bash
   npm install

# ou

yarn install

# ou

pnpm install
\`\`\`

3. Execute o servidor de desenvolvimento:
   \`\`\`bash
   npm run dev

# ou

yarn dev

# ou

pnpm dev
\`\`\`

4. Acesse a aplicação em [http://localhost:3000](http://localhost:3000)

## Como Usar

1. **Descreva sua API**: Escreva uma breve descrição da funcionalidade que deseja simular (ex: "API de login", "Sistema de cobrança")

2. **Escolha o método HTTP**: Selecione GET ou POST dependendo do tipo de chamada que deseja simular

3. **Defina parâmetros**: Liste os parâmetros de entrada e saída esperados

4. **Gere o mock**: Clique em "Gerar Mock Simples" ou use "Gerar com IA" para criar automaticamente exemplos mais detalhados

5. **Teste sua API**: Visualize e edite os corpos de requisição e resposta, e teste a chamada para ver como funcionaria em uma aplicação real

6. **Copie para seu código**: Use os botões de cópia para transferir os JSONs diretamente para seu código

## Simulação de IA

A aplicação inclui uma simulação de IA que gera respostas contextualmente relevantes com base na entrada do usuário. Esta funcionalidade permite:

- Geração de descrições técnicas de API
- Sugestão de parâmetros de entrada e saída
- Criação de corpos de requisição JSON
- Criação de corpos de resposta JSON

Esta funcionalidade não depende de APIs externas pagas e funciona inteiramente no lado do servidor com base em padrões e heurísticas predefinidos.

## Personalização

Você pode personalizar os mocks gerados editando os arquivos:

- `app/api/mock/route.ts` - Para alterar as respostas padrão da API de mock
- `app/api/ai-generate/route.ts` - Para modificar a lógica de simulação de IA

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests para melhorias.

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/incrivel`)
3. Commit suas alterações (`git commit -m 'Adiciona recurso incrível'`)
4. Push para a branch (`git push origin feature/incrivel`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
