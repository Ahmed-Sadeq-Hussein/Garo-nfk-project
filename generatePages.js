// generatePages.js

const fs = require('fs');
const path = require('path');

// ✅ Sanitize version WITH numbers (default)
function sanitizeFilename(name) {
  return name
    .replace(/-/g, '_')                 // replace hyphens with underscores
    .replace(/[^a-z0-9_ ]/gi, '')       // allow letters, numbers, underscores, spaces
    .replace(/\s+/g, '')                // remove spaces
    .trim();
}

// ✅ Sanitize version WITHOUT numbers (for alternate file/component)
function sanitizeFilenameWithoutNumbers(name) {
  return name
    .replace(/-/g, '_')                 // replace hyphens with underscores
    .replace(/[^a-zA-Z_ ]/g, '')        // only letters and underscores
    .replace(/\s+/g, '')                // remove spaces
    .trim();
}

const jsonDir = path.join(__dirname, 'resource json');
const outputDir = path.join(__dirname, 'Front_end/info-page/src/generated');

// Ensure the output folder exists and is clean
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// Generate React page components
fs.readdirSync(jsonDir).forEach(file => {
  if (file.endsWith('.json')) {
    const raw = fs.readFileSync(path.join(jsonDir, file));
    const data = JSON.parse(raw);

    const originalName = data.egenskap;
    const safeName = sanitizeFilename(originalName);
    const safeNameNoNums = sanitizeFilenameWithoutNumbers(originalName);

    const componentName = `${safeName}Page`;
    const altComponentName = `${safeNameNoNums}Page`;

    const content = (nameToUse) => `
import React from 'react';

export default function ${nameToUse}() {
  return (
    <div>
      <h1>${data.egenskap}</h1>
      <p><strong>Kundfördel:</strong> ${data.fordel}</p>
      <p><strong>Tänkbar Nytta:</strong> ${data.nytta}</p>
      <p><strong>Tänkbara Problem:</strong> ${data.problem}</p>
      <p><strong>Anledning:</strong> ${data.anledning}</p>
      <p><strong>Värde:</strong> ${data.cost}</p>
      <p><strong>Beskrivning:</strong> ${data.beskrivning}</p>
    </div>
  );
}
`.trim();

    // Save component WITH numbers
    fs.writeFileSync(
      path.join(outputDir, `${componentName}.js`),
      content(componentName)
    );

    // Save component WITHOUT numbers
    fs.writeFileSync(
      path.join(outputDir, `${altComponentName}.js`),
      content(altComponentName)
    );
  }
});

console.log("✅ Pages generated with and without numbers.");
