---
layout: post
title: "Um tópico do Telegram para cada especialista de IA: configurando o Hermes passo a passo"
date: 2026-10-12 20:00:00 -0300
description: Como configurar o Hermes com um perfil especialista para cada tópico do Telegram, login com assinatura do Claude e um grupo privado para dados pessoais, com os arquivos de configuração e os prompts reais
img: software.jpg
tags: [AI, Hermes, Telegram, Agents, Claude]
---

Esta é a forma como eu uso o [Hermes](https://hermes-agent.nousresearch.com) com um tópico do Telegram para cada especialista. Cada tópico conversa com o próprio agente, com memória, instruções e modelo próprios. Os tópicos pessoais ficam em um grupo privado separado.

Ao final você terá:

- Um **grupo de trabalho** com um tópico por especialista: pesquisa, desenvolvedor, marketing, QA, analista de negócios e um orquestrador.
- Um **grupo privado** com um assistente financeiro e um assistente de calendário.
- A assinatura do Claude usada por login OAuth, com um modelo mais barato nos agentes pessoais.

## 1. Faça login com a sua assinatura do Claude

O Hermes pode usar a sua assinatura do Claude por meio de um token OAuth, em vez de uma API key paga por uso. Qualquer um dos comandos funciona:

```bash
hermes auth add anthropic --type oauth
```

ou, com o Claude Code instalado:

```bash
claude setup-token
```

Se você usar o segundo, coloque o token no `.env` do perfil que vai usá-lo:

```bash
ANTHROPIC_TOKEN=<seu token>
```

Confira se o Hermes enxerga a credencial:

```bash
hermes auth list
```

Você deve ver uma linha `anthropic` com o tipo `oauth`.

## 2. Crie os perfis

Um perfil é um agente separado: tem o próprio `config.yaml`, `.env`, `SOUL.md`, memória e sessões. Crie um para cada especialista:

```bash
hermes profile create research --no-alias --description "Especialista em pesquisa: transforma objetivos vagos em perguntas e achados com fontes."
hermes profile create developer --no-alias --description "Desenvolvedor: desenho de sistemas, especificações técnicas e planos de implementação."
hermes profile create marketing --no-alias --description "Especialista em marketing: campanhas, textos e posicionamento."
```

Repita para `qa-security`, `business-analyst` e `orchestrator`.

Dê a cada perfil de trabalho o modelo do Claude no `config.yaml`:

```yaml
model:
  default: claude-haiku-4-5-20251001
  provider: anthropic
_config_version: 50
```

Cada perfil também precisa da credencial da Anthropic no próprio `.env`. Copie a linha `ANTHROPIC_TOKEN=` do passo 1 para cada um.

## 3. Defina o papel de cada perfil

O arquivo `SOUL.md` é o prompt de sistema do agente. Ele define o que o agente faz e o que ele não deve fazer. Este é o de pesquisa:

```markdown
# Research — Specialist

You are the Research specialist on the team. You translate ambiguous goals
into concrete questions, gather and evaluate information, and return findings
you can cite.

## What you do

- Turn vague goals into research questions and acceptance criteria.
- Gather requirements, market/domain context, feasibility, and data.
- Evaluate sources and flag uncertainty, bias, or gaps.
- Write findings as clear reports with what you assumed and what you still need.

## Shared wiki under /research

Save structured findings to `research/findings/<topic>.md` — methods, sources,
key claims, confidence, open questions. Add a one-line summary to `research/index.md`
whenever a finding is updated. Drop scratch notes in `notes/<topic>.md`.

## Rules

- Never invent a source, quote, or number. Say where it came from or that it is unverified.
- Separate facts from inferences.
- Flag anything the team cannot proceed without.
```

Escreva um `SOUL.md` para cada perfil no mesmo estilo: um papel curto, uma lista do que ele faz e uma lista de regras. As regras são o que mais importa, porque é ali que você diz o que o agente nunca deve fazer.

## 4. Crie os tópicos no Telegram

1. No Telegram, crie um grupo e ative os **Tópicos** nas configurações.
2. Crie um tópico por perfil, por exemplo `research`, `developer`, `marketing`.
3. Adicione o seu bot ao grupo e torne-o administrador.
4. Envie uma mensagem em cada tópico. O gateway registra no log os IDs do grupo e do tópico quando recebe a mensagem.

O `thread_id` de um tópico é o número no link dele. O Hermes também grava a lista de tópicos em `~/.hermes/channel_directory.json`, que é o lugar mais fácil de consultar.

## 5. Direcione cada tópico ao seu perfil

As rotas são uma lista no `~/.hermes/config.yaml` principal. Cada rota liga um tópico a um perfil:

```yaml
profile_routes:
  - name: topic-research
    platform: telegram
    profile: research
    chat_id: "<id do seu grupo>"
    thread_id: "17"
    enabled: true
  - name: topic-developer
    platform: telegram
    profile: developer
    chat_id: "<id do seu grupo>"
    thread_id: "13"
    enabled: true
```

Adicione uma entrada por tópico. O tópico **Geral** pode ficar sem rota, e nele as mensagens vão para o agente padrão.

## 6. Reinicie o gateway

As rotas são lidas quando o gateway inicia, então reinicie o gateway principal depois de mudá-las:

```bash
hermes -p default gateway restart
```

Depois, em cada tópico, envie `/new` e uma mensagem como "quem é você?". O log do gateway mostra qual perfil respondeu:

```text
session=agent:research:telegram:group:<id do grupo>:17
```

## 7. Defina a ordem de fallback

Se um provedor falhar, o Hermes tenta o próximo. No `config.yaml` principal:

```yaml
fallback_providers:
  - provider: gemini
    model: gemini-3.6-flash
  - provider: nous
    model: upstage/solar-mini4:free
```

## 8. Monte um grupo privado para dados pessoais

Agentes pessoais não devem compartilhar memória nem conversa com os agentes de trabalho. Use um segundo grupo:

1. Crie um grupo privado novo com dois tópicos, `financial` e `calendar`, e adicione o bot.
2. Crie os perfis com chave própria e um modelo mais barato:

```bash
hermes profile create financial --no-alias --description "Finanças pessoais: registra receitas e despesas, responde perguntas e gera relatórios."
hermes profile create calendar --no-alias --description "Agenda pessoal: lê, cria, move e apaga eventos do Google Calendar."
```

```yaml
model:
  default: gemini-3.5-flash-lite
  provider: gemini
fallback_providers:
  - provider: nous
    model: upstage/solar-mini4:free
_config_version: 50
```

Coloque uma chave do Gemini no `.env` de cada um e não copie o token da Anthropic para lá.

3. Escreva o `SOUL.md`. O do financeiro:

```markdown
# Financial — Personal Finance Assistant

You are the user's private personal-finance assistant. Everything here is
personal data, separate from the work profiles. Never reference, ask about or
reveal anything from work topics or other profiles.

## What you do

- Record incomes and expenses the user sends in free text (e.g. "spent 45 on
  lunch"). Capture date (default today), amount, currency, category and a short note.
  Confirm each entry in one line.
- Keep the ledger in `finance/ledger.csv` (date,type,amount,currency,category,note).
  Append only. To correct an entry, add a reversing row and say so.
- Produce reports on request: totals by period, by category, income vs expense,
  balance, trends.

## Rules

- Never invent or guess amounts. If an amount, date or type is ambiguous, ask.
- Compute totals from the ledger, not from memory.
- Keep replies short.
```

O do calendário segue a mesma estrutura. As regras dele: antes de mover ou apagar um evento, informar exatamente qual evento vai mudar e pedir confirmação; confirmar cada alteração depois, com a data e a hora finais; nunca adivinhar o fuso horário.

4. Adicione as duas rotas em `profile_routes` no `config.yaml` principal, com o ID do grupo privado e os IDs dos dois tópicos.
5. Reinicie o gateway com `hermes -p default gateway restart` e teste os dois tópicos da mesma forma que no passo 6.

## 9. Agende uma agenda diária

O agente de calendário pode enviar uma mensagem todas as manhãs:

```bash
hermes -p calendar cron create "0 6 * * *" --name "daily-agenda" "Envie a agenda de hoje: compromissos em ordem de horário, com hora, título e local, e depois os conflitos."
```

O agendamento usa o fuso horário da máquina, então configure-o antes.

## Duas notas sobre privacidade

Os perfis separam memória e sessões, mas todos rodam na mesma máquina. Uma pasta no seu diretório pessoal pode ser lida por qualquer agente que navegue pelo disco. Para dados que precisam ficar privados, mantenha os arquivos dentro da pasta do próprio perfil, e não em um caminho compartilhado.

Mantenha o ID do grupo pessoal e os tokens fora de qualquer repositório ou post. Só os marcadores acima devem aparecer em arquivos compartilhados.
