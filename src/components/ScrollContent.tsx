import { sections, separators } from "../data/content";
import type { ThemeName } from "../types";
import { ScrollSection } from "./ScrollSection";
import { Separator } from "./Separator";

type ScrollContentProps = {
  activeTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
};

export function ScrollContent({
  activeTheme,
  onThemeChange,
}: ScrollContentProps) {
  return (
    <main id="content-layer">
      {sections.map((section, index) => (
        <div key={`${section.align}-${section.radF}-${index}`}>
          <ScrollSection
            activeTheme={activeTheme}
            onThemeChange={onThemeChange}
            {...section}
          />
          {index < separators.length && (
            <Separator {...separators[index]} />
          )}
          {index === sections.length - 2 && <div className="pre-final-spacer" />}
        </div>
      ))}
    </main>
  );
}
