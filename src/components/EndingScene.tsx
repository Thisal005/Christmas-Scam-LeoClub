import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { StatItem } from './StatItem';

interface EndingSceneProps {
    /** Function to reload the application/restart the experience */
    onRestart: () => void;
    /** Function to stop the main background music from App.tsx */
    onStopBgMusic: () => void;
}

/**
 * EndingScene Component
 * 
 * Displays the cinematic "reveal" sequence where the user learns this was a simulation.
 * It progresses through multiple stages:
 * 1. Playing: A timed cinematic sequence showing facts and warnings.
 * 2. Finished: Displays a "Roast Card" summarizing the user's "fail".
 * 3. Sendoff: A final message from the organization (Leo Club) with credits.
 */
export const EndingScene = ({ onRestart, onStopBgMusic }: EndingSceneProps) => {
    // 0: Idle/Start, 1: Sequence Active, 2: Finished (Card), 3: SendOff
    const [status, setStatus] = useState<'idle' | 'playing' | 'finished' | 'sendoff'>('idle');
    const [currentTime, setCurrentTime] = useState(0);
    const [sendoffTime, setSendoffTime] = useState(0);

    // Audio Refs
    const glitchAudioRef = useRef<HTMLAudioElement | null>(null);
    const errorGlitchRef = useRef<HTMLAudioElement | null>(null);
    const endingBgRef = useRef<HTMLAudioElement | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    /**
     * Starts the cinematic ending sequence.
     * Initializes specific ending audio and stops the main App music.
     */
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

    /**
     * Main timeline loop for the cinematics.
     * Updates `currentTime` every 100ms and triggers audio cues at specific timestamps.
     */
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

        // Text Reveal Sound Triggers (error-glitch.mp3) - Syncing with all English & Sinhala text reveals
        const textRevealTimes = [
            0.1,        // Intro text (Eng)
            5.0,        // Intro text (Sin)

            10.0, 10.5, // Clickbait (Eng)
            15.0, 15.5, // Clickbait (Sin)

            20.0, 21.5, // AI Context (Eng)
            26.0, 27.5, // AI Context (Sin)

            32.2, 33.5, 34.8, 36.0, // Stats (Eng)
            38.2, 39.5, 40.8, 42.0, // Stats (Sin)

            44.0, 45.0, // Social Media (Eng)
            50.0, 51.0, // Social Media (Sin)

            56.0, 57.5, 58.5, // Hardest Truth (Eng)
            61.0, 62.5, 63.5, // Hardest Truth (Sin)

            66.0, 67.5, // Real Test (Eng)
            71.0, 72.5, // Real Test (Sin)

            76.5, 78.5, // Final (Eng)
            83.5, 85.5  // Final (Sin)
        ];

        if (textRevealTimes.some(t => Math.abs(currentTime - t) < 0.05)) {
            if (errorGlitchRef.current) {
                errorGlitchRef.current.currentTime = 0;
                errorGlitchRef.current.play().catch(() => { });
            }
        }

        // End sequence timing - Extended to 92s to cover all disjoint scenes
        if (currentTime >= 92) {
            setStatus('finished');
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [status, currentTime]);

    /**
     * Timeline loop for the Final Send-off sequence.
     * Starts after the user interacts with the Roast Card or downloads it.
     */
    useEffect(() => {
        if (status !== 'sendoff') return;

        const interval = setInterval(() => {
            setSendoffTime(prev => prev + 0.1);
        }, 100);

        // Fade out audio at 16s (extended from 13s)
        if (sendoffTime > 16 && endingBgRef.current) {
            const newVolume = Math.max(0, 0.5 - ((sendoffTime - 16) * 0.5));
            endingBgRef.current.volume = newVolume;
        }

        // End at 17.5s (extended from 14.5s)
        if (sendoffTime >= 17.5) {
            onRestart();
        }

        return () => clearInterval(interval);
    }, [status, sendoffTime, onRestart]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            endingBgRef.current?.pause();
            errorGlitchRef.current?.pause();
        };
    }, []);

    /**
     * Generates an image from the Roast Card DOM element and triggers a download.
     */
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
    const isSendoffTime = (start: number, end: number) => sendoffTime >= start && sendoffTime < end;

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

                        {/* 0-5s: Intro Text - English*/}
                        {isTime(0, 5) && (
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

                        {/* 5-10s: Intro Text - Sinhala*/}
                        {isTime(5, 10) && (
                            <motion.div
                                className="z-10 text-center px-4"
                                initial={{ opacity: 0, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 1.1, filter: 'blur(5px)' }}
                            >
                                <h2 className="text-xl md:text-3xl font-light tracking-wider text-gray-300">
                                    ඔබ දැන් අත්විඳි දෙයට<br />නියම නමක් තිබේ.
                                </h2>
                            </motion.div>
                        )}

                        {/* 10-15s: Clickbait Scams - English */}
                        {isTime(10, 15) && (
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

                        {/* 15-20s: Clickbait Scams - Sinhala */}
                        {isTime(15, 20) && (
                            <motion.div
                                className="z-10 text-center px-4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <h1 className="text-4xl md:text-6xl font-black text-red-600 tracking-tighter mb-4 glitch-text">
                                    'ක්ලික්බේට්' වංචා (CLICKBAIT SCAMS)
                                </h1>
                                <motion.div
                                    className="flex flex-wrap justify-center gap-4 text-sm md:text-lg text-gray-400 font-mono"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <span>ෆිෂිං (Phishing).</span>
                                    <span>තෑගි දීමනා (Giveaways).</span>
                                    <span>පුද්ගල මාරු වෙස්ගැනීම (Impersonation).</span>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* 20-26s: Abstract Data / AI Context - English */}
                        {isTime(20, 26) && (
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


                        {/* 26-32s: Abstract Data / AI Context - Sinhala */}
                        {isTime(26, 32) && (
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
                                    2025 වසරේදී, මෙම වංචාවන් තවදුරටත් ව්‍යාජ ඒවා ලෙස පෙනෙන්නේ නැත.
                                </motion.div>
                                <motion.div
                                    className="text-xl md:text-3xl text-blue-400 font-bold"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.5 }}
                                >
                                    කෘතිම බුද්ධිය (AI) මඟින් ඒවා ඉතා විශ්වසනීය ලෙස නිර්මාණය කර ඇත.
                                </motion.div>
                            </motion.div>
                        )}

                        {/* 32-38s: Cinematic Stats - English */}
                        {isTime(32, 38) && (
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

                        {/* 38-44s: Cinematic Stats - Sinhala */}
                        {isTime(38, 44) && (
                            <motion.div
                                className="z-10 w-full max-w-3xl px-6 flex flex-col gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <StatItem delay={0.2} label="කෘතිම බුද්ධිය (AI) ආධාරයෙන් සිදු කරන ප්‍රහාරයන්ගේ වර්ධනය" value="1265%" color="text-red-500" />
                                <StatItem delay={1.5} label="වඩාත්ම සුලභ සයිබර් අපරාධය" value="Phishing" color="text-white" />
                                <StatItem delay={2.8} label="දත්ත අවභාවිතයක (Data breach) සාමාන්‍ය පිරිවැය" value="$4.88 million" color="text-yellow-400" />
                                <StatItem delay={4} label="2024 වසරේ සමස්ත ගෝලීය සයිබර් අපරාධ පාඩුව" value="$16.6 billion" color="text-yellow-400" />
                                -
                            </motion.div>
                        )}

                        {/* 44-50s: Social Media Context - English */}
                        {isTime(44, 50) && (
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


                        {/* 50-56s: Social Media Context - Sinhala */}
                        {isTime(50, 56) && (
                            <motion.div
                                className="z-10 text-center px-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="text-xs md:text-sm text-gray-500 tracking-[0.2em] mb-4 uppercase">
                                    ශ්‍රී ලංකාව — 2025
                                </div>
                                <motion.div
                                    className="text-3xl md:text-5xl font-bold mb-2"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                >
                                    සයිබර් අපරාධ සිදුවීම් 5,400+ කට වඩා වාර්තා වී ඇත.
                                </motion.div>
                                <motion.div
                                    className="text-gray-400 text-lg"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                >
                                    මින් බොහොමයක් සමාජ මාධ්‍ය හරහා පැතිර යයි.
                                </motion.div>
                            </motion.div>
                        )}

                        {/* 56-61s: The Hardest Truth - English */}
                        {isTime(56, 61) && (
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

                        {/* 61-66s: The Hardest Truth - Sinhala */}
                        {isTime(61, 66) && (
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
                                    කටුක ඇත්ත (The Hardest Truth)
                                </motion.div>
                                <motion.p
                                    className="text-2xl md:text-4xl text-white font-bold mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    බොහෝ වංචාවන් කිසිදා වාර්තා නොවේ.
                                </motion.p>
                                <motion.p
                                    className="text-lg md:text-2xl text-gray-400"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.5 }}
                                >
                                    ඒ මිනිසුන්ට එය නොදැනෙන නිසා නොව...
                                </motion.p>
                                <motion.p
                                    className="text-lg md:text-2xl text-gray-300 mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2.5 }}
                                >
                                    ඔවුන්ට එය වැටහෙන විට <span className="text-red-500 font-bold">ප්‍රමාද වැඩි නිසාය.</span>.
                                </motion.p>
                            </motion.div>
                        )}

                        {/* 66-71s: The Real Test - English */}
                        {isTime(66, 71) && (
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

                        {/* 71-76s: The Real Test - Sinhala */}
                        {isTime(71, 76) && (
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
                                    මෙහි ඇති කිසිවක් ඔබගේ උපාංගයට (Device) හානි කළේ නැත.
                                </motion.p>
                                <motion.p
                                    className="text-2xl md:text-4xl text-white font-bold"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1.5 }}
                                >
                                    එය පරීක්ෂා කළේ වෙනත් දෙයකි.
                                </motion.p>
                            </motion.div>
                        )}

                        {/* 76-83s: Final Message - English */}
                        {isTime(76, 83) && (
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


                        {/* 83-90s: Final Message - Sinhala */}
                        {isTime(83, 90) && (
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
                                    මිනිස් විශ්වාසය.
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2.5 }}
                                    className="flex flex-col gap-2"
                                >
                                    <p className="text-lg md:text-xl text-white font-light tracking-wider">
                                        විමසිලිමත් වන්න. සැක සහිත දේ ගැන අවදියෙන් සිටින්න.
                                    </p>
                                    <p className="text-sm md:text-base text-gray-500 mt-2">
                                        දැනුවත්භාවය යනු ඔබේ සැබෑ ආරක්ෂාවයි.
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}

                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 h-1 bg-red-600 z-50" style={{ width: `${(Math.min(currentTime, 92) / 92) * 100}%` }} />
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
                                #ChristmasScamSim #SSCLC #LeoClub
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
                                }}
                                className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-colors"
                            >
                                🔁 Restart
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* SCENE E6: Cinematic Ending (10s) */}
                {status === 'sendoff' && (
                    <motion.div
                        key="cinematic-sendoff"
                        className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center text-center pointer-events-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1 } }}
                    >
                        {/* 0-3s: Intro */}
                        {isSendoffTime(0, 3) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 1.5, ease: "easeIn" } }}
                                exit={{ opacity: 0, y: -20, transition: { duration: 0.8 } }}
                                className="flex flex-col items-center"
                            >
                                <p className="text-white text-lg md:text-2xl font-medium tracking-wide">
                                    This message is from the Leo Club of St. Servatius College.
                                </p>
                            </motion.div>
                        )}

                        {/* 3-6s: Stay Safe */}
                        {isSendoffTime(3, 6) && (
                            <motion.div
                                className="flex flex-col gap-3"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.05, transition: { duration: 1 } }}
                            >
                                <motion.h2
                                    className="text-3xl md:text-5xl font-bold text-white tracking-tight"
                                    initial={{ filter: "blur(5px)" }}
                                    animate={{ filter: "blur(0px)" }}
                                >
                                    Pause. Verify. Protect.
                                </motion.h2>
                                <motion.p
                                    className="text-gray-400 text-lg md:text-xl font-light"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Digital awareness matters.
                                </motion.p>
                                <motion.div
                                    className="absolute inset-0 bg-white/5 blur-3xl rounded-full"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1.5 }}
                                    transition={{ duration: 0.2, yoyo: 1 }}
                                    style={{ pointerEvents: 'none' }}
                                />
                            </motion.div>
                        )}

                        {/* 6-9s: Credits */}
                        {isSendoffTime(6.0, 9.0) && (
                            <motion.div
                                className="flex flex-col items-center"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <p className="text-gray-500 text-sm uppercase tracking-[0.2em] mb-2">
                                    Scripted & Developed by
                                </p>
                                <h3 className="text-2xl md:text-4xl text-white font-medium tracking-wide">
                                    Thisal Thiranjith
                                </h3>
                            </motion.div>
                        )}

                        {/* 9-11s: Merry Christmas (English) */}
                        {isSendoffTime(9.0, 11.0) && (
                            <motion.h1
                                className="text-3xl md:text-5xl text-red-500 font-serif italic"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Merry Christmas 🎄
                            </motion.h1>
                        )}

                        {/* 11-13s: Merry Christmas (Sinhala) */}
                        {isSendoffTime(11.0, 13.5) && (
                            <motion.h1
                                className="text-3xl md:text-5xl text-red-500 font-serif italic"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                සුබ නත්තලක් වේවා! 🎄
                            </motion.h1>
                        )}

                        {/* 13.5-16.5s: Logo Reveal with Cinematic Animation */}
                        {isSendoffTime(13.5, 17.0) && (
                            <motion.div
                                className="flex flex-col items-center justify-center p-4"
                                initial={{ opacity: 0, scale: 0.8, filter: "brightness(0)" }}
                                animate={{ opacity: 1, scale: 1, filter: "brightness(1.2)" }}
                                exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            >
                                <motion.img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="w-32 md:w-64 object-contain shadow-[0_0_50px_rgba(255,255,255,0.4)] rounded-full"
                                    initial={{ rotate: -5 }}
                                    animate={{ rotate: 0 }}
                                    transition={{ duration: 3, ease: "easeOut" }}
                                />
                            </motion.div>
                        )}

                        {/* 16.5-18s: Fade Black (extended fade out) */}
                        {sendoffTime > 16.5 && (
                            <motion.div
                                className="absolute inset-0 bg-black z-[101]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            />
                        )}

                        {/* Optional Footer */}
                        <div className="absolute bottom-6 left-0 w-full text-center">
                            <motion.p
                                className="text-[10px] text-gray-600 uppercase tracking-widest opacity-50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                            >
                                Awareness is protection.
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay */}
            <div className="fixed bottom-6 right-6 z-[200] pointer-events-auto text-[10px] md:text-xs tracking-widest text-white/40 font-light mix-blend-screen">
                <span className="opacity-70">The concept and developed by :</span>
                <a
                    href="https://github.com/Thisal005"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative inline-flex items-center group ml-1 text-white/80 hover:text-white transition-colors duration-300"
                >
                    <span className="relative z-10">thisal005</span>
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/30 origin-right transition-transform duration-300 scale-x-0 group-hover:scale-x-100 group-hover:origin-left group-hover:bg-gradient-to-r group-hover:from-transparent group-hover:via-white group-hover:to-transparent"></span>
                    <span className="absolute -inset-2 bg-white/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </a>
            </div>
        </div>
    );
};
