import { ColorPicker } from "./ColorPicker";
import type { ThemeName } from "../types";

type NavigationProps = {
  activeTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
};

export function Navigation({ activeTheme, onThemeChange }: NavigationProps) {
  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <a className="logo" href="#top" aria-label="Kinetic home">
        KINETIC
      </a>
      <div className="nav-theme-picker">
        <ColorPicker activeTheme={activeTheme} onThemeChange={onThemeChange} />
      </div>
      <a className="cta-btn nav-cta" href="#pre-order">
        PRE-ORDER
      </a>
    </nav>
  );
}
