import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#FFCF59',
          500: '#FFCF59',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
