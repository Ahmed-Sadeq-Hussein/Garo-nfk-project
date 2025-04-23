import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import './theme.css';

import routes from './generated/Routes';

// 🔁 Dynamically load all generated components
const context = require.context('./generated', false, /\.js$/);

// 🎯 Section labels with emojis
const sectionLabels = {
  "1": "1. GARO",
  "2": "🔧 2. Installation & Setup",
  "3": "🌐 3.   Kommunikation & Smart Funktionalitet",
  "4": "⚙️ 4. Hårdvara & Elektronik",
  "5": "✅ 5. Säkerhet & Efterlevnad",
  "6": "🏭 6. Tillverkning & Organisation"
};

function App() {
  return (
    <div>
      <h1 style={{ padding: '1rem' }}>📦 Features</h1>

      <Splide options={{ type: 'slide', perPage: 1, gap: '1rem' }}>
        {routes.map((route, index) => {
          const componentFile = `./${route.component}`;
          let FeatureComponent = () => <div>⚠️ Component not found</div>;

          try {
            const mod = context(componentFile);
            FeatureComponent = mod.default;
          } catch (err) {
            console.warn(`Missing component for ${route.file}`, err);
          }

          const sectionTitle = sectionLabels[route.section] || "📦 Funktion";

          return (
            <SplideSlide key={index}>
              <div className="feature-slide">
                <div className="section-banner">{sectionTitle}</div>
                <FeatureComponent />
              </div>
            </SplideSlide>
          );
        })}
      </Splide>
    </div>
  );
}

export default App;
