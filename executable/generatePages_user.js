const fs = require('fs');
const path = require('path');

// === Config ===
const TAG_COLUMNS = [
  "Garo",
  "Säkerhet",
  "Driftsäkerhet",
  "Installation",
  "Användarvänlighet",
  "Smarta funktioner",
  "Ekonomi"
];

const jsonDir = path.join(__dirname, 'resource json');
const outputDir = path.join(__dirname, 'Front_end/info-page/src/generated');

function sanitizeComponentName(name) {
  return name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^[0-9]+/, '')
    .trim();
}

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

TAG_COLUMNS.forEach(tag => {
  const folder = path.join(outputDir, tag);
  if (fs.existsSync(folder)) fs.rmSync(folder, { recursive: true });
  fs.mkdirSync(folder, { recursive: true });
});

const routesRaw = fs.readFileSync(path.join(jsonDir, 'routes.json'));
const routesList = JSON.parse(routesRaw);
const tagCounts = {};
const tagRoutesMap = {};
const usedTags = new Set();

routesList.forEach(route => {
  const filePath = path.join(jsonDir, route.file);
  if (!fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath);
  const data = JSON.parse(raw);

  const safeName = sanitizeComponentName(data.egenskap || 'Unnamed');
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
      {fields.map((field, i) => (
        <p key={i}><strong>{field.label}:</strong> {field.value}</p>
      ))}

      ${data.reference && data.reference !== "nan"
        ? `<p><strong>Läs mer här:</strong> <a href="${data.reference}" target="_blank" rel="noopener noreferrer">${data.reference}</a></p>`
        : ""}
    </div>
  );
}`.trim();

  (data.tags || []).forEach(tag => {
    if (!TAG_COLUMNS.includes(tag)) return;

    usedTags.add(tag);
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

TAG_COLUMNS.forEach(tag => {
  const routes = tagRoutesMap[tag] || [];
  const content = `const routes = ${JSON.stringify(routes, null, 2)};\n\nexport default routes;`;
  fs.writeFileSync(path.join(outputDir, tag, 'Routes.js'), content, 'utf-8');
});

fs.writeFileSync(path.join(outputDir, 'tagCounts.json'), JSON.stringify(tagCounts, null, 2));

// === Brödtext support ===
const brodtextPath = path.join(__dirname, 'Python', 'Resource folder', 'brödtext.txt');
const brodtextOutput = path.join(outputDir, 'brodtext.js');

const brodRaw = fs.readFileSync(brodtextPath, 'utf-8');
const brodMap = {};
brodRaw.split(/\r?\n/).forEach(line => {
  const [key, ...rest] = line.split(':');
  if (!key || rest.length === 0) return;
  brodMap[key.trim()] = rest.join(':').trim();
});

const brodJS = 'const BRODTEXT = ' + JSON.stringify(brodMap, null, 2) + ';\n\nexport default BRODTEXT;';
fs.writeFileSync(brodtextOutput, brodJS, 'utf-8');

console.log("\u2705 All components and routes generated.");
console.log("\ud83e\udde9 Tags used in actual data:", Array.from(usedTags));
const missingTags = TAG_COLUMNS.filter(tag => !usedTags.has(tag));
if (missingTags.length) {
  console.warn("\u26a0\ufe0f Tags in TAG_COLUMNS but not found in any data:", missingTags);
}

