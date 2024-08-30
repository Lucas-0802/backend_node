# 🛠️ Serviço de Back-end para Gestão de Leitura de Imagens

Bem-vindo ao serviço de back-end para gestão de leitura de imagens, desenvolvido como parte de um teste técnico para a Shopper.com.br. Este projeto demonstra uma API robusta que utiliza a IA do Google Gemini para ler e gerenciar leituras individuais de consumo de água e gás por meio de imagens.

## 🚀 Funcionalidades

- **Leitura de Imagens com IA:** Integração com a API do Google Gemini para extrair leituras a partir de imagens de medidores.
- **Operações CRUD:** Gerenciamento completo das leituras, incluindo criação, confirmação e listagem.
- **Tratamento de Erros:** Respostas detalhadas para dados inválidos, leituras duplicadas, entre outros.
- **Setup Dockerizado:** Facilmente implantável com Docker e Docker Compose.

## 📂 Visão Geral dos Endpoints

### 1. `POST /upload`

**Descrição:** Envia uma imagem em formato Base64 para leitura e armazenamento do valor do medidor usando a IA do Google Gemini.

- **Corpo da Requisição:**
  ```json
  {
    "image": "base64",
    "customer_code": "string",
    "measure_datetime": "YYYY-MM-DD",
    "measure_type": "WATER" ou "GAS"
  }
