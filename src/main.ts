import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-500-italic.css';
import '@fontsource/caveat/latin-400.css';
import './styles/theme.css';
import './styles/scenes.css';
import './styles/interactions.css';
import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { App } from './App';
import { birthdayContent } from './content/birthday';

const root = hydrateRoot(document.getElementById('app')!, createElement(App, { content: birthdayContent, base: './' }));
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());