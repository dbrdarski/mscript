import { getOrSetDefault } from "../utils";
import { getNodeType } from "../parser";
import * as types from "./node-types";

export const keywords = {};

export const addKeyword = (options) => {
  keywords[options.value] = options;
};

const operators = [];
const operatorsMap = {};

export const addOperator = ({ type, value, ...rest }) => {
  type = getNodeType(type);
  const options = {
    type,
    value,
    ...rest
  };

  getOrSetDefault(operatorsMap, value, []).push(options);
  operators.push(options);
};

// export const initOperators = () => ;

addOperator({ value: "+", precedence: 13, type: types.BinaryExpression });
addOperator({ value: "-", precedence: 13, type: types.BinaryExpression });
addOperator({ value: "*", precedence: 14, type: types.BinaryExpression });
addOperator({ value: "/", precedence: 14, type: types.BinaryExpression });
addOperator({ value: ".", precedence: 14, type: types.BinaryExpression });
// addOperator({ value: "...", precedence: 11 });
addOperator({ value: ":", precedence: 3, type: types.MatchExpression });
// addOperator({ value: "=", precedence: 3, type: types.AssignmentExpression });

addKeyword({ value: "typeof", precedence: 15, type: types.UnaryExpression });
addKeyword({ value: "instanceof", precedence: 11, type: types.BinaryExpression });
addKeyword({ value: "true", type: types.BooleanLiteral });
addKeyword({ value: "false", type: types.BooleanLiteral });
addKeyword({ value: "null", type: types.NullLiteral });

export function initOperators() {
  return operators.sort((a,b) => b.value.length - a.value.length);
}

export const matchOperator = (o) => {
  return operatorsMap[o];
}

// export const matchKeyword = (o) => {
//   return operatorsMap[o][0];
// }
