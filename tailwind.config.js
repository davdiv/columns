import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
