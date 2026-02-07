// import { ExternalLink } from 'lucide-react';
// import { config } from '../../config';
// import styles from './Projects.module.css';

// const Projects = () => {
//     return (
//         <section className={styles.section}>
//             <h2 className={styles.title}>Projects</h2>
//             <div className={styles.grid}>
//                 {config.projects.map((project, index) => (
//                     <div key={index} className={styles.projectCard}>
//                         <div className={styles.imageWrapper}>
//                             <img src={project.image} alt={project.title} className={styles.image} />
//                             <a href={project.link} className={styles.overlay} target="_blank" rel="noopener noreferrer">
//                                 <ExternalLink size={20} />
//                             </a>
//                         </div>
//                         <div className={styles.info}>
//                             <h3 className={styles.projectTitle}>{project.title}</h3>
//                             <p className={styles.description}>{project.description}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </section>
//     );
// };

// export default Projects;
