import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Dark theme colors matching the reference design
                dark: {
                    bg: '#0f0f1a',
                    card: '#1a1a2e',
                    'card-hover': '#252540',
                    border: '#2a2a45',
                },
                accent: {
                    lime: '#c8ff00',
                    coral: '#ff6b6b',
                    pink: '#ff00ff',
                    teal: '#00ffd5',
                    purple: '#b388ff',
                },
            },
            backgroundImage: {
                'gradient-card-teal': 'linear-gradient(135deg, rgba(0,80,80,0.3) 0%, rgba(0,40,60,0.5) 100%)',
                'gradient-card-purple': 'linear-gradient(135deg, rgba(60,20,80,0.3) 0%, rgba(30,10,50,0.5) 100%)',
                'gradient-card-blue': 'linear-gradient(135deg, rgba(20,40,80,0.3) 0%, rgba(10,25,60,0.5) 100%)',
                'gradient-card-green': 'linear-gradient(135deg, rgba(20,80,40,0.3) 0%, rgba(10,50,30,0.5) 100%)',
            },
            boxShadow: {
                'glow-lime': '0 0 20px rgba(200, 255, 0, 0.3)',
                'glow-teal': '0 0 20px rgba(0, 255, 213, 0.3)',
                'glow-purple': '0 0 20px rgba(179, 136, 255, 0.3)',
            },
        },
    },
    plugins: [],
}
export default config
