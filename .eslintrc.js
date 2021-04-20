module.exports = {
  root: true,
  extends: 'koa',
  rules: {
    // allow async-await
    quotes: [1, 'single'], // 引号类型
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-unused-vars': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0,
    'no-path-concat': 0,
    'no-useless-escape': 'off'
  }
};
