import { themes } from "../data/content";
import type { ThemeName } from "../types";

type ColorPickerProps = {
  activeTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
};

export function ColorPicker({ activeTheme, onThemeChange }: ColorPickerProps) {
  return (
    <div className="color-picker" aria-label="Ball color theme">
      {themes.map((theme) => (
        <button
          aria-label={theme.label}
          className={`color-btn btn-${theme.name} ${
            activeTheme === theme.name ? "active" : ""
          }`}
          key={theme.name}
          onClick={() => onThemeChange(theme.name)}
          type="button"
        />
      ))}
    </div>
  );
}
