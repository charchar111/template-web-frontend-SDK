import html2canvas from "html2canvas";

export class PrintControl {
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
      console.log(`요소 캡처를 시작합니다...`);
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

  public async toPrint(selector: string) {
    const element = this.#findElement(selector);
    if (!element) return;

    const canvas = await this.#captureCanvas(element);
    if (!canvas) return;

    const imageDataURL = canvas.toDataURL("image/png");
    const printWindow = window.open("", "printWindow", "width=800, height=600");

    if (!printWindow) {
      console.error("인쇄 창을 열 수 없습니다.");
      return;
    }

    const img = printWindow.document.createElement("img");
    img.src = imageDataURL;
    img.style.width = "100%";

    img.onload = () => {
      printWindow.onafterprint = () => {
        printWindow.close();
      };
      printWindow.print();
    };

    printWindow.document.body.appendChild(img);
  }
}
