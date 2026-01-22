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
      alert('Please allow popups to generate PDF');
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
    // Clone
    const clone = originalElement.cloneNode(true);
    const container = document.createElement('div');

    container.style.position = 'absolute';
    container.style.top = '-9999px';
    container.style.width = '100%';
    document.body.appendChild(container);
    container.appendChild(clone);

    // Remove unwanted elements
    clone.querySelectorAll('[data-pdf-ignore="true"]').forEach(e => e.remove());

    // A4 aspect ratio
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

    // Background
    const bgColor =
      window.getComputedStyle(originalElement).backgroundColor || '#ffffff';
    clone.style.background = bgColor;

    // Profile Image (Extra Large)
    const img = clone.querySelector('img');
    if (img) {
      img.style.width = '180px';
      img.style.height = '180px';
      img.style.borderRadius = '50%';
      img.style.objectFit = 'cover';
      img.style.marginBottom = '16px';
    }

    // Name styling
    const name = clone.querySelector('h1');
    if (name) {
      name.style.fontSize = '32px';
      name.style.margin = '8px 0';
    }

    // Contact Number Styling
    const phone = clone.querySelector('.phone');
    if (phone) {
      phone.style.fontSize = '20px';
      phone.style.marginTop = '10px';
      phone.style.fontWeight = '500';
    }

    await new Promise(r => setTimeout(r, 400));

    // Canvas capture
    const canvas = await html2canvas(clone, {
      scale: 4,
      backgroundColor: bgColor,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');

    // Collect links
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

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

    // Add links (phone included)
    links.forEach(l => {
      pdf.link(l.x * 210, l.y * 297, l.w * 210, l.h * 297, {
        url: l.url,
      });
    });

    // Save / open
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
