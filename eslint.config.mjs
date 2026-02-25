import globals from "globals";
import tseslint from "typescript-eslint";
import nextPlugin from "eslint-config-next";

export default tseslint.config(
  {
    ignores: [".next/", "node_modules/"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...nextPlugin,
  ...tseslint.configs.recommended
);
