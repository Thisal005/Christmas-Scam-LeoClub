import { Canvas } from '@react-three/fiber'
import { Environment, Sparkles, OrbitControls, Float } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef } from 'react'
import { GiftBox } from './components/GiftBox'
import { Overlay } from './components/Overlay'
import { BackgroundSanta } from './components/BackgroundSanta'
import { SantaSleigh } from './components/SantaSleigh'
import { SplashScreen } from './components/SplashScreen'
import { EndingScene } from './components/EndingScene'
import { useScamStats } from './hooks/useScamStats'

function App() {
    const { visits, victims, incrementVisit, incrementVictim } = useScamStats()
    const bgMusicRef = useRef<HTMLAudioElement | null>(null)
    const [musicStarted, setMusicStarted] = useState(false)
    const [deliveryStarted, setDeliveryStarted] = useState(false)
    const [boxDropped, setBoxDropped] = useState(false)
    const [extraGifts, setExtraGifts] = useState(false)

    const [isMobile, setIsMobile] = useState(false)

    // Detect mobile screen
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Configuration for the 6 extra gifts
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

    // Splash Screen State
    const [showSplash, setShowSplash] = useState(true)

    // Initialize background music
    useEffect(() => {
        bgMusicRef.current = new Audio('/bg.mp3')
        bgMusicRef.current.loop = true
        bgMusicRef.current.volume = 0.4

        incrementVisit()
    }, [])

    // Handle music and delivery start after splash screen
    useEffect(() => {
        const tryStartSequence = async () => {
            if (bgMusicRef.current) {
                try {
                    await bgMusicRef.current.play()
                    setMusicStarted(true)
                    setDeliveryStarted(true)
                } catch (err) {
                    console.log('Autoplay blocked, waiting for interaction')
                }
            }
        }

        if (!showSplash) {
            tryStartSequence()
        }
    }, [showSplash])

    // Fallback interaction handler if autoplay failed
    useEffect(() => {
        const handleInteraction = () => {
            if (!showSplash && !musicStarted && bgMusicRef.current) {
                bgMusicRef.current.play()
                    .then(() => {
                        setMusicStarted(true)
                        setDeliveryStarted(true)
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
            {showSplash && (
                <SplashScreen onComplete={() => setShowSplash(false)} />
            )}

            <Canvas
                shadows
                camera={{ position: [0, 2, isMobile ? 13.5 : 8], fov: 45 }}
                style={{
                    width: '100vw',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    // Hide canvas visually while splash is active, 
                    // or keep it behind if splash is opaque (splash is black background so it covers it)
                    visibility: showSplash ? 'hidden' : 'visible'
                }}
            >
                <color attach="background" args={['#050510']} />
                <fog attach="fog" args={['#050510', 5, 20]} />

                <Suspense fallback={null}>
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

                    {/* Delivery Sequence */}
                    <SantaSleigh
                        start={deliveryStarted}
                        onDrop={() => setBoxDropped(true)}
                    />

                    {/* The Main Gift Box - Scaling slightly down for mobile if needed, but camera distance handles most */}
                    <GiftBox
                        isDropped={boxDropped}
                        isMain={true}
                        onOpen={() => {
                            setExtraGifts(true)
                            incrementVictim()
                        }}
                    />

                    {/* Extra Gifts - Floating in background */}
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
                        enableZoom={false} // We handle zoom programmatically
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Suspense>
            </Canvas>

            {!showSplash && <Overlay visits={visits} victims={victims} />}

            {!showSplash && !musicStarted && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    opacity: 0.8,
                    pointerEvents: 'none'
                }}>
                    Click anywhere to start
                </div>
            )}
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
        </>
    )
}

export default App
