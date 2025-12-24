import { useState, useEffect } from 'react'
import { motion } from 'framer-motion-3d'

/**
 * BackgroundSanta Component
 * 
 * An ambient animation triggering periodically.
 * Shows Santa flying in the far background (silhouette style) to add life to the scene.
 */
export function BackgroundSanta() {
    const [active, setActive] = useState(false)

    useEffect(() => {
        // Run every 15 seconds
        const interval = setInterval(() => {
            setActive(true)
            setActive(true)
            // Allow time for reset to apply then animate
        }, 15000)

        // Initial run
        setActive(true)

        return () => clearInterval(interval)
    }, [])

    const variant = {
        initial: { x: -50 },
        fly: {
            x: 50,
            transition: { duration: 8, ease: "linear" }
        }
    }

    return (
        <motion.group
            position={[0, 15, -30]} // High up and far back
            scale={0.5}
            rotation={[0, 0, 0.1]}
            animate={active ? "fly" : "initial"}
            variants={variant}
            onAnimationComplete={() => setActive(false)}
        >
            {/* Silhouette Color - Dark Blue/Black to blend but be visible against stars */}
            <meshStandardMaterial color="#111122" roughness={1} />

            {/* Sleigh Body */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[4, 1.5, 2]} />
                <meshStandardMaterial color="#0a0a15" />
            </mesh>

            {/* Reindeer (Abstract representation) */}
            {[1, 2, 3].map((i) => (
                <group key={i} position={[3 + i * 2.5, 0.5, 0]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.5, 1, 0.5]} />
                        <meshStandardMaterial color="#0a0a15" />
                    </mesh>
                    {/* Antlers */}
                    <mesh position={[0.5, 0.8, 0]} rotation={[0, 0, 0.5]}>
                        <boxGeometry args={[0.2, 0.8, 0.1]} />
                        <meshStandardMaterial color="#0a0a15" />
                    </mesh>
                </group>
            ))}

            {/* Reins/Rope (Thin line) */}
            <mesh position={[5, 0.2, 0]} rotation={[0, 0, -1.4]}>
                <boxGeometry args={[8, 0.05, 0.05]} />
                <meshStandardMaterial color="#0a0a15" />
            </mesh>

        </motion.group>
    )
}
