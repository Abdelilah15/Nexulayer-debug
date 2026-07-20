import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { isWhiteLabeled, ...metadata } = body;

    if (!isWhiteLabeled) {
      const branding = "\n\n---\n*Created by Nexulayer, https://nexulayer.com*";
      metadata.description = metadata.description ? metadata.description + branding : branding;
    }

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({ pinataContent: metadata }),
    });

    if (!res.ok) throw new Error("Pinata JSON error");

    const data = await res.json();
    return NextResponse.json({ ipfsHash: data.IpfsHash }, { status: 200 });
  } catch (error) {
    console.error("IPFS JSON error:", error);
    return NextResponse.json({ error: "Server error during JSON upload" }, { status: 500 });
  }
}
