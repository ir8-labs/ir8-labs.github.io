/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ir8-black': '#000000',
                'ir8-white': '#FFFFFF',
                'ir8-gray': '#333333',
                'ir8-gray-dark': '#1a1a1a',
                'ir8-gray-mid': '#666666',
            },
            fontFamily: {
                'mono': ['JetBrains Mono', 'Geist Mono', 'monospace'],
                'display': ['Inter', 'sans-serif'],
                'headline': ['Oswald', 'sans-serif'],
            },
            borderRadius: {
                'none': '0px',
            },
        },
    },
    plugins: [],
}
