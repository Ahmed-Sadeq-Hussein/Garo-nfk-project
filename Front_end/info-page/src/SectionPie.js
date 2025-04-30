// src/SectionPie.js
import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#667799'];

const sectionLabels = {
  "1": "1. GARO",
  "2": "🔧 2. Installation & Setup",
  "3": "🌐 3. Kommunikation & Smart Funktionalitet",
  "4": "⚙️ 4. Hårdvara & Elektronik",
  "5": "✅ 5. Säkerhet & Efterlevnad",
  "6": "🏭 6. Tillverkning & Organisation"
};

const data = Object.entries(sectionLabels).map(([key, label]) => ({
  name: label,
  section: key,
  value: 1 // or count of features per section
}));

export default function SectionPie() {
  const navigate = useNavigate();

  const handleClick = (entry) => {
    const sectionId = entry.payload.section;
    navigate(`/section/${sectionId}`);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>📊 Välj en Sektion</h2>
      <PieChart width={500} height={350}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          innerRadius={60}
          paddingAngle={5}
          label
          onClick={handleClick}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              cursor="pointer"
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}
