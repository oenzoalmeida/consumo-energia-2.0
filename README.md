# Consumo de Energia 2.0

Aplicação web para simular consumo de energia elétrica, estimar custos e comparar aparelhos, com autenticação, persistência por usuário e painel administrativo.

## Demonstração

**Aplicação:** https://consumo-energia-2.onrender.com

## Credencial demo

| Perfil | E-mail | Senha |
|---|---|---|
| Usuário | `demo@consumoenergia.app` | `ConsumoEnergia@2026` |

O acesso administrativo é interno e não possui credencial pública.

## Sobre

Evolução de um projeto acadêmico de cálculo de consumo de energia. O usuário cadastra aparelhos (potência, horas e dias de uso) e a tarifa, e o sistema estima consumo mensal em kWh, custo e projeção anual, com classificação por faixas de consumo.

## Funcionalidades principais

- Cadastro e login de usuários com sessão por cookie HttpOnly
- Cadastro de aparelhos e tarifa por usuário
- Estimativa de consumo (kWh), custo mensal e projeção anual
- Classificação do consumo e destaque do maior consumidor
- Dados salvos por usuário (um cenário por conta)
- Painel administrativo de gestão de contas
- Exclusão definitiva da conta pela própria interface

## Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express, JWT
- **Banco de dados:** PostgreSQL (Neon)
- **Infraestrutura:** Render

## Perfis de acesso

- **Usuário (USER):** gerencia a própria simulação e pode excluir a própria conta.
- **Administrador (ADMIN):** lista contas e ativa/desativa usuários. Credencial não pública.

## Segurança e privacidade

- Senhas com hash scrypt (sal aleatório) e comparação em tempo constante; nenhum segredo de produção versionado.
- Sessão por JWT em cookie HttpOnly/Secure/SameSite; CORS restrito ao domínio do frontend.
- Consultas SQL parametrizadas; saídas do frontend escapadas.
- Sem analytics, rastreamento ou cookies de terceiros (apenas o cookie de sessão).
- Termos de Uso e Política de Privacidade disponíveis na aplicação.

## Executando localmente

Backend (requer `DATABASE_URL` e `JWT_SECRET`; opcional `PORT` e `FRONTEND_URL`):

```bash
cd backend
npm install
npm start
```

Frontend: abra `index.html` via um servidor estático local. A URL da API é definida em `auth.js` (`const API`) — ajuste se necessário.

## Testes

O CI verifica a sintaxe dos arquivos JavaScript (`node --check`) e a integridade dos arquivos essenciais. Não há suíte de testes automatizados funcionais.

## Deploy

- **Frontend:** site estático no Render.
- **Backend:** serviço Node no Render com variáveis `DATABASE_URL`, `JWT_SECRET` e `FRONTEND_URL`.
- **Banco:** PostgreSQL gerenciado no Neon.

## Limitações conhecidas

- Sem verificação de e-mail e sem recuperação de senha.
- Sem rate limiting nas rotas de autenticação.
- A simulação mantém um único cenário por usuário (sem histórico).

## Avisos específicos

- Os cálculos são **estimativas** baseadas na potência nominal informada e na tarifa definida pelo usuário; não consideram bandeiras tarifárias, impostos nem o histórico real da unidade consumidora, e não substituem a fatura da distribuidora.

## Autor

Enzo Almeida
