const fs = require("fs");
const path = require("path");

console.log("🚀 DOC 문서 버전별 정리 실행 : scripts/move-doc.js...");

// 1. package.json 읽기
const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
const version = pkg.version;

// 2. 버전 파싱
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error("❌ Invalid version format in package.json");
  process.exit(1);
}
const [major] = version.split(".");
console.log("🔍 버전 정보:", { version, major });

// 3. 원본 Typedoc 디렉토리
const docsSource = path.join(process.cwd(), "subtree-docs/docs/typedoc");
if (!fs.existsSync(docsSource)) {
  console.error("❌ Typedoc source not found at docs/docs/typedoc");
  process.exit(1);
}

// 4. 대상 디렉토리 (예: docs/docs/v1/typedoc)
const docsTargetDir = path.join(process.cwd(), `subtree-docs/docs/v${major}`);
if (!fs.existsSync(docsTargetDir)) {
  console.log(`📁 새 메이저 버전 감지. 폴더 생성: ${docsTargetDir}`);
  fs.mkdirSync(docsTargetDir, { recursive: true });
}

console.log("🗑️ 기존 파일 제거");
// 기존 typedoc 제거
const existingTypedoc = path.join(docsTargetDir, "typedoc");
if (fs.existsSync(existingTypedoc)) {
  fs.rmSync(existingTypedoc, { recursive: true, force: true });
}

// 5. 새 typedoc 복사
fs.cpSync(docsSource, existingTypedoc, { recursive: true });
console.log(`✅ Docs moved to ${docsTargetDir}/typedoc`);

// 6. 원본 삭제
console.log("🧹 원본 디렉토리 정리");
fs.rmSync(docsSource, { recursive: true, force: true });

console.log(`✅ 파일 이동 작업 완료 : 최종 위치: ${docsTargetDir}/typedoc`);
