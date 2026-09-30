import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import type { NextRequest } from 'next/server';

// Ensure temp directory exists
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const sourceLang = formData.get('sourceLang') as string | null;
    const targetLang = formData.get('targetLang') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    if (!sourceLang || !targetLang) {
      return NextResponse.json({ error: 'Langues manquantes' }, { status: 400 });
    }

    // Save file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileId = `${Date.now()}-${file.name}`;
    const filePath = join(UPLOAD_DIR, fileId);
    await writeFile(filePath, buffer);

    // Demo mode — returns same file for download
    // Later: we'll add DeepL here for real translation
    const downloadUrl = `/uploads/${fileId}`;

    return NextResponse.json({
      success: true,
      message: 'Fichier reçu avec succès',
      downloadUrl,
      filename: file.name,
      sourceLang,
      targetLang
    });

  } catch (error) {
    console.error('❌ Erreur API /translate:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du traitement du fichier' },
      { status: 500 }
    );
  }
}