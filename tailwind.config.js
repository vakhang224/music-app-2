/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        one: "#3d3d3d",
        two: "#171414",
        three: "#ff9a68"
      },
    },
  },
  plugins: [],
}