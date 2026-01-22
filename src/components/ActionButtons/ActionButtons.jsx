import { Phone, Mail, Link, Download, FileDown } from 'lucide-react';
import { config } from '../../config';
import styles from './ActionButtons.module.css';
import { generatePDF } from '../../utils/generatePDF';

const ActionButtons = () => {
    const { actions } = config;

    const handleSaveContact = () => {
        const { name, role } = config.profile;
        const { phone, email, website } = config.actions;

        // Construct vCard data
        const vCardData = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${name}`,
            `TITLE:${role}`,
            phone.enabled ? `TEL;TYPE=CELL:${phone.value}` : '',
            email.enabled ? `EMAIL;TYPE=WORK:${email.value}` : '',
            website.enabled ? `URL:${website.value}` : '',
            'END:VCARD'
        ].filter(Boolean).join('\n');

        // Create blob and trigger download
        const blob = new Blob([vCardData], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${name.replace(/\s+/g, '_')}.vcf`);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const handleDownloadPDF = () => {
        // Use the ID we added to DigitalCardContainer
        const fileName = `${config.profile.name.replace(/\s+/g, '_')}_Card.pdf`;
        generatePDF('card-container', fileName);
    };

    const handleAction = (type, value) => {
        if (!value) return;
        switch (type) {
            case 'email': window.location.href = `mailto:${value}`; break;
            case 'phone': window.location.href = `tel:${value}`; break;
            case 'website': window.open(value, '_blank', 'noopener,noreferrer'); break;
            default: break;
        }
    };

    return (
        <div className={styles.container} data-pdf-ignore="true">
            {/* Row 1: Circular Action Icons */}
            <div className={styles.secondaryActions}>
                {actions.phone.enabled && (
                    <button
                        className={styles.iconButton}
                        onClick={() => handleAction('phone', actions.phone.value)}
                        data-pdf-url={`tel:${actions.phone.value}`}
                        aria-label="Call"
                    >
                        <Phone size={24} strokeWidth={1.5} />
                    </button>
                )}

                {actions.email.enabled && (
                    <button
                        className={styles.iconButton}
                        onClick={() => handleAction('email', actions.email.value)}
                        data-pdf-url={`mailto:${actions.email.value}`}
                        aria-label="Email"
                    >
                        <Mail size={24} strokeWidth={1.5} />
                    </button>
                )}

                {actions.website.enabled && (
                    <button
                        className={styles.iconButton}
                        onClick={() => handleAction('website', actions.website.value)}
                        data-pdf-url={actions.website.value}
                        aria-label="Website"
                    >
                        <Link size={24} strokeWidth={1.5} />
                    </button>
                )}
            </div>

            {/* Row 2: Primary Actions */}
            <div className={styles.actionRow}>
                {actions.saveContact.enabled && (
                    <button
                        className={styles.primaryButton}
                        onClick={handleSaveContact}
                    >
                        <span>{actions.saveContact.label}</span>
                    </button>
                )}

                <button
                    className={styles.secondaryButton}
                    onClick={handleDownloadPDF}
                    title="Download Visiting Card"
                >
                    <span>Save Visiting Card</span>
                </button>
            </div>
        </div>
    );
};

export default ActionButtons;
