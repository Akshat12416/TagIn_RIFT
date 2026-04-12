import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Environment, useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PARAGRAPH =
    "Real products deserve real proof. Tag-In links every item to its blockchain identity — so authenticity speaks for itself, every single time.";

function HighlightShapeModel(props) {
    const { nodes } = useGLTF("/models/shape-transformed.glb");
    const modelRef = useRef(null);

    useFrame((state) => {
        if (!modelRef.current) return;
        modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.35 - Math.PI / 5;
    });

    return (
        <Center {...props}>
            <group ref={modelRef}>
                <mesh geometry={nodes.Object_2.geometry} rotation={[-Math.PI / 2, 0, 0]}>
                    <meshPhysicalMaterial
                        color="#0a0a0a"
                        metalness={0.95}
                        roughness={0.08}
                        clearcoat={1}
                        clearcoatRoughness={0.05}
                        reflectivity={1}
                    />
                </mesh>
            </group>
        </Center>
    );
}

function EntryGroup({ position = [0, 0, 0], startX = 0, entryProgressRef, children }) {
    const groupRef = useRef(null);
    const baseX = position[0];

    useFrame(() => {
        if (!groupRef.current) return;
        const entry = entryProgressRef?.current?.value ?? 1;
        const visibility = Math.max(0, Math.min(1, entry));

        groupRef.current.position.x = gsap.utils.interpolate(startX, baseX, entry);
        const groupScale = gsap.utils.interpolate(0.82, 1, visibility);
        groupRef.current.scale.setScalar(groupScale);

        groupRef.current.traverse((obj) => {
            if (!obj.material) return;
            if (Array.isArray(obj.material)) {
                obj.material.forEach((mat) => {
                    mat.transparent = true;
                    mat.opacity = visibility;
                });
            } else {
                obj.material.transparent = true;
                obj.material.opacity = visibility;
            }
        });
    });

    return (
        <group ref={groupRef} position={position}>
            {children}
        </group>
    );
}

function FloatingSphere({
    position,
    scale,
    color,
    phase = 0,
    floatSpeed = 0.9,
    floatDistance = 0.08,
    entryProgressRef,
    startX,
}) {
    const sphereRef = useRef(null);
    const baseX = position[0];

    useFrame((state) => {
        if (!sphereRef.current) return;
        const entry = entryProgressRef?.current?.value ?? 1;
        const visibility = Math.max(0, Math.min(1, entry));
        const fromX = startX ?? baseX;
        sphereRef.current.position.x = gsap.utils.interpolate(fromX, baseX, entry);
        sphereRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * floatSpeed + phase) * floatDistance;
        const sphereScale = gsap.utils.interpolate(0.82, 1, visibility);
        sphereRef.current.scale.setScalar(scale * sphereScale);

        sphereRef.current.material.transparent = true;
        sphereRef.current.material.opacity = visibility;
    });

    return (
        <mesh ref={sphereRef} scale={scale} position={position}>
            <sphereGeometry args={[0.45, 64, 64]} />
            <meshPhysicalMaterial
                color={color}
                metalness={0.95}
                roughness={0.08}
                clearcoat={1}
                clearcoatRoughness={0.05}
                reflectivity={1}
            />
        </mesh>
    );
}

useGLTF.preload("/models/shape-transformed.glb");

export default function ScrollHighlightSection() {
    const sectionRef = useRef(null);
    const paraRef = useRef(null);
    const wordsRef = useRef([]);
    const entryProgressRef = useRef({ value: 0 });
    const circleRef = useRef(null);

    const words = PARAGRAPH.split(" ");

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(entryProgressRef.current, { value: 0 });
            gsap.set(circleRef.current, { xPercent: -50, yPercent: -50, scale: 0 });

            gsap.to(entryProgressRef.current, {
                value: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "top+=680 top",
                    scrub: 1.5,
                },
            });

            // Phase 1 — paragraph slides up from below as section enters viewport
            gsap.fromTo(
                paraRef.current,
                { y: 80, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                        end: "top top",
                        scrub: 1.3,
                    },
                }
            );

            // Phase 2 — pin the section and scrub word highlights
            const pinTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=2600",
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });

            pinTl.fromTo(
                wordsRef.current,
                { color: "rgba(0,0,0,0.22)" },
                {
                    color: "rgba(0,0,0,1)",
                    stagger: 1,
                    ease: "none",
                }
            )
                .to({}, { duration: 1 })
                .to(circleRef.current, {
                    scale: 150,
                    duration: 15,
                    ease: "power2.inOut",
                })
                .to({}, { duration: 1 });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative bg-white flex items-center justify-center overflow-hidden"
            style={{ height: "100vh" }}
        >
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Canvas
                    gl={{ alpha: true }}
                    camera={{ position: [0, 0, 5], fov: 40 }}
                    style={{ width: "100%", height: "100%", background: "transparent" }}
                >
                    <ambientLight intensity={0.7} />
                    <hemisphereLight args={["#ffffff", "#dbeafe", 0.85]} />
                    <directionalLight position={[4, 4, 4]} intensity={2.2} color="#ffffff" />
                    <directionalLight position={[-3, 2, -2]} intensity={1.2} color="#dbeafe" />
                    <spotLight position={[0, 5, 3]} angle={0.45} penumbra={0.6} intensity={1.5} color="#ffffff" />
                    <pointLight position={[2, -1, 2]} intensity={1.1} color="#7dd3fc" />
                    <pointLight position={[-2, 1, -1]} intensity={0.9} color="#60a5fa" />
                    <Environment preset="city" />
                    <EntryGroup
                        position={[0, 0, 0]}
                        startX={-7.6}
                        entryProgressRef={entryProgressRef}
                    >
                        <Suspense fallback={null}>
                            <HighlightShapeModel
                                scale={0.013}
                                position={[-2.4, -0.9, 0]}
                                rotation={[0, Math.PI / 4, -Math.PI / 3]}
                            />
                        </Suspense>
                        <FloatingSphere
                            scale={0.34}
                            position={[-2.8, -1.2, 0.1]}
                            color="#5282E1"
                            phase={0.4}
                            floatSpeed={0.9}
                            floatDistance={0.08}
                        />
                    </EntryGroup>
                    <FloatingSphere
                        scale={0.5}
                        position={[2.7, 1, 0]}
                        color="#0a0a0a"
                        phase={1.2}
                        floatSpeed={1.45}
                        floatDistance={0.1}
                        entryProgressRef={entryProgressRef}
                        startX={7.2}
                    />
                </Canvas>
            </div>

            {/* Subtle blue radial glow */}
            <div
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(82,130,225,0.07) 0%, transparent 80%)",
                }}
            />

            {/* Black circle for transition */}
            <div
                ref={circleRef}
                className="absolute z-[15] pointer-events-none rounded-full bg-black"
                style={{
                    width: "2vw", // Starts very small in center
                    height: "2vw",
                    top: "50%",
                    left: "50%",
                }}
            />

            <p
                ref={paraRef}
                className="relative z-10 max-w-5xl mx-auto px-8 text-center tracking-wide"
                style={{
                    fontSize: "3.75rem",
                    lineHeight: "1.15",
                    fontFamily: "'MelodramaBold', sans-serif",
                    opacity: 0,
                    transform: "translateY(80px)",
                }}
            >
                {words.map((word, i) => (
                    <span
                        key={i}
                        ref={(el) => (wordsRef.current[i] = el)}
                        className="inline-block mr-[0.3em]"
                        style={{ color: "rgba(0,0,0,0.22)" }}
                    >
                        {word}
                    </span>
                ))}
            </p>
        </section>
    );
}
