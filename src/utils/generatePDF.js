import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Detect mobile devices
const isMobileDevice = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const generatePDF = async (
  elementId,
  fileName = 'digital-profile-a4.pdf'
) => {
  // --------------------------------------------------
  // MOBILE POPUP SAFETY
  // --------------------------------------------------
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
          background:#ffffff;
          color:#000;
          display:flex;
          justify-content:center;
          align-items:center;
          height:100vh;
          font-family:sans-serif;
        ">
          <h3>Generating PDF…</h3>
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
    container.style.zIndex = '-9999';

    document.body.appendChild(container);
    container.appendChild(clone);

    // Force full rendering
    clone.style.width = '100%';
    clone.style.minHeight = '100vh';
    clone.style.height = 'auto';
    clone.style.overflow = 'visible';

    // Remove non-PDF UI
    clone
      .querySelectorAll('[data-pdf-ignore="true"]')
      .forEach(el => el.remove());

    // --------------------------------------------------
    // EXTRA LARGE PROFILE IMAGE
    // --------------------------------------------------
    const profileImg =
      clone.querySelector('.profile-image') ||
      clone.querySelector('[class*="avatar"] img') ||
      clone.querySelector('[class*="profile"] img');

    if (profileImg) {
      profileImg.style.width = '280px';
      profileImg.style.height = '280px';
      profileImg.style.maxWidth = '280px';
      profileImg.style.maxHeight = '280px';
      profileImg.style.borderRadius = '50%';
      profileImg.style.objectFit = 'cover';
      profileImg.style.display = 'block';
      profileImg.style.margin = '40px auto 32px auto';
    }

    // Ensure background color fills page
    const cardContainer =
      clone.querySelector('#card-container') || clone;

    cardContainer.style.minHeight = '100vh';
    cardContainer.style.height = 'auto';
    cardContainer.style.boxShadow = 'none';
    cardContainer.style.borderRadius = '0';

    await new Promise(res => setTimeout(res, 500));

    // --------------------------------------------------
    // CAPTURE CANVAS (NO BLACK BACKGROUND)
    // --------------------------------------------------
    const canvas = await html2canvas(clone, {
      scale: 4,
      useCORS: true,
      backgroundColor: null, // 🔥 IMPORTANT
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
    // CREATE FULL A4 PDF
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

    // COVER MODE → FULL PAGE
    if (imgRatio > pageRatio) {
      renderHeight = pdfHeight;
      renderWidth = renderHeight * imgRatio;
      xOffset = (pdfWidth - renderWidth) / 2;
      yOffset = 0;
    } else {
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
    // CLICKABLE LINKS
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
    console.error('PDF generation failed', err);
    if (mobileWindow) mobileWindow.close();
  }
};
