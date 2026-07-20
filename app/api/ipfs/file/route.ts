import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const pinataFormData = new FormData();
    pinataFormData.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
      body: pinataFormData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Pinata error details:", errorText);
      throw new Error("Pinata error during file upload");
    }

    const data = await res.json();

    return NextResponse.json({ ipfsHash: data.IpfsHash }, { status: 200 });

  } catch (error) {
    console.error("IPFS File error:", error);
    return NextResponse.json({ error: "Server error during image upload" }, { status: 500 });
  }
}
