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

        // 1. MAPPING PARFAIT AVEC ZERION
        const periodMap: Record<string, string> = {
            '1J': 'day',
            '1S': 'week',
            '1M': 'month',
            '3M': '3months',
            '1A': 'year',
            'Max': 'max'
        };
        const chartPeriod = periodMap[timeframe] || 'month'; // 'month' par défaut

        const encodedKey = Buffer.from(`${apiKey}:`).toString('base64');
        const headers = {
            'accept': 'application/json',
            'authorization': `Basic ${encodedKey}`
        };

        // 2. Requêtes simultanées
        const chartRes = await fetch(`https://api.zerion.io/v1/wallets/${address}/charts/${chartPeriod}?currency=usd`, { headers });
        const portfolioRes = await fetch(`https://api.zerion.io/v1/wallets/${address}/portfolio?currency=usd`, { headers });

        if (!chartRes.ok) {
            throw new Error(`Erreur Zerion Chart: ${chartRes.status}`);
        }

        const chartData = await chartRes.json();
        let portfolioData = null;
        if (portfolioRes.ok) {
            portfolioData = await portfolioRes.json();
        }

        return NextResponse.json({ chartData, portfolioData }, { status: 200 });

    } catch (error) {
        console.error("❌ CRASH API ZERION :", error);
        return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
    }
}