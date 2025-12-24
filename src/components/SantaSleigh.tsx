import { useEffect } from 'react'
import { motion } from 'framer-motion-3d'
import * as THREE from 'three'

interface SantaSleighProps {
    /** Whether to start the fly-in animation */
    start: boolean
    /** Callback triggered when the gift should decrease/drop */
    onDrop: () => void
}

/**
 * SantaSleigh Component
 * 
 * The main 3D asset for the delivery sequence using low-poly styled geometries.
 * Animates across the screen and triggers the gift drop event at the midway point.
 */
export function SantaSleigh({ start, onDrop }: SantaSleighProps) {

    // Trigger the drop exactly when sleigh is in the middle
    useEffect(() => {
        if (start) {
            const timer = setTimeout(() => {
                onDrop()
            }, 2000) // Half of the 4s duration
            return () => clearTimeout(timer)
        }
    }, [start, onDrop])

    const variant = {
        idle: { x: -30 },
        fly: {
            x: 30,
            transition: { duration: 4, ease: "linear" }
        }
    }

    // Material constants
    const redMat = new THREE.MeshStandardMaterial({ color: '#C0392B' })
    const goldMat = new THREE.MeshStandardMaterial({ color: '#F1C40F' })
    const brownMat = new THREE.MeshStandardMaterial({ color: '#5D4037' })
    const whiteMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF' })
    const skinMat = new THREE.MeshStandardMaterial({ color: '#FFCCBC' })

    if (!start) return null

    return (
        <motion.group
            position={[0, 8, 0]} // Height for dropping
            animate={start ? "fly" : "idle"}
            initial="idle"
            variants={variant}
            rotation={[0, 0, 0.1]}
        >
            {/* Sleigh Main Body */}
            <mesh position={[0, 0, 0]} material={redMat} castShadow>
                <boxGeometry args={[2.5, 1, 1.5]} />
            </mesh>
            <mesh position={[0, 0.6, -0.7]} material={goldMat}>
                <boxGeometry args={[2.6, 0.2, 0.1]} />
            </mesh>
            <mesh position={[0, 0.6, 0.7]} material={goldMat}>
                <boxGeometry args={[2.6, 0.2, 0.1]} />
            </mesh>

            {/* Runners */}
            <mesh position={[0, -0.8, -0.5]} material={goldMat}>
                <boxGeometry args={[3, 0.1, 0.1]} />
            </mesh>
            <mesh position={[0, -0.8, 0.5]} material={goldMat}>
                <boxGeometry args={[3, 0.1, 0.1]} />
            </mesh>
            {/* Runner Connectors */}
            <mesh position={[-1, -0.5, -0.5]} material={goldMat}><boxGeometry args={[0.1, 0.5, 0.1]} /></mesh>
            <mesh position={[1, -0.5, -0.5]} material={goldMat}><boxGeometry args={[0.1, 0.5, 0.1]} /></mesh>
            <mesh position={[-1, -0.5, 0.5]} material={goldMat}><boxGeometry args={[0.1, 0.5, 0.1]} /></mesh>
            <mesh position={[1, -0.5, 0.5]} material={goldMat}><boxGeometry args={[0.1, 0.5, 0.1]} /></mesh>


            {/* Santa */}
            <group position={[-0.5, 0.8, 0]}>
                {/* Body */}
                <mesh material={redMat}><sphereGeometry args={[0.6, 16, 16]} /></mesh>
                {/* Head */}
                <mesh position={[0, 0.7, 0]} material={skinMat}><sphereGeometry args={[0.35, 16, 16]} /></mesh>
                {/* Beard */}
                <mesh position={[0.1, 0.6, 0]} material={whiteMat}><sphereGeometry args={[0.35, 16, 16]} /></mesh>
                {/* Hat */}
                <mesh position={[0, 1.1, 0]} material={redMat}><coneGeometry args={[0.3, 0.6, 16]} /></mesh>
                <mesh position={[0, 1.4, 0]} material={whiteMat}><sphereGeometry args={[0.1, 8, 8]} /></mesh>
            </group>

            {/* Reindeer (Simplified Leader) */}
            <group position={[3.5, -0.2, 0]}>
                <mesh material={brownMat}><boxGeometry args={[1.2, 0.8, 0.6]} /></mesh>
                <mesh position={[0.5, 0.6, 0]} material={brownMat}><boxGeometry args={[0.5, 0.7, 0.5]} /></mesh>
                <mesh position={[0.8, 1.1, 0]} material={redMat}><sphereGeometry args={[0.1, 8, 8]} /></mesh> {/* Rudolph Nose */}
            </group>
            {/* Rope */}
            <mesh position={[1.5, 0, 0]} rotation={[0, 0, -0.2]} material={brownMat}>
                <cylinderGeometry args={[0.05, 0.05, 2.5]} />
            </mesh>

        </motion.group>
    )
}
