import DigitalCardContainer from './components/DigitalCardContainer/DigitalCardContainer';
import ProfileHeader from './components/ProfileHeader/ProfileHeader';
import ActionButtons from './components/ActionButtons/ActionButtons';
import SocialGrid from './components/SocialGrid/SocialGrid';

import logo from './assets/logopngsmall.png';

function App() {
    return (
        <DigitalCardContainer>
            <ProfileHeader />
            <ActionButtons />
            <SocialGrid />

            {/* Simple Footer */}
            <div style={{
                textAlign: 'center',
                padding: '2rem 2rem 4rem',
                opacity: 0.6,
                fontSize: '0.8rem',
                marginTop: 'auto',
                color: 'white',
                fontWeight: 500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <p>Developed By</p>
                <a
                    href="https://www.instagram.com/softstudiotechnologies"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <img src={logo} alt="Soft Studio Logo" style={{ height: '40px', objectFit: 'contain' }} />
                </a>
            </div>
        </DigitalCardContainer>
    )
}

export default App;
