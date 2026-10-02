# Security policy

## Supported versions

Only the latest published minor version receives security fixes.

## Reporting a vulnerability

Please do not open a public issue for security problems. Use GitHub's private vulnerability reporting ("Security" tab, "Report a vulnerability") on this repository, or email valentine.efimov@gmail.com.

You will get an acknowledgement within a few days. Please include the affected version, a description, and a minimal reproduction if you have one.

## Notes for users

- The library renders PDFs with pdf.js through react-pdf. Treat PDFs from untrusted sources as untrusted input and keep `pdfjs-dist` up to date.
- The package does not use `innerHTML`, `eval` or remote code loading, and has no install scripts.
