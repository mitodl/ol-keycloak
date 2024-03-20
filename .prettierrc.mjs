// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/** @type {import("prettier").Config} */
const config = {
  overrides: [
    {
      files: ["*.ftl"],
      options: {
        parser: "html",
      },
    },
  ],
};

export default config;
