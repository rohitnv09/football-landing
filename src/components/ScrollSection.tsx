import type { ReactNode } from "react";
import { ColorPicker } from "./ColorPicker";
import type { ThemeName } from "../types";

type ScrollSectionProps = {
  align: number;
  body?: string;
  finalCta?: boolean;
  hasThemePicker?: boolean;
  onThemeChange: (theme: ThemeName) => void;
  radF: number;
  short?: boolean;
  side: "left" | "right" | "center";
  activeTheme: ThemeName;
  title: ReactNode;
};

export function ScrollSection({
  activeTheme,
  align,
  body,
  finalCta = false,
  hasThemePicker = false,
  onThemeChange,
  radF,
  short = false,
  side,
  title,
}: ScrollSectionProps) {
  return (
    <section
      className={`scroll-section ${short ? "short" : ""} section-${side}`}
      data-align={align}
      data-radf={radF}
      id={side === "left" && hasThemePicker ? "top" : undefined}
    >
      <div className="section-copy">
        <h1 className={`title-huge gradient-text ${finalCta ? "final-title" : ""}`}>
          {title}
        </h1>
        {body && <p className="subtitle">{body}</p>}
        {hasThemePicker && (
          <ColorPicker activeTheme={activeTheme} onThemeChange={onThemeChange} />
        )}
        {finalCta && (
          <div className="final-action" id="pre-order">
            <a className="cta-btn final-cta" href="#pre-order">
              SECURE YOURS NOW
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
