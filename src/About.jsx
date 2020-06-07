import React from 'react';
import store from './store.js';

export default function About() {
  return (
    <div className="text-center">
      <h3>Issue tracker App</h3>
      <h4>{store.initialData ? store.initialData : 'Unknown'}</h4>
    </div>
  );
}
