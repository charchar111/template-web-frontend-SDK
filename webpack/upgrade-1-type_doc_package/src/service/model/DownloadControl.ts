import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export class DownloadControl {
  constructor() {}

  #findElement(selector: string): HTMLElement | null {
    const element = document.querySelector(selector);
    if (!element) {
      console.error(`선택자 ${selector}에 해당하는 요소를 찾을 수 없습니다.`);
      return null;
    }
    return element as HTMLElement;
  }

  async #captureCanvas(element: HTMLElement) {
    try {
      console.log(`'${element.tagName}' 요소 캡처를 시작합니다...`);
      const canvas = await html2canvas(element, {
        useCORS: true, // 외부 이미지가 포함된 경우 필수
        allowTaint: true,
        onclone: (clonedDocument) => {
          const clonedTooltip = clonedDocument.querySelector(
            ".tooltip",
          ) as HTMLElement | null;

          if (clonedTooltip) {
            clonedTooltip.style.boxShadow = "none";
          }
        },
      });
      console.log("요소 캡처가 완료되었습니다.");

      return canvas;
    } catch (error) {
      console.error("html2canvas 캡처 중 오류가 발생했습니다:", error);
      return null;
    }
  }

  async toPNG(selector: string, fileName: string = "캡쳐지도.png") {
    const element = this.#findElement(selector);
    if (!element) return;

    const canvas = await this.#captureCanvas(element);
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = fileName.endsWith(".png") ? fileName : `${fileName}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("PNG 파일 다운로드가 완료되었습니다.");
  }

  async toPDF(selector: string, fileName: string = "캡쳐지도.pdf") {
    const element = this.#findElement(selector);
    if (!element) return;

    const canvas = await this.#captureCanvas(element);
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const orientation = canvas.width > canvas.height ? "landscape" : "portrait";

    const pdf = new jsPDF({
      orientation: orientation,
      unit: "px",
      // 캔버스 크기를 그대로 PDF 포맷으로 지정
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(dataURL, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${fileName}.pdf`);

    console.log("PDF 파일 다운로드가 완료되었습니다.");
  }
}
