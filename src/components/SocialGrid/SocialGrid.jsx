import { config } from '../../config';
import SocialIcon from './SocialIcon';
import styles from './SocialGrid.module.css';

const SocialGrid = () => {
    const { socials } = config;
    // Filter only enabled socials
    const activSocials = socials.filter(s => s.enabled);

    return (
        <div className={styles.gridContainer}>
            {activSocials.map((platform) => (
                <SocialIcon
                    key={platform.id}
                    id={platform.id}
                    Icon={platform.icon}
                    url={platform.url}
                    color={platform.color}
                />
            ))}
        </div>
    );
};

export default SocialGrid;
