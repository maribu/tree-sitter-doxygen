Doxygen Grammar for Tree-Sitter
===============================

This repository contains a [tree-sitter][] grammar for the [Doxygen][] markup.
It supports most of the [special commands][] of Doxygen, basic markdown styling
natively, and markdown lists and tables via injections. It also supports code
blocks with injections.

Terminology
-----------

This grammar divides Doxygen's special commands into two groups: Block commands
and inline commands. Block commands such as `@brief` or `@return` can only
appear at the beginning of a comment line. Block commands can accept parameters
(single word arguments) or a description (a variable length argument that is a
text that can contain inline arguments and markdown styling).

Inline commands such as `@p`, `@ref`, or `@em` can appear within the description
of a block command or in a paragraph.

The grammar categorizes any text in the Doxygen markup that is not belonging
to any block command as paragraphs.

Paragraphs and descriptions are terminated by either a block command or an
empty line.

Limitations
-----------

There a number design limitations:

- Stripping of comment markers is limited to C and C++ style comments, as well
  as files that contain Doxygen markup without any comments, as Doxygen supports
  parsing markdown files as well.
- The C comment handling is opinionated and requires each consecutive line to
  be started with `[\t ]*\*[\t ]` and will trim that. If the line doesn't start
  with that pattern, it will trim nothing. A C style comment without leading
  `*` will run into issues with markdown lists with `*`.
- Use of special Doxygen commands within markdown lists and markdown tables
  won't work, this grammar forwards them via injections to a markdown grammar
  and does not support them natively.
- The grammar will parse commands even when not syntactically correct. This is
  in part to simplify the grammar, but it also allows syntax highlighting
  while a command is not fully typed yet.

[tree-sitter]: https://tree-sitter.github.io
[Doxygen]: https://www.doxygen.nl
[special commands]: https://www.doxygen.nl/manual/commands.html
