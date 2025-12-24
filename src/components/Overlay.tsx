interface OverlayProps {
    visits: number;
    victims: number;
}

export function Overlay({ visits, victims }: OverlayProps) {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col items-center justify-end pb-12 font-sans text-white/50">
            {/* Stats Display - Hacker/Terminal Style */}
            <div className="absolute top-6 right-6 flex flex-col items-end gap-1 pointer-events-auto">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">Live Visitors</span>
                    <span className="text-sm font-bold text-white font-mono min-w-[3ch] text-right">
                        {visits > 0 ? visits.toLocaleString() : '...'}
                    </span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded border border-red-500/20 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-red-400 font-mono">Scammed</span>
                    <span className="text-sm font-bold text-red-500 font-mono min-w-[3ch] text-right">
                        {victims > 0 ? victims.toLocaleString() : '...'}
                    </span>
                </div>
            </div>

            <p className="text-sm tracking-widest uppercase mb-4">Tap all gifts to open</p>

            <div className="absolute bottom-6 right-6 pointer-events-auto text-[10px] md:text-xs tracking-widest text-white/40 font-light mix-blend-screen">
                <span className="opacity-70">The concept and developed by : </span>
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
    )
}
