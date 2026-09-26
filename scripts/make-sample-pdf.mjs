// Generates examples/react-vite/public/sample.pdf: three text pages, no dependencies.
import { writeFileSync } from 'node:fs';

const pages = [
  [
    'DISCHARGE SUMMARY',
    'Patient: Jane Roe     Admitted: 2026-03-02     Discharged: 2026-03-09',
    '',
    'Reason for admission',
    'The patient was admitted with chest pain radiating to the left arm.',
    'An ECG and troponin series ruled out an acute myocardial infarction.',
    '',
    'Past medical history',
    'Type 2 diabetes mellitus, diagnosed in 2019 and treated with metformin.',
    'Hypertension controlled with lisinopril 10 mg daily.',
  ],
  [
    'MEDICATION LIST',
    '',
    'Metformin 500 mg twice daily with meals.',
    'Lisinopril 10 mg once daily in the morning.',
    'Atorvastatin 20 mg nightly.',
    '',
    'Allergies',
    'Penicillin causes a rash. No other known drug allergies.',
  ],
  [
    'FOLLOW UP',
    '',
    'Follow up with the primary care physician in two weeks.',
    'Repeat the HbA1c test in three months.',
    'Return to the emergency department if chest pain recurs,',
    'or if shortness of breath or fainting develops.',
  ],
];

const escape = (text) => text.replace(/[\\()]/g, '\\$&');

function pageStream(lines) {
  const body = lines
    .map((line, i) => {
      const heading = i === 0;
      return `BT /${heading ? 'F2' : 'F1'} ${heading ? 16 : 12} Tf 56 ${760 - i * 22} Td (${escape(line)}) Tj ET`;
    })
    .join('\n');
  return body;
}

const objects = [];
const add = (content) => objects.push(content) && objects.length;

const catalog = add('');
const pagesRoot = add('');
const regular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
const bold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
const pageRefs = [];

for (const lines of pages) {
  const stream = pageStream(lines);
  const content = add(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
  const page = add(
    `<< /Type /Page /Parent ${pagesRoot} 0 R /MediaBox [0 0 612 792] ` +
      `/Resources << /Font << /F1 ${regular} 0 R /F2 ${bold} 0 R >> >> /Contents ${content} 0 R >>`,
  );
  pageRefs.push(page);
}

objects[catalog - 1] = `<< /Type /Catalog /Pages ${pagesRoot} 0 R >>`;
objects[pagesRoot - 1] =
  `<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`;

let pdf = '%PDF-1.4\n';
const offsets = [];
objects.forEach((content, index) => {
  offsets.push(Buffer.byteLength(pdf));
  pdf += `${index + 1} 0 obj\n${content}\nendobj\n`;
});

const xrefOffset = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
pdf += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

writeFileSync(new URL('../examples/react-vite/public/sample.pdf', import.meta.url), pdf, 'latin1');
console.log(`sample.pdf written (${pages.length} pages)`);
