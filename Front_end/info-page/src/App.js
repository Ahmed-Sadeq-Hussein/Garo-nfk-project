import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

import routes from './generated/Routes';

// Dynamically require all generated components
const context = require.context('./generated', false, /\.js$/);

function App() {
  return (
    <div>
      <h1 style={{ padding: '1rem' }}>📦 Features</h1>

      <Splide options={{ type: 'slide', perPage: 1, gap: '1rem' }}>
        {routes.map((route, index) => {
          // Get the corresponding component file using the filename
          const safeComponentName = route.file.replace(/\.json$/, 'Page.js');
          let FeatureComponent = () => <div>⚠️ Component not found</div>;

          try {
            const mod = context(`./${safeComponentName}`);
            FeatureComponent = mod.default;
          } catch (err) {
            console.warn(`Missing component for ${route.file}`, err);
          }

          return (
            <SplideSlide key={index}>
              <div style={{ padding: '1rem' }}>
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
