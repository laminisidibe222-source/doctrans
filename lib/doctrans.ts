import JSZip from "jszip";

// Correspond à un texte trouvé entre <w:t ...>...</w:t> dans le XML du docx
interface TextMatch {
  fullMatch: string; // ex: <w:t xml:space="preserve">Bonjour</w:t>
  openTag: string;   // ex: <w:t xml:space="preserve">
  text: string;      // ex: Bonjour
  closeTag: string;  // </w:t>
}

const TEXT_TAG_REGEX = /(<w:t[^>]*>)([\s\S]*?)(<\/w:t>)/g;

/**
 * Extrait tous les segments de texte traduisibles d'un document.xml
 */
function extractTextSegments(xml: string): TextMatch[] {
  const matches: TextMatch[] = [];
  let match: RegExpExecArray | null;
  const regex = new RegExp(TEXT_TAG_REGEX);
  while ((match = regex.exec(xml)) !== null) {
    matches.push({
      fullMatch: match[0],
      openTag: match[1],
      text: match[2],
      closeTag: match[3],
    });
  }
  return matches;
}

/**
 * Traduit une liste de textes via l'API DeepL en un seul appel (plus rapide, moins de quota gaspillé)
 */
async function translateTexts(
  texts: string[],
  targetLang: string,
  apiKey: string
): Promise<string[]> {
  // On ne traduit que les segments non vides pour économiser le quota
  const nonEmptyIndexes: number[] = [];
  const nonEmptyTexts: string[] = [];
  texts.forEach((t, i) => {
    if (t.trim().length > 0) {
      nonEmptyIndexes.push(i);
      nonEmptyTexts.push(t);
    }
  });

  if (nonEmptyTexts.length === 0) return texts;

  const params = new URLSearchParams();
  nonEmptyTexts.forEach((t) => params.append("text", t));
  params.append("target_lang", targetLang.toUpperCase());
  // tag_handling=xml évite que DeepL casse d'éventuelles entités HTML (&amp; etc.) dans le texte
  params.append("tag_handling", "xml");

  const response = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Erreur DeepL (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const translated: string[] = data.translations.map((t: any) => t.text);

  // On remet les traductions à leur place d'origine, en gardant les segments vides tels quels
  const result = [...texts];
  nonEmptyIndexes.forEach((originalIndex, i) => {
    result[originalIndex] = translated[i];
  });
  return result;
}

/**
 * Fonction principale : prend un buffer .docx, retourne un buffer .docx traduit
 */
export async function translateDocx(
  fileBuffer: Buffer,
  targetLang: string,
  apiKey: string
): Promise<Buffer> {
  const zip = await JSZip.loadAsync(fileBuffer);
  const documentXmlPath = "word/document.xml";
  const documentFile = zip.file(documentXmlPath);

  if (!documentFile) {
    throw new Error("Fichier .docx invalide : word/document.xml introuvable");
  }

  const xml = await documentFile.async("string");
  const segments = extractTextSegments(xml);

  if (segments.length === 0) {
    throw new Error("Aucun texte traduisible trouvé dans le document");
  }

  const originalTexts = segments.map((s) => s.text);
  const translatedTexts = await translateTexts(originalTexts, targetLang, apiKey);

  // Reconstruction du XML : on remplace chaque segment original par sa version traduite,
  // dans l'ordre, en gardant les balises (et donc le formatage) intactes.
  let newXml = xml;
  let cursor = 0;
  let rebuilt = "";
  const regex = new RegExp(TEXT_TAG_REGEX);
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(xml)) !== null) {
    rebuilt += xml.slice(cursor, match.index);
    rebuilt += `${segments[i].openTag}${translatedTexts[i]}${segments[i].closeTag}`;
    cursor = match.index + match[0].length;
    i++;
  }
  rebuilt += xml.slice(cursor);
  newXml = rebuilt;

  zip.file(documentXmlPath, newXml);
  const outputBuffer = await zip.generateAsync({ type: "nodebuffer" });
  return outputBuffer;
}
