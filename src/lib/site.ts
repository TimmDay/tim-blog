// Everything a visitor or a machine needs to know about the author lives here.

export const site = {
  url: 'https://timmday.com',
  /** The visible wordmark in the header. */
  wordmark: 'timmday',
  /** The name used anywhere a machine reads it: titles, metadata, structured data. */
  author: 'Tim Day',
  description:
    'Tim Day on AI progress, the software engineering industry, society, and leading engineering teams through the transition.',
  locale: 'en-AU',
};

export type ProfileLink = { label: string; href: string };

// TODO(tim): replace with your real LinkedIn profile URL.
export const profileLinks: ProfileLink[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/REPLACE-ME' },
  { label: 'GitHub', href: 'https://github.com/TimmDay' },
];

export type CvVariant = { role: string; href: string };

// Filenames are stable: replace a PDF in place so links already shared keep working.
export const cvVariants: CvVariant[] = [
  { role: 'Engineering Manager', href: '/cv/tim-day-engineering-manager.pdf' },
  { role: 'AI Consultant', href: '/cv/tim-day-ai-consultant.pdf' },
];
