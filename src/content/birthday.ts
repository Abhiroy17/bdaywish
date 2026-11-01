export interface Memory {
  title: string;
  caption: string;
  src?: string;
  alt?: string;
}

export interface BirthdayContent {
  name: string;
  sender: string;
  age: number;
  date: string;
  personality: { sign: string; mulank: number; traits: { title: string; note: string }[] };
  reasons: string[];
  memories: Memory[];
  letter: string[];
}

/** Personalize this file, then rebuild. Photo paths are relative to public/. */
export const birthdayContent: BirthdayContent = {
  name: 'Debarpita',
  sender: 'Abhijit',
  age: 28,
  date: '2026-11-02',
  // User-supplied identity and a poetic mood board, not a calculated sun sign or personality diagnosis.
  personality: {
    sign: 'Pisces', mulank: 2,
    traits: [
      { title: 'Your dreamy imagination', note: 'For the little worlds you dream up, the beauty you notice, and the possibilities you keep close. I’d love to explore them with you.' },
      { title: 'Your gentle heart', note: 'There is strength in caring deeply. I hope the love around you always feels as thoughtful and tender as the love you give.' },
      { title: 'Your thoughtful little gestures', note: 'A remembered detail. A little kindness. The quiet ways of saying “you matter.” Those are the things I never want to overlook.' },
      { title: 'Your quiet strength', note: 'Soft does not mean small. You can have a tender heart, brave dreams, and boundaries that deserve to be respected — all at once.' },
    ],
  },
  memories: [
    { title: 'The everyday magic', caption: 'A little space for a photo of us. Because ordinary days with you deserve a frame, too.' },
    { title: 'My favourite view', caption: 'A little space for your favourite photo. Of all the lovely things in this world, you are my favourite.' },
    { title: 'Somewhere, together', caption: 'A little space for an adventure. The destination is a bonus. You are the part I look forward to.' },
    { title: 'To all the next chapters', caption: 'A little space for a new memory. Here’s to the beautiful moments we haven’t met yet.' },
  ],
  reasons: [
    'Your imagination makes ordinary days feel full of possibility.',
    'Your smile is still my favourite plot twist.',
    'There is a softness in you that makes the world feel kinder.',
    'The thoughtful little details are part of what makes you so lovely.',
    'You make love feel like a place I can come home to.',
    'Even the quiet moments feel warm when I think of you.',
    'Your happiness matters to me in a thousand little ways.',
    'You deserve the same gentleness you give the world.',
    'There is nobody else I would rather write this chapter with.',
    'Your creative spark brings colour to the most ordinary corners of life.',
    'I love the person you are, not just the beautiful parts you show.',
    'You make the future feel like something to look forward to.',
    'Your dreams are worth cheering for. I’m in your front row.',
    'You don’t have to be perfect to be my favourite.',
    'I like the world a little more because you are in it.',
    'You are both the butterflies and the peaceful feeling afterwards.',
    'Loving you is my favourite kind of everyday magic.',
    'Your gentle heart deserves to feel safe, celebrated, and understood.',
    'You make a simple “hello” feel like the best part of a day.',
    'I want to celebrate all your little victories, too.',
    'The care behind your little gestures means more than any grand gesture.',
    'Your presence is a gift I never want to take for granted.',
    'I would choose your company over the most perfect plans.',
    'Your quiet strength and your big dreams can belong in the same beautiful heart.',
    'I love your dreamy side, and all the wonderfully real parts of you, too.',
    'You are someone worth showing up for, again and again.',
    'I’m grateful that, in this very big world, there is an us.',
    'Because you’re you, Debarpita. And that will always be enough.',
  ],
  letter: [
    'Happy 28th birthday, my love.',
    'If our lives were a series, you would be the part I’d never skip. Not just the big, beautiful moments, but the little in-between ones. The quiet scenes. The ordinary days that feel a little less ordinary because of you.',
    'I made this little corner of the internet for you because a simple birthday message didn’t feel quite big enough. I wanted you to have somewhere to come back to, whenever you need a reminder of how deeply you are loved.',
    'A little Pisces dreaming, a little Mulank 2 moonlight — that was the feeling I wanted to give this birthday episode. Soft, imaginative, full of care. But no sign or number could ever fit all of you inside it. It’s your particular kind of magic I’m celebrating: the thoughtful details, the tender heart, and the dreams that deserve room to grow.',
    'For this next chapter, I wish you soft mornings, brave beginnings, laughter that catches you by surprise, and the kind of happiness that doesn’t need a reason. I hope 28 brings you closer to the dreams you keep tucked in your heart.',
    'You never have to earn your place in my heart, or make your feelings smaller to be loved. I hope I can be a softer place to land, a patient listener, and someone who keeps noticing the little things. On the wonderful days, on the messy days, and on the days when nothing much happens at all — I’m so glad it’s you.',
    'Here’s to your next season. More joy. More adventures. More little moments that become everything. And, if I’m lucky, a whole lot more of us.',
    'Today is all about you. But loving you? That’s my favourite thing, every day.',
  ],
};

export function validateContent(content: BirthdayContent): void {
  const parsed = new Date(`${content.date}T12:00:00Z`);
  if (!content.name.trim() || !content.sender.trim() || !Number.isInteger(content.age) || content.age < 1
    || !/^\d{4}-\d{2}-\d{2}$/.test(content.date) || Number.isNaN(parsed.getTime())
    || parsed.toISOString().slice(0, 10) !== content.date
    || !content.personality.sign.trim() || !Number.isInteger(content.personality.mulank)
    || content.personality.mulank < 1 || content.personality.mulank > 9
    || !content.personality.traits.length || content.personality.traits.some((trait) => !trait.title.trim() || !trait.note.trim())
    || content.reasons.length !== content.age || content.reasons.some((reason) => !reason.trim())
    || !content.letter.length || content.letter.some((paragraph) => !paragraph.trim())
    || !content.memories.length || content.memories.some((memory) => !memory.title || !memory.caption || (memory.src && !memory.alt))) {
    throw new Error('Check birthday names, date, age, personality notes, reasons, letter and photo descriptions.');
  }
}