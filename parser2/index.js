const parse = require('./parser');
const InputStream = require('./input-stream');
const TokenStream = require('./token-stream');
const make_js = require('./generator');

const generateAST = code => parse(TokenStream(InputStream(code)));
const code = `
  asdf = 3
  dfgh = 'hello'
  3 + 4`;

console.log(generateAST(code));

module.exports = {
  parse,
  InputStream,
  TokenStream,
  generateAST
}

// /* -----[ CPS transformer ]----- */
//
// var GENSYM = 0;
//
// function gensym(name) {
//   if (!name) name = "";
//   name = "Î²_" + name;
//   return name + (++GENSYM);
// }
//
// function has_side_effects(exp) {
//   switch (exp.type) {
//     case "call":
//     case "assign":
//     case "raw":
//       return true;
//
//     case "num":
//     case "str":
//     case "bool":
//     case "var":
//     case "lambda":
//       return false;
//
//     case "binary":
//       return has_side_effects(exp.left)
//         || has_side_effects(exp.right);
//
//     case "if":
//       return has_side_effects(exp.cond)
//         || has_side_effects(exp.then)
//         || (exp.else && has_side_effects(exp.else));
//
//     case "let":
//       for (var i = 0; i < exp.vars.length; ++i) {
//         var v = exp.vars[i];
//         if (v.def && has_side_effects(v.def))
//           return true;
//       }
//       return has_side_effects(exp.body);
//
//     case "prog":
//       for (var i = 0; i < exp.prog.length; ++i)
//         if (has_side_effects(exp.prog[i]))
//           return true;
//       return false;
//   }
//   return true;
// }
//
// function to_cps(exp, k) {
//     return cps(exp, k);
//
//     function cps(exp, k) {
//       switch (exp.type) {
//         case "raw"    :
//         case "num"    :
//         case "str"    :
//         case "bool"   : return cps_atom   (exp, k);
//
//         case "assign" :
//         case "binary" : return cps_binary (exp, k);
//
//         case "not"    : return cps_not    (exp, k);
//         case "var"    : return cps_var    (exp, k);
//         case "let"    : return cps_let    (exp, k);
//         case "lambda" : return cps_lambda (exp, k);
//         case "if"     : return cps_if     (exp, k);
//         case "prog"   : return cps_prog   (exp, k);
//         case "call"   : return cps_call   (exp, k);
//         default:
//           throw new Error("Dunno how to CPS " + JSON.stringify(exp));
//       }
//     }
//
//     function cps_atom(exp, k) {
//       return k(exp);
//     }
//
//     function cps_not(exp, k) {
//       return cps(exp.body, function(body){
//         return k({ type: "not", body: body });
//       });
//     }
//
//     function cps_var(exp, k) {
//       return k(exp);
//     }
//
//     function cps_binary(exp, k) {
//       return cps(exp.left, function(left){
//         return cps(exp.right, function(right){
//           return k({ type     : exp.type,
//                      operator : exp.operator,
//                      left     : left,
//                      right    : right });
//         });
//       });
//     }
//
//     function cps_let(exp, k) {
//       if (exp.vars.length == 0)
//         return cps(exp.body, k);
//       return cps({
//         type: "call",
//         args: [ exp.vars[0].def || FALSE ],
//         func: {
//           type: "lambda",
//           vars: [ exp.vars[0].name ],
//           body: {
//             type: "let",
//             vars: exp.vars.slice(1),
//             body: exp.body
//           }
//         }
//       }, k);
//     }
//
//     function cps_lambda(exp, k) {
//       var cont = gensym("K");
//       var body = cps(exp.body, function(body){
//         return {
//           type: "call",
//           func: { type: "var", value: cont },
//           args: [ body ]
//         };
//       });
//       return k({
//         type: "lambda",
//          name: exp.name,
//          vars: [ cont ].concat(exp.vars),
//          body: body
//        });
//     }
//
//     function cps_if(exp, k) {
//       return cps(exp.cond, function(cond){
//         var cvar = gensym("I");
//         var cast = make_continuation(k);
//         k = function(ifresult) {
//           return {
//             type: "call",
//             func: { type: "var", value: cvar },
//             args: [ ifresult ]
//           };
//         };
//         return {
//           type: "call",
//           func: {
//             type: "lambda",
//             vars: [ cvar ],
//             body: {
//               type: "if",
//               cond: cond,
//               then: cps(exp.then, k),
//               else: cps(exp.else || FALSE, k)
//             }
//           },
//           args: [ cast ]
//         };
//       });
//     }
//
//     function cps_call(exp, k) {
//       return cps(exp.func, function(func){
//         return (function loop(args, i){
//           if (i == exp.args.length) return {
//             type : "call",
//             func : func,
//             args : args
//           };
//           return cps(exp.args[i], function(value){
//             args[i + 1] = value;
//             return loop(args, i + 1);
//           });
//         })([ make_continuation(k) ], 0);
//       });
//     }
//
//     function make_continuation(k) {
//       var cont = gensym("R");
//       return {
//         type : "lambda",
//         vars : [ cont ],
//         body : k({
//           type  : "var",
//           value : cont
//         })
//       };
//     }
//
//     function cps_prog(exp, k) {
//       return (function loop(body){
//         if (body.length == 0) return k(FALSE);
//         if (body.length == 1) return cps(body[0], k);
//         if (!has_side_effects(body[0]))
//           return loop(body.slice(1));
//         return cps(body[0], function(first){
//           if (has_side_effects(first)) return {
//             type: "prog",
//             prog: [ first, loop(body.slice(1)) ]
//           };
//           return loop(body.slice(1));
//         });
//       })(exp.prog);
//     }
// }
//
// /* -----[ environment ]----- */
//
// function Environment(parent) {
//   this.vars = Object.create(parent ? parent.vars : null);
//   this.parent = parent;
// }
// Environment.prototype = {
//   extend: function() {
//     return new Environment(this);
//   },
//   lookup: function(name) {
//     var scope = this;
//     while (scope) {
//       if (Object.prototype.hasOwnProperty.call(scope.vars, name))
//         return scope;
//       scope = scope.parent;
//     }
//   },
//   get: function(name) {
//     if (name in this.vars)
//       return this.vars[name];
//     throw new Error("Undefined variable " + name);
//   },
//   set: function(name, value) {
//     var scope = this.lookup(name);
//     if (!scope && this.parent)
//       throw new Error("Undefined variable " + name);
//     return (scope || this).vars[name] = value;
//   },
//   def: function(name, value) {
//     return this.vars[name] = value;
//   },
// };
//
// /* -----[ optimizer ]----- */
//
// function optimize(exp) {
//     var changes, defun;
//     do {
//         changes = 0;
//         make_scope(exp);
//         exp = opt(exp);
//     } while (changes);
//     make_scope(exp);
//     return exp;
//
//     function opt(exp) {
//         if (changes) return exp;
//         switch (exp.type) {
//           case "raw"    :
//           case "num"    :
//           case "str"    :
//           case "bool"   :
//           case "var"    : return exp;
//           case "not"    : return opt_not    (exp);
//           case "binary" : return opt_binary (exp);
//           case "assign" : return opt_assign (exp);
//           case "if"     : return opt_if     (exp);
//           case "prog"   : return opt_prog   (exp);
//           case "call"   : return opt_call   (exp);
//           case "lambda" : return opt_lambda (exp);
//         }
//         throw new Error("I don't know how to optimize " + JSON.stringify(exp));
//     }
//
//     function changed() {
//         ++changes;
//     }
//
//     function is_constant(exp) {
//         return exp.type == "num"
//             || exp.type == "str"
//             || exp.type == "bool";
//     }
//
//     function num(exp) {
//         if (exp.type != "num")
//             throw new Error("Not a number: " + JSON.stringify(exp));
//         return exp.value;
//     }
//
//     function div(exp) {
//         if (num(exp) == 0)
//             throw new Error("Division by zero: " + JSON.stringify(exp));
//         return exp.value;
//     }
//
//     function opt_not(exp) {
//         exp.body = opt(exp.body);
//         return exp;
//     }
//
//     function opt_binary(exp) {
//         exp.left = opt(exp.left);
//         exp.right = opt(exp.right);
//         if (is_constant(exp.left) && is_constant(exp.right)) {
//             switch (exp.operator) {
//               case "+":
//                 changed();
//                 return {
//                     type: "num",
//                     value: num(exp.left) + num(exp.right)
//                 };
//
//               case "-":
//                 changed();
//                 return {
//                     type: "num",
//                     value: num(exp.left) - num(exp.right)
//                 };
//
//               case "*":
//                 changed();
//                 return {
//                     type: "num",
//                     value: num(exp.left) * num(exp.right)
//                 };
//
//               case "/":
//                 changed();
//                 return {
//                     type: "num",
//                     value: num(exp.left) / div(exp.right)
//                 };
//
//               case "%":
//                 changed();
//                 return {
//                     type: "num",
//                     value: num(exp.left) % div(exp.right)
//                 };
//
//               case "<":
//                 changed();
//                 return {
//                     type: "bool",
//                     value: num(exp.left) < num(exp.right)
//                 };
//
//               case ">":
//                 changed();
//                 return {
//                     type: "bool",
//                     value: num(exp.left) > num(exp.right)
//                 };
//
//               case "<=":
//                 changed();
//                 return {
//                     type: "bool",
//                     value: num(exp.left) <= num(exp.right)
//                 };
//
//               case ">=":
//                 changed();
//                 return {
//                     type: "bool",
//                     value: num(exp.left) >= num(exp.right)
//                 };
//
//               case "==":
//                 changed();
//                 if (exp.left.type != exp.right.type)
//                     return FALSE;
//                 return {
//                     type: "bool",
//                     value: exp.left.value === exp.right.value
//                 };
//
//               case "!=":
//                 changed();
//                 if (exp.left.type != exp.right.type)
//                     return TRUE;
//                 return {
//                     type: "bool",
//                     value: exp.left.value !== exp.right.value
//                 };
//
//               case "||":
//                 changed();
//                 if (exp.left.value !== false)
//                     return exp.left;
//                 return exp.right;
//
//               case "&&":
//                 changed();
//                 if (exp.left.value !== false)
//                     return exp.right;
//                 return FALSE;
//             }
//         }
//         return exp;
//     }
//
//     function opt_assign(exp) {
//         if (exp.left.type == "var") {
//             if (exp.right.type == "var" && exp.right.def.cont) {
//                 // the var on the right never changes.  we can safely
//                 // replace references to exp.left with references to
//                 // exp.right, saving one var and the assignment.
//                 changed();
//                 exp.left.def.refs.forEach(function(node){
//                     node.value = exp.right.value;
//                 });
//                 return opt(exp.right); // could be needed for the result.
//             }
//             if (exp.left.def.refs.length == exp.left.def.assigned && exp.left.env.parent) {
//                 // if assigned as many times as referenced and not a
//                 // global, it means the var is never used, drop the
//                 // assignment but keep the right side for possible
//                 // side effects.
//                 changed();
//                 return opt(exp.right);
//             }
//         }
//         exp.left = opt(exp.left);
//         exp.right = opt(exp.right);
//         return exp;
//     }
//
//     function opt_if(exp) {
//         exp.cond = opt(exp.cond);
//         exp.then = opt(exp.then);
//         exp.else = opt(exp.else || FALSE);
//         if (is_constant(exp.cond)) {
//             changed();
//             if (exp.cond.value !== false)
//                 return exp.then;
//             return exp.else;
//         }
//         return exp;
//     }
//
//     function opt_prog(exp) {
//         if (exp.prog.length == 0) {
//             changed();
//             return FALSE;
//         }
//         if (exp.prog.length == 1) {
//             changed();
//             return opt(exp.prog[0]);
//         }
//         if (!has_side_effects(exp.prog[0])) {
//             changed();
//             return opt({
//                 type : "prog",
//                 prog : exp.prog.slice(1)
//             });
//         }
//         if (exp.prog.length == 2) return {
//             type: "prog",
//             prog: exp.prog.map(opt)
//         };
//         // normalize
//         return opt({
//             type: "prog",
//             prog: [
//                 exp.prog[0],
//                 { type: "prog", prog: exp.prog.slice(1) }
//             ]
//         });
//     }
//
//     function opt_call(exp) {
//         // IIFE-s will be optimized away by defining variables in the
//         // containing function.  However, we don't unwrap into the
//         // global scope (that's why checking for env.parent.parent).
//         var func = exp.func;
//         if (func.type == "lambda" && !func.name) {
//             if (func.env.parent.parent)
//                 return opt_iife(exp);
//             // however, if in global scope we can safely unguard it.
//             func.unguarded = true;
//         }
//         return {
//             type : "call",
//             func : opt(func),
//             args : exp.args.map(opt)
//         };
//     }
//
//     function opt_lambda(f) {
//         // Î»(x...) y(x...)  ==>  y
//         TCO: if (f.body.type == "call" &&
//                  f.body.func.type == "var" &&
//                  f.body.func.def.assigned == 0 &&
//                  f.body.func.env.parent &&
//                  f.vars.indexOf(f.body.func.value) < 0 &&
//                  f.vars.length == f.body.args.length) {
//             for (var i = 0; i < f.vars.length; ++i) {
//                 var x = f.body.args[i];
//                 if (x.type != "var" || x.value != f.vars[i])
//                     break TCO;
//             }
//             changed();
//             return opt(f.body.func);
//         }
//         f.locs = f.locs.filter(function(name){
//             var def = f.env.get(name);
//             return def.refs.length > 0;
//         });
//         var save = defun;
//         defun = f;
//         f.body = opt(f.body);
//         if (f.body.type == "call")
//             f.unguarded = true;
//         defun = save;
//         return f;
//     }
//
//     // (Î»(foo, bar){...body...})(fooval, barval)
//     //    ==>
//     // foo = fooval, bar = barval, ...body...
//     function opt_iife(exp) {
//         changed();
//         var func = exp.func;
//         var argvalues = exp.args.map(opt);
//         var body = opt(func.body);
//         function rename(name) {
//             var sym = name in defun.env.vars ? gensym(name + "$") : name;
//             defun.locs.push(sym);
//             defun.env.def(sym, true);
//             func.env.get(name).refs.forEach(function(ref){
//                 ref.value = sym;
//             });
//             return sym;
//         }
//         var prog = func.vars.map(function(name, i){
//             return {
//                 type     : "assign",
//                 operator : "=",
//                 left     : { type: "var", value: rename(name) },
//                 right    : argvalues[i] || FALSE
//             };
//         });
//         func.locs.forEach(rename);
//         prog.push(body);
//         return opt({
//             type: "prog",
//             prog: prog
//         });
//     }
// }
//
// function make_scope(exp) {
//     var global = new Environment();
//     exp.env = global;
//     (function scope(exp, env) {
//         switch (exp.type) {
//           case "num":
//           case "str":
//           case "bool":
//           case "raw":
//             break;
//
//           case "var":
//             var s = env.lookup(exp.value);
//             if (!s) {
//                 exp.env = global;
//                 global.def(exp.value, { refs: [], assigned: 0 });
//             } else {
//                 exp.env = s;
//             }
//             var def = exp.env.get(exp.value);
//             def.refs.push(exp);
//             exp.def = def;
//             break;
//
//           case "not":
//             scope(exp.body, env);
//             break;
//
//           case "assign":
//             scope(exp.left, env);
//             scope(exp.right, env);
//             if (exp.left.type == "var")
//                 exp.left.def.assigned++;
//             break;
//
//           case "binary":
//             scope(exp.left, env);
//             scope(exp.right, env);
//             break;
//
//           case "if":
//             scope(exp.cond, env);
//             scope(exp.then, env);
//             if (exp.else)
//                 scope(exp.else, env);
//             break;
//
//           case "prog":
//             exp.prog.forEach(function(exp){
//                 scope(exp, env);
//             });
//             break;
//
//           case "call":
//             scope(exp.func, env);
//             exp.args.forEach(function(exp){
//                 scope(exp, env);
//             });
//             break;
//
//           case "lambda":
//             exp.env = env = env.extend();
//             if (exp.name)
//                 env.def(exp.name, { refs: [], func: true, assigned: 0 });
//             exp.vars.forEach(function(name, i){
//                 env.def(name, { refs: [], farg: true, assigned: 0, cont: i == 0 });
//             });
//             if (!exp.locs) exp.locs = [];
//             exp.locs.forEach(function(name){
//                 env.def(name, { refs: [], floc: true, assigned: 0 });
//             });
//             scope(exp.body, env);
//             break;
//
//           default:
//             throw new Error("Can't handle node " + JSON.stringify(exp));
//         }
//     })(exp, global);
//     return exp.env;
// }
//
// function debug_js(exp) {
//     var u2 = require("uglify-js");
//     var sys = require("util");
//     var jsc = make_js(exp);
//     sys.error(u2.parse(jsc).print_to_string({
//         beautify: true,
//         indent_level: 2
//     }));
//     // sys.error(jsc);
//     sys.error("/*********************************************/");
// }
//
// var FALSE = { type: "bool", value: false };
// var TRUE = { type: "bool", value: true };
//
// /* -----[ stack guard ]----- */
//
// var STACKLEN, IN_EXECUTE = false;
// function GUARD(args, f) {
//   if (--STACKLEN < 0) throw new Continuation(f, args);
// }
// function Continuation(f, args) {
//   this.f = f;
//   this.args = args;
// }
// function Execute(f, args) {
//     if (IN_EXECUTE)
//         return f.apply(null, args);
//     IN_EXECUTE = true;
//     while (true) try {
//         STACKLEN = 200;
//         f.apply(null, args);
//         break;
//     } catch(ex) {
//         if (ex instanceof Continuation) {
//             f = ex.f, args = ex.args;
//         } else {
//             IN_EXECUTE = false;
//             throw ex;
//         }
//     }
//     IN_EXECUTE = false;
// }
//
// /* -----[ NodeJS CLI test ]----- */
//
// if (typeof process != "undefined") (function(){
//     var u2 = require("uglify-js");
//     var sys = require("util");
//     var print = function(k) {
//         sys.puts([].slice.call(arguments, 1).join(" "));
//         k(false);
//     };
//     function readStdin(callback) {
//         var text = "";
//         process.stdin.setEncoding("utf8");
//         process.stdin.on("readable", function(){
//             var chunk = process.stdin.read();
//             if (chunk) text += chunk;
//         });
//         process.stdin.on("end", function(){
//             callback(text);
//         });
//     }
//     readStdin(function(code){
//         var ast = parse(TokenStream(InputStream(code)));
//         var cps = to_cps(ast, function(x){
//             return {
//                 type: "call",
//                 func: { type: "var", value: "Î²_TOPLEVEL" },
//                 args: [ x ]
//             };
//         });
//
//         //console.log(sys.inspect(cps, { depth: null }));
//
//         var opt = optimize(cps);
//         //var opt = cps; make_scope(opt);
//         var jsc = make_js(opt);
//
//         jsc = "var Î²_TMP;\n\n" + jsc;
//
//         if (opt.env) {
//             var vars = Object.keys(opt.env.vars);
//             if (vars.length > 0) {
//                 jsc = "var " + vars.map(function(name){
//                     return make_js({
//                         type: "var",
//                         value: name
//                     });
//                 }).join(", ") + ";\n\n" + jsc;
//             }
//         }
//
//         jsc = '"use strict";\n\n' + jsc;
//
//         try {
//             sys.error(u2.parse(jsc).print_to_string({
//                 beautify: true,
//                 indent_level: 2
//             }));
//         } catch(ex) {
//             console.log(ex);
//             throw(ex);
//         }
//
//         //sys.error(jsc);
//
//         sys.error("\n\n/*");
//         var func = new Function("Î²_TOPLEVEL, GUARD, print, require, Execute", jsc);
//         console.time("Runtime");
//         Execute(func, [
//             function(result){
//                 console.timeEnd("Runtime");
//                 sys.error("***Result: " + result);
//                 sys.error("*/");
//             },
//             GUARD,
//             print,
//             require,
//             Execute
//         ]);
//     });
// })();
