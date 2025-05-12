import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import tagCounts from './generated/tagCounts.json';
import TAG_COLORS from './tagColors';

const SectionPie = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const chartData = Object.entries(tagCounts).map(([name, value]) => ({
      name,
      value,
      color: TAG_COLORS[name] || '#cccccc'
    }));
    setData(chartData);
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
            onClick={handleClick}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className="legend">
        {data.map((entry, index) => (
          <span key={index} style={{ color: entry.color, marginRight: '1rem', fontSize: '2rem' }}>
            ● {entry.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SectionPie;
