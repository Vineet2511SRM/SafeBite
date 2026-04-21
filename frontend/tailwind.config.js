/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0D9488",
                "primary-dark": "#0F766E",
                "primary-light": "#CCFBF1",
                "primary-ultra-light": "#F0FDFA",
                accent: "#115E59",
                success: "#16A34A",
                "success-light": "#DCFCE7",
                danger: "#DC2626",
            },
        },
    },
    plugins: [],
}
