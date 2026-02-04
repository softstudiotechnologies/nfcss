import { useState, useRef, useEffect } from 'react';
import { X, Camera as CameraIcon, SwitchCamera } from 'lucide-react';
import styles from './CameraModal.module.css';

const CameraModal = ({ isOpen, onClose }) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [facingMode, setFacingMode] = useState('user'); // 'user' (front) or 'environment' (back)
    const [error, setError] = useState(null);

    // Start Camera
    useEffect(() => {
        if (!isOpen) {
            stopCamera();
            return;
        }

        startCamera();

        return () => {
            stopCamera();
        };
    }, [isOpen, facingMode]);

    const startCamera = async () => {
        stopCamera(); // Ensure previous stream is stopped
        setError(null);

        try {
            const constraints = {
                video: {
                    facingMode: facingMode
                }
            };

            const newStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(newStream);

            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setError("Unable to access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleSwitchCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <button className={styles.closeButton} onClick={onClose}>
                <X size={24} />
            </button>

            <div className={styles.videoContainer}>
                {error ? (
                    <div className={styles.errorMsg}>{error}</div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`${styles.video} ${facingMode === 'environment' ? styles.environment : ''}`}
                    />
                )}

                <div className={styles.controls}>
                    <button className={styles.controlButton} onClick={handleSwitchCamera}>
                        <SwitchCamera size={28} />
                    </button>
                    {/* Placeholder for Capture Action if needed later */}
                    {/* <button className={styles.controlButton}>
                        <CameraIcon size={28} />
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default CameraModal;
