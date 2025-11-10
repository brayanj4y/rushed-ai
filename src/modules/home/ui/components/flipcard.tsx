"use client";

import React from "react";

const cards = [
    {
        title: "Ideas to Web App in Seconds",
        description:
            "Turn your ideas into fully functional web apps instantly using AI.",
        color:
            "bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100",
        rotation: "rotate-[7deg]",
        svg: (
            <svg
                width="255"
                height="314"
                viewBox="0 0 255 314"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-[-10%] bottom-[-4%] max-h-[40%] max-w-[80%] rotate-[-20deg] transition-transform duration-500"
            >
                <path
                    d="M22.5164 146.35H51.4649V160.825H65.9391V175.299H80.4133V14.4741H109.362V146.35H123.836V86.8452H152.784V160.825H167.259V101.319H196.207V175.299H210.681V115.794H225.156V130.268H239.63V218.721H225.156V260.536H210.681V291.093H94.8875V276.618H80.4133V247.67H65.9391V218.721H51.4649V189.773H36.9906V160.825H22.5164V146.35Z"
                    fill="#E2FC91"
                    stroke="black"
                    strokeWidth="8"
                />
            </svg>
        ),
    },
    {
        title: "Run Code in Secure Sandbox",
        description:
            "Your code runs safely in an isolated environment, protecting your data.",
        color:
            "bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100",
        rotation: "rotate-[4deg]",
        svg: (
            <svg
                viewBox="0 0 329 195"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-[-10%] bottom-[-4%] max-h-[40%] max-w-[80%] rotate-[-20deg] transition-transform duration-500"
            >
                <path
                    d="M125.85 45V30H155.85V15H170.85V30H200.85V45H215.85V60H230.85V90H245.85V105H230.85V135H215.85V150H200.85V165H170.85V180H155.85V165H125.85V150H110.85V135H95.8499V105H80.8499V90H95.8499V60H110.85V45H125.85Z"
                    fill="#E2FC91"
                    stroke="black"
                    strokeWidth="8"
                />
            </svg>
        ),
    },
    {
        title: "Open Source & Self-Hostable",
        description:
            "Fully open source, self-host with private keys for maximum control.",
        color:
            "bg-pink-200 dark:bg-pink-800 text-pink-900 dark:text-pink-100",
        rotation: "rotate-[-6deg]",
        svg: (
            <svg
                width="255"
                height="314"
                viewBox="0 0 255 314"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-[-10%] bottom-[-4%] max-h-[40%] max-w-[80%] rotate-[-20deg] transition-transform duration-500"
            >
                <path
                    d="M22.5164 146.35H51.4649V160.825H65.9391V175.299H80.4133V14.4741H109.362V146.35H123.836V86.8452H152.784V160.825H167.259V101.319H196.207V175.299H210.681V115.794H225.156V130.268H239.63V218.721H225.156V260.536H210.681V291.093H94.8875V276.618H80.4133V247.67H65.9391V218.721H51.4649V189.773H36.9906V160.825H22.5164V146.35Z"
                    fill="#E2FC91"
                    stroke="black"
                    strokeWidth="8"
                />
            </svg>
        ),
    },
];

export default function FlipCards() {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 perspective-[1200px]">
            {cards.map((card, i) => (
                <details
                    key={i}
                    className={`relative w-full transition-transform duration-700 [transform-style:preserve-3d] group ${card.rotation} hover:rotate-0`}
                >
                    <summary
                        className={`relative aspect-[3/4] border-8 border-black rounded-xl p-6 ${card.color} cursor-pointer overflow-hidden [backface-visibility:visible] list-none`}
                    >
                        <h1 className="text-[clamp(2rem,6vw,3rem)] font-bold mb-4">
                            {card.title}
                        </h1>
                        {card.svg}
                    </summary>

                    <div className="absolute top-0 left-0 w-full h-full aspect-[3/4] border-8 border-black rounded-xl p-6 bg-white rotate-y-180 [backface-visibility:visible] [transform:translateZ(-1px)] flex items-center justify-center text-center">
                        <p className="text-[clamp(1rem,2vw,1.25rem)] leading-snug max-w-[90%]">
                            {card.description}
                        </p>
                    </div>
                </details>
            ))}
        </section>
    );
}
