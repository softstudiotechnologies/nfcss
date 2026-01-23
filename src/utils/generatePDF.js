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
        <head><title>Generating Card...</title></head>
        <body style="
          margin:0;
          background:#0f172a;
          color:white;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          height:100vh;
          font-family:sans-serif;
        ">
          <h3 id="status">Generating PDF...</h3>
          <p style="opacity:0.7; font-size:0.9rem;">Please wait a moment</p>
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
        // ------------------------------
        // CLONE
        // ------------------------------
        const clone = originalElement.cloneNode(true);
        const container = document.createElement('div');

        container.style.position = 'absolute';
        container.style.top = '-9999px';
        container.style.width = '100%';
        document.body.appendChild(container);
        container.appendChild(clone);

        clone.querySelectorAll('[data-pdf-ignore="true"]').forEach(e => e.remove());

        // ------------------------------
        // FORCE A4 RATIO
        // ------------------------------
        const A4_RATIO = 210 / 297;
        // Use original element's offsetWidth to ensure we have a valid number
        const originalWidth = originalElement.offsetWidth || 350;
        const width = originalWidth;
        const height = width / A4_RATIO;

        clone.style.width = `${width}px`;
        clone.style.height = `${height}px`;
        clone.style.display = 'flex';
        clone.style.flexDirection = 'column';
        clone.style.alignItems = 'center';
        clone.style.justifyContent = 'center';
        clone.style.overflow = 'hidden';
        clone.style.position = 'relative';
        clone.style.margin = '0';
        clone.style.padding = '40px 20px'; // Add some breathing room for the PDF layout

        const bgColor =
            window.getComputedStyle(originalElement).backgroundColor || '#ffffff';
        clone.style.background = bgColor;

        // ------------------------------
        // PROFILE IMAGE
        // ------------------------------
        const img = clone.querySelector('img');
        if (img) {
            img.style.width = '120px';
            img.style.height = '120px';
            img.style.borderRadius = '50%';
            img.style.objectFit = 'cover';
            img.style.marginBottom = '14px';
        }

        // ------------------------------
        // COMPANY PHONE
        // ------------------------------
        clone.querySelectorAll('.main-phone').forEach(el => {
            el.style.fontSize = '18px';
            el.style.fontWeight = '600';
            el.style.marginTop = '8px';
        });

        // ------------------------------
        // EMPLOYEE PHONES
        // ------------------------------
        clone.querySelectorAll('.employee-phone').forEach(el => {
            el.style.fontSize = '15px';
            el.style.marginTop = '4px';
            el.style.opacity = '0.9';
        });

        await new Promise(r => setTimeout(r, 300));

        // ------------------------------
        // CAPTURE (OPTIMIZED)
        // ------------------------------
        if (mobileWindow) {
            const statusEl = mobileWindow.document.getElementById('status');
            if (statusEl) statusEl.innerText = 'Capturing Card...';
        }

        const canvas = await html2canvas(clone, {
            scale: 2, // Slightly higher for better quality
            backgroundColor: bgColor,
            useCORS: true,
            logging: false,
            allowTaint: true
        });

        if (mobileWindow) {
            const statusEl = mobileWindow.document.getElementById('status');
            if (statusEl) statusEl.innerText = 'Finalizing PDF...';
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.65);

        // ------------------------------
        // EXTRACT LINKS
        // ------------------------------
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

        // ------------------------------
        // CREATE PDF
        // ------------------------------
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });

        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

        links.forEach(l => {
            pdf.link(
                l.x * 210,
                l.y * 297,
                l.w * 210,
                l.h * 297,
                { url: l.url }
            );
        });

        // ------------------------------
        // SAVE / DISPLAY
        // ------------------------------
        if (mobileWindow) {
            // For mobile, DataURL is often more reliable for window.open than Blob URLs
            // as some mobile browsers block blob navigation or fail to render them.
            const pdfData = pdf.output('dataurlstring');

            // Update the window content to show the PDF or provide a download link
            mobileWindow.location.replace(pdfData);
        } else {
            pdf.save(fileName);
        }
    } catch (e) {
        console.error(e);
        mobileWindow?.close();
    }
};
