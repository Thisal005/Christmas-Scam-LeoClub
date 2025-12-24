import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScamSpinner } from './ScamSpinner';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
    const [scene, setScene] = useState(1);
    const [countdown, setCountdown] = useState(5);
    const [spinFinished, setSpinFinished] = useState(false);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!started) return;

        // Play spin sound on mount (when started)
        // We handle this in the click handler for better browser support, 
        // but can keeping a safeguard here or solely relying on the click.
        // Let's rely on the click handler for the initial sound to ensure autoplay policy compliance.

        // Scene 1: The Perfect Win (0-6s)
        const timer1 = setTimeout(() => {
            // Spin finishes at 5s (matching audio/animation)
            setSpinFinished(true);
        }, 5000);

        const timerGlitch = setTimeout(() => {
            setScene(2);
        }, 8000); // 8s duration for Scene 1 (5s spin + 3s celebrate)

        // Scene 2: Glitch Interruption (8s - 11s)
        const timer2 = setTimeout(() => {
            setScene(3);
        }, 11000);

        // Scene 3: Panic Reveal (11s - 15s)
        const timer3 = setTimeout(() => {
            setScene(4);
        }, 15000);

        // Scene 4: Countdown (15s - 20s)
        const timer4 = setTimeout(() => {
            setScene(5);
        }, 20000);

        // Scene 5: Release
        const timer5 = setTimeout(() => {
            onComplete();
        }, 20000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timerGlitch);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
        };
    }, [onComplete, started]);

    // Scene Audio Effects
    useEffect(() => {
        if (scene === 2) {
            const audio = new Audio('/glitch.mp3');
            audio.volume = 0.6;
            audio.play().catch(e => console.log('Glitch audio failed:', e));
        } else if (scene === 3) {
            const audio = new Audio('/cat.mp3');
            audio.volume = 0.6;
            audio.play().catch(e => console.log('Cat audio failed:', e));
        } else if (scene === 4) {
            const audio = new Audio('/countdown.mp3');
            audio.volume = 0.6;
            audio.play().catch(e => console.log('Countdown audio failed:', e));

            // Countdown logic moved here or kept separate, 
            // but the audio trigger is now centralized by scene.
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) return 0;
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [scene]);

    // Win sound effect
    useEffect(() => {
        if (spinFinished) {
            const winAudio = new Audio('/win.mp3');
            winAudio.volume = 0.5;
            winAudio.play().catch(e => console.log('Audio play failed:', e));

            winAudio.onended = () => {
                const errorAudio = new Audio('/error.mp3');
                errorAudio.volume = 0.5;
                errorAudio.play().catch(e => console.log('Error play failed:', e));
            };
        }
    }, [spinFinished]);

    const handleStart = () => {
        const spinAudio = new Audio('/spin.mp3');
        spinAudio.volume = 0.5;
        spinAudio.play().catch(e => console.log('Audio play failed:', e));
        setStarted(true);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none cursor-default">
            {!started && (
                <div
                    className="absolute inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center text-white cursor-pointer"
                    onClick={handleStart}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                        className="text-4xl font-bold tracking-widest uppercase border-4 border-yellow-400 px-8 py-4 rounded-xl text-yellow-400 hover:bg-yellow-400 hover:text-black transition-colors"
                    >
                        Click to Reveal Prize
                    </motion.div>
                    <p className="mt-4 text-gray-400 text-sm">Enable sound for best experience</p>
                </div>
            )}
            <AnimatePresence mode="wait">
                {/* SCENE 1: THE PERFECT WIN */}
                {scene === 1 && (
                    <motion.div
                        key="scene1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        className="w-full h-full bg-gradient-to-b from-purple-900 to-indigo-900 flex flex-col items-center justify-center text-white relative"
                    >
                        {/* Confetti Rain */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(50)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-4"
                                    style={{
                                        backgroundColor: ['#FFD700', '#FF0000', '#00FF00', '#00FFFF', '#FF00FF'][i % 5],
                                        left: `${Math.random() * 100}%`,
                                        top: -20
                                    }}
                                    animate={{
                                        y: window.innerHeight + 20,
                                        rotate: 360,
                                        x: [-20, 20, -20]
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 3,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: Math.random() * 2
                                    }}
                                />
                            ))}
                        </div>

                        {/* Sparkles */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={`sparkle-${i}`}
                                    className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
                                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                                    animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                                    transition={{ duration: 1 + Math.random(), repeat: Infinity, delay: Math.random() }}
                                />
                            ))}
                        </div>

                        <ScamSpinner
                            started={started}
                            spinFinished={spinFinished}
                        />
                    </motion.div>
                )}

                {/* SCENE 2: GLITCH INTERRUPTION */}
                {scene === 2 && (
                    <motion.div
                        key="scene2"
                        className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden"
                    >
                        {/* Static Noise Overlay */}
                        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-10 pointer-events-none mix-blend-screen bg-cover" />

                        {/* Scrolling Terminal Text Columns */}
                        <div className="absolute inset-0 flex justify-between opacity-40 pointer-events-none font-mono text-xs text-green-500 overflow-hidden">
                            {[...Array(5)].map((_, colIndex) => (
                                <div key={colIndex} className="flex flex-col space-y-1 mx-2">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={`${colIndex}-${i}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: [0, 1, 0.5, 1], x: 0 }}
                                            transition={{
                                                duration: 0.1,
                                                delay: Math.random() * 2,
                                                repeat: Infinity,
                                                repeatDelay: Math.random() * 0.5
                                            }}
                                        >
                                            {`> ${[
                                                'injecting payload...',
                                                'bypassing firewall...',
                                                'root access granted',
                                                'decrypting user keys...',
                                                'uploading private_data.zip',
                                                'disabling antivirus...',
                                                'connecting to botnet...',
                                                'fetching gps location...',
                                                'camera access: ENABLED',
                                                'microphone: LISTENING'
                                            ][Math.floor(Math.random() * 10)]}`}
                                        </motion.div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Glitch Text */}
                        <div className="relative z-20 mix-blend-hard-light">
                            <motion.h1
                                className="text-4xl md:text-8xl font-mono font-black text-white relative"
                                animate={{
                                    x: [-5, 5, -3, 3, 0],
                                    skewX: [0, 20, -20, 0],
                                    scaleY: [1, 1.2, 0.8, 1],
                                    color: ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffffff']
                                }}
                                transition={{ repeat: Infinity, duration: 0.08, repeatType: "mirror" }}
                            >
                                SYSTEM FAILURE
                            </motion.h1>

                            {/* RGB Split Layers */}
                            <motion.div
                                className="absolute top-0 left-0 w-full h-full text-red-500 text-4xl md:text-8xl font-mono font-black opacity-80 mix-blend-screen"
                                animate={{ x: [-10, 10, -5], clipPath: ['inset(0 0 0 0)', 'inset(10% 0 30% 0)', 'inset(0 0 0 0)'] }}
                                transition={{ repeat: Infinity, duration: 0.05 }}
                            >
                                SYSTEM FAILURE
                            </motion.div>
                            <motion.div
                                className="absolute top-0 left-0 w-full h-full text-blue-500 text-4xl md:text-8xl font-mono font-black opacity-80 mix-blend-screen"
                                animate={{ x: [10, -10, 5], clipPath: ['inset(0 0 0 0)', 'inset(30% 0 10% 0)', 'inset(0 0 0 0)'] }}
                                transition={{ repeat: Infinity, duration: 0.05 }}
                            >
                                SYSTEM FAILURE
                            </motion.div>
                            <motion.div
                                className="absolute top-0 left-0 w-full h-full text-green-500 text-4xl md:text-8xl font-mono font-black opacity-80 mix-blend-screen"
                                animate={{ x: [-5, 5, -2], skewX: [10, -10] }}
                                transition={{ repeat: Infinity, duration: 0.05 }}
                            >
                                SYSTEM FAILURE
                            </motion.div>
                        </div>

                        {/* Random Rectangles / Artifacts */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(10)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute bg-white"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        width: Math.random() * 200 + 'px',
                                        height: Math.random() * 5 + 'px',
                                    }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        x: [0, Math.random() * 100 - 50]
                                    }}
                                    transition={{
                                        duration: 0.1,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                        repeatDelay: Math.random()
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* SCENE 3: PANIC REVEAL */}
                {scene === 3 && (
                    <motion.div
                        key="scene3"
                        initial={{ backgroundColor: '#000' }}
                        animate={{ backgroundColor: '#1a0000' }}
                        className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
                    >
                        {/* Shaking Background */}
                        <motion.div
                            className="absolute inset-0 border-[20px] border-red-900 opacity-50"
                            animate={{ x: [-5, 5, -5], y: [-5, 5, -5] }}
                            transition={{ duration: 0.1, repeat: Infinity }}
                        />

                        <div className="z-10 text-center space-y-4">
                            <motion.h2
                                initial={{ scale: 2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-red-600 text-4xl md:text-8xl font-black uppercase tracking-tighter"
                            >
                                YOU FOOL.
                            </motion.h2>
                            <motion.h3
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-white text-xl md:text-5xl font-bold bg-red-600 px-4 py-1"
                            >
                                YOU CLICKED THE SCAM.
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0, 1] }}
                                transition={{ delay: 1, duration: 0.2, repeat: 4 }}
                                className="text-red-400 text-sm md:text-xl font-mono mt-8"
                            >
                                YOUR DEVICE HAS BEEN HACKED
                            </motion.p>
                        </div>
                    </motion.div>
                )}

                {/* SCENE 4: COUNTDOWN */}
                {scene === 4 && (
                    <motion.div
                        key="scene4"
                        className="w-full h-full bg-black flex flex-col items-center justify-center relative"
                    >
                        {/* Scan lines */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-20" />

                        <motion.div
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: [1.2, 1], opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="text-[8rem] md:text-[20rem] font-black text-red-600 font-mono relative z-10"
                        >
                            {countdown}
                            {/* Glitch effect on number */}
                            <motion.span
                                className="absolute inset-0 text-white mix-blend-difference translate-x-1"
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 0.2 }}
                            >
                                {countdown}
                            </motion.span>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-10 text-red-500 font-mono text-xs md:text-xl text-center px-4"
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            IF YOU CLOSE THIS YOUR DATA WILL BE DELETED THEREFORE CONTINUE THE NEXT STEPS...
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SCENE 5: RELEASE (Overlay Fade Out handled by AnimatePresence on main app or just instant cut) */}
        </div>
    );
};
