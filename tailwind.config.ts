import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: [
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          '"Songti SC"',
          'Georgia',
          'serif',
        ],
        serif: [
          '"LXGW WenKai Screen"',
          '"LXGW WenKai"',
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          '"Songti SC"',
          'Georgia',
          'serif',
        ],
        sans: [
          '"Inter"',
          '-apple-system',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#1a1a1a',
          soft: '#2a2a2a',
          muted: '#5a5a5a',
          faint: '#9a9a9a',
        },
        paper: {
          DEFAULT: '#fdfcf8',
          warm: '#f5f1e8',
          sepia: '#ebe4d1',
          line: '#e5ddc7',
        },
        accent: {
          DEFAULT: '#a8321e',
          soft: '#c44f38',
        },
      },
      maxWidth: {
        prose: '42rem',
        reading: '46rem',
      },
      spacing: {
        '18': '4.5rem',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': '#2a2a2a',
            '--tw-prose-headings': '#1a1a1a',
            '--tw-prose-links': '#a8321e',
            '--tw-prose-bold': '#1a1a1a',
            '--tw-prose-quotes': '#5a5a5a',
            '--tw-prose-quote-borders': '#a8321e',
            fontFamily:
              '"LXGW WenKai Screen", "Noto Serif SC", "Source Han Serif SC", "Songti SC", Georgia, serif',
            fontSize: '1.125rem',
            lineHeight: '1.9',
            letterSpacing: '0.01em',
            p: { textIndent: '2em', marginTop: '0.5em', marginBottom: '0.5em' },
            'h1, h2, h3': {
              fontFamily: '"Noto Serif SC", "Source Han Serif SC", Georgia, serif',
              letterSpacing: '-0.01em',
            },
            blockquote: {
              fontStyle: 'normal',
              fontFamily: '"Noto Serif SC", Georgia, serif',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
