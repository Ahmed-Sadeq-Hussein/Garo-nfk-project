import React from 'react';
import { useParams } from 'react-router-dom';

export default function TagSlider() {
  const { id } = useParams();
  const folder = `./generated/${id}`;

  // Use Webpack-compatible require.context
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

  // Try loading Routes.js for that tag
  let routes = [];
  try {
    routes = require(`./generated/${id}/Routes.js`).default;
  } catch (e) {
    console.error("Failed to load Routes.js for", id, e);
  }

  if (!routes || routes.length === 0) {
    return <div>🚫 Inga komponenter hittades för {id}</div>;
  }

  return (
    <div>
      <h2>{id}</h2>
      {routes.map((route, index) => {
        const Component = components[route.component.replace('.js', '')];
        return Component ? <Component key={index} /> : null;
      })}
    </div>
  );
}
