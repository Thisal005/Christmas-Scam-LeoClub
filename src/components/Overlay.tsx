export function Overlay() {
    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col items-center justify-end pb-12 font-sans text-white/50">
            <p className="text-sm tracking-widest uppercase">Tap all gifts to open</p>

            <div className="absolute bottom-6 right-6 pointer-events-auto text-[10px] md:text-xs tracking-widest text-white/40 font-light mix-blend-screen">
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
    )
}
