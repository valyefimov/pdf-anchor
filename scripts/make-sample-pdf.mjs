// Generates examples/react-vite/public/sample.pdf: a multi-page text document, no dependencies.
// Every block is real, selectable text so pdf.js builds a proper text layer for it.
import { writeFileSync } from 'node:fs';

const h = (text) => ({ type: 'h', text });
const p = (text) => ({ type: 'p', text });
const li = (items) => ({ type: 'ul', items });

const pages = [
  [
    h('DISCHARGE SUMMARY'),
    p(
      'Patient: Jane Roe. Date of birth: 1958-06-14. Admitted: 2026-03-02. Discharged: 2026-03-09. Attending physician: Dr. Alan Whitfield, Department of Internal Medicine.',
    ),
    h('Reason for admission'),
    p(
      'The patient was admitted with chest pain radiating to the left arm that began two hours before arrival. She described the pain as pressure-like, rated seven out of ten, and associated with mild nausea and sweating. An ECG and a serial troponin series ruled out an acute myocardial infarction.',
    ),
    h('Past medical history'),
    p(
      'Type 2 diabetes mellitus, diagnosed in 2019 and treated with metformin. Hypertension controlled with lisinopril 10 mg daily. Hyperlipidemia managed with atorvastatin. No prior surgeries other than an uncomplicated appendectomy in 1984.',
    ),
    h('Social history'),
    p(
      'Retired schoolteacher. Never smoked. Drinks one glass of wine on weekends. Walks thirty minutes most days and lives with her husband, who is her primary support.',
    ),
  ],
  [
    h('HOSPITAL COURSE'),
    p(
      'On arrival the patient was hemodynamically stable with a blood pressure of 148 over 86 and a heart rate of 82 beats per minute. Oxygen saturation was 97 percent on room air. She was started on aspirin and monitored on telemetry for the first twenty-four hours.',
    ),
    p(
      'Serial troponin values at zero, three and six hours remained within normal limits. A resting echocardiogram showed preserved left ventricular function with an ejection fraction of 60 percent and no wall motion abnormalities.',
    ),
    p(
      'A stress test on the fourth hospital day demonstrated a small reversible defect in the inferior wall. Cardiology recommended a coronary angiogram, which showed a single 60 percent stenosis of the right coronary artery that was managed medically.',
    ),
    h('Complications'),
    p(
      'There were no in-hospital complications. A transient rise in blood glucose to 240 mg/dL on the second day resolved after a temporary adjustment of the insulin sliding scale.',
    ),
  ],
  [
    h('MEDICATIONS AT DISCHARGE'),
    li([
      'Metformin 500 mg twice daily with meals.',
      'Lisinopril 10 mg once daily in the morning.',
      'Atorvastatin 40 mg nightly, increased from 20 mg.',
      'Aspirin 81 mg once daily.',
      'Metoprolol succinate 25 mg once daily, newly started.',
      'Nitroglycerin 0.4 mg sublingual as needed for chest pain.',
    ]),
    h('Allergies'),
    p(
      'Penicillin causes a rash. No other known drug allergies. The patient carries a wallet card listing the reaction.',
    ),
    h('Medications stopped'),
    p(
      'Ibuprofen was stopped because of its interaction with lisinopril and the risk of kidney injury. The patient was advised to use acetaminophen for minor aches.',
    ),
  ],
  [
    h('LABORATORY RESULTS'),
    li([
      'Hemoglobin A1c: 7.4 percent, above the target of 7.0 percent.',
      'Fasting glucose: 142 mg/dL.',
      'Creatinine: 0.9 mg/dL with an estimated glomerular filtration rate of 78.',
      'LDL cholesterol: 118 mg/dL before the statin dose was increased.',
      'Potassium: 4.2 mmol/L. Sodium: 139 mmol/L.',
      'Troponin I: below 0.01 ng/mL at all three measurements.',
    ]),
    h('Imaging'),
    p(
      'Chest radiograph showed clear lung fields and a normal cardiac silhouette. Coronary angiography confirmed a single 60 percent stenosis of the right coronary artery without flow limitation.',
    ),
  ],
  [
    h('ASSESSMENT AND PLAN'),
    p(
      'Chest pain with a negative myocardial infarction work-up and moderate single-vessel coronary disease. The pain is most consistent with stable angina. Optimal medical therapy was started and cardiac risk factors were addressed.',
    ),
    li([
      'Continue aspirin, atorvastatin and metoprolol indefinitely.',
      'Intensify diabetes management; the primary care physician will consider adding an SGLT2 inhibitor.',
      'Target blood pressure below 130 over 80.',
      'Enroll in the outpatient cardiac rehabilitation program.',
    ]),
    h('Diet and activity'),
    p(
      'Follow a Mediterranean-style diet low in saturated fat and added sugar. Resume light walking immediately and increase gradually. Avoid heavy lifting for two weeks.',
    ),
  ],
  [
    h('FOLLOW UP'),
    p(
      'Follow up with the primary care physician in two weeks to review blood pressure and glucose logs. Repeat the HbA1c test in three months. Cardiology clinic visit is scheduled in six weeks.',
    ),
    h('Return precautions'),
    p(
      'Return to the emergency department if chest pain recurs, lasts longer than fifteen minutes or does not respond to one dose of nitroglycerin, or if shortness of breath, fainting or palpitations develop.',
    ),
    h('Patient education'),
    p(
      'The patient and her husband received written instructions and a medication schedule. They verbalized understanding and were able to repeat the warning signs of a heart attack.',
    ),
    p('Signed electronically by Dr. Alan Whitfield on 2026-03-09.'),
  ],
];

// --- tiny PDF writer -------------------------------------------------------------------

const FONT = { h: ['F2', 15, 22], p: ['F1', 11, 15.5] };
const MAX_CHARS = 92;
const LEFT = 56;

const escape = (text) => text.replace(/[\\()]/g, '\\$&');

function wrap(text, max) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function layout(blocks) {
  const ops = [];
  let y = 750;
  const text = (font, size, x, line) => {
    ops.push(`BT /${font} ${size} Tf ${x} ${y.toFixed(1)} Td (${escape(line)}) Tj ET`);
  };

  blocks.forEach((block) => {
    if (block.type === 'h') {
      y -= 8;
      text(...FONT.h.slice(0, 2), LEFT, block.text);
      y -= FONT.h[2];
    } else if (block.type === 'p') {
      for (const line of wrap(block.text, MAX_CHARS)) {
        text(...FONT.p.slice(0, 2), LEFT, line);
        y -= FONT.p[2];
      }
      y -= 6;
    } else {
      for (const item of block.items) {
        wrap(item, MAX_CHARS - 4).forEach((line, index) => {
          if (index === 0) text('F1', 11, LEFT, '-');
          text('F1', 11, LEFT + 14, line);
          y -= FONT.p[2];
        });
      }
      y -= 6;
    }
  });
  return ops.join('\n');
}

const objects = [];
const add = (content) => objects.push(content) && objects.length;

const catalog = add('');
const pagesRoot = add('');
const regular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
const bold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
const pageRefs = [];

for (const blocks of pages) {
  const stream = layout(blocks);
  const content = add(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
  pageRefs.push(
    add(
      `<< /Type /Page /Parent ${pagesRoot} 0 R /MediaBox [0 0 612 792] ` +
        `/Resources << /Font << /F1 ${regular} 0 R /F2 ${bold} 0 R >> >> /Contents ${content} 0 R >>`,
    ),
  );
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
