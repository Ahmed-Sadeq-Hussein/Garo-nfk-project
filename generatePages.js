const fs = require('fs');
const path = require('path');

// ✅ Sanitize name and REMOVE leading numbers
function sanitizeComponentName(name) {
  return name
    .replace(/-/g, '_')                 // replace hyphens with underscores
    .replace(/^[0-9]+/, '')             // remove leading numbers
    .replace(/[^a-zA-Z0-9_ ]/g, '')     // keep only safe characters
    .replace(/\s+/g, '')                // remove spaces
    .trim();
}

const jsonDir = path.join(__dirname, 'resource json');
const outputDir = path.join(__dirname, 'Front_end/info-page/src/generated');

// Clean and recreate the output folder
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// 🔧 Generate a React component for each JSON feature
fs.readdirSync(jsonDir).forEach(file => {
  if (file.endsWith('.json') && file !== 'routes.json') {
    const raw = fs.readFileSync(path.join(jsonDir, file));
    const data = JSON.parse(raw);

    const rawName = data.egenskap;
    const safeName = sanitizeComponentName(rawName);
    const componentName = `${safeName}Page`;
    const fileName = `${componentName}.js`;

    const pageContent = `
import React from 'react';

export const section = "${data.section || ''}";
export const reference = "${data.reference || ''}";
export const part = "${data.part || ''}";

export default function ${componentName}() {
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
`;

    fs.writeFileSync(path.join(outputDir, fileName), pageContent.trim());
  }
});

// 🧭 Generate Routes.js from routes.json
const routesPath = path.join(jsonDir, 'routes.json');
if (fs.existsSync(routesPath)) {
  const routesRaw = fs.readFileSync(routesPath);
  const routesList = JSON.parse(routesRaw);

  const routesContent = `
const routes = ${JSON.stringify(routesList, null, 2)};

export default routes;
`;

  fs.writeFileSync(
    path.join(outputDir, 'Routes.js'),
    routesContent.trim()
  );

  console.log("📦 Routes.js generated from routes.json");
}

console.log("✅ Feature pages generated in 'generated' folder.");
