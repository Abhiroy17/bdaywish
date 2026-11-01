import { describe, expect, it } from 'vitest';
import { birthdayContent, validateContent } from '../../src/content/birthday';
import { renderPage } from '../../src/render';

describe('birthday content', () => {
  it('contains the personalized occasion and 28 distinct reasons', () => {
    expect(birthdayContent.name).toBe('Debarpita');
    expect(birthdayContent.sender).toBe('Abhijit');
    expect(birthdayContent.age).toBe(28);
    expect(new Set(birthdayContent.reasons).size).toBe(28);
    expect(() => validateContent(birthdayContent)).not.toThrow();
  });
  it('rejects missing fields, invalid dates, mismatched reasons and inaccessible photos', () => {
    for (const change of [
      { name: '' }, { sender: '' }, { age: 0 }, { date: 'not-a-date' },
      { date: '2026-02-31' }, { reasons: ['one'] }, { letter: [] },
      ...[
        { sign: '' }, { mulank: 0 }, { mulank: 10 }, { mulank: 1.5 }, { traits: [] },
        { traits: [{ title: '', note: 'A note' }] }, { traits: [{ title: 'A trait', note: ' ' }] },
      ].map((personality) => ({ personality: { ...birthdayContent.personality, ...personality } })),
      { memories: [{ title: 'Photo', caption: 'Caption', src: 'x.jpg', alt: '' }] },
    ]) {
      expect(() => validateContent({ ...birthdayContent, ...change })).toThrow();
    }
  });
  it('renders every chapter and letter without needing JavaScript', () => {
    document.body.innerHTML = renderPage(birthdayContent, '/birthday/');
    expect(document.querySelectorAll('main > section')).toHaveLength(7);
    expect(document.querySelectorAll('.reason')).toHaveLength(28);
    expect(document.querySelector('#letter')?.textContent).toContain(birthdayContent.letter[0]);
    expect(document.querySelectorAll('.memory')).toHaveLength(4);
  });
  it('escapes editable content and prefixes local images for subpath hosting', () => {
    const html = renderPage({ ...birthdayContent, name: '<img onerror=bad>',
      memories: [{ title: 'Us', caption: 'Love', src: 'images/us.jpg', alt: 'Us together' }],
    }, '/birthday/');
    expect(html).toContain('src="/birthday/images/us.jpg"');
    expect(html).not.toContain('<img onerror');
    expect(html).toContain('&lt;img onerror=bad&gt;');
  });
});