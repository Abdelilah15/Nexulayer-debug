import { NextResponse } from 'next/server';

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

export async function POST(request: Request) {
  try {
    const jwt = process.env.PINATA_JWT;
    if (!jwt) {
      return NextResponse.json({ error: "PINATA_JWT manquant côté serveur." }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier invalide." }, { status: 400 });
    }

    // Conversion robuste
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const blob = new Blob([buffer], { type: file.type || "application/octet-stream" });

    const pinataData = new FormData();
    pinataData.append("file", blob, file.name || "upload.bin");

    // Endpoint Pinata v3
    const res = await fetchWithTimeout("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: pinataData,
    });

    const raw = await res.text();
    if (!res.ok) {
      return NextResponse.json({ error: "Erreur Pinata upload", details: raw }, { status: res.status });
    }

    const data = JSON.parse(raw);
    // v3 retourne souvent data.data.cid
    const cid = data?.data?.cid || data?.IpfsHash;
    if (!cid) {
      return NextResponse.json({ error: "CID introuvable dans la réponse Pinata.", details: data }, { status: 500 });
    }

    return NextResponse.json({ ipfsHash: cid }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur IPFS File:", error);
    return NextResponse.json(
      { error: error?.name === "AbortError" ? "Timeout vers Pinata" : (error?.message || "Erreur serveur") },
      { status: 500 }
    );
  }
}