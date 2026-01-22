import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Helper to detect mobile
const isMobileDevice = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const generatePDF = async (elementId, fileName = 'digital-card.pdf') => {
    // 1. POPUP BLOCKER FIX: Open window immediately if mobile
    // We must do this BEFORE any await keyword to maintain the 'user gesture'
    let mobileWindow = null;
    if (isMobileDevice()) {
        mobileWindow = window.open('', '_blank');
        if (mobileWindow) {
            mobileWindow.document.write('<html><body style="background:#0f172a;color:white;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;text-align:center;"><h3>Generating PDF...</h3><p>Please wait a moment.</p></body></html>');
        } else {
            // If null, the blocker prevented it even with direct click (unlikely but possible in some in-app browsers)
            console.warn("Popup blocked");
            alert("Please allow popups to save the card, or open this page in Chrome/Safari.");
            return;
        }
    }

    const originalElement = document.getElementById(elementId);
    if (!originalElement) {
        console.error(`Element with id ${elementId} not found`);
        if (mobileWindow) mobileWindow.close();
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
            scale: 4, // Higher scale for better print quality on small card size
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
        // 4. GENERATE PDF (Standard Visiting Card Size)
        // -----------------------------------------------------------------------
        // Standard Vertical Visiting Card: ~2 inches wide (50.8mm)
        // We let height adjust by aspect ratio to avoid distortion, 
        // but it will be close to standard 3.5 inches (88.9mm) if aspect ratio is ~9:16.
        const pdfWidth = 50.8;
        const pdfHeight = pdfWidth / aspectRatio;

        if (!Number.isFinite(pdfWidth) || !Number.isFinite(pdfHeight) || pdfWidth <= 0 || pdfHeight <= 0) {
            console.error("Invalid PDF dimensions generated:", { pdfWidth, pdfHeight, imgWidth, imgHeight, aspectRatio });
            if (mobileWindow) mobileWindow.close();
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

        // 5. SAVE / DOWNLOAD PDF
        // -----------------------------------------------------------------------

        if (mobileWindow) {
            // Finish Mobile Flow: Inject PDF into the pre-opened window
            const blob = pdf.output('blob');
            const blobUrl = URL.createObjectURL(blob);
            mobileWindow.location.href = blobUrl;
        } else {
            // Desktop Flow: Standard save
            try {
                pdf.save(fileName);
            } catch (e) {
                console.warn("Save failed in desktop mode", e);
            }
        }

    } catch (error) {
        console.error("Error generating PDF:", error);
        if (mobileWindow) {
            mobileWindow.close();
            alert("Error generating PDF. Please try again.");
        }
    }
};
