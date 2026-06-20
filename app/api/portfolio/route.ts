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

        const periodMap: Record<string, string> = {
            '1J': 'day',
            '1S': 'week',
            '1M': 'month',
            '3M': '3months',
            '1A': 'year',
            'Max': 'max'
        };
        const chartPeriod = periodMap[timeframe] || 'month';

        const encodedKey = Buffer.from(`${apiKey}:`).toString('base64');
        const headers = {
            'accept': 'application/json',
            'authorization': `Basic ${encodedKey}`
        };

        // NOUVEAU : Ajout de filter[positions]=no_filter pour inclure TOUS les actifs (DeFi, Staking, autres tokens)
        const chartUrl = `https://api.zerion.io/v1/wallets/${address}/charts/${chartPeriod}?currency=usd&filter[positions]=no_filter`;
        const portfolioUrl = `https://api.zerion.io/v1/wallets/${address}/portfolio?currency=usd&filter[positions]=no_filter`;

        const chartRes = await fetch(chartUrl, { headers });
        const portfolioRes = await fetch(portfolioUrl, { headers });

        if (!chartRes.ok) {
            console.error("Zerion Chart Error:", await chartRes.text());
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