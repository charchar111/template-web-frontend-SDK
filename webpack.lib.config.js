// webpack.lib.js
const path = require("path");

const externals = {
  react: "react",
  "react-dom": "react-dom",
  "styled-components": "styled-components",
  // 필요한 peer들 추가
};

// 공통 베이스
const base = {
  entry: "./src/service/index.ts",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    modules: ["src", "node_modules"],
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@asset": path.resolve(__dirname, "src", "asset"),
      "@public": path.resolve(__dirname, "public"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: [
          { loader: "babel-loader" },
          { loader: "ts-loader", options: { transpileOnly: true } },
        ],
      },
    ],
  },
  externals,
  // ✅ 이름 보존을 위해 어떤 난독화/망글링도 하지 않음
  mode: "production", // 배포 최적화(트리쉐이킹 등)는 유지
  devtool: false, // 배포 시 소스맵 OFF
  optimization: {
    minimize: true, // ❗ Terser(내장) 비활성화 → 이름 그대로 유지
  },
};

// ✅ ESM 번들
const esm = {
  ...base,
  name: "esm",
  target: "web",
  experiments: { outputModule: true },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.esm.js",
    library: { type: "module" },
    clean: true,
  },
};

// ✅ CJS 번들
const cjs = {
  ...base,
  name: "cjs",
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.cjs.js",
    library: { type: "commonjs2" },
  },
};

// ✅ UMD(Global) 번들 (브라우저 전역 window.mySDK로 노출)
const umd = {
  ...base,
  name: "umd",
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.umd.js",
    library: {
      name: "mySDK", // 전역 이름 고정
      type: "umd",
      // export: "default", // default export를 window.mySDK로
      umdNamedDefine: true,
    },
    // globalObject: "this", // node/browser 모두 안전
  },
};

module.exports = [esm, cjs, umd];
