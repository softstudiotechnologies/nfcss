import { Phone, Mail, Link, Download, FileDown, UserPlus } from 'lucide-react';
import { config } from '../../config';
import styles from './ActionButtons.module.css';
import visitingCardImage from '../../assets/BLG.jpg';

const ActionButtons = () => {
    const { actions } = config;

    const handleSaveContact = () => {
        const { phone } = config.actions;
        if (phone.enabled && phone.value) {
            window.location.href = `tel:${phone.value}`;
        }
    };

    const handleDownloadImage = () => {
        const link = document.createElement('a');
        link.href = visitingCardImage;
        link.setAttribute('download', `${config.profile.name.replace(/\s+/g, '_')}_Visiting_Card.jpg`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

            {/* Row 2: Primary Actions (Stacked) */}
            <div className={styles.actionRow} style={{ flexDirection: 'column', gap: '1rem' }}>
                {actions.saveContact.enabled && (
                    <button
                        className={styles.primaryButton}
                        onClick={handleSaveContact}
                        style={{ background: '#ffffff', color: '#000000' }}
                    >
                        <UserPlus size={20} />
                        <span>{actions.saveContact.label}</span>
                    </button>
                )}

                <button
                    className={styles.secondaryButton}
                    onClick={handleDownloadImage}
                    title="Download Visiting Card"
                    style={{ background: '#1e293b', color: '#ffffff', width: '100%' }}
                >
                    <FileDown size={20} />
                    <span>Save Visiting Card</span>
                </button>
            </div>
        </div>
    );
};

export default ActionButtons;
