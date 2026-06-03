import { sections, separators } from "../data/content";
import { ScrollSection } from "./ScrollSection";
import { Separator } from "./Separator";

export function ScrollContent() {
  return (
    <main id="content-layer">
      {sections.map((section, index) => (
        <div key={`${section.align}-${section.radF}-${index}`}>
          <ScrollSection {...section} />
          {index < separators.length && (
            <Separator {...separators[index]} />
          )}
          {index === sections.length - 2 && <div className="pre-final-spacer" />}
        </div>
      ))}
    </main>
  );
}
