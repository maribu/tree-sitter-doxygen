/**
 * @file tree-sitter grammar for Doxygen markup
 * @author Marian Buschsieweke <marian.buschsieweke@posteo.net>
 * @license 0BSD
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "doxygen",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
