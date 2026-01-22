import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Detect mobile device
const isMobileDevice = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const generatePDF = async (
  elementId,
  fileName = 'digital-card.pdf'
) => {
  // --------------------------------------------------
  // MOBILE POPUP SAFETY (must happen before await)
  // --------------------------------------------------
  let mobileWindow = null;
  if (isMobileDevice()) {
    mobileWindow = window.open('', '_blank');
    if (!mobileWindow) {
      alert(
        'Please allow popups or open this page in Chrome / Safari.'
      );
      return;
    }

    mobileWindow.document.write(`
      <html>
        <body style="
          background:#0f172a;
          color:white;
          display:flex;
          align-items:center;
          justify-content:center;
          height:100vh;
          font-family:sans-serif;
          text-align:center;
        ">
          <div>
            <h3>Generating PDF...</h3>
            <p>Please wait</p>
          </div>
        </body>
      </html>
    `);
  }

  const originalElement = document.getElementById(elementId);
  if (!originalElement) {
    console.error(`Element with id ${elementId} not found`);
    if (mobileWindow) mobileWindow.close();
    return;
  }

  try {
    // --------------------------------------------------
    // CLONE ELEMENT FOR FULL RENDER
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

    // Force full visibility
    clone.style.height = 'auto';
    clone.style.maxHeight = 'none';
    clone.style.overflow = 'visible';
    clone.style.width = '100%';

    // --------------------------------------------------
    // CLEAN FOR PDF (ATM / CARD LOOK)
    // --------------------------------------------------
    const ignored = clone.querySelectorAll(
      '[data-pdf-ignore="true"]'
    );
    ignored.forEach(el => el.remove());

    const cardContainer =
      clone.querySelector('#card-container') || clone;

    cardContainer.style.background = '#000000';
    cardContainer.style.color = '#ffffff';
    cardContainer.style.backgroundImage = 'none';
    cardContainer.style.boxShadow = 'none';
    cardContainer.style.borderRadius = '0';
    cardContainer.style.height = 'auto';
    cardContainer.style.minHeight = 'auto';

    const floatingCard = cardContainer.querySelector(
      '[class*="floatingCard"]'
    );
    if (floatingCard) {
      floatingCard.style.background = 'transparent';
      floatingCard.style.boxShadow = 'none';
      floatingCard.style.border = 'none';
      floatingCard.style.backdropFilter = 'none';
      floatingCard.style.margin = '0';
      floatingCard.style.width = '100%';
    }

    const scrollables = clone.querySelectorAll(
      '[class*="scrollable"], [class*="phoneFrame"]'
    );
    scrollables.forEach(el => {
      el.style.height = 'auto';
      el.style.maxHeight = 'none';
      el.style.overflow = 'visible';
    });

    // Allow layout to stabilize
    await new Promise(res => setTimeout(res, 500));

    // --------------------------------------------------
    // CAPTURE CANVAS (HIGH QUALITY)
    // --------------------------------------------------
    const canvas = await html2canvas(clone, {
      scale: 5, // HIGH QUALITY
      useCORS: true,
      backgroundColor: '#000000',
      logging: false,
      windowWidth: document.documentElement.offsetWidth,
    });

    let imgData = canvas.toDataURL('image/jpeg', 0.98);
    let imgType = 'JPEG';

    if (imgData.startsWith('data:image/png')) {
      imgType = 'PNG';
    }

    // --------------------------------------------------
    // CAPTURE LINK POSITIONS
    // --------------------------------------------------
    const linkData = [];
    const links = clone.querySelectorAll('[data-pdf-url]');
    const cloneRect = clone.getBoundingClientRect();

    links.forEach(el => {
      const url = el.getAttribute('data-pdf-url');
      if (!url) return;

      const rect = el.getBoundingClientRect();
      linkData.push({
        url,
        xRatio: (rect.left - cloneRect.left) / cloneRect.width,
        yRatio: (rect.top - cloneRect.top) / cloneRect.height,
        wRatio: rect.width / cloneRect.width,
        hRatio: rect.height / cloneRect.height,
      });
    });

    document.body.removeChild(container);

    // --------------------------------------------------
    // CREATE PDF (A4)
    // --------------------------------------------------
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    // Fill background
    pdf.setFillColor(0, 0, 0);
    pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

    const imgProps = pdf.getImageProperties(imgData);
    const imgRatio = imgProps.width / imgProps.height;

    // --------------------------------------------------
    // SCALE UP + CENTER CONTENT
    // --------------------------------------------------
    const scaleFactor = 0.85; // 🔥 Increase / decrease size here
    const renderWidth = pdfWidth * scaleFactor;
    const renderHeight = renderWidth / imgRatio;

    const xOffset = (pdfWidth - renderWidth) / 2;
    const yOffset = (pdfHeight - renderHeight) / 2;

    pdf.addImage(
      imgData,
      imgType,
      xOffset,
      yOffset,
      renderWidth,
      renderHeight
    );

    // --------------------------------------------------
    // ADD CLICKABLE LINKS
    // --------------------------------------------------
    linkData.forEach(link => {
      const x = link.xRatio * renderWidth + xOffset;
      const y = link.yRatio * renderHeight + yOffset;
      const w = link.wRatio * renderWidth;
      const h = link.hRatio * renderHeight;

      if (
        Number.isFinite(x) &&
        Number.isFinite(y) &&
        Number.isFinite(w) &&
        Number.isFinite(h)
      ) {
        try {
          pdf.link(x, y, w, h, { url: link.url });
        } catch {
          /* ignore */
        }
      }
    });

    // --------------------------------------------------
    // SAVE / OPEN PDF
    // --------------------------------------------------
    if (mobileWindow) {
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      mobileWindow.location.href = url;
    } else {
      pdf.save(fileName);
    }
  } catch (err) {
    console.error('PDF generation failed:', err);
    if (mobileWindow) {
      mobileWindow.close();
      alert('Failed to generate PDF. Please try again.');
    }
  }
};
