import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (elementId, fileName = 'digital-card.pdf') => {
    const originalElement = document.getElementById(elementId);
    if (!originalElement) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        // -----------------------------------------------------------------------
        // 1. CLONE & EXPAND for Full Page Capture
        // -----------------------------------------------------------------------
        const clone = originalElement.cloneNode(true);
        const container = document.createElement('div');

        // Position off-screen but renderable
        container.style.position = 'absolute';
        container.style.top = '-9999px';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.zIndex = '-9999';

        document.body.appendChild(container);
        container.appendChild(clone);

        // Force full visibility on clone and its scrollable children
        clone.style.height = 'auto';
        clone.style.minHeight = 'auto';
        clone.style.maxHeight = 'none';
        clone.style.overflow = 'visible';
        clone.style.width = '100%';

        const scrollables = clone.querySelectorAll('[class*="scrollableContent"], [class*="phoneFrame"]');
        scrollables.forEach(el => {
            el.style.height = 'auto';
            el.style.minHeight = 'auto';
            el.style.maxHeight = 'none';
            el.style.overflow = 'visible';
        });

        // Wait for layout stability
        await new Promise(resolve => setTimeout(resolve, 500));

        // -----------------------------------------------------------------------
        // 2. CAPTURE VISUALS
        // -----------------------------------------------------------------------
        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: document.documentElement.offsetWidth,
        });

        let imgData = canvas.toDataURL('image/jpeg', 0.98);
        let type = 'JPEG';

        // Fallback detection: if browser doesn't support JPEG export or falls back
        if (imgData.startsWith('data:image/png')) {
            type = 'PNG';
        }

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const aspectRatio = imgWidth / imgHeight;

        // -----------------------------------------------------------------------
        // 3. EXTRACT LINKS (While clone exists)
        // -----------------------------------------------------------------------
        const linkData = [];
        const linkElements = clone.querySelectorAll('[data-pdf-url]');
        const cloneRect = clone.getBoundingClientRect();

        linkElements.forEach(el => {
            const url = el.getAttribute('data-pdf-url');
            if (url) {
                const rect = el.getBoundingClientRect();
                linkData.push({
                    url,
                    // Store relative position as a ratio (0 to 1) to be resolution independent
                    xRatio: (rect.left - cloneRect.left) / cloneRect.width,
                    yRatio: (rect.top - cloneRect.top) / cloneRect.height,
                    wRatio: rect.width / cloneRect.width,
                    hRatio: rect.height / cloneRect.height,
                });
            }
        });

        // Clean up DOM
        document.body.removeChild(container);

        // -----------------------------------------------------------------------
        // 4. GENERATE PDF
        // -----------------------------------------------------------------------
        const pdfWidth = 210; // A4 Width in mm
        const pdfHeight = pdfWidth / aspectRatio;

        if (!Number.isFinite(pdfWidth) || !Number.isFinite(pdfHeight) || pdfWidth <= 0 || pdfHeight <= 0) {
            console.error("Invalid PDF dimensions generated:", { pdfWidth, pdfHeight, imgWidth, imgHeight, aspectRatio });
            return;
        }

        const pdf = new jsPDF({
            orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
            unit: 'mm',
            format: [pdfWidth, pdfHeight],
        });

        // Add Image
        pdf.addImage(imgData, type, 0, 0, pdfWidth, pdfHeight);

        // Add Links
        linkData.forEach(link => {
            const x = link.xRatio * pdfWidth;
            const y = link.yRatio * pdfHeight;
            const w = link.wRatio * pdfWidth;
            const h = link.hRatio * pdfHeight;

            // Ensure values are valid finite numbers before adding link
            if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(w) && Number.isFinite(h)) {
                pdf.link(x, y, w, h, { url: link.url });
            } else {
                console.warn("Skipping link with invalid coordinates:", { x, y, w, h, url: link.url });
            }
        });

        pdf.save(fileName);

    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};
