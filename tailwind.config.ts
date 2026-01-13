import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        md: "2rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          light: "hsl(var(--secondary-light))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          light: "hsl(var(--success-light))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
          light: "hsl(var(--warning-light))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
          light: "hsl(var(--destructive-light))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius)",
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        xl: "2rem",
        "2xl": "2.5rem",
        "3xl": "3rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "fluid-xs": ["clamp(0.75rem, 2vw, 0.875rem)", "1rem"],
        "fluid-sm": ["clamp(0.8rem, 2vw, 0.9rem)", "1.25rem"],
        "fluid-base": ["clamp(1rem, 2.5vw, 1.1rem)", "1.5rem"],
        "fluid-lg": ["clamp(1.2rem, 3vw, 1.4rem)", "1.75rem"],
        "fluid-xl": ["clamp(1.5rem, 4vw, 2rem)", "2rem"],
        "fluid-2xl": ["clamp(2rem, 5vw, 2.5rem)", "2.5rem"],
        "fluid-3xl": ["clamp(2rem, 6vw, 2.5rem)", "3rem"],
        "fluid-4xl": ["clamp(2.5rem, 7vw, 3rem)", "3.5rem"],
      },
      spacing: {
        "fluid-xs": "clamp(0.5rem, 1.5vw, 0.75rem)",
        "fluid-sm": "clamp(0.75rem, 2vw, 1rem)",
        "fluid-md": "clamp(1rem, 2.5vw, 1.5rem)",
        "fluid-lg": "clamp(1.5rem, 3vw, 2rem)",
        "fluid-xl": "clamp(2rem, 4vw, 3rem)",
        "fluid-2xl": "clamp(3rem, 5vw, 4rem)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "screen-header": "4rem",
      },
      maxWidth: {
        content: "640px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-up": {
          from: { opacity: "0", transform: "translateY(100%)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "stagger-in": {
          from: { opacity: "0", transform: "translateY(1rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "score-ring": {
          from: { "stroke-dashoffset": "251.2" },
          to: { "stroke-dashoffset": "calc(251.2 - (251.2 * var(--score)) / 100)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-up": "slide-in-up 0.3s ease-out",
        "fade-in-scale": "fade-in-scale 0.2s ease-out",
        "stagger-in": "stagger-in 0.4s ease-out forwards",
        "score-ring": "score-ring 1s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
