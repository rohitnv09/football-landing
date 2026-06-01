import { AmbientCanvas } from "./components/AmbientCanvas";
import { Navigation } from "./components/Navigation";
import { ScrollContent } from "./components/ScrollContent";
import { SketchfabScene } from "./components/SketchfabScene";
import { useTheme } from "./hooks/useTheme";

export function App() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <SketchfabScene />
      <AmbientCanvas />
      <div className="vignette" />
      <Navigation />
      <ScrollContent activeTheme={theme} onThemeChange={setTheme} />
    </>
  );
}
