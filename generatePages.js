const fs = require('fs');
const path = require('path');

/**
 * Sanitize a component name by:
 * - Removing accents (diacritics)
 * - Stripping all non-alphanumeric characters
 * - Removing leading numbers
 * - Removing spaces
 */
function sanitizeComponentName(name) {
  return name
    .normalize('NFD')                      // Normalize accented letters
    .replace(/[\u0300-\u036f]/g, '')       // Remove diacritics
    .replace(/[^a-zA-Z0-9]/g, '')          // Remove all non-alphanumeric
    .replace(/^[0-9]+/, '')                // Remove leading numbers
    .trim();                               // Remove surrounding whitespace
}

// 📁 Directories
const jsonDir = path.join(__dirname, 'resource json');
const outputDir = path.join(__dirname, 'Front_end/info-page/src/generated');

// 🧹 Clean output directory
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir, { recursive: true });

// 🔄 Generate a component for each JSON file
fs.readdirSync(jsonDir).forEach(file => {
  if (file.endsWith('.json') && file !== 'routes.json') {
    const raw = fs.readFileSync(path.join(jsonDir, file));
    const data = JSON.parse(raw);

    const safeName = sanitizeComponentName(data.egenskap);
    const componentName = `${safeName}Page`;
    const fileName = `${componentName}.js`;

    const pageContent = `
import React from 'react';

export default function ${componentName}() {
  const fields = [
    { label: "Kundfördel", value: \`${data.fordel}\` },
    { label: "Tänkbar Nytta", value: \`${data.nytta}\` },
    { label: "Tänkbara Problem", value: \`${data.problem}\` },
    { label: "Anledning", value: \`${data.anledning}\` },
    { label: "Värde", value: \`${data.cost}\` },
    { label: "Beskrivning", value: \`${data.beskrivning}\` },
    { label: "Taggar", value: \`${(data.tags || []).join(', ')}\` }
  ];

  return (
    <div>
      <h1>${data.egenskap}</h1>
      {fields
        .filter(field => field.value && field.value !== "Inget innehåll")
        .map((field, i) => (
          <p key={i}><strong>{field.label}:</strong> {field.value}</p>
        ))}
    </div>
  );
}
`;

    fs.writeFileSync(path.join(outputDir, fileName), pageContent.trim());
  }
});

// 📦 Generate Routes.js from routes.json
const routesPath = path.join(jsonDir, 'routes.json');

if (fs.existsSync(routesPath)) {
  const routesRaw = fs.readFileSync(routesPath);
  const routesList = JSON.parse(routesRaw);

  const enrichedRoutes = routesList.map((r) => {
    const safeName = sanitizeComponentName(r.title);
    return {
      ...r,
      component: `${safeName}Page.js`
    };
  });

  const routesContent = `
const routes = ${JSON.stringify(enrichedRoutes, null, 2)};

export default routes;
`;

  fs.writeFileSync(
    path.join(outputDir, 'Routes.js'),
    routesContent.trim()
  );

  console.log("📦 Routes.js generated from routes.json");
}

console.log("✅ Feature pages generated in 'generated' folder.");
