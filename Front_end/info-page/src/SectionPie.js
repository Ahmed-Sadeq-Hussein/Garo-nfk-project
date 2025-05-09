import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import tagCounts from './generated/tagCounts.json';

const COLORS = [
  '#1f77b4', '#ff5733', '#ffc107', '#28a745',
  '#c71585', '#17a2b8', '#dc3545'
];

const SectionPie = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const chartData = Object.entries(tagCounts).map(([name, value], i) => ({
      name,
      value,
      color: COLORS[i % COLORS.length]
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

      <h2 className="title">Välj en Sektion</h2>
      <div className="chart-wrapper">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
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
          <span key={index} style={{ color: entry.color, marginRight: '1rem' }}>
            ● {entry.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SectionPie;
