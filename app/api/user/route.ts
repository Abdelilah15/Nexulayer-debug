import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { address } = body;

        if (!address) {
            return NextResponse.json({ error: "Adresse requise" }, { status: 400 });
        }

        // 1. On se connecte à la base de données
        const client = await clientPromise;
        const db = client.db('forgenix');
        const collection = db.collection('users');

        // 2. On cherche si l'utilisateur existe déjà
        let user = await collection.findOne({ address: address });

        // 3. S'il n'existe pas, on le crée !
        if (!user) {
            const newUser = {
                address: address,
                username: `Forger_${address.substring(2, 6).toUpperCase()}`,
                role: "Creator",
                domain: "", // Prévu pour plus tard (ex: monx.forgenix.eth)
                joinedAt: new Date().toISOString()
            };
            
            await collection.insertOne(newUser);
            user = newUser as any;
        }

        // 4. On renvoie les données (soit celles trouvées, soit les nouvelles)
        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        console.error("Erreur API User:", error);
        return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
    }
}