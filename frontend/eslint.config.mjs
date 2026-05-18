import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

const config = [
  // Next.js flat config — includes React, React Hooks, @next/next, jsx-a11y, import, TypeScript
  ...nextCoreWebVitals,

  // Prettier — applied last so formatting rules win over style rules
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",

      // react-hooks/set-state-in-effect (react-hooks v7) is too aggressive:
      // it flags the standard `useEffect(() => { fetchData(); }, [dep])` pattern.
      "react-hooks/set-state-in-effect": "off",

      // no-img-element is a performance recommendation, not a correctness rule.
      // Address as a separate next/image migration task.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
