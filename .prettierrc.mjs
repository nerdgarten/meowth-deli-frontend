// @ts-check

/** @satisfies {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  endOfLine: "lf",

  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-astro",
    "prettier-plugin-tailwindcss", // Must be last for proper class sorting
  ],

  importOrder: [
    "^react$",
    "^react/(.*)$",
    "^@astrojs/(.*)$",
    "^astro/(.*)$",
    "^@/(.*)$",
    "^@common/(.*)$",
    "^@firstdate/(.*)$",
    "^@rpkm/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  tailwindConfig: "./tailwind.config.js",
  tailwindFunctions: ["clsx", "cn", "tw"],

  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
    {
      files: ["*.json", "*.jsonc"],
      options: {
        trailingComma: "none",
      },
    },
  ],
};

export default config;
