---
layout: post
title: "Documentação no terminal iex"
date: 2020-04-30 00:00:00 +0300
description: Mostrando a documentação de uma função no terminal iex
img: elixir/default.png
tags: [TIL, Programação Funcional, Elixir, Software]
---

Para entrar em um terminal Elixir, você pode rodar:

```bash
  $ iex
```

Depois, para mostrar a documentação de uma função específica, você pode usar o _h_ como neste exemplo:


```bash
  $ h round/1

  # =>                              def round(number)

  # => @spec round(number()) :: integer()

  # => guard: true

  # => Rounds a number to the nearest integer.

  # => If the number is equidistant to the two nearest integers, rounds away from zero.

  # => Allowed in guard tests. Inlined by the compiler.
  ## Examples

      iex> round(5.6)
      # => 6

      iex> round(5.2)
      # => 5

      iex> round(-9.9)
      # => -10

      iex> round(-9)
      # => -9

      iex> round(2.5)
      # => 3

      iex> round(-2.5)
      # => -3

```
Neste caso, _round/1_ é uma função chamada *round* que recebe um argumento (aridade 1).
