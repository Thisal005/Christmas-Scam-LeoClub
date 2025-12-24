import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion-3d'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MagicalSurprise } from './MagicalSurprise'

interface GiftBoxProps {
    isDropped: boolean
    position?: [number, number, number]
    scale?: number
    color?: string
    ribbonColor?: string
    isMain?: boolean
    onOpen?: () => void
    delay?: number
    soundUrl?: string
    variant?: 'open' | 'shake'
}

export function GiftBox({
    isDropped,
    position = [0, 0, 0],
    scale = 1,
    color = '#C0392B',
    ribbonColor = '#F1C40F',
    isMain = false,
    onOpen,
    delay = 0,
    soundUrl = '/message.mp3',
    variant = 'open'
}: GiftBoxProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isShaking, setIsShaking] = useState(false)
    const [hovered, setHover] = useState(false)

    // Audio ref for gift opening/shake sound
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Initialize audio on mount or soundUrl change
    useEffect(() => {
        audioRef.current = new Audio(soundUrl)
        audioRef.current.volume = 0.7
    }, [soundUrl])

    const handleClick = () => {
        if (!isDropped) return

        if (variant === 'open') {
            setIsOpen(true)
        } else if (variant === 'shake') {
            triggerShake()
        }
    }

    const triggerShake = () => {
        setIsShaking(true)
        if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(err => console.log('Audio play failed:', err))
        }
        setTimeout(() => setIsShaking(false), 500) // Shake duration
    }

    // Track if opening sequence has played to prevent echoes (since onOpen changes on render)
    const hasPlayedRef = useRef(false)

    // Play audio when box is opened (only for 'open' variant)
    useEffect(() => {
        if (variant === 'open' && isOpen && audioRef.current && !hasPlayedRef.current) {
            hasPlayedRef.current = true
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(err => console.log('Audio play failed:', err))
            if (onOpen) onOpen()
        }
    }, [isOpen, onOpen, variant])

    // Camera animation logic (Only for Main Box)
    useFrame((state) => {
        if (isMain && isOpen) {
            // Smoothly zoom in and up to see the surprise
            const targetPos = new THREE.Vector3(0, 3, 6)
            state.camera.position.lerp(targetPos, 0.05)
            state.camera.lookAt(0, 1.5, 0) // Look a bit higher
        }
    })

    // Materials
    const boxMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.1,
    })

    const ribbonMaterial = new THREE.MeshStandardMaterial({
        color: ribbonColor,
        metalness: 0.6,
        roughness: 0.2,
    })

    const boxSize = 2
    const ribbonWidth = 0.3

    // Falling animation variants (relative to position)
    const targetY = position[1] || 0
    const dropVariants = {
        hidden: { y: 20, x: position[0], z: position[2], scale: 0 },
        dropped: {
            y: [20, targetY, targetY + 2, targetY],
            x: position[0],
            z: position[2],
            scale: scale,
            transition: {
                duration: 1.5,
                delay: delay, // Add stagger delay
                times: [0, 0.6, 0.8, 1],
                ease: "easeOut"
            }
        }
    }

    // Shake animation variants
    const shakeVariants = {
        idle: { rotateZ: 0 },
        shake: {
            rotateZ: [0, 0.2, -0.2, 0.1, -0.1, 0],
            transition: { duration: 0.4 }
        }
    }


    if (!isDropped) return null

    return (
        <group>
            <motion.group
                onPointerOver={() => !isOpen && setHover(true)}
                onPointerOut={() => setHover(false)}
                onClick={handleClick}
                variants={dropVariants}
                initial="hidden"
                animate="dropped"
            >
                {/* Scale Group to separate physics move from hover scale */}
                {/* Also apply shake here if variant is shake */}
                <motion.group
                    animate={isShaking ? "shake" : (isOpen ? { scale: 0.6 } : { scale: hovered ? 1.05 : 1 })}
                    variants={shakeVariants}
                    transition={{ duration: 0.8 }}
                >

                    {/* Animated Point Light inside (Stronger for Main) */}
                    <motion.pointLight
                        position={[0, 0.5, 0]}
                        variants={{
                            closed: { intensity: 0, distance: 0 },
                            open: { intensity: 2, distance: 5 }
                        } as any}
                        animate={isOpen ? "open" : "closed"}
                        color="#ffaa00"
                    />

                    {/* Box Base */}
                    <mesh position={[0, -boxSize / 4, 0]} receiveShadow castShadow material={boxMaterial}>
                        <boxGeometry args={[boxSize, boxSize / 2, boxSize]} />
                    </mesh>

                    {/* Vertical Ribbon */}
                    <mesh position={[0, -boxSize / 4, 0]} receiveShadow castShadow material={ribbonMaterial}>
                        <boxGeometry args={[ribbonWidth + 0.01, boxSize / 2, boxSize + 0.01]} />
                    </mesh>
                    <mesh position={[0, -boxSize / 4, 0]} receiveShadow castShadow material={ribbonMaterial}>
                        <boxGeometry args={[boxSize + 0.01, boxSize / 2, ribbonWidth + 0.01]} />
                    </mesh>


                    {/* Lid Group - Pivoted at the back */}
                    <motion.group
                        position={[0, 0, -boxSize / 2]} // Pivot at the back edge
                        animate={{ rotateX: isOpen ? -2 : 0 }}
                        transition={{ type: "spring", stiffness: 60, damping: 10 }}
                    >
                        <group position={[0, 0, boxSize / 2]}> {/* Shift mesh back to center relative to pivot */}
                            {/* Lid Mesh */}
                            <mesh position={[0, boxSize / 40, 0]} castShadow material={boxMaterial}>
                                <boxGeometry args={[boxSize + 0.1, boxSize / 20, boxSize + 0.1]} />
                            </mesh>

                            {/* Lid Ribbon */}
                            <mesh position={[0, boxSize / 40, 0]} castShadow material={ribbonMaterial}>
                                <boxGeometry args={[ribbonWidth + 0.02, boxSize / 20 + 0.001, boxSize + 0.11]} />
                            </mesh>
                            <mesh position={[0, boxSize / 40, 0]} castShadow material={ribbonMaterial}>
                                <boxGeometry args={[boxSize + 0.11, boxSize / 20 + 0.001, ribbonWidth + 0.02]} />
                            </mesh>

                            {/* Bow (Simplified 2 loops) */}
                            <group position={[0, 0.15, 0]}>
                                <mesh rotation={[0, 0, Math.PI / 4]} position={[0.2, 0.2, 0]} material={ribbonMaterial}>
                                    <torusGeometry args={[0.2, 0.08, 16, 32]} />
                                </mesh>
                                <mesh rotation={[0, 0, -Math.PI / 4]} position={[-0.2, 0.2, 0]} material={ribbonMaterial}>
                                    <torusGeometry args={[0.2, 0.08, 16, 32]} />
                                </mesh>
                            </group>
                        </group>
                    </motion.group>

                    {/* The Magical Surprise - Attached to the box group for movement but floats up */}
                    {isMain && (
                        <group position={[0, 0.5, 0]}>
                            <MagicalSurprise isOpen={isOpen} />
                        </group>
                    )}
                </motion.group>
            </motion.group>
        </group>
    )
}
