const chalk = require('chalk');
const log = console.log;

export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const DisAllowedFunctionExpressionTypes = ['ArrowFunctionExpression', 'FunctionExpression', 'ObjectExpression'];

  function getCatchBlockExpression() {
    if(options.catchBlock) {
      try {
        const astOfCatchBlockParsed = j(options.catchBlock);
        let astCatchBlock = [
          j.expressionStatement(
            j.callExpression(j.memberExpression(j.identifier('console'), j.identifier('log')), [j.identifier('e')])
          )
        ];
        astOfCatchBlockParsed.find(j.Program).forEach(path => {
          astCatchBlock = path.node.body;
        });
        return astCatchBlock;
      } catch (e) {
        log(chalk.red('Malformed code block passed to catchBlock. Please refer to the documentation'));
        log(chalk.blue('Defaulting to console.log(e) inside catch block'));
        return [
          j.expressionStatement(
            j.callExpression(j.memberExpression(j.identifier('console'), j.identifier('log')), [
              j.identifier('e')
            ])
          )
        ];
      }
    }
    return [j.expressionStatement(j.callExpression(j.memberExpression(j.identifier('console'), j.identifier('log')), [j.identifier('e')]))];
  }
  function isAlreadyInsideTryBlock(path) {
    return j(path).closest(j.TryStatement).length;
  }
  function doesNotHaveAwaitStatement(path) {
    return !j(path).find(j.AwaitExpression).length;
  }
  function replaceWithAssignmentExpression(path, id, init) {
    j(path).replaceWith(j.expressionStatement(j.assignmentExpression('=', id, init)));
  }
  function insertVariablesInOuterScope(path, declarators) {
    j(path).insertBefore(j.variableDeclaration('let', declarators));
  }
  function replaceWithTryCatch(path, type) {
    if (isAlreadyInsideTryBlock(path) || doesNotHaveAwaitStatement(path)) return;
    j(path).replaceWith(
      j.tryStatement(
        j.blockStatement([type]),
        j.catchClause(j.identifier('e'), null, j.blockStatement(getCatchBlockExpression()))
      )
    );
  }
  root.find(j.VariableDeclarator).forEach(path => {
    if (path.node.init && DisAllowedFunctionExpressionTypes.indexOf(path.node.init.type) < 0) {
      if (!doesNotHaveAwaitStatement(path)) {
        const init = path.node.init;
        let declarators;
        if (path.node.id.type === 'ArrayPattern') {
          const elements = path.node.id.elements;
          replaceWithAssignmentExpression(path.parent, j.arrayPattern(elements), init);
          declarators = elements.map(declarator => {
            return j.variableDeclarator(declarator, null);
          });
        } else {
          const name = path.node.id.name;
          declarators = [j.variableDeclarator(j.identifier(name), null)];
          replaceWithAssignmentExpression(path.parent, j.identifier(name), init);
        }
        insertVariablesInOuterScope(path.parent, declarators);
      }
    }
  });

  root.find(j.ExpressionStatement).forEach(path => {
    if (path.node.expression.type !== 'CallExpression') {
      replaceWithTryCatch(path, path.node);
    }
  });

  root.find(j.ReturnStatement).forEach(path => {
    replaceWithTryCatch(path, path.node);
  });
  return root.toSource();
}
