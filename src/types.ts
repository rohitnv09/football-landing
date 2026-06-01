export type ThemeName = "green" | "red" | "blue" | "yellow" | "white";

export type TimelineFrame = {
  scroll: number;
  align: number;
  radF: number;
};

export type SketchfabCamera = {
  position: [number, number, number];
  target: [number, number, number];
};

export type SketchfabApi = {
  start: () => void;
  addEventListener: (event: "viewerready", callback: () => void) => void;
  getCameraLookAt: (
    callback: (error: unknown, camera: SketchfabCamera) => void,
  ) => void;
  setCameraLookAt: (
    position: [number, number, number],
    target: [number, number, number],
    duration: number,
  ) => void;
};

export type SketchfabClient = {
  init: (
    uid: string,
    options: {
      success: (api: SketchfabApi) => void;
      error: () => void;
      autostart: number;
      transparent: number;
      ui_theme: "dark";
      ui_watermark: number;
      ui_infos: number;
      ui_stop: number;
      ui_hints: number;
      ui_help: number;
      scrollwheel: number;
    },
  ) => void;
};

declare global {
  interface Window {
    Sketchfab: new (version: string, iframe: HTMLIFrameElement) => SketchfabClient;
  }
}
