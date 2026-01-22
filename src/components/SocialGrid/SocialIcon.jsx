import styles from './SocialGrid.module.css';

const SocialIcon = ({ Icon, url, color, id }) => {
    // Capitalize first letter for label
    const label = id.charAt(0).toUpperCase() + id.slice(1);

    // Determine if it's a protocol link (tel, mailto) vs a website
    const isProtocol = url.startsWith('tel:') || url.startsWith('mailto:');

    return (
        <div className={styles.itemWrapper}>
            <a
                href={url}
                className={styles.socialCard}
                style={{ backgroundColor: color }}
                aria-label={`Visit ${id}`}
                target={isProtocol ? undefined : "_blank"}
                rel={isProtocol ? undefined : "noopener noreferrer"}
                data-pdf-url={url}
            >
                <Icon size={28} color="white" />
            </a>
            <span className={styles.label}>{label}</span>
        </div>
    );
};

export default SocialIcon;
