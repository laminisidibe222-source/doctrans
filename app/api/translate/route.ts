// app/api/translate/routes.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const sourceLang = formData.get('sourceLang') || 'fr';
    const targetLang = formData.get('targetLang') || 'en';

    // Validation
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Read file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to uploads folder
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, uniqueName);
    await writeFile(filePath, buffer);

    console.log('✅ Fichier reçu:', file.name);
    console.log('🌐 Traduction:', sourceLang, '→', targetLang);

    // ==============================================
    // DEEPL INTEGRATION WILL GO HERE
    // ==============================================
    // Example:
    // const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', { ... });

    return NextResponse.json({
      success: true,
      message: 'Fichier reçu avec succès',
      fileName: file.name,
      downloadUrl: `/uploads/${uniqueName}`,
      sourceLang,
      targetLang
    });

  } catch (error) {
    console.error('❌ Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du fichier' },
      { status: 500 }
    );
  }
}