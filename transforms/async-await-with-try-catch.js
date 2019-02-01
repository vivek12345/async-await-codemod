export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const ExpressionTypes = ['BinaryExpression', 'LogicalExpression', 'NewExpression', 'ObjectExpression'];
  const DisAllowedFunctionExpressionTypes = ['ArrowFunctionExpression', 'FunctionExpression', 'ObjectExpression'];

  function getCatchBlockExpression() {
    if(options.catchBlock) {
      const [obj, property] = options.catchBlock.split('.');
      if(property) {
        return j.callExpression(j.memberExpression(j.identifier(obj), j.identifier(property)), [
          j.identifier('e')
        ]);
      } else {
        return j.callExpression(j.identifier(obj), [
          j.identifier('e')
        ]);
      }
    }
    return j.callExpression(j.memberExpression(j.identifier('console'), j.identifier('log')), [j.identifier('e')]);
  }
  function isAlreadyInsideTryBlock(path) {
    return j(path).closest(j.TryStatement).length;
  }
  function replaceWithTryCatch(path, type) {
    if (isAlreadyInsideTryBlock(path)) return;
    j(path).replaceWith(
      j.tryStatement(
        j.blockStatement([type]),
        j.catchClause(j.identifier('e'), null, j.blockStatement([j.expressionStatement(getCatchBlockExpression())]))
      )
    );
  }
  root.find(j.AwaitExpression).forEach(path => {
    if (
      path.parent.node &&
      (ExpressionTypes.indexOf(path.parent.node.type) >= 0 || path.parent.node.type === 'VariableDeclarator')
    )
      return;
    if (path.parent.node.type === 'ReturnStatement') {
      replaceWithTryCatch(path.parent, path.parent.node);
    } else {
      replaceWithTryCatch(path, j.expressionStatement(path.node));
    }
  });
  root.find(j.VariableDeclaration).forEach(path => {
    const variableDeclarators = path.node.declarations;
    variableDeclarators.forEach(variableDeclarator => {
      if (
        j(variableDeclarator).find(j.AwaitExpression).length &&
        DisAllowedFunctionExpressionTypes.indexOf(variableDeclarator.init.type) < 0
      ) {
        replaceWithTryCatch(path, path.node);
      }
    });
  });
  root.find(j.AssignmentExpression).forEach(path => {
    if (j(path).find(j.AwaitExpression).length && DisAllowedFunctionExpressionTypes.indexOf(path.node.right.type) < 0) {
      replaceWithTryCatch(path, path.parent.node);
    }
  });
  return root.toSource();
}
