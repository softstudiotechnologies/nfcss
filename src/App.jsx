import DigitalCardContainer from './components/DigitalCardContainer/DigitalCardContainer';
import ProfileHeader from './components/ProfileHeader/ProfileHeader';
import ActionButtons from './components/ActionButtons/ActionButtons';
import SocialGrid from './components/SocialGrid/SocialGrid';
import About from './components/About/About';
import Skills from './components/Skills/Skills';
import Projects from './components/Projects/Projects';

import logo from './assets/logopngsmall.png';

function App() {
    return (
        <DigitalCardContainer>
            <ProfileHeader />
            <ActionButtons />
            <About />
            <Skills />
            <Projects />
            <SocialGrid />

            {/* Modern Footer */}
            <footer style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                opacity: 0.8,
                fontSize: '0.85rem',
                marginTop: '2rem',
                color: 'var(--text-secondary)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>© {new Date().getFullYear()} Printo Cards. All rights reserved.</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Developed By</p>
                    <a
                        href="https://www.instagram.com/softstudiotechnologies"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img src={logo} alt="Soft Studio Logo" style={{ height: '32px', filter: 'grayscale(1) brightness(2)' }} />
                    </a>
                </div>
            </footer>
        </DigitalCardContainer>
    )
}

export default App;

