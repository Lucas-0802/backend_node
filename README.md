🛠️ Serviço de Back-end para Gestão de Leitura de Imagens
Bem-vindo ao serviço de back-end para gestão de leitura de imagens. Este projeto demonstra uma API robusta que utiliza a IA do Google Gemini para ler e gerenciar leituras individuais de consumo de água e gás por meio de imagens.

🚀 Funcionalidades
Leitura de Imagens com IA: Integração com a API do Google Gemini para extrair leituras a partir de imagens de medidores.
Operações CRUD: Gerenciamento completo das leituras, incluindo criação, confirmação e listagem.
Tratamento de Erros: Respostas detalhadas para dados inválidos, leituras duplicadas, entre outros.
Setup Dockerizado: Facilmente implantável com Docker e Docker Compose.
📂 Visão Geral dos Endpoints
1. POST /upload
Descrição: Envia uma imagem em formato Base64 para leitura e armazenamento do valor do medidor usando a IA do Google Gemini.

Corpo da Requisição:
json
Copiar código
{
  "image": "base64",
  "customer_code": "string",
  "measure_datetime": "YYYY-MM-DD",
  "measure_type": "WATER" ou "GAS"
}
Resposta:
200 OK:
json
Copiar código
{
  "image_url": "string",
  "measure_value": "integer",
  "measure_uuid": "string"
}
400 Bad Request: Dados inválidos fornecidos.
409 Conflict: Já existe uma leitura para o tipo especificado no mês atual.
2. PATCH /confirm
Descrição: Confirma ou corrige o valor de uma leitura.

Corpo da Requisição:
json
Copiar código
{
  "measure_uuid": "string",
  "confirmed_value": "integer"
}
Resposta:
200 OK:
json
Copiar código
{
  "success": true
}
400 Bad Request: Dados inválidos fornecidos.
404 Not Found: Leitura não encontrada.
409 Conflict: Leitura já confirmada.
3. GET /<customer_code>/list
Descrição: Lista todas as leituras de um cliente específico. Opcionalmente, filtra por tipo de leitura (WATER ou GAS).

Parâmetro de Query: measure_type=WATER ou GAS (opcional)
Resposta:
200 OK:
json
Copiar código
{
  "customer_code": "string",
  "measures": [
    {
      "measure_uuid": "string",
      "measure_datetime": "YYYY-MM-DDTHH:MM:SSZ",
      "measure_type": "string",
      "has_confirmed": "boolean",
      "image_url": "string"
    }
  ]
}
400 Bad Request: Tipo de medida inválido.
404 Not Found: Nenhuma leitura encontrada.
🛠️ Configuração e Instalação
Pré-requisitos
Docker e Docker Compose instalados na sua máquina.
Passos de Instalação
Clone o repositório:

bash
Copiar código
git clone https://github.com/seuusuario/nome-do-repositorio.git
cd nome-do-repositorio
Configure as variáveis de ambiente:

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:
bash
Copiar código
GEMINI_API_KEY=<sua-chave-de-api-google-gemini>
Construa e execute a aplicação usando Docker Compose:

bash
Copiar código
docker-compose up --build
Acesse a API:

A API estará disponível em http://localhost:3000.
🧪 Testes
Este projeto inclui uma série de testes unitários abrangentes. Para executar os testes, use o seguinte comando:

bash
Copiar código
npm test
📚 Documentação
Documentação da API Google Gemini
Documentação da API Vision
🤝 Contribuições
Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request com suas alterações.

📄 Licença
Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.

👥 Contato
Para qualquer dúvida ou feedback, entre em contato pelo email@exemplo.com.
