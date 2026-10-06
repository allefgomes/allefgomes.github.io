---
layout: post
title: "The Rust language"
date: 2022-12-14 00:00:00 +0000
description: An introduction to the Rust language
img: rust/rust-lang.jpeg
tags: [Rust, Functional Programming]
---

Hi!

I've been learning `Rust` to bring more performance to some problems I've been facing at work. So this is the start of a series of notes I'll be writing to understand and use Rust here at the company.

### Rust
Rust focuses on efficiency and reliability.
It's extremely fast, manages memory efficiently, and its type system and _ownership_ model guarantee memory safety and thread safety. On top of that, it has great documentation, a friendly compiler with useful error messages, and first-class tooling.

Rust has an interesting way of teaching its fundamentals: ["the book"](https://doc.rust-lang.org/book/), which gives an overview of the language from first principles.

### Installation
Rust is installed through rustup. On the official [`rustup`](https://rustup.rs/) site you can see how to install it on your operating system. On Linux it was really simple. I just ran `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh` in the terminal.

After that, you can check the installation by running `rustc --version`, which in my case returned `rustc 1.65.0 (897e37553 2022-11-02)`.

Besides rustc, it also installed [`cargo`](https://doc.rust-lang.org/cargo/), Rust's package manager. Beyond managing dependencies, cargo compiles your packages, builds distributable packages and uploads them to [`crates.io`](https://crates.io), the registry of packages for Rust applications.

### Hello World
Assuming you're on a Linux system such as Ubuntu, open the terminal, create a folder called `hello_world_rust` and enter it. The commands are:
```bash
$ mkdir hello_world_rust
$ cd hello_world_rust
```
For editing code, I recommend VS Code. Open VS Code in the project folder: if you're inside `hello_world_rust`, just type `code .` in the terminal and VS Code will open in the current folder.

Create a file called `main.rs` and add the main function, since it's always the first code that runs in a Rust program. Make your `main.rs` look like this:
```rust
fn main() {
    println!("Hello, world!");
}
```
To run the code, use these commands:
```bash
$ rustc main.rs
$ ./main
Hello, world!
```
The `rustc main.rs` command compiled the code in `main.rs` and produced an executable called `main`.
With `./main` you run the compiled program, and it prints "Hello, world!".

### Conclusion
That's it for today. We learned what Rust is, how to install it, and wrote our first program. More soon!

God bless!
