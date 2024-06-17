module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    quotes: ["error", "double"],
    "max-len": ["error", { code: 80 }],
    indent: ["error", 2],
    "object-curly-spacing": ["error", "never"],
  },
};
