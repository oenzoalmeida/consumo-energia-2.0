# Consumo de Energia 2.0

Aplicação web para simular consumo de energia elétrica, estimar custos e comparar aparelhos, agora com autenticação, persistência por usuário e painel administrativo.

## Demonstração

[Acessar o Consumo de Energia 2.0 online](https://consumo-energia-2.onrender.com)

**Conta demo:** `demo@consumoenergia.app` / `ConsumoEnergia@2026` (cadastro livre também disponível na aplicação).

## Funcionalidades

- Cadastro, edição e exclusão de aparelhos
- Cálculo de consumo mensal em kWh
- Estimativa de custo mensal e anual
- Tarifa personalizada
- Identificação do maior consumidor
- Comparação visual do consumo
- Cadastro e login de usuários
- Dados separados por conta e armazenados em PostgreSQL
- Perfis `USER` e `ADMIN`
- Painel administrativo para gestão de contas

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Node.js + Express
- PostgreSQL (Neon)
- JWT em cookie HttpOnly
- Render

## Perfis de acesso

| Perfil | Acesso |
| --- | --- |
| Usuário | Mantém seus próprios aparelhos, tarifa, simulações e estimativas. |
| Admin | Acessa uma área administrativa separada para gerenciar contas. |

O painel administrativo não é utilizado para alterar as simulações privadas dos usuários.

## Segurança

- Senhas armazenadas com derivação `scrypt`, nunca em texto puro.
- Sessão em cookie `HttpOnly`, `Secure` e `SameSite=None` para a arquitetura frontend/backend separada.
- Cada operação de dados é vinculada ao usuário autenticado no backend.
- Contas administrativas não podem ser criadas pelo cadastro público.
- Segredos de produção são mantidos em variáveis de ambiente e não no repositório.

## Origem do projeto

A primeira versão surgiu em 2025 em um trabalho acadêmico. Em 2026 o projeto foi revisitado e evoluído, mantendo a proposta original de cálculo de consumo enquanto adiciona uma arquitetura mais completa de aplicação web.

## Observação

Os resultados são estimativas. A potência varia conforme o aparelho e o custo real depende da tarifa e de outros componentes da conta de energia.
