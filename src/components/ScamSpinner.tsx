import { motion } from 'framer-motion';

interface ScamSpinnerProps {
    /** Whether the spin animation has started */
    started: boolean;
    /** Whether the spin has finished and result is shown */
    spinFinished: boolean;
    /** Title displayed above the spinner */
    title?: string;
    /** Text for the CTA button */
    buttonText?: string;
    /** "Smarter" mode changes colors/branding to look more "premium" */
    isSmarter?: boolean;
    /** Whether to show the fake data collection form */
    showForm?: boolean;
}

/**
 * ScamSpinner Component
 * 
 * Renders an interactive "Spin to Win" wheel game.
 * Designed to mimic common scam/phishing patterns using psychological tricks:
 * - Urgency (flashing lights)
 * - Reward promise (data/prizes)
 * - Fake social proof/verification
 */
export const ScamSpinner = ({
    started,
    spinFinished,
    title = "Spin to Win Data",
    buttonText = "CLAIM MY 50GB",
    isSmarter = false,
    showForm = true
}: ScamSpinnerProps) => {

    // --- Style Configurations ---
    // Swaps behaviors between "Basic" (Yellow/Red) and "Smarter" (Blue/Premium) scam styles
    const wheelBorderColor = isSmarter ? "border-blue-500" : "border-yellow-500";
    const centerColor = isSmarter ? "from-blue-300 via-blue-500 to-blue-700" : "from-yellow-300 via-yellow-500 to-yellow-700";
    const titleColor = isSmarter ? "text-blue-300" : "text-yellow-300";
    const winTextColor = isSmarter ? "text-blue-400" : "text-yellow-400";
    const buttonGradient = isSmarter ? "from-blue-500 to-indigo-600" : "from-green-500 to-emerald-600";

    const winTitle = isSmarter ? "VERIFIED SELECTION" : "CONGRATULATIONS!";
    const winSubtitle = isSmarter ? "PREMIUM DATA ALLOCATION" : "YOU WON 50GB DATA";
    const verificationText = isSmarter ? "Partner Promotion" : "Secure Verification";

    return (
        <div className="z-10 flex flex-col items-center w-full max-w-md px-4">
            {/* Spinner UI */}
            <motion.div
                className="mb-6 relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <div className={`text-center text-xs uppercase tracking-widest mb-4 ${titleColor} font-bold drop-shadow-md`}>
                    {title}
                </div>

                <div className="relative">
                    {/* Winner Sunburst: Explodes when spin finishes */}
                    <motion.div
                        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,${isSmarter ? 'rgba(59,130,246,0.6)' : 'rgba(255,215,0,0.6)'}_0%,transparent_70%)] -z-10`}
                        animate={{ scale: spinFinished ? [0.5, 1.2, 1] : 0, opacity: spinFinished ? 1 : 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                    {/* Outer Ring with Lights */}
                    <div className="absolute -inset-4 rounded-full border-[8px] border-yellow-700 bg-gradient-to-br from-yellow-800 to-yellow-900 shadow-2xl flex items-center justify-center box-border">
                        {/* Bolts and Lights Animation */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-4 h-4 rounded-full bg-gradient-to-tr from-gray-300 to-white shadow-md border border-gray-400 overflow-hidden"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-85px) md:translateY(-114px)`
                                }}
                            >
                                <div className="w-full h-full rounded-full bg-black scale-50" />
                                {/* Light Bulb: Flashes in a pattern */}
                                <motion.div
                                    className={`absolute inset-0 rounded-full ${isSmarter ? 'bg-blue-300' : 'bg-yellow-300'} mix-blend-screen`}
                                    animate={{ opacity: [0.2, 1, 0.2] }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.1,
                                        repeat: Infinity,
                                        repeatType: "mirror"
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* The Rotating Wheel */}
                    <div className={`w-40 h-40 md:w-56 md:h-56 rounded-full border-4 ${wheelBorderColor} relative overflow-hidden bg-white shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] z-10`}>
                        <motion.div
                            className="w-full h-full"
                            initial={{ rotate: 0 }}
                            // Rotates 5 full turns (1800deg) + offset to land on the winner
                            animate={{ rotate: started ? 1800 + 36 : 0 }}
                            transition={{ duration: 5, ease: [0.15, 0.85, 0.35, 1] }}
                        >
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <defs>
                                    <radialGradient id="gloss" cx="50%" cy="50%" r="50%" fx="40%" fy="40%">
                                        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                                    </radialGradient>
                                </defs>
                                {
                                    (isSmarter ? [
                                        { label: 'BASIC', color: '#94a3b8' },
                                        { label: 'PRO', color: '#60a5fa' },
                                        { label: 'ELITE', color: '#818cf8' },
                                        { label: 'ULTRA', color: '#c084fc' },
                                        { label: 'MAX', color: '#2563eb', text: '#ffffff', highlight: true },
                                    ] : [
                                        { label: '1GB', color: '#3B82F6' },
                                        { label: '5GB', color: '#10B981' },
                                        { label: '10GB', color: '#F59E0B' },
                                        { label: '25GB', color: '#8B5CF6' },
                                        { label: '50GB', color: '#DC2626', text: '#FFD700', highlight: true },
                                    ]).map((segment, i) => {
                                        const angle = 72;
                                        const startAngle = i * angle;
                                        const endAngle = (i + 1) * angle;

                                        // Calculate arc path
                                        const x1 = 50 + 50 * Math.cos(Math.PI * startAngle / 180);
                                        const y1 = 50 + 50 * Math.sin(Math.PI * startAngle / 180);
                                        const x2 = 50 + 50 * Math.cos(Math.PI * endAngle / 180);
                                        const y2 = 50 + 50 * Math.sin(Math.PI * endAngle / 180);
                                        const largeArcFlag = angle > 180 ? 1 : 0;

                                        return (
                                            <g key={i}>
                                                <path
                                                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                                    fill={segment.color}
                                                    stroke="rgba(255,255,255,0.2)"
                                                    strokeWidth="0.5"
                                                />
                                                <path
                                                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                                    fill="url(#gloss)"
                                                />
                                                <text
                                                    x="0"
                                                    y="0"
                                                    fill={segment.text || 'white'}
                                                    fontSize="8"
                                                    fontWeight="900"
                                                    fontFamily="Arial"
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    transform={`translate(50, 50) rotate(${startAngle + angle / 2}) translate(32, 0) rotate(90)`}
                                                    style={{
                                                        filter: segment.highlight ? 'drop-shadow(0px 1px 2px rgba(0,0,0,0.8))' : 'drop-shadow(0px 1px 1px rgba(0,0,0,0.5))',
                                                        textShadow: '0px 1px 0px rgba(0,0,0,0.4)'
                                                    }}>
                                                    {segment.label}
                                                </text>
                                            </g>
                                        );
                                    })
                                }
                                {/* Pegs separating sections */}
                                {[0, 72, 144, 216, 288].map((angle, i) => (
                                    <circle key={`peg-${i}`} cx={50 + 46 * Math.cos(angle * Math.PI / 180)} cy={50 + 46 * Math.sin(angle * Math.PI / 180)} r="1.5" fill="#d1d5db" stroke="#9ca3af" strokeWidth="0.5" filter="drop-shadow(0px 1px 1px rgba(0,0,0,0.5))" />
                                ))}
                                <circle cx="50" cy="50" r="50" fill="url(#gloss)" pointerEvents="none" />
                            </svg>
                        </motion.div>
                    </div>

                    {/* Pointer Clacker: Logic to simulate hitting pegs */}
                    <motion.div
                        className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 drop-shadow-xl origin-top"
                        animate={{ rotate: spinFinished ? [0, 15, 0] : [0, -20, 0] }}
                        transition={{
                            duration: spinFinished ? 0.3 : 0.1,
                            repeat: spinFinished ? 0 : Infinity,
                            ease: "linear"
                        }}
                    >
                        <div className="w-8 h-10 bg-gradient-to-b from-gray-100 to-gray-300 shadow-inner clip-path-polygon" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 50% 100%)' }} />
                        <div className="w-8 h-10 bg-gradient-to-b from-red-500 to-red-700 absolute top-0 left-0 scale-75 clip-path-polygon shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)]" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 50% 100%)' }} />
                    </motion.div>

                    {/* Center Button/Cover */}
                    <motion.div
                        className={`absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${centerColor} rounded-full flex items-center justify-center font-black text-white border-4 border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.4)] z-20 text-xs md:text-sm tracking-wider`}
                        animate={{
                            scale: spinFinished ? [1, 1.1, 1] : 1,
                            boxShadow: spinFinished ? `0 0 25px ${isSmarter ? 'rgba(59,130,246,0.8)' : 'rgba(255, 215, 0, 0.8)'}` : "0 4px 15px rgba(0,0,0,0.4)"
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: spinFinished ? Infinity : 0,
                            repeatType: "reverse"
                        }}
                    >
                        <span className="drop-shadow-md text-yellow-50">{spinFinished ? "WIN!" : "SPIN"}</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Winning Message */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: spinFinished ? 1 : 0.5, y: 0, scale: spinFinished ? 1.1 : 1 }}
                className="text-center mb-8"
            >
                <h1 className={`text-xl md:text-3xl font-black ${winTextColor} drop-shadow-md`}>{winTitle}</h1>
                <h2 className="text-lg md:text-2xl font-bold text-white mt-1">{winSubtitle}</h2>
            </motion.div>

            {/* Fake Data Collection Form */}
            {showForm && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full bg-white rounded-t-xl p-6 shadow-2xl text-gray-800"
                >
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Claim Your Reward</h3>
                    <div className="space-y-3">
                        <div className="h-2 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
                        <input disabled placeholder="Full Name" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-sm" />
                        <input disabled placeholder="Mobile Number" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-sm" />
                        <div className="relative">
                            <select disabled aria-label="Select Provider" className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-sm appearance-none">
                                <option>Select Provider</option>
                            </select>
                            <div className="absolute right-3 top-3 text-xs text-gray-400">▼</div>
                        </div>

                        <button className={`w-full bg-gradient-to-r ${buttonGradient} text-white font-bold py-3 rounded shadow-lg transform active:scale-95 transition-transform flex items-center justify-center gap-2 mt-2`}>
                            {buttonText}
                            <motion.div
                                className="w-2 h-2 bg-white rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            />
                        </button>

                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
                            <span>🔒 {verificationText}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
