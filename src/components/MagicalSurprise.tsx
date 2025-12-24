import { useRef, useMemo } from 'react'
import { motion } from 'framer-motion-3d'
import { Text, Sparkles, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MagicalSurpriseProps {
    isOpen: boolean
}

function MiniSanta() {
    return (
        <group scale={0.3}>
            {/* Simple Santa Geometry */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial color="#C0392B" />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color="#FFCCBC" />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
                <coneGeometry args={[0.3, 0.5, 16]} />
                <meshStandardMaterial color="#C0392B" />
            </mesh>
        </group>
    )
}

function SpiralParticles({ active }: { active: boolean }) {
    const count = 30
    // Create random spiral positions
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 4 // 2 full turns
            const radius = 0.5 + Math.random() * 0.5
            const y = (i / count) * 3
            temp.push({
                pos: new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius),
                speed: Math.random() * 0.5 + 0.2
            })
        }
        return temp
    }, [])

    const groupRef = useRef<THREE.Group>(null)

    useFrame((_, delta) => {
        if (!active || !groupRef.current) return
        groupRef.current.rotation.y += delta * 1 // Spin
    })

    if (!active) return null

    return (
        <group ref={groupRef}>
            {particles.map((p, i) => (
                <mesh key={i} position={p.pos}>
                    <sphereGeometry args={[0.05, 8, 8]} />
                    <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
                </mesh>
            ))}
        </group>
    )

}

export function MagicalSurprise({ isOpen }: MagicalSurpriseProps) {
    const params = new URLSearchParams(window.location.search)
    const name = params.get('to')
    const text = name ? `Merry Christmas,\n${name}!` : "Merry\nChristmas!"

    return (
        <group visible={isOpen}>
            {/* Floating Text */}
            <motion.group
                initial={{ scale: 0, y: 0 }}
                animate={{ scale: isOpen ? 1.5 : 0, y: isOpen ? 2.2 : 0 }}
                transition={{ duration: 1.5, type: "spring" }}
            >
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                    <Text
                        fontSize={window.innerWidth < 768 ? 0.35 : 0.8}
                        color="#FFF8DC"
                        textAlign="center"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.04}
                        outlineColor="#8B0000"
                        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff" // Default font available in drei often works, or use system font
                    >
                        {text}
                        <meshStandardMaterial emissive="#FFD700" emissiveIntensity={0.4} />
                    </Text>
                </Float>
            </motion.group>

            {/* Rising Mini Santa */}
            <motion.group
                initial={{ y: 0, scale: 0 }}
                animate={{
                    y: isOpen ? [0, 1, 2, 3] : 0,
                    x: isOpen ? [0, 0.6, -0.6, 1.2] : 0, // Zig zag up
                    scale: isOpen ? 0.7 : 0
                }}
                transition={{ duration: 4, ease: "easeInOut" }}
            >
                <MiniSanta />
            </motion.group>

            {/* Spiraling Gold Dust */}
            <SpiralParticles active={isOpen} />

            {/* General Sparkles */}
            <Sparkles
                count={40}
                scale={2.5}
                size={3}
                speed={0.4}
                opacity={0.7}
                color="#FFD700"
                position={[0, 1.5, 0]}
            />
        </group>
    )
}
