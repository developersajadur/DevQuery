/** @type {import('tailwindcss').Config} */
import flowbite from "flowbite-react/tailwind";

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      keyframes: {
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)' },
        },
        scaleDown: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.8)' },
          '100%': { transform: 'scale(1)' },
        },
        burst: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.5)', opacity: 0.7 },
          '100%': { transform: 'scale(2)', opacity: 0 },
        },
      },
      animation: {
        scaleUp: 'scaleUp 0.3s ease-in-out',
        scaleDown: 'scaleDown 0.3s ease-in-out',
        burst: 'burst 0.5s ease-out',
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
};
