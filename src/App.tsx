import { Canvas } from '@react-three/fiber'
import { Environment, Sparkles, OrbitControls, Float } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { GiftBox } from './components/GiftBox'
import { Overlay } from './components/Overlay'
import { BackgroundSanta } from './components/BackgroundSanta'
import { SantaSleigh } from './components/SantaSleigh'
import { SplashScreen } from './components/SplashScreen'
import { EndingScene } from './components/EndingScene'
import { useScamStats } from './hooks/useScamStats'

/**
 * Main Application Component
 * 
 * Orchestrates the entire user experience including:
 * 1. Splash Screen (Initial engagement)
 * 2. 3D Scene (Main interaction)
 * 3. Ending Scene (Educational reveal)
 * 
 * Uses @react-three/fiber for 3D rendering.
 */
function App() {
    // --- State Management ---
    const { visits, victims, incrementVisit, incrementVictim } = useScamStats()
    const bgMusicRef = useRef<HTMLAudioElement | null>(null)

    // UI Flow States
    const [showSplash, setShowSplash] = useState(true)
    const [musicStarted, setMusicStarted] = useState(false)
    const [deliveryStarted, setDeliveryStarted] = useState(false)
    const [boxDropped, setBoxDropped] = useState(false)
    const [extraGifts, setExtraGifts] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // --- Effects ---

    /**
     * Detects mobile screen width to adjust 3D camera and object positions.
     */
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    /**
     * Configuration for the 6 extra gifts that appear after the "scam" is triggered.
     * Positions are adjusted based on the device type (mobile vs desktop).
     */
    const giftsConfig = [
        {
            pos: isMobile ? [-0.7, 4, -2] : [-3.2, 1, -2],
            color: '#27AE60', ribbon: '#C0392B', scale: 0.6, sound: '/sound_12.mp3'
        }, // Top Left
        {
            pos: isMobile ? [1.1, 3, -2] : [3.5, 4, -2],
            color: '#2980B9', ribbon: '#ECF0F1', scale: 0.6, sound: '/sound_2.mp3'
        }, // Top Right
        {
            pos: isMobile ? [1.5, 1, 0] : [3.5, -1, 0],
            color: '#8E44AD', ribbon: '#F39C12', scale: 0.5, sound: '/sound_7.mp3'
        }, // Mid Right
        {
            pos: isMobile ? [-1, 2, 0] : [-5, -1, 0],
            color: '#D35400', ribbon: '#2ECC71', scale: 0.3, sound: '/scam.mp3'
        }, // Mid Left
        {
            pos: isMobile ? [1.8, -2, -1] : [5, 2, 0],
            color: '#16A085', ribbon: '#E74C3C', scale: 0.7, sound: '/sound_11.mp3'
        }, // Bottom Right
        {
            pos: isMobile ? [-1.9, -1.8, -2] : [-5, 3.5, -1],
            color: '#FF69B4', ribbon: '#FFFFFF', scale: 0.6, sound: '/sound_4.mp3'
        }, // Bottom Left
    ] as const

    /**
     * Initializes background music and tracks the initial visit.
     */
    useEffect(() => {
        bgMusicRef.current = new Audio('/bg.mp3')
        bgMusicRef.current.loop = true
        bgMusicRef.current.volume = 0.4

        incrementVisit()
    }, [])

    /**
     * Attempts to start music and delivery sequence after splash screen.
     * Handles browser autoplay policies.
     */
    /**
     * Attempts to start music and delivery sequence after splash screen.
     * Visuals start immediately; audio attempts to autoplay but fails gracefully.
     */
    useEffect(() => {
        if (!showSplash) {
            // ALWAYS start visual delivery immediately
            setDeliveryStarted(true)

            // Try to play audio, but don't block visuals if it fails
            if (bgMusicRef.current) {
                bgMusicRef.current.play()
                    .then(() => setMusicStarted(true))
                    .catch(() => console.log('Autoplay blocked, waiting for interaction'))
            }
        }
    }, [showSplash])

    /**
     * Fallback interaction handler if autoplay failed.
     * Ensures music starts on the first user interaction after splash.
     */
    useEffect(() => {
        const handleInteraction = () => {
            if (!showSplash && !musicStarted && bgMusicRef.current) {
                bgMusicRef.current.play()
                    .then(() => {
                        setMusicStarted(true)
                    })
                    .catch(err => console.log('Playback failed:', err))
            }
        }

        if (!showSplash && !musicStarted) {
            window.addEventListener('click', handleInteraction)
            return () => window.removeEventListener('click', handleInteraction)
        }
    }, [showSplash, musicStarted])

    return (
        <>
            {/* 1. Splash Screen Phase */}
            {showSplash && (
                <SplashScreen onComplete={() => setShowSplash(false)} />
            )}

            {/* 2. Main 3D Experience Phase */}
            <Canvas
                shadows
                camera={{ position: [0, 2, isMobile ? 13.5 : 8], fov: 45 }}
                style={{
                    width: '100vw',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    // Hide canvas visually while splash is active to save resources/avoid pop-in
                    visibility: showSplash ? 'hidden' : 'visible'
                }}
            >
                <color attach="background" args={['#050510']} />
                <fog attach="fog" args={['#050510', 5, 20]} />

                <Suspense fallback={null}>
                    {/* Lighting & Environment */}
                    <Environment preset="night" />

                    <ambientLight intensity={0.5} />
                    <directionalLight position={[0, 2, 5]} intensity={1} />
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.15}
                        penumbra={1}
                        intensity={1}
                        castShadow
                    />

                    {/* Ambient Background Santa Fly-by */}
                    <BackgroundSanta />

                    <Sparkles
                        count={200}
                        scale={12}
                        size={2}
                        speed={0.4}
                        opacity={0.5}
                        color="#ffffff"
                    />

                    {/* Delivery Sequence: Sleigh flying in */}
                    <SantaSleigh
                        start={deliveryStarted}
                        onDrop={() => setBoxDropped(true)}
                    />

                    {/* The Main Gift Box: The "Trap" */}
                    <GiftBox
                        isDropped={boxDropped}
                        isMain={true}
                        onOpen={() => {
                            setExtraGifts(true)
                            incrementVictim()
                        }}
                    />

                    {/* Extra Gifts: Floating elements appearing after the trap is sprung */}
                    {extraGifts && giftsConfig.map((gift, i) => (
                        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={1} position={gift.pos as any}>
                            <GiftBox
                                isDropped={true}
                                position={[0, 0, 0]} // Local position inside Float
                                color={gift.color}
                                ribbonColor={gift.ribbon}
                                scale={gift.scale}
                                variant="shake"
                                soundUrl={gift.sound}
                            />
                        </Float>
                    ))}

                    <OrbitControls
                        enablePan={false}
                        enableZoom={false} // Zoom is handled programmatically via camera position
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Suspense>
            </Canvas>

            {/* UI Overlays */}
            {!showSplash && <Overlay visits={visits} victims={victims} />}

            {/* 3. Ending Scene Phase: The Educational Reveal */}
            {extraGifts && (
                <EndingScene
                    onRestart={() => window.location.reload()}
                    onStopBgMusic={() => {
                        if (bgMusicRef.current) {
                            bgMusicRef.current.pause()
                            bgMusicRef.current.currentTime = 0
                        }
                    }}
                />
            )}

            {/* Vercel Web Analytics */}
            <Analytics />
        </>
    )
}

export default App
