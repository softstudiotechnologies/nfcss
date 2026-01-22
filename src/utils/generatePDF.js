import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Detect mobile device
const isMobileDevice = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const generatePDF = async (
  elementId,
  fileName = 'digital-card.pdf'
) => {
  // -------------------------------
  // MOBILE POPUP FIX
  // -------------------------------
  let mobileWindow = null;
  if (isMobileDevice()) {
    mobileWindow = window.open('', '_blank');
    if (!mobileWindow) {
      alert('Please allow popups to generate the PDF.');
      return;
    }
    mobileWindow.document.write(`
      <html>
        <body style="
          margin:0;
          background:#ffffff;
          display:flex;
          align-items:center;
          justify-content:center;
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
    console.error('Element not found');
    return;
  }

  try {
    // -------------------------------
    // CLONE ELEMENT
    // -------------------------------
    const clone = originalElement.cloneNode(true);
    const container = document.createElement('div');

    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.top = '-9999px';
    container.style.width = '100%';
    container.style.zIndex = '-1';

    document.body.appendChild(container);
    container.appendChild(clone);

    // -------------------------------
    // REMOVE NON-PDF ELEMENTS
    // -------------------------------
    clone
      .querySelectorAll('[data-pdf-ignore="true"]')
      .forEach(el => el.remove());

    // -------------------------------
    // FORCE A4 RATIO (CRITICAL FIX)
    // -------------------------------
    const A4_RATIO = 210 / 297; // width / height

    const forcedWidth = clone.offsetWidth;
    const forcedHeight = forcedWidth / A4_RATIO;

    clone.style.width = `${forcedWidth}px`;
    clone.style.height = `${forcedHeight}px`;
    clone.style.minHeight = `${forcedHeight}px`;
    clone.style.maxHeight = `${forcedHeight}px`;
    clone.style.overflow = 'hidden';

    // -------------------------------
    // BACKGROUND COLOR (NO BLACK)
    // -------------------------------
    const bgColor =
      window.getComputedStyle(originalElement).backgroundColor || '#ffffff';

    clone.style.background = bgColor;

    // -------------------------------
    // CENTER CONTENT
    // -------------------------------
    clone.style.display = 'flex';
    clone.style.alignItems = 'center';
    clone.style.justifyContent = 'center';

    // -------------------------------
    // PROFILE PIC → EXTRA LARGE
    // -------------------------------
    const profilePic = clone.querySelector('img');
    if (profilePic) {
      profilePic.style.width = '180px';
      profilePic.style.height = '180px';
      profilePic.style.borderRadius = '50%';
      profilePic.style.objectFit = 'cover';
    }

    // -------------------------------
    // WAIT FOR LAYOUT
    // -------------------------------
    await new Promise(r => setTimeout(r, 500));

    // -------------------------------
    // CAPTURE CANVAS (PNG ONLY)
    // -------------------------------
    const canvas = await html2canvas(clone, {
      scale: 4,
      useCORS: true,
      backgroundColor: bgColor,
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    // -------------------------------
    // EXTRACT LINKS
    // -------------------------------
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

    // -------------------------------
    // CREATE PDF (FULL A4 FILL)
    // -------------------------------
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // FULL PAGE IMAGE (NO MARGINS, NO BLACK)
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

    // -------------------------------
    // APPLY LINKS
    // -------------------------------
    linkData.forEach(link => {
      pdf.link(
        link.xRatio * 210,
        link.yRatio * 297,
        link.wRatio * 210,
        link.hRatio * 297,
        { url: link.url }
      );
    });

    // -------------------------------
    // SAVE / OPEN
    // -------------------------------
    if (mobileWindow) {
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      mobileWindow.location.href = url;
    } else {
      pdf.save(fileName);
    }
  } catch (err) {
    console.error(err);
    if (mobileWindow) {
      mobileWindow.close();
      alert('Failed to generate PDF');
    }
  }
};
