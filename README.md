## About

A version of game of life coded in Rust -> WebAssembly and Javascript. I kinda
followed [this](https://rustwasm.github.io/book/introduction.html) tutorial
from rustwasm and just really wanted to try WebAssembly.

To run the "dev server" all you need to do is go through a bunch of hoops.

- You have to install _wasm-pack_ for compiling Rust into WebAssembly.
  - This can be done by running `cargo install wasm-pack` (make sure you have
  the latest rust toolchain rustacean!)
  - Then you have to run `wasm-pack build` in the root directory to build
  into Javascript and WebAssembly
- Then you have to cd into _./www_ and run `npm install`
- Finally you can run `npm start` in _./www_
  
I think that should be it.