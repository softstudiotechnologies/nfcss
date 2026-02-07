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
                aria-label={`Visit ${id}`}
            >
                <Icon size={28} style={{ color: color || 'white' }} />
                <div className={styles.glow} style={{ backgroundColor: color }} />
            </button>
            <span className={styles.label}>{label}</span>
        </div>
    );
};


export default SocialIcon;
