import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useProgress } from "@react-three/drei";
import taginLogoBlack from "../assets/tagin-logo-black.svg";

export default function PreLoader({ onComplete }) {
    const [percent, setPercent] = useState(0);
    const containerRef = useRef(null);
    const logoWrapperRef = useRef(null);
    const logoImgRef = useRef(null);
    const textWrapperRef = useRef(null);
    const { progress } = useProgress();
    const countObj = useRef({ val: 0 });
    const hasCompleted = useRef(false);
    const timelineRef = useRef(null);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        if (hasCompleted.current) return;

        const tweenDuration = progress === 100 && countObj.current.val === 0 ? 1.5 : 0.4;

        const tween = gsap.to(countObj.current, {
            val: progress,
            duration: tweenDuration,
            ease: "power2.out",
            onUpdate: () => {
                const currentVal = Math.floor(countObj.current.val);
                setPercent(currentVal);

                if (currentVal >= 100 && !hasCompleted.current) {
                    hasCompleted.current = true;

                    const tl = gsap.timeline({
                        onComplete: () => {
                            document.body.style.overflow = "auto";
                            if (onCompleteRef.current) onCompleteRef.current();
                        },
                    });
                    
                    timelineRef.current = tl;

                    // 1. Shrink width of wrapper to 0
                    // Since the inner text is anchored to the right, it slides left underneath the fixed left edge!
                    tl.to(textWrapperRef.current, {
                        width: 0,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power3.inOut"
                    }, "+=0.2");

                    // 2. Slide the logo wrapper exactly into the center
                    // It's offset left by half its width (40px) + the margin (24px) = 64px.
                    tl.to(logoWrapperRef.current, {
                        x: 64,
                        duration: 0.6,
                        ease: "power3.inOut"
                    }, "-=0.2"); // starts slightly before the text finishes hiding

                    // 3. Logo drops down out of its hidden overflow wrapper
                    tl.to(logoImgRef.current, {
                        y: "100%",
                        duration: 0.5,
                        ease: "power3.in"
                    }, "+=0.3"); // the "+=0.3" effectively creates a short pause

                    // 4. Shrink the entire white background into a circle
                    tl.to(containerRef.current, {
                        clipPath: "circle(1% at 50% 50%)", // Reduced circle size
                        duration: 0.6,
                        ease: "power4.inOut"
                    });

                    // 5. Drop the circle bottom and out completely
                    tl.to(containerRef.current, {
                        y: "100vh",
                        scale: 0.2, // squeeze it flatter/out while it falls
                        duration: 0.5,
                        ease: "power3.in"
                    }, "-=0.1");

                    tl.to(containerRef.current, {
                        display: "none",
                    });
                }
            }
        });

        return () => {
            tween.kill();
            if (timelineRef.current) timelineRef.current.kill();
        };
    }, [progress]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-white overflow-hidden origin-center"
            style={{ clipPath: "circle(150% at 50% 50%)", willChange: "clip-path, transform" }} // Add starting values for GSAP to grab
        >
            <div className="relative flex items-center justify-center w-full max-w-lg h-40">
                {/* Logo wrapper anchored slightly left of center */}
                <div
                    ref={logoWrapperRef}
                    className="absolute w-20 h-20 overflow-hidden flex items-center justify-center pointer-events-none"
                    style={{ right: "50%", marginRight: "1.5rem" }}
                >
                    <img ref={logoImgRef} src={taginLogoBlack} alt="TagIn Logo" className="w-full h-full object-contain" />
                </div>

                {/* Text wrapper with hidden overflow to squeeze its width leftwards to 0 */}
                <div
                    ref={textWrapperRef}
                    className="absolute overflow-hidden h-32 flex items-center"
                    style={{ left: "50%", marginLeft: "1.5rem", width: "220px" }}
                >
                    <div
                        className="absolute right-0 flex justify-start items-center text-black font-['ClashDisplay'] font-bold text-8xl md:text-9xl tabular-nums tracking-tighter shrink-0"
                        style={{ width: "220px" }}
                    >
                        {percent}
                    </div>
                </div>
            </div>
        </div>
    );
}
