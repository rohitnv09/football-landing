import { AmbientCanvas } from "./components/AmbientCanvas";
import { FootballScene } from "./components/FootballScene";
import { Navigation } from "./components/Navigation";
import { ScrollContent } from "./components/ScrollContent";
import { useTheme } from "./hooks/useTheme";

export function App() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <FootballScene />
      <AmbientCanvas />
      <div className="vignette" />
      <Navigation />
      <ScrollContent activeTheme={theme} onThemeChange={setTheme} />
    </>
  );
}
