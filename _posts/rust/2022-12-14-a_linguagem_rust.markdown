---
layout: post
title: PT-BR - A linguagem Rust
date: 2022-12-14 00:00:00 +0000
description: Uma introdução a linguagem rust
img: rust/rust-lang.jpeg
tags: [Functional Programming, Rust, Programação Funcional]
---

Olá!

Tenho aprendido `Rust` para poder trazer performance para alguns problemas que tenho enfrentado no trabalho. Então, este é o início de algumas anotações que irei fazer para entender e utilizar rust aqui na empresa.

### Rust
A linguagem rust tem foco em eficiência e confiabilidade.
Rust traz um desempenho extremamente rápido, gerencia memória eficientemente, seu sistema de tipos e modelo de _ownership_ garantem segurança de memória e de concorrência. Além disso, possui uma ótima documentação, compilador amigável com mensagens de erros úteis e ferramental de primeira qualidade.

Rust traz uma forma interessante de apresentar seus fundamentos que é por meio do ["o livro"](https://doc.rust-lang.org/book/) que apresenta uma visão geral da linguagem a partir de princípios fundamentais.

### Instalação
A instalação do Rust é pelo rustup. No site oficial do [`rustup`](https://rustup.rs/) você pode ver como instalar no seu sistema operacional. No linux foi bem simples. Bastou rodar o comando `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` no terminal.

Após isso, pode verificar a instalação rodando o comando `rustc --version` que no meu caso, retornou `rustc 1.65.0 (897e37553 2022-11-02)`.

Além do rustc, também houve a instalação do [`cargo`](https://doc.rust-lang.org/cargo/) que é o gerenciador de pacotes do Rust. Além de ser o gerenciador de dependências, cargo compila os seus pacotes,  gera pacotes distribuídos e também realiza o upload para o [`crates`](https://crates.io), onde ficam as informações de pacotes para aplicações Rust.

### Hello World
Presumindo que você esteja em um sistema operacional linux como por exemplo, em um Ubuntu, abra o terminal e crie uma pasta chamada `hello_world_rust` e entre nela. Os comandos para isso são:
```bash
$ mkdir hello_world_rust
$ cd hello_world_rust
``` 
Para a edição dos códigos, aconselho você utilizar o vscode. Então, abra o vscode na pasta do projeto. Ou seja, se você tiver entrado na pasta `hello_world_rust`, basta digitar no terminal `code .` e o vscode será aberto na pasta atual.

Crie um arquivo chamado `main.rs` e adicione a função main, pois ela é sempre o primeiro código que será executádo em um programa Rust. Deixe seu `main.rs` igual ao código abaixo:
```rust
fn main() {
    println!("Hello, world!");
}
```
Para poder reproduzir o código, utilize os comandos:
```bash
$ rustc main.rs
$ ./main
Hello, world!
```
O comando `rustc main.rs` compilou o código contigo no arquivo `main.rs` e gerou um executável chamado `main`.
Com o comando `./main` você irá executar o programa compilado e ele irá retornar o "Hello, world!".

### Conclusão
Por hoje é isso. Entendemos o que é Rust, aprendemos a instalar e criamos nosso primeiro programa. Em breve venho com mais!

Deus abençoe!