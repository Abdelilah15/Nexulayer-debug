import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { address, timeframe } = await request.json();

        if (!address) {
            return NextResponse.json({ error: "Adresse requise" }, { status: 400 });
        }

        const apiKey = process.env.ZERION_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Clé API manquante" }, { status: 500 });
        }

        // L'URL de base pour les graphiques de portefeuille Zerion
        // (L'API Zerion utilise Basic Auth où le nom d'utilisateur est la clé API)
        const encodedKey = Buffer.from(`${apiKey}:`).toString('base64');
        
        const response = await fetch(`https://api.zerion.io/v1/wallets/${address}/portfolio/charts`, {
            headers: {
                'accept': 'application/json',
                'authorization': `Basic ${encodedKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur Zerion: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("❌ CRASH API ZERION :", error);
        return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
    }
}