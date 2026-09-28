import type { PdfCitation } from 'pdf-anchor';

export const SAMPLE_PDF = `${import.meta.env.BASE_URL}sample.pdf`;

export const citations: PdfCitation[] = [
  {
    id: 'chest-pain',
    page: 1,
    title: 'Reason for admission',
    text: 'The patient was admitted with chest pain radiating to the left arm that began two hours before arrival.',
  },
  {
    id: 'diabetes',
    page: 1,
    title: 'Diagnosis',
    text: 'Type 2 diabetes mellitus, diagnosed in 2019 and treated with metformin.',
  },
  {
    id: 'troponin',
    page: 2,
    title: 'Cardiac work-up',
    text: 'Serial troponin values at zero, three and six hours remained within normal limits.',
  },
  {
    id: 'stenosis',
    page: 2,
    title: 'Angiogram',
    text: 'a single 60 percent stenosis of the right coronary artery that was managed medically',
  },
  {
    id: 'metformin',
    page: 3,
    title: 'Medication',
    text: 'Metformin 500 mg twice daily with meals.',
  },
  {
    id: 'allergy',
    page: 3,
    title: 'Allergy',
    text: 'Penicillin causes a rash.',
  },
  {
    id: 'hba1c',
    page: 4,
    title: 'Lab result',
    text: 'Hemoglobin A1c: 7.4 percent, above the target of 7.0 percent.',
  },
  {
    id: 'follow-up',
    page: 6,
    title: 'Follow-up',
    // Several passages can belong to one citation.
    text: [
      'Follow up with the primary care physician in two weeks',
      'Repeat the HbA1c test in three months.',
    ],
    quote: 'Follow up in two weeks; repeat HbA1c in three months.',
  },
];
