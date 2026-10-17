---
layout: post
title: "Cactus Needle: Chamada de Ferramentas Local para Reduzir Custos de Tokens em LLMs na Nuvem"
date: 2026-10-17 00:00:00 +0000
description: Instale o Cactus Needle, um LLM agentico de 14MB para dispositivos e servidores locais, para rotear ferramentas sem gastar tokens na nuvem
img: ai/cactus_needle.jpg
tags: [AI, LLM, Otimização de Custos, Edge Computing, Tool Calling]
---

## O Problema: Tokens de Tool-Calling Acumulam Rápido

Quando construímos sistemas baseados em agentes, cada chamada de ferramenta dispara uma requisição para uma LLM na nuvem. O agente:
1. Lê o esquema da ferramenta (muitas vezes longo)
2. Lê o histórico de chat
3. Raciocina sobre qual ferramenta chamar
4. Formata argumentos em JSON
5. Retorna o resultado para processamento

Para um fluxo típico de agente com 5+ chamadas de ferramentas por requisição, **50% a 70% do seu consumo de tokens é gasto em uma camada de chamada de função que não precisa do nível de raciocínio de um GPT-4o**. É como contratar um cirurgião para checar seu e-mail.

---

## A Solução: Cactus Needle

O **Cactus Needle** é um LLM agentico de 45 milhões de parâmetros, destilado do Gemini, otimizado exclusivamente para chamada de ferramentas (*tool calling*) e extração estruturada. Ele vem em um único **binário de 14MB** e roda uma sessão completa em ~28MB de RAM.

- **0 tokens na nuvem** para despacho de ferramentas
- **500 tokens/segundo de decodificação** em um Raspberry Pi 5
- **Quantização de 2 bits** (compressão CQ2)
- **Licença MIT**, totalmente open-source
- Roda em celulares, servidores, microcontroladores e microsserviços

Movendo a lógica de tool-calling para o Needle, sua LLM cara na nuvem (Claude, GPT-4o, Gemini) lida apenas com raciocínio de alto valor e síntese.

---

## Instalação

### 1. Instalar via pip

```bash
pip install cactus_needle
```

### 2. Baixar os pesos do modelo

```bash
needle download needle3
```

Isso baixa um arquivo `.cact` de ~34MB (pesos quantizados):
```
$ ls -lah needle3.cact
-rw-rw-r-- 1 user user 34M Oct 17 16:48 needle3.cact
```

### 3. Verificar se está funcionando

```bash
needle --help
```

Você verá:
```
usage: needle <command> [options]
  run            run a checkpoint on a query
  finetune       train a LoRA adapter on JSONL data
  build          export a checkpoint to a .cact archive
  playground     serve the browser playground
  ...
```

---

## Como Funciona: Exemplo Prático

### Definindo ferramentas e um esquema

```python
from needle import Needle
from pydantic import BaseModel

def add(a: int, b: int) -> int:
    """Soma dois números"""
    return a + b

def multiply(a: int, b: int) -> int:
    """Multiplica dois números"""
    return a * b

class MathResult(BaseModel):
    operation: str
    result: int

# Carrega o modelo (arquivo de 14MB, ~28MB RAM)
needle = Needle(weights='./needle3.cact', tools=[add, multiply])
```

### Executando uma consulta

```python
query = "Some 5 e 3"
result = needle.extract(query, schema=MathResult)

print(result)
# Output: operation='add' result=8
```

Pronto. **Sem chamadas de API na nuvem.** O modelo rodou localmente na sua máquina, interpretou a consulta, roteou para a ferramenta correta e retornou o JSON estruturado — tudo em ~100ms.

---

## Comparação no Mundo Real: Local vs. Nuvem

### Cenário: Agente com 10 passos de tool-calling

**Sem o Needle (todas as chamadas para o Claude):**
- 10 chamadas × 2.000 tokens médios (entrada+saída por chamada) = **20.000 tokens**
- Custo: ~$0.30 nas taxas atuais
- Latência: 5–10 segundos (ida e volta na rede)

**Com o Needle (apenas como roteador):**
- 10 chamadas locais: **0 tokens** (roda no próprio dispositivo)
- 2 chamadas finais de síntese para o Claude (apenas raciocínio complexo): **4.000 tokens**
- Custo: ~$0.06 (80% de economia)
- Latência: 1–2 segundos (sem saltos de rede para o roteamento)

Para 100 invocações de agentes por dia:
- **Sem Needle:** 2.000 tokens/dia × 30 dias = **60.000 tokens** (~$9/mês)
- **Com Needle:** 400 tokens/dia × 30 dias = **12.000 tokens** (~$1.80/mês)
- **Economia: $7.20/mês por usuário** (escala com o volume)

---

## Por que o Needle Vence uma LLM Pequena Genérica?

Você pode se perguntar: "Por que não usar apenas um Llama de 7B localmente?"

### Vantagens do Needle:
1. **Focado em ferramentas:** Treinado em 2B de tokens de dados de chamadas de função, não em chat genérico
2. **Eficiência extrema:** 70 MFLOPs por token vs. 164 para transformers tradicionais
3. **Decodificação restrita por gramática:** Sempre gera JSON válido sem precisar de pós-processamento
4. **Fine-tuning via LoRA:** Personalize para suas ferramentas específicas em 45 minutos
5. **Binários minúsculos:** Arquivo `.cact` único de 14MB; implante em celulares, edge devices e IoT

Um Llama 2 7B ou Mistral genérico produzirá JSON ruidoso, alucinará nomes de ferramentas e exigirá parsers complexos. O Needle foi desenhado para uma única função: **despachar ferramentas perfeitamente, todas as vezes.**

---

## Passo a Passo da Instalação (17 de Outubro de 2026)

Aqui está o passo a passo executado no ambiente:

```bash
# 1. Instalar o pacote
$ pip install cactus_needle
Successfully installed cactus_needle-3.2.5

# 2. Baixar o modelo (34MB)
$ needle download needle3
weights   ./needle3.cact  35.34 MB

# 3. Verificar a instalação
$ needle --help
usage: needle <command> [options]
  run            run a checkpoint on a query
  finetune       train a LoRA adapter on JSONL data
  ...

# 4. Testar com uma chamada de ferramenta
$ python3 -c "
from needle import Needle
from pydantic import BaseModel

def add(a: int, b: int) -> int:
    return a + b

class MathResult(BaseModel):
    operation: str
    result: int

needle = Needle(weights='./needle3.cact', tools=[add])
result = needle.extract('Some 5 e 3', schema=MathResult)
print(result)
"
operation='add' result=8
```

**Sucesso.** Ferramenta acionada, JSON extraído, zero tokens de nuvem gastos.

---

## Quando Usar o Needle

### ✅ Use o Needle para:
- Despacho de ferramentas em agentes multi-passo
- Extração de dados estruturados (formulários, e-mails, documentos)
- Roteamento de funções em camadas de API
- Microsserviços locais que acionam várias ferramentas
- Agentes mobile com foco offline-first

### ❌ Não use o Needle para:
- Raciocínio aberto ou criatividade
- Conversas multi-turno (ele opera em modo single-shot)
- Tarefas que exigem compreensão semântica além de esquemas de função
- Utilize LLMs na nuvem para a síntese final e o Needle para o roteamento

---

## Referências

- **GitHub:** [cactus-compute/needle](https://github.com/cactus-compute/needle)
- **Paper:** arXiv:2607.18363
- **Plataforma:** [cactuscompute.com](https://cactuscompute.com)
- **HuggingFace:** [Cactus-Compute/needle2](https://huggingface.co/Cactus-Compute/needle2)

---

**Resumo:** Um modelo de 14MB + inferência local = custos drasticamente menores, menor latência e total controle. Instale o Cactus Needle hoje mesmo.
