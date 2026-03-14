[default]
test: test-scanner test-grammar

test-scanner:
    cc \
        -std=c11 \
        -Wall \
        -Wextra \
        -Wpedantic \
        -Werror \
        -fsanitize=address \
        -fsanitize=undefined \
        -Og \
        -g \
        -o unit_tests_scanner \
        src/unit_tests_scanner.c
    ./unit_tests_scanner

test-grammar: build-so
    tree-sitter test

test-update: build-so
    tree-sitter test -u

playground: build-wasm
    tree-sitter playground

build-so: generate
    tree-sitter build

build-wasm: generate
    tree-sitter build --wasm

generate:
    tree-sitter generate
