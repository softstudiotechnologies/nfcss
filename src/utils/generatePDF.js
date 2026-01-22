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
        // Force full visibility on clone
        clone.style.height = 'auto';
        clone.style.minHeight = 'auto';
        clone.style.maxHeight = 'none';
        clone.style.overflow = 'visible';
        clone.style.width = '100%';

        // -----------------------------------------------------------------------
        // 1.5 CLEANUP FOR ATM CARD LOOK
        // -----------------------------------------------------------------------
        // Remove elements tagged with data-pdf-ignore (Banner, Buttons)
        const ignoredElements = clone.querySelectorAll('[data-pdf-ignore="true"]');
        ignoredElements.forEach(el => el.remove());

        // Adjust styles for the "Clean Card" look
        // We want to ensure the background is white/clean since cover is gone
        // And content is centered.
        // Identify the card container in the clone
        const cardContainer = clone.querySelector('#card-container') || clone;
        cardContainer.style.background = '#000000'; // Make Background Black
        cardContainer.style.color = '#ffffff'; // Ensure text is white
        cardContainer.style.backgroundImage = 'none';
        cardContainer.style.minHeight = 'auto'; // Shrink to fit content
        cardContainer.style.height = 'auto';
        cardContainer.style.boxShadow = 'none';
        cardContainer.style.borderRadius = '0';

        // Add specific padding/centering for the ATM look
        const contentContainer = cardContainer.querySelector('[class*="floatingCard"]');
        if (contentContainer) {
            contentContainer.style.background = 'transparent';
            contentContainer.style.boxShadow = 'none';
            contentContainer.style.border = 'none';
            contentContainer.style.backdropFilter = 'none';
            contentContainer.style.margin = '0';
            contentContainer.style.width = '100%';
        }

        // Force full visibility on scrollable children
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
            backgroundColor: '#000000', // Capture with Black Background
            logging: false,
            windowWidth: document.documentElement.offsetWidth,
        });

        let imgData = canvas.toDataURL('image/jpeg', 0.98);
        let type = 'JPEG';

        // Fallback detection: if browser doesn't support JPEG export or falls back
        if (imgData.startsWith('data:image/png')) {
            type = 'PNG';
        }

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
        // 4. GENERATE PDF (A4 Size)
        // -----------------------------------------------------------------------
        // A4 Dimensions: 210mm x 297mm
        const pdfWidth = 210;
        const pdfHeight = 297;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        // 1. Fill entire page with Black
        pdf.setFillColor(0, 0, 0);
        pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

        const imgProps = pdf.getImageProperties(imgData);
        const imgRatio = imgProps.width / imgProps.height;
        const pageRatio = pdfWidth / pdfHeight;

        // Calculate dimensions to FIT within the page (contain)
        let renderWidth, renderHeight;

        if (imgRatio > pageRatio) {
            // Image is wider than page (relative to format) -> Fit Width
            renderWidth = pdfWidth;
            renderHeight = renderWidth / imgRatio;
        } else {
            // Image is taller than page -> Fit Height
            renderHeight = pdfHeight;
            renderWidth = renderHeight * imgRatio;
        }

        // Center the image on the page
        const xOffset = (pdfWidth - renderWidth) / 2;
        const yOffset = (pdfHeight - renderHeight) / 2;

        // Add Image
        pdf.addImage(imgData, type, xOffset, yOffset, renderWidth, renderHeight);

        // Add Links mapped to the new scaled coordinates
        linkData.forEach(link => {
            const x = (link.xRatio * renderWidth) + xOffset;
            const y = (link.yRatio * renderHeight) + yOffset;
            const w = link.wRatio * renderWidth;
            const h = link.hRatio * renderHeight;

            if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(w) && Number.isFinite(h)) {
                try {
                    pdf.link(x, y, w, h, { url: link.url });
                } catch (e) {/*Ignore link errors*/ }
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
