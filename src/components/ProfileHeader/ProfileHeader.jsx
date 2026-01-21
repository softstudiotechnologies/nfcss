import { BadgeCheck } from 'lucide-react';
import { config } from '../../config';
import styles from './ProfileHeader.module.css';

const ProfileHeader = () => {
    const { name, role, verified, image } = config.profile;

    return (
        <div className={styles.header}>
            <div className={styles.avatarContainer}>
                <img src={image} alt={name} className={styles.avatar} />
            </div>
            <div className={styles.info}>
                <div className={styles.nameRow}>
                    <h1 className={styles.name}>{name}</h1>
                    {verified && (
                        <BadgeCheck
                            className={styles.verified}
                            size={24}
                            color={config.theme.accentColor}
                            fill={config.theme.accentColor}
                            stroke="white"
                        />
                    )}
                </div>
                <p className={styles.role}>{role}</p>
            </div>
        </div>
    );
};

export default ProfileHeader;
