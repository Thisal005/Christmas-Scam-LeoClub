import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

interface EndingSceneProps {
    onRestart: () => void;
    onStopBgMusic: () => void;
}

export const EndingScene = ({ onRestart, onStopBgMusic }: EndingSceneProps) => {
    // 0: Idle/Start, 1: Sequence Active, 2: Finished (Card), 3: SendOff
    const [status, setStatus] = useState<'idle' | 'playing' | 'finished' | 'sendoff'>('idle');
    const [currentTime, setCurrentTime] = useState(0);

    // Audio Refs
    const glitchAudioRef = useRef<HTMLAudioElement | null>(null);
    const errorGlitchRef = useRef<HTMLAudioElement | null>(null);
    const endingBgRef = useRef<HTMLAudioElement | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const startEnding = () => {
        onStopBgMusic();
        setStatus('playing');
        setCurrentTime(0);

        // Init Audio
        glitchAudioRef.current = new Audio('/glitch.mp3');
        glitchAudioRef.current.volume = 0.6;

        errorGlitchRef.current = new Audio('/error-glitch.mp3');
        errorGlitchRef.current.volume = 0.4;

        // Init Ending Background Music
        endingBgRef.current = new Audio('/bg_3.mp3');
        endingBgRef.current.volume = 0.5;
        endingBgRef.current.loop = true;
        endingBgRef.current.play().catch(e => console.warn("Ending music play failed:", e));
    };

    useEffect(() => {
        if (status !== 'playing') return;

        const interval = setInterval(() => {
            setCurrentTime(prev => prev + 0.1);
        }, 100);

        // Original Glitch triggers (kept as requested or arguably part of effect)
        if (Math.abs(currentTime - 0.5) < 0.05) {
            glitchAudioRef.current?.play().catch(() => { });
        }
        if (Math.abs(currentTime - 4.0) < 0.05) {
            glitchAudioRef.current?.play().catch(() => { });
        }

        // Text Reveal Sound Triggers (error-glitch.mp3)
        const textRevealTimes = [
            0.1,        // Intro text
            4.0, 4.5,   // Clickbait title + items
            8.0, 9.5,   // In 2025... + AI makes them...
            13.2, 14.5, 15.8, // Stats 1, 2, 3
            18.0, 19.0, // Cases + Social media
            22.0, 23.5, // The Hardest Truth
            26.0, 27.5, // Nothing here... + It tested...
            30.5, 32.5  // Human Trust + Stay curious
        ];

        if (textRevealTimes.some(t => Math.abs(currentTime - t) < 0.05)) {
            if (errorGlitchRef.current) {
                errorGlitchRef.current.currentTime = 0;
                errorGlitchRef.current.play().catch(() => { });
            }
        }

        // End sequence timing - Extend to allow reading final message before card (e.g., 38s)
        if (currentTime >= 38) {
            setStatus('finished');
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [status, currentTime]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            endingBgRef.current?.pause();
            errorGlitchRef.current?.pause();
        };
    }, []);

    const handleDownload = async () => {
        if (cardRef.current) {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2 // High res
            });
            const link = document.createElement('a');
            link.download = 'christmas-scam-roast.png';
            link.href = canvas.toDataURL();
            link.click();

            // Show final send-off after download
            setStatus('sendoff');
        }
    };

    // Helper for time ranges
    const isTime = (start: number, end: number) => currentTime >= start && currentTime < end;

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center font-sans">

            {status === 'idle' && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 md:bottom-6 md:left-6 md:translate-x-0 z-[100] pointer-events-auto">
                    <motion.button
                        onClick={startEnding}
                        className="bg-red-600/80 backdrop-blur-sm text-white text-xs md:text-sm font-bold uppercase tracking-widest py-2 px-6 rounded-full shadow-lg border border-red-400/50 hover:bg-red-600 hover:scale-105 transition-all"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        See The Truth
                    </motion.button>
                </div>
            )}

            <AnimatePresence mode="wait">
                {status === 'playing' && (
                    <motion.div
                        key="cinematic-container"
                        className="fixed inset-0 bg-black z-[100] text-white flex items-center justify-center overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Background Effects */}
                        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                            {/* Simple noise or grid effect could go here */}
                            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black" />
                        </div>

                        {/* 0-4s: Intro Text */}
                        {isTime(0, 4) && (
                            <motion.div
                                className="z-10 text-center px-4"
                                initial={{ opacity: 0, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 1.1, filter: 'blur(5px)' }}
                            >
                                <h2 className="text-xl md:text-3xl font-light tracking-wider text-gray-300">
                                    What you just experienced<br />has a real name.
                                </h2>
                            </motion.div>
                        )}

                        {/* 4-8s: Clickbait Scams */}
                        {isTime(4, 8) && (
                            <motion.div
                                className="z-10 text-center px-4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <h1 className="text-4xl md:text-6xl font-black text-red-600 tracking-tighter mb-4 glitch-text">
                                    CLICKBAIT SCAMS
                                </h1>
                                <motion.div
                                    className="flex flex-wrap justify-center gap-4 text-sm md:text-lg text-gray-400 font-mono"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <span>Phishing.</span>
                                    <span>Giveaways.</span>
                                    <span>Impersonation.</span>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* 8-13s: Abstract Data / AI Context */}
                        {isTime(8, 13) && (
                            <motion.div
                                className="z-10 text-center px-4 max-w-4xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="text-2xl md:text-4xl font-bold mb-2"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                >
                                    In 2025, scams don’t look fake anymore.
                                </motion.div>
                                <motion.div
                                    className="text-xl md:text-3xl text-blue-400 font-bold"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.5 }}
                                >
                                    AI makes them convincing.
                                </motion.div>
                            </motion.div>
                        )}

                        {/* 13-18s: Cinematic Stats */}
                        {isTime(13, 18) && (
                            <motion.div
                                className="z-10 w-full max-w-3xl px-6 flex flex-col gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <StatItem delay={0.2} label="AI-powered attacks increased by" value="1265%" color="text-red-500" />
                                <StatItem delay={1.5} label="Most common cybercrime" value="Phishing" color="text-white" />
                                <StatItem delay={2.8} label="Average data breach cost" value="$4.88 million" color="text-yellow-400" />
                                <StatItem delay={4} label="Total global cybercrime losses in 2024" value="$16.6 billion" color="text-yellow-400" />
                                -
                            </motion.div>
                        )}

                        {/* 18-22s: Social Media Context */}
                        {isTime(18, 22) && (
                            <motion.div
                                className="z-10 text-center px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="text-xs md:text-sm text-gray-500 tracking-[0.2em] mb-4 uppercase">
                                    Sri Lanka — 2025
                                </div>
                                <motion.div
                                    className="text-3xl md:text-5xl font-bold mb-2"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    5,400+ Cybercrime Cases
                                </motion.div>
                                <motion.div
                                    className="text-gray-400 text-lg"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    Most spread through social media.
                                </motion.div>
                            </motion.div>
                        )}

                        {/* 22-26s: The Hardest Truth */}
                        {isTime(22, 26) && (
                            <motion.div
                                className="z-10 text-center px-4 max-w-2xl"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="text-xs md:text-sm text-red-500 tracking-[0.3em] mb-6 uppercase font-bold"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    The Hardest Truth
                                </motion.div>
                                <motion.p
                                    className="text-2xl md:text-4xl text-white font-bold mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    Most scams are never reported.
                                </motion.p>
                                <motion.p
                                    className="text-lg md:text-2xl text-gray-400"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.5 }}
                                >
                                    Not because people don't notice…
                                </motion.p>
                                <motion.p
                                    className="text-lg md:text-2xl text-gray-300 mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2.5 }}
                                >
                                    but because they notice <span className="text-red-500 font-bold">too late</span>.
                                </motion.p>
                            </motion.div>
                        )}

                        {/* 26-30s: The Real Test */}
                        {isTime(26, 30) && (
                            <motion.div
                                className="z-10 text-center px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.p
                                    className="text-xl md:text-3xl text-gray-300 mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Nothing here hacked your device.
                                </motion.p>
                                <motion.p
                                    className="text-2xl md:text-4xl text-white font-bold"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.5 }}
                                >
                                    It tested something else.
                                </motion.p>
                            </motion.div>
                        )}

                        {/* 30-38s: Final Message */}
                        {isTime(30, 38) && (
                            <motion.div
                                className="z-10 text-center px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 1.5 }}
                            >
                                <motion.div
                                    className="text-4xl md:text-7xl font-serif text-amber-100 mb-8"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Human Trust.
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2.5 }}
                                    className="flex flex-col gap-2"
                                >
                                    <p className="text-lg md:text-xl text-white font-light tracking-wider">
                                        Stay curious. Stay skeptical.
                                    </p>
                                    <p className="text-sm md:text-base text-gray-500 mt-2">
                                        Awareness is your real security.
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 h-1 bg-red-600 z-50" style={{ width: `${(Math.min(currentTime, 38) / 38) * 100}%` }} />
                    </motion.div>
                )}

                {/* Final Roast Card Scene */}
                {status === 'finished' && (
                    <motion.div
                        key="final-card"
                        className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center pointer-events-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div ref={cardRef} className="bg-white p-4 md:p-6 rounded shadow-2xl rotate-[-2deg] max-w-sm mx-auto mb-8 relative overflow-hidden transform scale-90 md:scale-100">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500 transform rotate-45 translate-x-10 -translate-y-10" />
                            <div className="bg-gray-100 border border-gray-200 aspect-square w-64 md:w-80 flex flex-col items-center justify-center text-center p-4 relative mb-4">
                                <div className="absolute top-2 left-2 text-xs text-gray-400 font-mono">CASE #XK-99</div>
                                <h2 className="text-2xl font-black text-red-600 mb-2 upeprcase transform -rotate-2">I CLICKED IT.</h2>
                                <p className="text-sm text-gray-600 mb-4">I spun the wheel and gave away my data.</p>
                                <div className="text-4xl mb-2">🤡</div>
                                <div className="w-full h-1 bg-gray-300 my-4" />
                                <div className="w-full flex justify-between text-xs font-bold text-gray-500 uppercase">
                                    <span>Curiosity: 100%</span>
                                    <span>Suspicion: 0%</span>
                                </div>
                            </div>
                            <div className="text-center font-handwriting text-xl text-gray-800 rotate-1">
                                Certified Easy Target
                            </div>
                            <div className="text-center text-[10px] text-gray-400 mt-2 font-mono">
                                #ChristmasScamSim
                            </div>
                        </div>

                        <div className="flex gap-4 z-20">
                            <button
                                onClick={handleDownload}
                                className="bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                📸 Download Card
                            </button>
                            <button
                                onClick={() => {
                                    setStatus('sendoff');
                                    setTimeout(onRestart, 4000);
                                }}
                                className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-colors"
                            >
                                🔁 Restart
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* SCENE E5: Final Send-off */}
                {status === 'sendoff' && (
                    <motion.div
                        key="scene-e5"
                        className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center text-center pointer-events-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.h1
                            className="text-4xl text-white font-serif italic mb-4"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Merry Christmas 🎄
                        </motion.h1>
                        <motion.p
                            className="text-gray-400 font-mono"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            Stay curious. Stay skeptical.
                        </motion.p>
                        <motion.div
                            className="mt-8 max-w-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                        >
                            <p className="text-gray-500 text-sm mb-1 font-mono">
                                Share this with your friends and loved ones.
                            </p>
                            <p className="text-gray-600 text-xs font-mono">
                                A little awareness can protect someone you care about.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

{/* Overlay */}
            <div className="fixed bottom-6 right-6 z-[200] pointer-events-auto text-[10px] md:text-xs tracking-widest text-white/40 font-light mix-blend-screen">
                <span className="opacity-70">This crazy shit developed by : </span>
                <a
                    href="https://github.com/Thisal005"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center group ml-1 text-white/80 hover:text-white transition-colors duration-300"
                >
                    <span className="relative z-10">anonymous</span>
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 origin-right transition-transform duration-300 scale-x-0 group-hover:scale-x-100 group-hover:origin-left group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-white group-hover:to-transparent"></span>
                    <span className="absolute -inset-2 bg-white/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </a>
            </div>
        </div>
    );
};

const StatItem = ({ label, value, color, delay }: { label: string, value: string, color: string, delay: number }) => (
    <motion.div
        className="flex items-center justify-between border-b border-gray-800 pb-2"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay }}
    >
        <span className="text-gray-400 text-sm md:text-lg font-mono">{label}</span>
        <span className={`text-xl md:text-3xl font-bold ${color}`}>{value}</span>
    </motion.div>
);
