import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const sourceLang = formData.get('sourceLang') as string;
    const targetLang = formData.get('targetLang') as string;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    console.log('Fichier reçu:', filePath);
    console.log('Langue source:', sourceLang);
    console.log('Langue cible:', targetLang);

    return NextResponse.json({
      success: true,
      downloadUrl: `/uploads/${fileName}`,
      message: 'Fichier reçu avec succès. Ajoutez ici votre logique de traduction DeepL / Google Translate.',
    });
  } catch (error) {
    console.error('Erreur API translate:', error);
    return NextResponse.json({ error: 'Erreur lors du traitement du fichier' }, { status: 500 });
  }
}