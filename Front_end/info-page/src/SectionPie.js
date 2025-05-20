import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import tagCounts from './generated/tagCounts.json';
import TAG_COLORS from './tagColors';

// 🟢 Your custom display order
const DISPLAY_ORDER = [
  "Garo",
  "Installation",
  "Användarvänlighet",
  "Driftsäkerhet",
  "Smarta funktioner",
  "Ekonomi",
  "Säkerhet"
];

const SectionPie = () => {
  const [data, setData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const rawData = Object.entries(tagCounts).map(([name, value]) => ({
      name,
      value,
      color: TAG_COLORS[name] || '#cccccc'
    }));

    // 🔃 Sort using the DISPLAY_ORDER
    const orderedData = DISPLAY_ORDER
      .map(name => rawData.find(entry => entry.name === name))
      .filter(Boolean); // skip undefined ones

    setData(orderedData);
  }, []);

  const handleClick = (entry) => {
    if (entry && entry.payload?.name) {
      navigate(`/section/${entry.payload.name}`);
    }
  };

  return (
    <div className="section-container">
      <img src="/garo-logo-red.png" alt="Garo Logo" className="garo-logo" />

      <h2 className="title">Detta är en informations hemsida för er som vill gärna läsa mer om</h2>
      <h2 className="title">Välj en Sektion</h2>

      <div className="chart-wrapper">
        <PieChart width={600} height={600}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={300}
            startAngle={90}
            endAngle={-270}  // <- Makes it go clockwise
            onClick={handleClick}
            onMouseLeave={() => setHovered(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                opacity={hovered && hovered !== entry.name ? 0.5 : 1}
                onMouseEnter={() => setHovered(entry.name)}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className="legend">
        {data.map((entry, index) => {
          const isHovered = hovered === entry.name;
          const style = {
            color: isHovered ? '#fff' : entry.color,
            backgroundColor: isHovered ? entry.color : 'transparent',
            marginRight: '1rem',
            padding: '0.3rem 0.8rem',
            fontSize: '2rem',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
          };
          return (
            <span key={index} style={style}>
              ● {entry.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SectionPie;
