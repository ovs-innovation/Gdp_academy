import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeColor =
  | 'gdp'
  | 'sky'
  | 'violet'
  | 'emerald'
  | 'rose'
  | 'amber'
  | 'orange'
  | 'teal'
  | 'pink'
  | 'indigo'
  | 'cyan'
  | 'lime'
  | 'red';

export interface ThemeColorConfig {
  label: string;
  hex: string;
  lightHsl: string;
  darkHsl: string;
  gradient: string;
}

export const THEME_COLOR_MAP: Record<ThemeColor, ThemeColorConfig> = {
  gdp: {
    label: 'GDP Purple',
    hex: '#634BFA',
    lightHsl: '252 95% 64%',
    darkHsl: '252 95% 64%',
    gradient: 'linear-gradient(135deg, hsl(252 95% 64%), hsl(174 100% 55%))',
  },
  sky: {
    label: 'Sky Blue',
    hex: '#0284c7',
    lightHsl: '199 89% 48%',
    darkHsl: '199 89% 48%',
    gradient: 'linear-gradient(135deg, hsl(199 89% 48%), hsl(210 95% 60%))',
  },
  violet: {
    label: 'Violet',
    hex: '#8b5cf6',
    lightHsl: '262 83% 58%',
    darkHsl: '270 76% 66%',
    gradient: 'linear-gradient(135deg, hsl(270 76% 66%), hsl(290 85% 65%))',
  },
  emerald: {
    label: 'Emerald',
    hex: '#10b981',
    lightHsl: '158 64% 42%',
    darkHsl: '160 84% 45%',
    gradient: 'linear-gradient(135deg, hsl(160 84% 45%), hsl(140 75% 50%))',
  },
  rose: {
    label: 'Rose',
    hex: '#f43f5e',
    lightHsl: '346 77% 50%',
    darkHsl: '349 89% 65%',
    gradient: 'linear-gradient(135deg, hsl(349 89% 65%), hsl(330 85% 65%))',
  },
  amber: {
    label: 'Amber',
    hex: '#f59e0b',
    lightHsl: '38 92% 50%',
    darkHsl: '43 96% 56%',
    gradient: 'linear-gradient(135deg, hsl(43 96% 56%), hsl(30 95% 55%))',
  },
  orange: {
    label: 'Orange',
    hex: '#f97316',
    lightHsl: '24 95% 53%',
    darkHsl: '27 96% 61%',
    gradient: 'linear-gradient(135deg, hsl(27 96% 61%), hsl(15 95% 60%))',
  },
  teal: {
    label: 'Teal',
    hex: '#14b8a6',
    lightHsl: '168 76% 42%',
    darkHsl: '170 80% 50%',
    gradient: 'linear-gradient(135deg, hsl(170 80% 50%), hsl(185 85% 50%))',
  },
  pink: {
    label: 'Pink',
    hex: '#ec4899',
    lightHsl: '330 81% 60%',
    darkHsl: '330 85% 68%',
    gradient: 'linear-gradient(135deg, hsl(330 85% 68%), hsl(310 80% 65%))',
  },
  indigo: {
    label: 'Indigo',
    hex: '#6366f1',
    lightHsl: '239 84% 67%',
    darkHsl: '239 90% 74%',
    gradient: 'linear-gradient(135deg, hsl(239 90% 74%), hsl(255 85% 70%))',
  },
  cyan: {
    label: 'Cyan',
    hex: '#06b6d4',
    lightHsl: '188 94% 43%',
    darkHsl: '185 96% 48%',
    gradient: 'linear-gradient(135deg, hsl(185 96% 48%), hsl(170 95% 50%))',
  },
  lime: {
    label: 'Lime',
    hex: '#84cc16',
    lightHsl: '84 81% 44%',
    darkHsl: '82 85% 52%',
    gradient: 'linear-gradient(135deg, hsl(82 85% 52%), hsl(100 85% 50%))',
  },
  red: {
    label: 'Red',
    hex: '#ef4444',
    lightHsl: '0 72% 51%',
    darkHsl: '0 84% 60%',
    gradient: 'linear-gradient(135deg, hsl(0 84% 60%), hsl(15 90% 58%))',
  },
};

export const resolveThemeColor = (input?: string | null): ThemeColor => {
  if (!input) return 'gdp';
  const clean = input.toLowerCase().trim();
  if (clean in THEME_COLOR_MAP) return clean as ThemeColor;
  if (clean === '#634bfa' || clean === 'purple') return 'gdp';
  if (clean === '#1a73e8' || clean === '#0284c7' || clean === 'blue') return 'sky';
  if (clean === '#06b6d4') return 'cyan';
  if (clean === '#8b5cf6') return 'violet';
  if (clean === '#10b981') return 'emerald';
  if (clean === '#f43f5e') return 'rose';
  if (clean === '#f59e0b') return 'amber';
  if (clean === '#f97316') return 'orange';
  if (clean === '#14b8a6') return 'teal';
  if (clean === '#ec4899') return 'pink';
  if (clean === '#6366f1') return 'indigo';
  if (clean === '#84cc16') return 'lime';
  if (clean === '#ef4444') return 'red';
  return 'gdp';
};

interface ThemeColorContextType {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

export const ThemeColorProvider = ({ children }: { children: ReactNode }) => {
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    const stored = localStorage.getItem('theme-color');
    return resolveThemeColor(stored);
  });

  const applyColors = (color: ThemeColor) => {
    const config = THEME_COLOR_MAP[color] || THEME_COLOR_MAP.gdp;
    const isDark = document.documentElement.classList.contains('dark');
    const colorValue = isDark ? config.darkHsl : config.lightHsl;

    document.documentElement.style.setProperty('--primary', colorValue);
    document.documentElement.style.setProperty('--ring', colorValue);
    document.documentElement.style.setProperty('--sidebar-primary', colorValue);
    document.documentElement.style.setProperty('--sidebar-ring', colorValue);
    document.documentElement.style.setProperty('--button-primary', colorValue);
    document.documentElement.style.setProperty('--accent', colorValue);
    document.documentElement.style.setProperty('--gradient-primary', config.gradient);
    document.documentElement.style.setProperty('--shadow-glow', `0 0 24px hsl(${colorValue} / 0.3)`);
    document.documentElement.style.setProperty('--gradient-glow', `radial-gradient(ellipse at top, hsl(${colorValue} / 0.2), transparent 50%)`);
  };

  const setThemeColor = (color: ThemeColor) => {
    const validColor = resolveThemeColor(color);
    setThemeColorState(validColor);
    localStorage.setItem('theme-color', validColor);
    localStorage.setItem('button-color', validColor);
    applyColors(validColor);
  };

  useEffect(() => {
    applyColors(themeColor);

    const observer = new MutationObserver(() => {
      applyColors(themeColor);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [themeColor]);

  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
};

export const useThemeColor = () => {
  const context = useContext(ThemeColorContext);
  if (!context) {
    throw new Error('useThemeColor must be used within ThemeColorProvider');
  }
  return context;
};
