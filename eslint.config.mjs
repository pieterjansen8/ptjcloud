import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { rule } from "postcss/lib/postcss";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  rule("@typescript-eslint/no-unused-vars", "off"),
  rule("@typescript-eslint/no-non-null-asserted-optional-chain", "off"),
];

export default eslintConfig;
