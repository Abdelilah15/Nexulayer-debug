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

        // 1. MAPPING DU TEMPS : On traduit nos filtres en "chart_period" pour Zerion
        let chartPeriod = 'max';
        if (timeframe === '1M') chartPeriod = 'month';
        else if (timeframe === '6M') chartPeriod = '6months';
        else if (timeframe === '1Y') chartPeriod = 'year';
        else if (timeframe === '2Y') chartPeriod = 'max'; // 2Y n'existe pas chez Zerion, on prend 'max'
        else if (timeframe === '5Y') chartPeriod = '5years';

        const encodedKey = Buffer.from(`${apiKey}:`).toString('base64');
        
        // 2. CORRECTION DE L'URL : Format officiel de Zerion
        const response = await fetch(`https://api.zerion.io/v1/wallets/${address}/charts/${chartPeriod}?currency=usd`, {
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