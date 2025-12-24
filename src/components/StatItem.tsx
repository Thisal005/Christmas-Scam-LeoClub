import { motion } from 'framer-motion';

interface StatItemProps {
    label: string;
    value: string;
    color: string;
    delay: number;
}

/**
 * StatItem Component
 * 
 * Displays a single statistic row with entrance animation.
 * Used in the EndingScene to display cybercrime statistics.
 */
export const StatItem = ({ label, value, color, delay }: StatItemProps) => (
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
