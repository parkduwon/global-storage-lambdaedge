module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'implicit-arrow-linebreak': 'off',
        'operator-linebreak': 'off',
        'no-console': 'off',
        'function-paren-newline': 'off',
        'no-underscore-dangle': 'off',
    },
};
