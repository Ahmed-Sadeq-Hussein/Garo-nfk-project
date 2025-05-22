import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TAG_COLORS from './tagColors';
import BRODTEXT from './generated/brodtext'; // 👈 Import here

export default function TagSlider() {
  const { id } = useParams();

  const components = {};
  try {
    const req = require.context('./generated', true, /\.js$/);
    req.keys().forEach((key) => {
      const match = key.match(new RegExp(`\\./${id}/(.+)\\.js$`));
      if (match) {
        const name = match[1];
        components[name] = req(key).default;
      }
    });
  } catch (e) {
    console.error("Failed to load components for", id, e);
  }

  let routes = [];
  try {
    routes = require(`./generated/${id}/Routes.js`).default;
  } catch (e) {
    console.error("Failed to load Routes.js for", id, e);
  }

  const borderColor = TAG_COLORS[id] || '#444';

  // Apply global body tint
  useEffect(() => {
    const previous = document.body.style.backgroundColor;
    document.body.style.backgroundColor = `${borderColor}10`;
    return () => {
      document.body.style.backgroundColor = previous;
    };
  }, [borderColor]);

  if (!routes || routes.length === 0) {
    return <div>🚫 Inga komponenter hittades för {id}</div>;
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2
          style={{
            display: 'inline-block',
            padding: '1.5rem 3rem',
            backgroundColor: borderColor,
            color: '#fff',
            borderRadius: '12px',
            fontSize: '2.5rem',
            fontWeight: '900',
            letterSpacing: '1px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          {id}
        </h2>

        {/* ✅ Show brödtext */}
        <p style={{
          maxWidth: '800px',
          margin: '1rem auto',
          fontSize: '1.3rem',
          color: '#444',
          fontStyle: 'italic'
        }}>
          {BRODTEXT[id] || 'Ingen brödtext tillgänglig för denna kategori.'}
        </p>
      </div>

      {routes.map((route, index) => {
        const Component = components[route.component.replace('.js', '')];
        if (!Component) return null;

        const isAlt = index % 2 !== 0;

        return (
          <div
            key={index}
            style={{
              backgroundColor: isAlt ? '#f3f3f3' : '#fff',
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              position: 'relative',
              left: '0',
            }}
          >
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem 1rem',
              }}
            >
              <Component />
            </div>
          </div>
        );
      })}
    </div>
  );
}
