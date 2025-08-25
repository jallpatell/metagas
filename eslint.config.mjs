import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // ✅ Allow any type
      "@typescript-eslint/no-explicit-any": "off",
      
      // ✅ Allow unused vars (e.g., useState imports)
      "@typescript-eslint/no-unused-vars": "off",
      
      // ✅ Allow using <img> instead of <Image>
      "@next/next/no-img-element": "off",
      
      // ✅ Reduce strictness for TypeScript
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/explicit-function-return-type": "off"
    },
  },
];

export default eslintConfig;
