import type { PdfCitation } from 'pdf-anchor';

export const SAMPLE_PDF = `${import.meta.env.BASE_URL}sample.pdf`;

export const citations: PdfCitation[] = [
  {
    id: 'chest-pain',
    page: 1,
    title: 'Reason for admission',
    text: 'The patient was admitted with chest pain radiating to the left arm.',
  },
  {
    id: 'diabetes',
    page: 1,
    title: 'Diagnosis',
    text: 'Type 2 diabetes mellitus, diagnosed in 2019 and treated with metformin.',
  },
  {
    id: 'metformin',
    page: 2,
    title: 'Medication',
    text: 'Metformin 500 mg twice daily with meals.',
  },
  {
    id: 'allergy',
    page: 2,
    title: 'Allergy',
    text: 'Penicillin causes a rash.',
  },
  {
    id: 'follow-up',
    page: 3,
    title: 'Follow-up',
    // Several passages can belong to one citation.
    text: [
      'Follow up with the primary care physician in two weeks.',
      'Repeat the HbA1c test in three months.',
    ],
    quote: 'Follow up in two weeks; repeat HbA1c in three months.',
  },
];
