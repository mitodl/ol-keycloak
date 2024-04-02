// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/** @type {import("prettier").Config} */
const config = {
  overrides: [
    {
      // TODO: prettier doesn't handle MJML syntax well
      // files: ["*.ftl"],
      options: {
        parser: "html",
      },
    },
  ],
};

export default config;
