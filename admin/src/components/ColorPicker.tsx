import { cn } from '@/lib/utils';
import { useThemeColor, ThemeColor, THEME_COLOR_MAP } from '@/contexts/ThemeColorContext';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  value?: ThemeColor;
  onChange?: (color: ThemeColor) => void;
  disabled?: boolean;
}

export const ColorPicker = ({ value, onChange, disabled = false }: ColorPickerProps) => {
  const { themeColor, setThemeColor } = useThemeColor();
  const activeColor = value || themeColor;

  const handleClick = (name: ThemeColor) => {
    if (disabled) return;
    setThemeColor(name);
    onChange?.(name);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {(Object.keys(THEME_COLOR_MAP) as ThemeColor[]).map((name) => {
        const config = THEME_COLOR_MAP[name];
        const isSelected = activeColor === name;

        return (
          <button
            key={name}
            type="button"
            disabled={disabled}
            onClick={() => handleClick(name)}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer select-none',
              'hover:scale-110 hover:shadow-lg',
              'ring-2 ring-offset-2 ring-offset-background',
              disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
              isSelected
                ? 'ring-foreground scale-105 shadow-md'
                : 'ring-transparent hover:ring-muted-foreground/50'
            )}
            style={{ backgroundColor: config.hex }}
            title={config.label}
          >
            {isSelected && (
              <Check className="h-5 w-5 text-white drop-shadow-md" />
            )}
          </button>
        );
      })}
    </div>
  );
};
