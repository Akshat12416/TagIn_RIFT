import React, { Suspense, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Center, Text } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Model as ShoeModel } from './models/Nike';
import { Model as WatchModel } from './models/Watch';
import { Model as BagModel } from './models/Bag';
import clashDisplayBold from '../assets/fonts/ClashDisplay-Semibold.ttf';

const StaggeredWord = React.forwardRef(({ word, spacing = 1.8, fontSize = 3 }, ref) => {
    const letters = word.split('');
    const totalWidth = (letters.length - 1) * spacing;

    return (
        <group ref={ref} position={[-2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            {letters.map((char, i) => (
                <Text
                    key={i}
                    position={[i * spacing - totalWidth / 2, 20, 0]} // Start high off-screen
                    fontSize={fontSize}
                    color="#5282E1"
                    font={clashDisplayBold}
                    anchorX="center"
                    anchorY="middle"
                >
                    {char}
                </Text>
            ))}
        </group>
    );
});

const SceneCarousel = ({ startAnimation }) => {
    const shoeRef = useRef();
    const watchRef = useRef();
    const bagRef = useRef();

    const shoesTextRef = useRef();
    const watchesTextRef = useRef();
    const bagsTextRef = useRef();

    useEffect(() => {
        if (!shoeRef.current || !watchRef.current || !bagRef.current) return;

        if (!startAnimation) {
            gsap.set([shoeRef.current.position, watchRef.current.position, bagRef.current.position], { y: 20 });
            return;
        }

        gsap.set([shoeRef.current.position, watchRef.current.position, bagRef.current.position], { y: 20 });

        const tl = gsap.timeline({ repeat: -1 });

        // Shoe Animation
        tl.fromTo(
            shoeRef.current.position,
            { y: 20 },
            { y: 0, duration: 2.5, ease: 'back.out(1.2)' }
        )
            .fromTo(shoesTextRef.current.children.map(c => c.position),
                { y: 20 },
                { y: 0, duration: 2.0, ease: 'back.out(1.2)', stagger: 0.08 },
                '<'
            )
            .to(shoeRef.current.position, { y: -20, duration: 2, ease: 'back.in(1.2)' }, '+=3')
            .to(shoesTextRef.current.children.map(c => c.position),
                { y: -20, duration: 1.5, ease: 'back.in(1.2)', stagger: 0.08 },
                '<'
            )

            // Watch Animation
            .fromTo(
                watchRef.current.position,
                { y: 20 },
                { y: 0, duration: 2.5, ease: 'back.out(1.2)' },
                '-=0.4'
            )
            .fromTo(watchesTextRef.current.children.map(c => c.position),
                { y: 20 },
                { y: 0, duration: 2.0, ease: 'back.out(1.2)', stagger: 0.08 },
                '<'
            )
            .to(watchRef.current.position, { y: -20, duration: 2, ease: 'back.in(1.2)' }, '+=3')
            .to(watchesTextRef.current.children.map(c => c.position),
                { y: -20, duration: 1.5, ease: 'back.in(1.2)', stagger: 0.08 },
                '<'
            )

            // Bag Animation
            .fromTo(
                bagRef.current.position,
                { y: 20 },
                { y: 0, duration: 2.5, ease: 'back.out(1.2)' },
                '-=0.4'
            )
            .fromTo(bagsTextRef.current.children.map(c => c.position),
                { y: 20 },
                { y: 0, duration: 2.0, ease: 'back.out(1.2)', stagger: 0.08 },
                '<'
            )
            .to(bagRef.current.position, { y: -20, duration: 2, ease: 'back.in(1.2)' }, '+=3')
            .to(bagsTextRef.current.children.map(c => c.position),
                { y: -20, duration: 1.5, ease: 'back.in(1.2)', stagger: 0.08 },
                '<'
            );

        return () => tl.kill();
    }, [startAnimation]);

    return (
        <>
            <group ref={shoeRef}>
                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                    <Center>
                        <ShoeModel scale={5} rotation={[Math.PI / 6, 0, 0]} />
                    </Center>
                </Float>
            </group>

            <group ref={watchRef}>
                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                    <Center>
                        <WatchModel scale={1.5} rotation={[0, Math.PI / 4, 0]} />
                    </Center>
                </Float>
            </group>

            <group ref={bagRef}>
                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
                    <Center>
                        <BagModel scale={6} rotation={[Math.PI / 6, Math.PI / 3, 0]} />
                    </Center>
                </Float>
            </group>

            <StaggeredWord ref={shoesTextRef} word="SHOES" spacing={1.6} />
            <StaggeredWord ref={watchesTextRef} word="WATCHES" spacing={1.4} fontSize={2.5} />
            <StaggeredWord ref={bagsTextRef} word="BAGS" spacing={1.6} />
        </>
    );
};

const STATS = [
    { value: '4.8M+', label: 'Products Verified' },
    { value: '72K',   label: 'Active Users'       },
    { value: '98%',   label: 'Auth Rate'          },
];

function StatsWidget({ statsRef }) {
    return (
        <div
            ref={statsRef}
            className="absolute top-36 right-24"
            style={{ zIndex: 60 }}
        >
            {/* ── three stats ── */}
            <div
                className="flex flex-col items-center rounded-2xl overflow-hidden"
            >
                {STATS.map((s, i) => (
                    <React.Fragment key={s.label}>
                        <div className="flex flex-col items-center py-8 px-4 w-full text-center">
                            <span className="text-white font-bold text-2xl leading-none">{s.value}</span>
                            <span className="text-white/50 text-[10px] mt-4 leading-none">{s.label}</span>
                        </div>
                        {i < STATS.length - 1 && (
                            <div className="w-4/5 h-[1px] bg-white/10" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

gsap.registerPlugin(ScrollTrigger);

export default function ModelsSection({ startAnimation = false }) {
    const sectionRef = useRef(null);
    const heroInnerRef = useRef(null);
    const h1Ref = useRef(null);
    const pRef = useRef(null);
    const ctaRef = useRef(null);
    const statsRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!startAnimation) {
                gsap.set([h1Ref.current, pRef.current, ctaRef.current, statsRef.current], { opacity: 0, y: 50 });
            } else {
                gsap.fromTo(
                    [h1Ref.current, pRef.current, ctaRef.current, statsRef.current],
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
                );
            }

            // Pure parallax — hero content scrolls up at ~40% speed of the page
            gsap.to(heroInnerRef.current, {
                y: '40%',
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [startAnimation]);

    return (
        <section
            ref={sectionRef}
            className="w-full h-screen bg-black relative flex items-center justify-center overflow-hidden"
            style={{ zIndex: 1 }}
        >
            <div ref={heroInnerRef} className="absolute inset-0 will-change-transform">
                <StatsWidget statsRef={statsRef} />
                <div className="h-full w-full absolute z-50 text-white pointer-events-none">
                    <h2 ref={h1Ref} className="absolute text-white/80 font-['Melodrama'] top-32 left-36 text-2xl"><span className=" text-9xl font-['MelodramaBold']">TAG-IN</span> <br />Authenticates any</h2>
                    <h2 ref={pRef} className="absolute bottom-56 font-['Melodrama'] right-36 text-white/80 text-2xl">by just with a Tap of your Smartphone.</h2>
                    <div ref={ctaRef} className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center w-max">
                        <Link to="/verify">
                            <button
                                className="px-8 py-3 bg-[#5282E1] hover:bg-[#3d68bc] text-white rounded-full font-medium transition-colors text-lg pointer-events-auto cursor-pointer relative z-50"
                            >
                                Verify Your Product
                            </button>
                        </Link>
                        <p className='my-5 text-center text-sm  text-white/80'>build a legacy with TAG-IN join the family now.</p>
                    </div>
                </div>
                <div className="w-full h-screen absolute ">
                    <Canvas shadows camera={{ position: [8, 0, 0], fov: 45 }}>
                        <color attach="background" args={['#000000']} />

                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                        <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />

                        <Suspense fallback={null}>
                            <SceneCarousel startAnimation={startAnimation} />

                            <Environment preset="city" />
                            <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </section>
    );
}
