import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";


export default [
  {
    input: "src/RayAudio.js",
    output: {
      format: "umd",
      file: "dist/rayAudio.min.js",
      name: "rayAudio"
    },
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs({ include: "node_modules/**" }),
      terser()
    ]
  },
  
];
