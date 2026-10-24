/**
 * @file tree-sitter grammer for Doxygen markup
 * @author Marian Buschsieweke <marian.buschsieweke@posteo.net>
 * @license 0BSD
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

function _cmd(name) {
  return seq(choice('@', '\\'), field('command', name));
}

/* hack in a whitepsace after cmd name to force that e.g. "@param" is not
* parsed as <@p><aram> */
function _cmd_workaround(name) {
  return seq(choice('@', '\\'), field('command', name), /[ \t]+/);
}

export default grammar({
  name: 'doxygen',

  conflicts: $ => [
    [$._block_command_param],
    [$._block_command_with_description],
    [$._block_command_with_one_parameter_and_description],
    [$._parse_text],
    [$._prefix_doc_item],
  ],

  extras: $ => [
    /[ \t]+/,
    $.comment
  ],

  word: $ => $._word,

  externals: $ => [
    $._ext_new,
    $._ext_cont,
    $._ext_after,
    $._ext_end,
    $._code_start,
    $.code_language,
    $._code_language_end,
    $.code_line,
    $._code_end,
    $.comment,
  ],

  rules: {
    source_file: $ => choice(
      $.prefix_doc,
      $.postfix_doc,
    ),

    _linebreak: _ => seq(optional('\r'), '\n'),

    postfix_doc: $ => seq(
      $._ext_after,
      optional($.param_attribute),
      $._parse_text,
      optional($._linebreak),
      $._ext_end,
      repeat($._linebreak),
    ),

    _prefix_doc_item: $=> choice(
      prec(-1, seq($._ext_new, $.paragraph)),
      seq($._ext_new, $.markdown),
      seq(
        choice($._ext_new, $._ext_cont),
        choice($.block_command, $.code_block),
        $._linebreak,
      ),
      seq(
        choice($._ext_new, $._ext_cont), $.header,
        optional(seq($._ext_cont, $.paragraph)),
      ),
    ),

    _prefix_doc_item_last: $=> choice(
      seq(choice($._ext_new, $._ext_cont), $.block_command),
      seq($._ext_new, alias($._parse_text, $.paragraph)),
    ),

    prefix_doc: $ => seq(
      repeat($._prefix_doc_item),
      optional($._prefix_doc_item_last),
      $._ext_end,
      repeat($._linebreak),
    ),

    // Markdown headers
    header: $ => seq(
      '#',
      field('title', /[^\r\n]+/),
      $._linebreak,
    ),

    // Block commands: Parse on until either an empty line or a new block
    // command is found.
    block_command: $ => choice(
      $._block_command_param,
      $._block_command_no_args,
      $._block_command_with_description,
      $._block_command_with_one_parameter_and_description,
      $._block_command_with_optional_title_and_description,
      $._block_command_with_parameters,
      $._block_command_with_code,
    ),

    _block_command_param: $ => seq(
      _cmd('param'),
      optional($.param_attribute),
      optional(seq($.parameter, optional($.description)))
    ),

    param_attribute: $ => token(seq(
      '[',
      choice(
        'in',
        'out',
        'in,out',
      ),
      ']'
    )),

    _block_command_with_description: $ => seq(
      choice(
        _cmd('addindex'),
        _cmd('arg'),
        _cmd('attention'),
        _cmd('author'),
        _cmd(alias('authors', 'author')),
        _cmd('brief'),
        _cmd(alias('short', 'brief')),
        _cmd('bug'),
        _cmd('copyright'),
        _cmd('date'),
        _cmd('deprecated'),
        _cmd('details'),
        _cmd('important'),
        _cmd('invariant'),
        _cmd('mainpage'),
        _cmd('name'),
        _cmd('noop'),
        _cmd('note'),
        _cmd('post'),
        _cmd('pre'),
        _cmd('raisewarning'),
        _cmd('remark'),
        _cmd(alias('remarks', 'remark')),
        _cmd('return'),
        _cmd(alias('result', 'return')),
        _cmd(alias('returns', 'return')),
        _cmd('since'),
        _cmd('test'),
        _cmd('todo'),
        _cmd('version'),
        _cmd('vhdlflow'),
        _cmd('warning'),
      ),
      optional($.description),
    ),

    _block_command_no_args: $ => choice(
      _cmd('callergraph'),
      _cmd('callgraph'),
      _cmd('collaborationgraph'),
      _cmd('directorygraph'),
      _cmd('docbookonly'),
      _cmd('else'),
      _cmd('endcond'),
      _cmd('enddocbookonly'),
      _cmd('endhtmlonly'),
      _cmd('endif'),
      _cmd('endinternal'),
      _cmd('endlatexonly'),
      _cmd('endlink'),
      _cmd('endmanonly'),
      _cmd('endparblock'),
      _cmd('endrtfonly'),
      _cmd('endxmlonly'),
      _cmd('groupgraph'),
      _cmd('hidecallergraph'),
      _cmd('hidecallgraph'),
      _cmd('hidecollaborationgraph'),
      _cmd('hidedirectorygraph'),
      _cmd('hideenumvalues'),
      _cmd('hidegroupgraph'),
      _cmd('hideincludedbygraph'),
      _cmd('hideincludegraph'),
      _cmd('hideinheritancegraph'),
      _cmd('hideinitializer'),
      _cmd('hideinlinesource'),
      _cmd('hiderefby'),
      _cmd('htmlonly'),
      _cmd('includedbygraph'),
      _cmd('includegraph'),
      _cmd('internal'),
      _cmd('latexonly'),
      _cmd('lineinfo'),
      _cmd('manonly'),
      _cmd('nosubgrouping'),
      _cmd('parblock'),
      _cmd('private'),
      _cmd('privatesection'),
      _cmd('property'),
      _cmd('protected'),
      _cmd('protectedsection'),
      _cmd('public'),
      _cmd('publicsection'),
      _cmd('pure'),
      _cmd('rtfonly'),
      _cmd('showenumvalues'),
      _cmd('showinitializer'),
      _cmd('showinlinesource'),
      _cmd('showrefby'),
      _cmd('showrefs'),
      _cmd('static'),
      _cmd('xmlonly'),
      _cmd('{'),
      _cmd('}'),
    ),

    _block_command_with_one_parameter_and_description: $ => seq(
      choice(
        _cmd('addtogroup'),
        _cmd('defgroup'),
        _cmd('exception'),
        _cmd('page'),
        _cmd('paragraph'),
        _cmd('requirement'),
        _cmd('retval'),
        _cmd('section'),
        _cmd('subparagraph'),
        _cmd('subsection'),
        _cmd('subsubparagraph'),
        _cmd('subsubsection'),
        _cmd('throw'),
        _cmd(alias('throws', 'throw')),
        _cmd('tparam'),
        _cmd('weakgroup'),
      ),
      optional(seq($.parameter, optional($.description))),
    ),

    _block_command_with_optional_title_and_description: $ => seq(
      choice(
        _cmd('par'),
      ),
      choice(
        seq(
          alias(/[^\r\n]+/, $.parameter),
          $._linebreak,
          $._ext_cont,
          $.description,
        ),
        seq(
          $._linebreak,
          $._ext_cont,
          $.description
        )
      )
    ),

    _block_command_with_parameters: $ => seq(
      choice(
        _cmd('anchor'),
        _cmd('category'),
        _cmd('cite'),
        _cmd('class'),
        _cmd('concept'),
        _cmd('cond'),
        _cmd('copybrief'),
        _cmd('copydetails'),
        _cmd('copydoc'),
        _cmd('diafile'),
        _cmd('dir'),
        _cmd('docbookinclude'),
        _cmd('dontinclude'),
        _cmd('dotfile'),
        _cmd('doxyconf'),
        _cmd('elseif'),
        _cmd('emoji'),
        _cmd('enum'),
        _cmd('example'),
        _cmd('mscfile'),
        _cmd('extends'),
        _cmd('file'),
        _cmd('fileinfo'),
        _cmd('headerfile'),
        _cmd('htmlinclude'),
        _cmd('idlexcept'),
        _cmd('if'),
        _cmd('ifnot'),
        _cmd('implements'),
        _cmd('include'),
        _cmd('includedoc'),
        _cmd('includelineno'),
        _cmd('ingroup'),
        _cmd('inheritancegraph'),
        _cmd('interface'),
        _cmd('latexinclude'),
        _cmd('link'),
        _cmd('maninclude'),
        _cmd('memberof'),
        _cmd('module'),
        _cmd('namespace'),
        _cmd('package'),
        _cmd('protocol'),
        _cmd('qualifier'),
        _cmd('related'),
        _cmd('relatedalso'),
        _cmd('relates'),
        _cmd('relatesalso'),
        _cmd('rtfinclude'),
        _cmd('sa'),
        _cmd(alias('see', 'sa')),
        _cmd('showdate'),
        _cmd('struct'),
        _cmd('union'),
        _cmd('verbinclude'),
        _cmd('xmlinclude'),
      ),
      repeat($.parameter),
    ),

    _block_command_with_code: $ => seq(
      choice(
        _cmd('def'),
        _cmd('fn'),
        _cmd('line'),
        _cmd('overload'),
        _cmd('skip'),
        _cmd('skipline'),
        _cmd('typedef'),
        _cmd('until'),
        _cmd('var'),
      ),
      optional($.code_parameter),
    ),

    parameter: _ => /[^@\[\]\t\r\n ][^\[\]\t\r\n ]*/,

    code_parameter: _ => /[^\r\n]+/,

    description: $ => seq(
      optional(seq($._linebreak, $._ext_cont)),
      $._parse_text,
    ),

    paragraph: $ => choice(
      prec(-1, seq($._parse_text, $._linebreak)),
    ),

    content: $ => repeat1($._inline),

    _parse_text: $ => seq(
      $.content,
      repeat(seq($._linebreak, $._ext_cont, $.content)),
    ),

    _inline: $ => seq(
      choice(
        $.bold,
        $.italic,
        $.code,
        $.inline_command,
        $.inline_formula,
        $.link,
        $.email,
        prec(-1, $._word),
        prec(-2, $._special_char),
        $.comment,
      )
    ),

    _word: _ => token(/[^#\[\]\(\)\@\\\n\t `\*"\|~]+/),

    _special_char: _ => token(/[#\[\]\(\)\@\\\*`"\|~]/),

    // Markdown styling
    _styleable: _ => choice(
      /[A-Za-z][A-Za-z ][A-Za-z]*/,
      /[A-Za-z]/,
    ),
    bold: $ => prec.left(seq('**', field('text', $._styleable), '**')),
    italic: $ => prec.left(seq('*', field('text', $._styleable), '*')),
    code: $ => prec.left(seq('`', field('code', /[^`\r\n]*/), '`')),

    // Inline commands
    inline_command: $ => choice(
      $._inline_command_one_parameter,
      $._ref_command,
    ),

    _inline_command_one_parameter: $ => seq(
      choice(
        _cmd_workaround('a'),
        _cmd_workaround('b'),
        _cmd_workaround('c'),
        _cmd_workaround('e'),
        _cmd_workaround('em'),
        _cmd_workaround('p'),
      ),
      choice(
        $.inline_command,
        $.parameter,
      )
    ),

    _ref_command: $ => seq(
      _cmd_workaround('ref'),
      $.parameter,
      optional(seq('"', alias(/[^\r\n"]+/, $.parameter), '"')),
    ),

    _inline_math: $ => alias(repeat1(choice(
      /[^\r\n\t \\@][^\r\n\t ]*/,
      /[\\@][^\r\n\t f][^\r\n\t ]*/,
      /[\\@]f[^\r\n\t \$\)][^\r\n\t ]*/,
    )), $.math),

    inline_formula: $ => choice(
      seq(_cmd('f('), $._inline_math, _cmd('f)')),
      seq(_cmd('f$'), $._inline_math, _cmd('f$')),
    ),

    // Markdown links
    email: $ => token(seq(
      '<',
      field('email', seq(/[a-zA-Z0-9_.-]+/, '@', /[a-zA-Z0-9_.-]+/)),
      '>'
    )),

    link_uri: _ => token(/[^ \r\n\t\(\)\[\]]+/),
    link: $ => choice(
      $._link_ref_def,
      $._link_inline,
      $._link_ref_long,
      prec(-1, $._link_ref_short),
    ),

    _link_inline: $ => seq(
      '[', field('text', $.content), '](', $.link_uri, ')'
    ),

    _link_ref_long: $ => seq(
      '[', field('text', $.content), '][', alias($.link_uri, $.link_ref), ']'
    ),

    _link_ref_def: $ => seq(
      '[', alias($.content, $.link_ref), ']:', $.link_uri,
    ),

    _link_ref_short: $ => seq(
      '[', alias($.content, $.link_ref), ']',
    ),


    // markdown blocks (for injection queries)
    markdown: $ => choice(
      $._markdown_table,
      $._markdown_list,
    ),

    _markdown_table: $ => prec.right(seq(
      alias($._markdown_table_row, $.markdown_line),
      $._ext_cont, alias($._markdown_table_line, $.markdown_line),
      repeat(seq($._ext_cont, alias($._markdown_table_row, $.markdown_line))),
    )),
    _markdown_table_row: _ => token(seq(
      '|', repeat1(seq(/[^\r\n\|]+/, '|')), /\r?\n/,
    )),
    _markdown_table_line: _ => token(seq(
      '|', repeat1(seq(/[\- \:]+/, '|')), /\r?\n/,
    )),

    _markdown_list: $ => prec.right(seq(
      alias($._markdown_list_row_first, $.markdown_line),
      repeat(seq($._ext_cont, alias($._markdown_list_row_cont, $.markdown_line))),
    )),
    _markdown_list_row_first: $ => token(seq(
      choice(
        /[\*\-][\t ]/,
        /[0-9][\.\)][\t ]/,
      ),
      /[^\r\n]*\r?\n/,
    )),
    _markdown_list_row_cont: $ => choice(
      $._markdown_list_row_first,
      token(seq(choice('  ', '\t'), /[^\r\n]+\r?\n/))
    ),

    // code blocks  (for injection queries)
    code_block: $ => seq(
      $._code_start,
      optional(seq($.code_language, $._code_language_end)),
      $._linebreak,
      repeat(seq(
        $._ext_cont,
        $.code_line,
      )),
      $._ext_cont,
      $._code_end,
    ),
  }
});
