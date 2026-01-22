import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const isMobileDevice = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const generatePDF = async (
  elementId,
  fileName = 'digital-card-a4.pdf'
) => {
  let mobileWindow = null;

  if (isMobileDevice()) {
    mobileWindow = window.open('', '_blank');
    if (!mobileWindow) {
      alert('Please allow popups to generate PDF.');
      return;
    }

    mobileWindow.document.write(`
      <html>
        <body style="
          background:#000;
          color:white;
          display:flex;
          justify-content:center;
          align-items:center;
          height:100vh;
          font-family:sans-serif;
        ">
          <h3>Generating PDF...</h3>
        </body>
      </html>
    `);
  }

  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    if (mobileWindow) mobileWindow.close();
    return;
  }

  try {
    // --------------------------------------------------
    // CLONE ELEMENT
    // --------------------------------------------------
    const clone = originalElement.cloneNode(true);
    const container = document.createElement('div');

    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.left = '0';
    container.style.width = '100%';

    document.body.appendChild(container);
    container.appendChild(clone);

    clone.style.width = '100%';
    clone.style.height = 'auto';
    clone.style.overflow = 'visible';

    // Remove unwanted elements
    clone
      .querySelectorAll('[data-pdf-ignore="true"]')
      .forEach(el => el.remove());

    await new Promise(res => setTimeout(res, 500));

    // --------------------------------------------------
    // CAPTURE FULL PAGE
    // --------------------------------------------------
    const canvas = await html2canvas(clone, {
      scale: 4,
      useCORS: true,
      backgroundColor: '#000000',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // --------------------------------------------------
    // EXTRACT LINKS
    // --------------------------------------------------
    const linkData = [];
    const cloneRect = clone.getBoundingClientRect();

    clone.querySelectorAll('[data-pdf-url]').forEach(el => {
      const rect = el.getBoundingClientRect();
      linkData.push({
        url: el.getAttribute('data-pdf-url'),
        xRatio: (rect.left - cloneRect.left) / cloneRect.width,
        yRatio: (rect.top - cloneRect.top) / cloneRect.height,
        wRatio: rect.width / cloneRect.width,
        hRatio: rect.height / cloneRect.height,
      });
    });

    document.body.removeChild(container);

    // --------------------------------------------------
    // CREATE A4 PDF (FULL BLEED)
    // --------------------------------------------------
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgProps = pdf.getImageProperties(imgData);
    const imgRatio = imgProps.width / imgProps.height;
    const pageRatio = pdfWidth / pdfHeight;

    let renderWidth, renderHeight, xOffset, yOffset;

    // 🔥 COVER logic (fills entire page)
    if (imgRatio > pageRatio) {
      // Image is wider → fit height
      renderHeight = pdfHeight;
      renderWidth = renderHeight * imgRatio;
      xOffset = (pdfWidth - renderWidth) / 2;
      yOffset = 0;
    } else {
      // Image is taller → fit width
      renderWidth = pdfWidth;
      renderHeight = renderWidth / imgRatio;
      xOffset = 0;
      yOffset = (pdfHeight - renderHeight) / 2;
    }

    pdf.addImage(
      imgData,
      'JPEG',
      xOffset,
      yOffset,
      renderWidth,
      renderHeight
    );

    // --------------------------------------------------
    // ADD CLICKABLE LINKS (FULL PAGE)
    // --------------------------------------------------
    linkData.forEach(link => {
      const x = link.xRatio * renderWidth + xOffset;
      const y = link.yRatio * renderHeight + yOffset;
      const w = link.wRatio * renderWidth;
      const h = link.hRatio * renderHeight;

      if (Number.isFinite(x + y + w + h)) {
        pdf.link(x, y, w, h, { url: link.url });
      }
    });

    // --------------------------------------------------
    // SAVE / OPEN
    // --------------------------------------------------
    if (mobileWindow) {
      const blob = pdf.output('blob');
      mobileWindow.location.href = URL.createObjectURL(blob);
    } else {
      pdf.save(fileName);
    }
  } catch (err) {
    console.error(err);
    if (mobileWindow) mobileWindow.close();
  }
};
