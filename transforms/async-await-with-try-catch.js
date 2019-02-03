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
      replaceWithTryCatch(path.parent, path.parent.node);
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
