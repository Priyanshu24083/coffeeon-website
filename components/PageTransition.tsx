"use client";

import Logo from "./Logo";
import { useEffect, useRef, ReactNode, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";

interface PageTransitionProps {
    children: ReactNode;
}

const NUM_BLOCKS = 20;

const PageTransition = ({ children }: PageTransitionProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const overlayRef = useRef<HTMLDivElement>(null);
    const logoOverlayRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<SVGSVGElement>(null);
    const blockRefs = useRef<HTMLDivElement[]>([]);

    const isTransitioning = useRef<boolean>(false);
    const linkHandlers = useRef<Map<Element, (e: Event) => void>>(new Map());
    const tlRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);

    const [blocks] = useState<number[]>(Array.from({ length: NUM_BLOCKS }, (_, i) => i));

    // Setup transition and event listeners
    useEffect(() => {
        if (!overlayRef.current) return;

        gsap.set(blockRefs.current, { scaleX: 0, transformOrigin: "left" });

        if (logoRef.current) {
            const path = logoRef.current.querySelector("path") as SVGPathElement;
            if (path) {
                const length = path.getTotalLength();
                gsap.set(path, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                    fill: "transparent",
                });
            }
        }

        revealPage();

        const handleRouteChange = (url: string) => {
            if (isTransitioning.current) return;
            isTransitioning.current = true;
            coverPage(url);
        };

        // Clean up previous listeners
        linkHandlers.current.forEach((handler, link) => {
            link.removeEventListener("click", handler);
        });
        linkHandlers.current.clear();

        const links = document.querySelectorAll<HTMLAnchorElement>(`a[href^="/"]`);
        links.forEach((link) => {
            const handler = (e: Event) => {
                e.preventDefault();
                const target = e.currentTarget as HTMLAnchorElement;
                const url = new URL(target.href).pathname;
                if (url !== pathname) {
                    handleRouteChange(url);
                }
            };
            linkHandlers.current.set(link, handler);
            link.addEventListener("click", handler);
        });

        return () => {
            linkHandlers.current.forEach((handler, link) => {
                link.removeEventListener("click", handler);
            });
            linkHandlers.current.clear();
        };
    }, [pathname, router]);

    const coverPage = (url: string) => {
        if (!logoRef.current || !document.contains(logoRef.current)) return;

        const path = logoRef.current.querySelector("path") as SVGPathElement;
        if (!path) return;

        const pathLength = path.getTotalLength();

        if (tlRef.current) {
            try {
                tlRef.current.kill();
            } catch (error) {
                console.warn("Error killing GSAP timeline:", error);
            }
            tlRef.current = null;
        }



        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(() => router.push(url), 0);
            },
        });
        tlRef.current = tl;

        const validBlocks = blockRefs.current.filter((el) => el && document.contains(el));

        if (logoOverlayRef.current && document.contains(logoOverlayRef.current)) {
            tl.to(validBlocks, {
                scaleX: 1,
                duration: 0.4,
                stagger: 0.02,
                ease: "power2.out",
                transformOrigin: "left",
            })
                .set(logoOverlayRef.current, { opacity: 1 }, "-=0.2")
                .set(
                    path,
                    {
                        strokeDashoffset: pathLength,
                        fill: "transparent",
                    },
                    "-=0.25"
                )
                .to(
                    path,
                    {
                        strokeDashoffset: 0,
                        duration: 2,
                        ease: "power2.inOut",
                    },
                    "-=0.5"
                )
                .to(
                    path,
                    {
                        fill: "#FFCF59",
                        duration: 1,
                        ease: "power2.out",
                    },
                    "-=0.5"
                )
                .to(logoOverlayRef.current, {
                    opacity: 0,
                    duration: 0.25,
                    ease: "power2.out",
                });
        }
    };

    const revealPage = () => {
        gsap.set(blockRefs.current, { scaleX: 1, transformOrigin: "right" });
        gsap.to(blockRefs.current, {
            scaleX: 0,
            duration: 0.4,
            stagger: 0.02,
            ease: "power2.out",
            transformOrigin: "right",
            onComplete: () => {
                isTransitioning.current = false;
            },
        });
    };

    return (
        <>
            <div ref={overlayRef} className="transition-overlay">
                {blocks.map((_, i) => (
                    <div
                        key={i}
                        className="block"
                        ref={(el) => {
                            if (el) blockRefs.current[i] = el;
                        }}
                    />
                ))}
            </div>

            <div ref={logoOverlayRef} className="logo-overlay">
                <div className="logo-container">
                    <Logo ref={logoRef} />
                </div>
            </div>

            {children}
        </>
    );
};

export default PageTransition;
