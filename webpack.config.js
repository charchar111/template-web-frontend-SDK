const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = () => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  console.log(
    "NODE_ENV:",
    process.env.NODE_ENV,
    "isDevelopment",
    isDevelopment
  );
  return {
    entry: "./src/index.tsx", // 애플리케이션의 진입점. 번들링 시 가장 먼저 시작하는 파일

    // 번들링 결과물
    output: {
      filename: "bundle.js", // 파일 이름
      path: path.resolve(__dirname, "dist"), // 파일 저장 경로
      publicPath: "/", // 브라우저에서 빌드 파일을 요청할 때 서버의 경로. 정적 파일을 찾을 때 중요
      clean: true, // 빌드 시, 이전 빌드 파일을 삭제함. 불필요한 파일이 누적되는 걸 방지
    },

    // 모듈의 경로나 파일 타입을 해석하는 방식을 결정
    // import나 require로 모듈 삽입 시, 경로를 정의하는 방식
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js"], // 확장자가 생략된 경우 가져올 모듈의 파일 확장자 지정
      modules: ["src", "node_modules"], // 모듈을 찾을 때 참조할 디렉토리의 목록을 정의. 자동으로 절대경로로 src와 node_modules부터 사용가능함

      // 경로 별칭 설정/
      // tsconfig.json의 paths와 수동으로 일치시켜 주세요
      alias: {
        "@src": path.resolve(__dirname, "src"),
        "@asset": path.resolve(__dirname, "src", "asset"),
        "@public": path.resolve(__dirname, "public"),
      },
    },
    // 개발용 로컬 서버
    devServer: {
      port: 3000, // 포트번호
      hot: true, // hmr 기능 활성화
      static: path.resolve(__dirname, "public"), // 개발 서버에서 정적 파일을 참조하는 경로
      allowedHosts: "all", // 외부 도메인에서의 접속 허용
      compress: true, // gzip 압축
      host: "0.0.0.0", // ip를 이용해 외부 네트워크 인터페이스에서 접속 허용
    },

    // eval-source-map: 번들 파일 내에 소스맵이 포함. 디버깅 시 원본 소스에 가까운 코드를 제공하나 무거우므로 성능이 느림 => 개발에 적합
    // source-map: 디버깅 시 번들 파일과 별도의 소스 맵을 제공함. eval-source-map보다 원본이 변형되었으나 성능이 빠름 => 배포에 적합
    devtool: isDevelopment ? "eval-source-map" : undefined,
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/, // .ts, .tsx, .js, .jsx 확장자에 대해
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader", // JavaScript 변환을 위한 Babel 로더
            },
            {
              loader: "ts-loader", // TypeScript 로더
              options: {
                // 타입 컴파일링을 수행할 것인지, 아니면 빠르게 트랜스파일만 할 것인지 결정.
                // true로 설정하면 타입 검사를 건너뜀. 대신, 컴파일 산출물(타입) 생성 불가
                transpileOnly: true,
                configFile: "tsconfig.json",
              },
            },
          ],
        },
      ],
    },

    plugins: [
      // 템플릿으로 사용할 html 파일 설정. 해당 html에 정적 리소스 추가 가능
      new HtmlWebpackPlugin({
        template: "public/index.html",
      }),

      // 웹팩 개발 서버에서 타입스크립트 타입 검사를 별도의 프로세스에서 수행
      // hmr 속도 향상 & 타입 에러 확인
      ...(isDevelopment
        ? [
            new ForkTsCheckerWebpackPlugin({
              typescript: { configFile: "tsconfig.json" },
            }),
          ]
        : []),
    ],
  };
};
