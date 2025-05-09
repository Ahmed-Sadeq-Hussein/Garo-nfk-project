const fs = require('fs');
const path = require('path');

function sanitizeComponentName(name) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^[0-9]+/, '')
    .trim();
}

const TAG_COLUMNS = [
  "Garo",
  "Säkerhet",
  "Driftsäkerhet",
  "Installation",
  "användarvänligt",
  "Smarta funktioner",
  "Ekonomi"
];

const jsonDir = path.join(__dirname, 'resource json');
const outputDir = path.join(__dirname, 'Front_end/info-page/src/generated');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Clear tag folders
TAG_COLUMNS.forEach(tag => {
  const folder = path.join(outputDir, tag);
  if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true });
  fs.mkdirSync(folder, { recursive: true });
});

const routesRaw = fs.readFileSync(path.join(jsonDir, 'routes.json'));
const routesList = JSON.parse(routesRaw);
const tagCounts = {};
const tagRoutesMap = {};

// Create .js components and group them by tag
routesList.forEach(route => {
  const filePath = path.join(jsonDir, route.file);
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath);
  const data = JSON.parse(raw);

  const safeName = sanitizeComponentName(data.egenskap);
  const componentName = `${safeName}Page`;
  const componentFile = `${componentName}.js`;

  const fields = [
    { label: "Kundfördel", value: data.fordel },
    { label: "Tänkbar Nytta", value: data.nytta },
    { label: "Tänkbara Problem", value: data.problem },
    { label: "Anledning", value: data.anledning },
    { label: "Värde", value: data.cost },
    { label: "Beskrivning", value: data.beskrivning }
  ];

  const content = `
import React from 'react';
export const tags = ${JSON.stringify(data.tags || [])};

export default function ${componentName}() {
  const fields = ${JSON.stringify(fields)}.filter(f => f.value && f.value !== "Inget innehåll" && f.value !== "nan");

  return (
    <div>
      <h1>${data.egenskap}</h1>
      {fields.map((field, i) => <p key={i}><strong>{field.label}:</strong> {field.value}</p>)}
    </div>
  );
}`.trim();

  (data.tags || []).forEach(tag => {
    const tagFolder = path.join(outputDir, tag);
    fs.writeFileSync(path.join(tagFolder, componentFile), content, 'utf-8');
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;

    if (!tagRoutesMap[tag]) tagRoutesMap[tag] = [];
    if (data.egenskap === "Garo" && tag === "Garo") {
      tagRoutesMap[tag].unshift({ ...route, component: componentFile });
    } else {
      tagRoutesMap[tag].push({ ...route, component: componentFile });
    }
  });
});

// Write Routes.js for each tag
for (const tag of TAG_COLUMNS) {
  const routes = tagRoutesMap[tag] || [];
  const content = `const routes = ${JSON.stringify(routes, null, 2)};\n\nexport default routes;`;
  fs.writeFileSync(path.join(outputDir, tag, 'Routes.js'), content, 'utf-8');
}

// Write tagCounts.json
fs.writeFileSync(path.join(outputDir, 'tagCounts.json'), JSON.stringify(tagCounts, null, 2));

console.log("✅ All components and routes generated.");
