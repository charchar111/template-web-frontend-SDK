#!/usr/bin/env node
/**
 * SDK 빌드 산출물을 git subtree로 분리 & 원격 push 하는 스크립트
 * (git 루트 자동 탐색 버전)
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// JSON 설정 파일 로드
const CONFIG_FILE = path.resolve(
  __dirname,
  "config",
  "subtree-repository.json"
);
if (!fs.existsSync(CONFIG_FILE)) {
  console.error(`❌ 설정 파일이 없습니다: ${CONFIG_FILE}`);
  process.exit(1);
}
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));

// 현재 디렉토리(package.json)에서 버전 읽기
const PKG_FILE = path.resolve(__dirname, "..", "package.json");
if (!fs.existsSync(PKG_FILE)) {
  console.error(`❌ package.json 파일을 찾을 수 없습니다: ${PKG_FILE}`);
  process.exit(1);
}
const PKG = JSON.parse(fs.readFileSync(PKG_FILE, "utf-8"));
const version = PKG.version || "unknown";

// Git 루트 동적 탐색
function getGitRoot() {
  return execSync("git rev-parse --show-toplevel").toString().trim();
}
const GIT_ROOT = getGitRoot();

function run(cmd) {
  console.log("▶", cmd);
  execSync(cmd, { stdio: "inherit", cwd: GIT_ROOT });
}

function main() {
  const [, , type] = process.argv;

  console.log(
    `🚀 서브트리 배포 시작 \n version: ${version} \n  type: ${type} \n `
  );

  if (!type || !CONFIG[type]) {
    console.error(
      `❌ type 인자가 필요합니다. (지원: ${Object.keys(CONFIG).join(", ")})`
    );
    process.exit(1);
  }

  const { prefix, branch } = CONFIG[type];

  console.log(` - prefix: ${prefix}`);
  console.log(` - branch: ${branch}`);

  try {
    // subtree split → branch 생성/갱신
    run(`git subtree split --prefix=${prefix} -b ${branch}`);
    // 원격 저장소 푸시
    run(`git push origin ${branch}:${branch}`);

    console.log(`✅ ${type} 배포 완료 (version: ${version})`);
  } catch (err) {
    console.error("❌ 배포 실패:", err.message);
    process.exit(1);
  }
}

main();
