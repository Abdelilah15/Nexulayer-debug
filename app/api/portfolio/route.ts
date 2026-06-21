import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma'; 

export async function POST(request: Request) {
    try {
        const { address, timeframe } = await request.json();
        if (!address) return NextResponse.json({ error: "Adresse requise" }, { status: 400 });

        const apiKey = process.env.ZERION_API_KEY;
        const encodedKey = Buffer.from(`${apiKey}:`).toString('base64');
        const headers = { 'accept': 'application/json', 'authorization': `Basic ${encodedKey}` };
        const safeAddress = address.toLowerCase();

        // 1. VÉRIFICATION
        const existingHistoryCount = await prisma.portfolioSnapshot.count({
            where: { address: safeAddress }
        });

        if (existingHistoryCount < 50) {
            await prisma.portfolioSnapshot.deleteMany({ where: { address: safeAddress } });

            const chartRes = await fetch(`https://api.zerion.io/v1/wallets/${address}/charts/max?currency=usd&filter[positions]=no_filter`, { headers });
            
            if (chartRes.ok) {
                const chartData = await chartRes.json();
                const points = chartData.data?.attributes?.charts || [];
                
                if (points.length > 0) {
                    const snapshotsToInsert = points.map((p: any) => ({
                        address: safeAddress,
                        timestamp: new Date(p[0] * 1000),
                        balance: parseFloat(Number(p[1]).toFixed(2))
                    }));

                    await prisma.portfolioSnapshot.createMany({
                        data: snapshotsToInsert,
                        skipDuplicates: true,
                    });
                    console.log(`✅ ${snapshotsToInsert.length} points historiques sauvegardés !`);
                }
            }
        }

        // 2. MISE À JOUR DU SOLDE ACTUEL
        try {
            const portfolioRes = await fetch(`https://api.zerion.io/v1/wallets/${address}/portfolio?currency=usd&filter[positions]=no_filter`, { headers });
            if (portfolioRes.ok) {
                const portfolioData = await portfolioRes.json();
                const currentBalance = portfolioData.data?.attributes?.total?.positions;
                
                if (currentBalance !== undefined) {
                    const now = new Date();
                    const currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);

                    const existingPoint = await prisma.portfolioSnapshot.findFirst({
                        where: { address: safeAddress, timestamp: currentHour }
                    });

                    if (!existingPoint) {
                        await prisma.portfolioSnapshot.create({
                            data: { address: safeAddress, timestamp: currentHour, balance: parseFloat(Number(currentBalance).toFixed(2)) }
                        });
                    } else {
                        await prisma.portfolioSnapshot.update({
                            where: { id: existingPoint.id },
                            data: { balance: parseFloat(Number(currentBalance).toFixed(2)) }
                        });
                    }
                }
            }
        } catch (e) {}

        // 3. RÉPONSE AU GRAPHIQUE
        const now = new Date();
        let limitDate = new Date(0); 
        
        if (timeframe === '1J') limitDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        else if (timeframe === '1S') limitDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        else if (timeframe === '1M') limitDate.setMonth(now.getMonth() - 1);
        else if (timeframe === '3M') limitDate.setMonth(now.getMonth() - 3);
        else if (timeframe === '1A') limitDate.setFullYear(now.getFullYear() - 1);

        const dbSnapshots = await prisma.portfolioSnapshot.findMany({
            where: { address: safeAddress, timestamp: { gte: limitDate } },
            orderBy: { timestamp: 'asc' }
        });

        const totalBalance = dbSnapshots.length > 0 ? dbSnapshots[dbSnapshots.length - 1].balance : 0;
        return NextResponse.json({ chartData: dbSnapshots, totalBalance }, { status: 200 });

    } catch (error) {
        console.error("❌ CRASH API PORTFOLIO :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}