import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App.tsx';
import { validateContent, type BirthdayContent } from './content/birthday.ts';

export function renderPage(content: BirthdayContent, base = '/'): string {
  validateContent(content);
  return renderToString(createElement(App, { content, base }));
}