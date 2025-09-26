const fs = require("fs");
const path = require("path");

console.log("🚀 패키지 재정리 실행 : scripts/move-pack.js...");

// 1. package.json 읽기
const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const version = pkg.version; // 예: "1.2.3"

// 2. 버전 파싱
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error("❌ Invalid version format in package.json");
  process.exit(1);
}
const [major] = version.split(".");
console.log("🔍 버전 정보:", { version, major });

// 3. pack 산출물 원래 파일명 규칙 (npm pack 결과물)
const originalFileName =
  pkg.name && version
    ? `${pkg.name.replace("@", "").replace("/", "-")}-${version}.tgz`
    : null;

if (!originalFileName) {
  console.error("❌ Failed to resolve package file name from package.json");
  process.exit(1);
}

const sourcePath = path.join(process.cwd(), originalFileName);
if (!fs.existsSync(sourcePath)) {
  console.error(`❌ Pack file not found: ${sourcePath}`);
  process.exit(1);
}

// 4. 대상 디렉토리 (예: v1)
const targetDir = path.join(process.cwd(), `subtree-package/package/v${major}`);
if (!fs.existsSync(targetDir)) {
  console.log(`📁 새 메이저 버전 감지. 폴더 생성: ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });
}

// 5. 기존 파일 제거 (동일 major 내 최신 버전만 유지)
console.log("🗑️ 기존 파일 제거:");
for (const f of fs.readdirSync(targetDir)) {
  if (f.endsWith(".tgz")) {
    fs.unlinkSync(path.join(targetDir, f));
  }
}

// 6. 새 파일명 (버전 제거: sdkname.tgz)
const cleanName = pkg.name.replace("@", "").replace("/", "-");
const targetFileName = `${cleanName}.tgz`;
const targetPath = path.join(targetDir, targetFileName);

// 7. 파일 이동 + 이름 변경
fs.renameSync(sourcePath, targetPath);

console.log(`✅ 파일 이동 작업 완료 : 최종 위치: ${targetPath}`);
