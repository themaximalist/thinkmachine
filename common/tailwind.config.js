/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          50: "#faf4ff",
          100: "#f3e7ff",
          200: "#e9d2ff",
          300: "#d8afff",
          400: "#c07cff",
          500: "#a74bff",
          600: "#9327f6",
          700: "#7e17d9",
          800: "#6e19b5",
          900: "#59158e",
          950: "#3c016a",
        },
        red: {
          50: "#fff0f3",
          100: "#ffe2e7",
          200: "#ffc9d5",
          300: "#ff9db4",
          400: "#ff678d",
          500: "#ff326a",
          600: "#e80e54",
          700: "#cb0549",
          800: "#a90844",
          900: "#910a42",
          950: "#51001f",
        },
        orange: {
          50: "#fff8ec",
          100: "#fff0d3",
          200: "#ffdda5",
          300: "#ffc46d",
          400: "#ff9e32",
          500: "#ff810a",
          600: "#fa6600",
          700: "#cc4a02",
          800: "#a13a0b",
          900: "#82320c",
          950: "#461604",
        },
        blue: {
          50: "#f0f8ff",
          100: "#e1effd",
          200: "#bbe0fc",
          300: "#7fc7fa",
          400: "#3cabf4",
          500: "#128fe5",
          600: "#0678cf",
          700: "#065a9e",
          800: "#094d83",
          900: "#0e416c",
          950: "#092948",
        },
        pink: {
          50: "#fff2fc",
          100: "#ffe4fa",
          200: "#ffc7f3",
          300: "#ff9ce6",
          400: "#ff61d5",
          500: "#ff26cd",
          600: "#f405c7",
          700: "#d900ac",
          800: "#a50381",
          900: "#860968",
          950: "#5c0046",
        },
        white: "#F7F8F8",
        gray: {
          50: "#f5f6f6",
          100: "#e6e7e7",
          200: "#cfd1d2",
          300: "#adb1b3",
          400: "#84898c",
          500: "#696e71",
          600: "#585c5f",
          700: "#4c5052",
          800: "#434547",
          900: "#3b3c3e",
          950: "#252727",
          1000: "#1A1A1A",
        },
        black: "#020304",
      },
      screens: {
        "3xl": "1800px",
        "4xl": "2000px",
      },
    },
  },
  plugins: [],
};
