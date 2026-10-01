import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import type { NextRequest } from 'next/server';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse-new';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });
}

function mapLangCode(code: string): string {
  const map: Record<string, string> = {
    fr: 'FR', en: 'EN', es: 'ES', de: 'DE',
    pt: 'PT', it: 'IT', ru: 'RU', zh: 'ZH', ar: 'AR'
  };
  return map[code] || code?.toUpperCase() || 'EN';
}

function splitIntoChunks(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxChars;
    if (end >= text.length) { chunks.push(text.slice(start)); break; }
    const breakPoint = text.lastIndexOf('. ', end);
    const finalBreak = breakPoint > start + maxChars * 0.5 ? breakPoint : end;
    chunks.push(text.slice(start, finalBreak + 1));
    start = finalBreak + 1;
  }
  return chunks;
}

async function translateChunk(text: string, sourceLang: string, targetLang: string, deeplKey: string): Promise<string> {
  const deeplSource = mapLangCode(sourceLang);
  const deeplTarget = mapLangCode(targetLang);
  const isFree = deeplKey.trim().endsWith(':fx');
  const apiUrl = isFree
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${deeplKey.trim()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text,
      source_lang: deeplSource,
      target_lang: deeplTarget
    })
  });

  const bodyText = await res.text();
  if (!res.ok) throw new Error(`DeepL ${res.status}: ${bodyText.slice(0, 300)}`);
  const data = JSON.parse(bodyText);
  return data.translations?.[0]?.text || '';
}

async function extractText(filePath: string, ext: string): Promise<string> {
  const safeExt = (ext || '').toLowerCase();
  console.log(`📄 Traitement: ${safeExt}`);

  if (['.txt', '.md', '.json'].includes(safeExt)) {
    const text = await readFile(filePath, 'utf-8');
    console.log(`✅ Texte: ${text.length} caractères`);
    return text;
  }

  if (safeExt === '.docx') {
    const buffer = await readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value || '';
    if (!text.trim()) throw new Error('Aucun texte lisible dans ce DOCX');
    console.log(`✅ DOCX: ${text.length} caractères`);
    return text;
  }

  if (safeExt === '.pdf') {
    const buffer = readFileSync(filePath);
    const result = await pdfParse(buffer);
    const text = result.text || '';
    if (text.trim().length < 30) {
      throw new Error('PDF numérisé détecté — version texte uniquement pour l\'instant');
    }
    console.log(`✅ PDF: ${text.length} caractères extraits`);
    return text;
  }

  throw new Error(`Format non supporté: ${safeExt}`);
}

// ✅ Create PDF with translated text
async function createTranslatedPDF(text: string, filename: string): Promise<string> {
  const pdfDoc = await PDFDocument.create();
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 72;
  const fontSize = 11;
  const lineHeight = fontSize * 1.5;
  
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPos = pageHeight - margin;
  
  // Title
  page.drawText('Document Traduit — Doctrans', {
    x: margin,
    y: yPos,
    font: helveticaBold,
    size: 16,
    color: rgb(0.1, 0.3, 0.7),
  });
  yPos -= 30;
  
  // Filename
  page.drawText(`Fichier: ${filename}`, {
    x: margin,
    y: yPos,
    font: helveticaFont,
    size: 10,
    color: rgb(0.3, 0.3, 0.3),
  });
  yPos -= 25;
  
  // Content — wrap text
  const lines = text.split('\n');
  for (const line of lines) {
    const words = line.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const textWidth = helveticaFont.widthOfTextAtSize(testLine, fontSize);
      
      if (textWidth > pageWidth - margin * 2 && currentLine) {
        if (yPos < margin + lineHeight) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPos = pageHeight - margin;
        }
        page.drawText(currentLine, {
          x: margin,
          y: yPos,
          font: helveticaFont,
          size: fontSize,
          color: rgb(0.15, 0.15, 0.15),
        });
        yPos -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      if (yPos < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        yPos = pageHeight - margin;
      }
      page.drawText(currentLine, {
        x: margin,
        y: yPos,
        font: helveticaFont,
        size: fontSize,
        color: rgb(0.15, 0.15, 0.15),
      });
      yPos -= lineHeight;
    }
  }
  
  const pdfBytes = await pdfDoc.save();
  const baseName = filename.replace(extname(filename), '');
  const translatedName = `${baseName}_traduit.pdf`;
  const translatedPath = join(UPLOAD_DIR, translatedName);
  
  await writeFile(translatedPath, pdfBytes);
  console.log(`📄 PDF généré: ${translatedName}`);
  
  return translatedName;
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();
    console.log('🚀 Nouvelle demande');

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const sourceLang = formData.get('sourceLang') as string | null;
    const targetLang = formData.get('targetLang') as string | null;

    if (!file || !sourceLang || !targetLang) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 413 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const fileId = `${Date.now()}-${file.name}`;
    const originalPath = join(UPLOAD_DIR, fileId);
    await writeFile(originalPath, bytes);
    console.log(`💾 Fichier: ${file.name} (${file.size} octets)`);

    const ext = extname(file.name).toLowerCase();
    const textContent = await extractText(originalPath, ext);

    const deeplKey = process.env.DEEPL_API_KEY;
    if (!deeplKey || deeplKey.trim() === '') {
      return NextResponse.json({
        success: true,
        warning: 'Mode démo — configurez DEEPL_API_KEY',
        downloadUrl: `/uploads/${fileId}`,
        filename: file.name
      });
    }

    const CHUNK_SIZE = 45000;
    const chunks = splitIntoChunks(textContent, CHUNK_SIZE);
    console.log(`📦 Découpé en ${chunks.length} partie(s)`);

    const translatedChunks: string[] = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`🔄 Partie ${i + 1}/${chunks.length}`);
      translatedChunks.push(await translateChunk(chunks[i], sourceLang, targetLang, deeplKey));
    }

    const translatedText = translatedChunks.join('\n\n');
    
    // ✅ Generate PDF instead of TXT
    const translatedName = await createTranslatedPDF(translatedText, file.name);
    
    console.log(`✅ Fini — ${translatedText.length} caractères → ${translatedName}`);

    return NextResponse.json({
      success: true,
      message: `✅ Traduction terminée !`,
      downloadUrl: `/uploads/${translatedName}`,
      filename: translatedName,
      chunks: chunks.length
    });

  } catch (error: any) {
    console.error('❌ Erreur:', error.message);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}