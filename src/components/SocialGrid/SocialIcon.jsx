import styles from './SocialGrid.module.css';

const SocialIcon = ({ Icon, url, color, id }) => {
    const handleClick = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // Capitalize first letter for label
    const label = id.charAt(0).toUpperCase() + id.slice(1);

    return (
        <div className={styles.itemWrapper}>
            <button
                className={styles.socialCard}
                onClick={handleClick}
                style={{ backgroundColor: color }} // Use branded color for background
                aria-label={`Visit ${id}`}
                data-pdf-url={url}
            >
                <Icon size={28} color="white" />
            </button>
            <span className={styles.label}>{label}</span>
        </div>
    );
};

export default SocialIcon;
