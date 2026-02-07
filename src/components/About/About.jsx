import { config } from '../../config';
import styles from './About.module.css';

const About = () => {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>About Me</h2>
            <p className={styles.bio}>{config.profile.bio}</p>
        </section>
    );
};

export default About;
