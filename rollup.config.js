import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "./index.ts",
  output: [
    {
      file: "dist/index.esm.js",
      format: "es",
    },
    { file: "dist/index.cjs.js", format: "cjs" },
    { file: "dist/index.cjs.min.js", format: "cjs", plugins: [terser()]},
    {
      file: "dist/index.esm.min.js",
      format: "esm",
      name: "weeknumber-iso8601",
      plugins: [terser()],
    },
  ],
  plugins: [typescript()],
};
