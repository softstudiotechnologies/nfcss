import { useState } from 'react';
import { Phone, Mail, Link, Download, FileDown, UserPlus, ScanLine } from 'lucide-react';
import { config } from '../../config';
import styles from './ActionButtons.module.css';
import CameraModal from '../CameraModal/CameraModal';

const ActionButtons = () => {
    const { actions } = config;
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const visitingCardPdf = '/PrintoCardsAndTechnologies.pdf';

    const handleSaveContact = () => {
        const { phone } = config.actions;
        if (phone.enabled && phone.value) {
            window.location.href = `tel:${phone.value}`;
        }
    };

    const handleDownloadImage = () => {
        const link = document.createElement('a');
        link.href = visitingCardPdf;
        link.setAttribute('download', `${config.profile.name.replace(/\s+/g, '_')}_Visiting_Card.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleAction = (type, value) => {
        if (!value && type !== 'camera') return;
        switch (type) {
            case 'email': window.location.href = `mailto:${value}`; break;
            case 'phone': window.location.href = `tel:${value}`; break;
            case 'website': window.open(value, '_blank', 'noopener,noreferrer'); break;
            case 'camera': setIsCameraOpen(true); break;
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
                        {actions.phone.icon ? <actions.phone.icon size={26} strokeWidth={2} /> : <Phone size={26} strokeWidth={2} />}
                    </button>
                )}

                {actions.email.enabled && (
                    <button
                        className={styles.iconButton}
                        onClick={() => handleAction('email', actions.email.value)}
                        data-pdf-url={`mailto:${actions.email.value}`}
                        aria-label="Email"
                    >
                        {actions.email.icon ? <actions.email.icon size={26} strokeWidth={2} /> : <Mail size={26} strokeWidth={2} />}
                    </button>
                )}

                {actions.website.enabled && (
                    <button
                        className={styles.iconButton}
                        onClick={() => handleAction('website', actions.website.value)}
                        data-pdf-url={actions.website.value}
                        aria-label="Website"
                    >
                        {actions.website.icon ? <actions.website.icon size={26} strokeWidth={2} /> : <Link size={26} strokeWidth={2} />}
                    </button>
                )}

                {actions.camera?.enabled && (
                    <button
                        className={styles.iconButton}
                        onClick={() => handleAction('camera')}
                        aria-label="Scan QR"
                    >
                        {actions.camera.icon ? <actions.camera.icon size={26} strokeWidth={2} /> : <ScanLine size={26} strokeWidth={2} />}
                    </button>
                )}
            </div>

            {/* Row 2: Primary Actions (Stacked) */}
            <div className={styles.actionRow} style={{ flexDirection: 'column', gap: '1rem' }}>
                {actions.saveContact.enabled && (
                    <button
                        className={styles.primaryButton}
                        onClick={handleSaveContact}
                    >
                        {actions.saveContact.icon ? <actions.saveContact.icon size={22} strokeWidth={2.5} /> : <UserPlus size={22} strokeWidth={2.5} />}
                        <span>{actions.saveContact.label}</span>
                    </button>
                )}

                <button
                    className={styles.secondaryButton}
                    onClick={handleDownloadImage}
                    title="Download Visiting Card"
                    style={{ width: '100%' }}
                >
                    <Download size={20} strokeWidth={2} />
                    <span>Save Visiting Card</span>
                </button>
            </div>


            <CameraModal
                isOpen={isCameraOpen}
                onClose={() => setIsCameraOpen(false)}
            />
        </div>
    );
};

export default ActionButtons;
