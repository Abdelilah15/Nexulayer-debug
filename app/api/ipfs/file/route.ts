import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const jwt = process.env.PINATA_JWT;
    if (!jwt) {
      return NextResponse.json({ error: "PINATA_JWT manquant côté serveur." }, { status: 500 });
    }

    const body = await request.json();

    const payload = {
      pinataContent: body, // metadata NFT
      pinataMetadata: {
        name: `${body?.name || "forgenix"}-metadata.json`,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    };

    const res = await fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(payload),
    });

    const raw = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erreur Pinata JSON", details: raw },
        { status: res.status }
      );
    }

    const data = JSON.parse(raw);
    return NextResponse.json({ ipfsHash: data.IpfsHash }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur IPFS JSON:", error);
    return NextResponse.json(
      { error: error?.message || "Erreur serveur lors de l'upload JSON" },
      { status: 500 }
    );
  }
}