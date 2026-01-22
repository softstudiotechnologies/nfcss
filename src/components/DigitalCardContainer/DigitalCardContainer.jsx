import { config } from '../../config';
import styles from './DigitalCardContainer.module.css';

const DigitalCardContainer = ({ children }) => {
    return (
        <div className={styles.wrapper}>
            <div
                id="card-container"
                className={styles.phoneFrame}
                style={{
                    '--primary-color': config.theme.primaryColor,
                    '--surface-color': config.theme.surfaceColor,
                    '--on-surface': config.theme.onSurface,
                }}
            >
                {/* Cover Image Area */}
                <div
                    className={styles.coverImage}
                    style={{ backgroundImage: `url(${config.profile.coverImage})` }}
                    data-pdf-ignore="true"
                />

                {/* Floating Card Content */}
                <div className={styles.floatingCard}>
                    <div className={styles.scrollableContent}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DigitalCardContainer;
