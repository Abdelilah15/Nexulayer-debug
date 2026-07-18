// components/Nexulayer.tsx
import React from 'react';

interface Props {
    size?: number;
    className?: string;
    hideLetters?: string[];
    coloredLetters?: Record<string, string>;
}

export function NexulayerLogo({
    size = 48,
    className,
}: Props) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            className={className}
            role="img"
            aria-label="Nexulayer Logo"
        >
            <g fill="currentColor" transform={`translate(0, 96) scale(${512 / 112})`}>
                <rect x="0" y="40" width="30" height="30" />
                <rect x="82" y="0" width="30" height="30" />
                <polygon points="0,0 42,0 82,40 112,40 112,70 70,70 30,30 0,30" />
            </g>
        </svg>
    );
}

export function NexulayerText({
    size = 48,
    className,
    hideLetters = [],
    coloredLetters = {},
}: Props) {
    // Largeur de base du viewBox d'après le nouveau SVG
    const originalWidth = 271.70;

    // Métriques calculées d'après les positions absolues des lettres du nouveau SVG
    const letterMetrics = [
        { id: 'N', char: 'N', advance: 34.50 },  // 34.50 - 0
        { id: 'E1', char: 'E', advance: 25.50 }, // 60.00 - 34.50
        { id: 'X', char: 'X', advance: 35.60 },  // 95.60 - 60.00
        { id: 'U', char: 'U', advance: 33.40 },  // 129.00 - 95.60
        { id: 'L', char: 'L', advance: 24.00 },  // 153.00 - 129.00
        { id: 'A', char: 'A', advance: 32.00 },  // 185.00 - 153.00
        { id: 'Y', char: 'Y', advance: 31.50 },  // 216.50 - 185.00
        { id: 'E2', char: 'E', advance: 27.50 }, // 244.00 - 216.50
        { id: 'R', char: 'R', advance: 27.70 },  // 271.70 - 244.00
    ];

    // Tracés absolus issus du nouveau SVG
    const paths = {
        'N': "M20.50 20.40L28.50 20.40L28.50 52.05L20.55 52.05L11.55 38.65Q10.50 37.05 9.80 35.95Q9.10 34.85 8.50 33.75Q7.90 32.65 7.15 31.15L7 31.35Q7.70 33.75 7.85 35.83Q8 37.90 8 39.85L8 52.05L0 52.05L0 20.40L7.95 20.40L16.95 33.80Q18 35.35 18.70 36.47Q19.40 37.60 20 38.70Q20.60 39.80 21.35 41.30L21.50 41.10Q21 39 20.75 37.02Q20.50 35.05 20.50 33.10L20.50 20.40Z",
        'E1': "M34.50 52.05L34.50 20.40L58 20.40L58 26.90L42.50 26.90L42.50 32.90L55.95 32.90L55.95 39.40L42.50 39.40L42.50 45.55L58 45.55L58 52.05L34.50 52.05Z",
        'X': "M82.40 35.90L91.65 52.05L81.65 52.05L75.90 40.85L75.75 40.85L70 52.05L60 52.05L69.25 35.90L69.25 35.65L60.60 20.40L70.45 20.40L75.75 31.40L75.90 31.40L81.20 20.40L91.05 20.40L82.40 35.65L82.40 35.90Z",
        'U': "M123 20.40L123 39.05Q123 43.95 121.82 46.90Q120.65 49.85 117.75 51.17Q114.85 52.50 109.55 52.50Q104.05 52.50 101.02 51.17Q98 49.85 96.80 46.90Q95.60 43.95 95.60 39.05L95.60 20.40L103.60 20.40L103.60 38.90Q103.60 41.45 104.10 42.90Q104.60 44.35 105.90 44.92Q107.20 45.50 109.55 45.50Q111.75 45.50 112.92 44.92Q114.10 44.35 114.55 42.90Q115 41.45 115 38.90L115 20.40L123 20.40Z",
        'L': "M152 45.25L152 52.05L129 52.05L129 20.40L137 20.40L137 45.25L152 45.25Z",
        'A': "M184.50 51.90L184.50 52.05L176 52.05Q175.65 50.85 175.18 49.30Q174.70 47.75 174.15 46L163.35 46Q162.35 49.50 161.50 52.05L153 52.05L153 51.95L163.25 20.40L174.25 20.40L184.50 51.90 M168.65 26.10Q168.15 28.65 167.20 32.30Q166.25 35.95 165.20 39.75L172.35 39.75Q171.25 35.95 170.30 32.30Q169.35 28.65 168.85 26.10L168.65 26.10Z",
        'Y': "M195.25 52.05L195.25 42.25L185 20.55L185 20.40L193.75 20.40Q195.30 24.45 196.22 26.88Q197.15 29.30 197.68 30.67Q198.20 32.05 198.50 32.90Q198.80 33.75 199.15 34.70L199.35 34.70Q199.70 33.75 200 32.90Q200.30 32.05 200.82 30.67Q201.35 29.30 202.28 26.88Q203.20 24.45 204.75 20.40L213.50 20.40L213.50 20.55L203.25 42.25L203.25 52.05L195.25 52.05Z",
        'E2': "M216.50 52.05L216.50 20.40L240 20.40L240 26.90L224.50 26.90L224.50 32.90L237.95 32.90L237.95 39.40L224.50 39.40L224.50 45.55L240 45.55L240 52.05L216.50 52.05Z",
        'R': "M252 52.05L244 52.05L244 20.40L259.10 20.40Q265.05 20.40 267.77 23.07Q270.50 25.75 270.50 30.95Q270.50 34.85 268.55 37.63Q266.60 40.40 263.40 41.10L263.35 41.25Q264.60 42.05 266.10 43.90Q267.60 45.75 269.07 47.92Q270.55 50.10 271.70 52L271.70 52.05L262.40 52.05L257 44.05Q256.30 43 255.88 42.55Q255.45 42.10 254.88 42Q254.30 41.90 253.05 41.90L252 41.90L252 52.05 M257.80 26.90L252 26.90L252 35.40L257.80 35.40Q260.30 35.40 261.27 34.40Q262.25 33.40 262.25 31.15Q262.25 28.90 261.27 27.90Q260.30 26.90 257.80 26.90Z"
    };

    const isHidden = (id: string, char: string) => hideLetters.includes(id) || hideLetters.includes(char);

    let accumulatedShift = 0;
    let totalRemovedWidth = 0;

    const renderLetters = letterMetrics.map((metric) => {
        if (isHidden(metric.id, metric.char)) {
            // Si la lettre est cachée, on incrémente le décalage pour les suivantes
            accumulatedShift += metric.advance;
            totalRemovedWidth += metric.advance;
            return null;
        }

        const fillValue = coloredLetters[metric.id] || coloredLetters[metric.char] || "currentColor";
        const isTailwindClass = fillValue.includes('text-');

        return (
            <path
                key={metric.id}
                // On translate les lettres vers la gauche en fonction de ce qui a été supprimé
                transform={`translate(-${accumulatedShift}, 0)`}
                d={paths[metric.id as keyof typeof paths]}
                fill={isTailwindClass ? "currentColor" : fillValue}
                className={isTailwindClass ? fillValue : ""}
            />
        );
    });

    const newViewBoxWidth = originalWidth - totalRemovedWidth;
    
    // Hauteur basée sur le nouveau viewBox d'origine (32.1 environ)
    const baseHeight = 32.1;
    const ratio = newViewBoxWidth / baseHeight;
    const calculatedWidth = size * ratio;

    return (
        <svg
            width={calculatedWidth}
            height={size}
            // Maintien du Y de départ à 20.4 tel que défini dans votre SVG brut
            viewBox={`0 20.4 ${newViewBoxWidth} ${baseHeight}`}
            data-asc="1.05"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                {renderLetters}
            </g>
        </svg>
    );
}

export default function Nexulayer({
    size = 48,
    className,
    hideLetters,
    coloredLetters,
}: Props) {
    return (
        <div
            className={`text-[#0055FF] ${className || ""}`}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: size * 0.2,
            }}
        >
            <NexulayerLogo size={size} />
            <NexulayerText
                size={size}
                hideLetters={hideLetters}
                coloredLetters={coloredLetters}
            />
        </div>
    );
}