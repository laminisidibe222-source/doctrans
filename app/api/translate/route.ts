import { NextRequest, NextResponse } from "next/server";
import { translateDocx } from "@/lib/doctrans";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetLang = formData.get("targetLang") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }
    if (!targetLang) {
      return NextResponse.json({ error: "Langue cible manquante" }, { status: 400 });
    }
    if (!file.name.endsWith(".docx")) {
      return NextResponse.json(
        { error: "Seuls les fichiers .docx sont supportés pour l'instant" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPL_API_KEY;
    console.log("DEBUG - clé lue par le serveur:", JSON.stringify(apiKey));
    if (!apiKey) {
      return NextResponse.json(
        { error: "DEEPL_API_KEY non configurée sur le serveur" },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    const translatedBuffer = await translateDocx(inputBuffer, targetLang, apiKey);
    const translatedBytes = Uint8Array.from(translatedBuffer);

    return new NextResponse(translatedBytes, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="traduit-${file.name}"`,
      },
    });
  } catch (err: any) {
    console.error("Erreur de traduction:", err);
    return NextResponse.json(
      { error: err.message || "Erreur interne" },
      { status: 500 }
    );
  }
}
