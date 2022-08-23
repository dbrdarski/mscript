const keywords = {};

const addKeyword = (kw, value) => {
  Object.defineProperty(keywords, kw, { value });
}

addKeyword("let");
addKeyword("if");
addKeyword("then");
addKeyword("else");
addKeyword("lamda");
addKeyword("Î»");
addKeyword("true");
addKeyword("false");
addKeyword("js:raw");

function is_keyword(x) {
  return keywords.hasOwnProperty(x);
}

function is_digit(ch) {
  return /[0-9]/i.test(ch);
}

function is_id_start(ch) {
  return /[a-zÎ»_]/i.test(ch);
}

function is_id(ch) {
  return is_id_start(ch) || "?!-<:>=0123456789".indexOf(ch) >= 0;
}

function is_operation_char(ch) {
  return "+-*/%=&|<>!:".indexOf(ch) >= 0;
}

function is_punctuation(ch) {
  return ",;(){}[]:\n".indexOf(ch) >= 0;
}

function is_whitespace(ch) {
  return " \t".indexOf(ch) >= 0;
}

function is_newline(ch) {
  return ch === "\n";
}

module.exports = function TokenStream(input) {
  let current = null;

  return {
    next,
    peek,
    eof,
    croak: input.croak
  };

  function read_while(predicate) {
    var str = "";
    while (!input.eof() && predicate(input.peek()))
      str += input.next();
    return str;
  }

  function read_number() {
    var has_dot = false;
    var number = read_while(function(ch){
      if (ch == ".") {
        if (has_dot) return false;
        has_dot = true;
        return true;
      }
      return is_digit(ch);
    });
    return { type: "num", value: parseFloat(number) };
  }

  function read_identifier() {
    var id = read_while(is_id);
    return {
      type: is_keyword(id) ? "kw" : "var",
      value: id
    };
  }

  function read_escaped(end) {
    var escaped = false, str = "";
    input.next();
    while (!input.eof()) {
      var ch = input.next();
      if (escaped) {
        str += ch;
        escaped = false;
      } else if (ch == "\\") {
        escaped = true;
      } else if (ch == end) {
        break;
      } else {
        str += ch;
      }
    }
    return str;
  }

  function read_string(type) {
    return { type: "str", value: read_escaped(type) };
  }

  function skip_comment() {
    read_while(function(ch){ return ch != "\n" });
    input.next();
  }

  function read_next() {
    read_while(is_whitespace);
    if (input.eof()) return null;
    var ch = input.peek();
    if (ch == "#") {
      skip_comment();
      return read_next();
    }
    if (ch === "\n") return { type: "newline", value: input.next() }
    if (ch === """ || ch === """) return read_string(ch);
    if (is_digit(ch)) return read_number();
    if (is_id_start(ch)) return read_identifier();
    if (is_punctuation(ch)) return {
      type  : "punc",
      value : input.next()
    };
    if (is_operation_char(ch)) return {
      type  : "op",
      value : read_while(is_operation_char)
    };
    input.croak("Can"t handle character: " + ch);
  }

  function peek() {
    return current || (current = read_next());
  }

  function next() {
    var tok = current;
    current = null;
    return tok || read_next();
  }

  function eof() {
    return peek() == null;
  }
}
