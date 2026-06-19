import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { address } = body;

        if (!address) {
            return NextResponse.json({ error: "Adresse requise" }, { status: 400 });
        }

        console.log("Tentative de connexion à MongoDB pour l'adresse :", address);

        // Connexion à la base
        const client = await clientPromise;
        const db = client.db('Forgenix');
        const collection = db.collection('users');

        // Recherche de l'utilisateur
        let user = await collection.findOne({ address: address });

        // Création si inexistant
        if (!user) {
            console.log("Nouvel utilisateur ! Création du profil en cours...");
            const defaultAvatars = [
                "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Alpha",
                "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Beta",
                "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Gamma",
                "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Delta"
            ];
            // Sélection aléatoire d'une des 4 images
            const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

            const newUser = {
                address: address,
                username: `Forger_${address.substring(2, 6).toUpperCase()}`,
                role: "Creator",
                domain: "", 
                avatar: randomAvatar, // Ajout du champ image
                joinedAt: new Date().toISOString()
            };
            
            await collection.insertOne(newUser);
            user = newUser as any;
            console.log("Profil créé avec succès :", newUser.username);
        } else {
            console.log("Utilisateur existant trouvé :", user.username);
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        // C'EST ICI QUE NOUS VERRONS LE VRAI PROBLÈME S'IL Y EN A UN
        console.error("❌ CRASH API MONGODB :", error);
        return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
    }
}