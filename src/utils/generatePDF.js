import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const isMobileDevice = () =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const generatePDF = async (
  elementId,
  fileName = 'digital-card.pdf'
) => {
  let mobileWindow = null;

  if (isMobileDevice()) {
    mobileWindow = window.open('', '_blank');
    if (!mobileWindow) {
      alert('Please allow popups');
      return;
    }
    mobileWindow.document.write(`
      <html>
        <body style="
          margin:0;
          background:#fff;
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
    mobileWindow?.close();
    return;
  }

  try {
    // --------------------------------
    // CLONE
    // --------------------------------
    const clone = originalElement.cloneNode(true);
    const container = document.createElement('div');

    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.width = '100%';
    document.body.appendChild(container);
    container.appendChild(clone);

    clone.querySelectorAll('[data-pdf-ignore="true"]').forEach(e => e.remove());

    // --------------------------------
    // FORCE A4 RATIO
    // --------------------------------
    const A4_RATIO = 210 / 297;
    const width = clone.offsetWidth;
    const height = width / A4_RATIO;

    clone.style.width = `${width}px`;
    clone.style.height = `${height}px`;
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.alignItems = 'center';
    clone.style.justifyContent = 'center';
    clone.style.overflow = 'hidden';

    const bgColor =
      window.getComputedStyle(originalElement).backgroundColor || '#ffffff';
    clone.style.background = bgColor;

    // --------------------------------
    // PROFILE IMAGE (OPTIMIZED)
    // --------------------------------
    const img = clone.querySelector('img');
    if (img) {
      img.style.width = '150px'; // reduced from 180
      img.style.height = '150px';
      img.style.borderRadius = '50%';
      img.style.objectFit = 'cover';
    }

    await new Promise(r => setTimeout(r, 300));

    // --------------------------------
    // CAPTURE (LOW SIZE, GOOD QUALITY)
    // --------------------------------
    const canvas = await html2canvas(clone, {
      scale: 1.5, // 🔥 BIGGEST SIZE REDUCTION
      backgroundColor: bgColor,
      useCORS: true,
    });

    // JPEG with compression
    const imgData = canvas.toDataURL('image/jpeg', 0.65);

    // --------------------------------
    // LINK EXTRACTION
    // --------------------------------
    const links = [];
    const rect = clone.getBoundingClientRect();

    clone.querySelectorAll('[data-pdf-url]').forEach(el => {
      const r = el.getBoundingClientRect();
      links.push({
        url: el.getAttribute('data-pdf-url'),
        x: (r.left - rect.left) / rect.width,
        y: (r.top - rect.top) / rect.height,
        w: r.width / rect.width,
        h: r.height / rect.height,
      });
    });

    document.body.removeChild(container);

    // --------------------------------
    // CREATE PDF (A4)
    // --------------------------------
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true, // 🔥 IMPORTANT
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

    links.forEach(l => {
      pdf.link(l.x * 210, l.y * 297, l.w * 210, l.h * 297, {
        url: l.url,
      });
    });

    // --------------------------------
    // SAVE / OPEN
    // --------------------------------
    if (mobileWindow) {
      const blob = pdf.output('blob');
      mobileWindow.location.href = URL.createObjectURL(blob);
    } else {
      pdf.save(fileName);
    }
  } catch (e) {
    console.error(e);
    mobileWindow?.close();
  }
};
