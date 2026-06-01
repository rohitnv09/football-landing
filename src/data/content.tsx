import type { ThemeName } from "../types";

export const themes: Array<{ name: ThemeName; label: string }> = [
  { name: "green", label: "Green Theme" },
  { name: "red", label: "Red Theme" },
  { name: "blue", label: "Blue Theme" },
  { name: "yellow", label: "Yellow Theme" },
  { name: "white", label: "White Theme" },
];

export const sections = [
  {
    align: 1,
    radF: 0.13,
    short: true,
    side: "left",
    title: (
      <>
        THE
        <br />
        NEW
        <br />
        STANDARD.
      </>
    ),
    body: "Introducing the Kinetic Orb. Precision engineering meets aerodynamic perfection.",
    hasThemePicker: true,
  },
  {
    align: -1,
    radF: 0.1,
    side: "right",
    title: (
      <>
        FLUID
        <br />
        MOTION.
      </>
    ),
    body: "Engineered to cut through the air. The completely redesigned panel shape reduces drag by 14%, ensuring every strike finds its target.",
  },
  {
    align: 1,
    radF: 0.1,
    side: "left",
    title: (
      <>
        NANO-GRIP
        <br />
        TEXTURE.
      </>
    ),
    body: "Get closer. See the micro-texture that gives you ultimate control in all weather conditions. Water sheds instantly.",
  },
  {
    align: -1,
    radF: 0.1,
    side: "right",
    title: (
      <>
        THERMAL
        <br />
        BOND.
      </>
    ),
    body: "Zero stitches. Seamless thermal bonding creates a perfectly spherical shape that maintains its integrity match after match.",
  },
  {
    align: 0,
    radF: 0.08,
    short: true,
    side: "center",
    title: (
      <>
        FEEL THE
        <br />
        DIFFERENCE.
      </>
    ),
    finalCta: true,
  },
] as const;

export const separators = [
  {
    viewBox: "0 0 1000 200",
    paths: [
      "M0,110 L110,40 L250,190 L340,80 L460,150 L570,30 L690,170 L810,70 L930,110 L1000,110",
      "M0,100 L120,20 L240,180 L350,60 L450,140 L580,10 L680,190 L820,50 L920,130 L1000,100",
    ],
  },
  {
    viewBox: "0 0 1000 200",
    paths: [
      "M0,90 L90,160 L260,50 L370,180 L490,50 L570,170 L710,40 L790,160 L910,20 L1000,90",
      "M0,100 L100,180 L250,30 L380,160 L480,70 L580,190 L700,20 L800,140 L900,40 L1000,100",
    ],
  },
  {
    viewBox: "0 0 1000 200",
    paths: [
      "M0,110 L160,30 L270,170 L410,10 L510,170 L640,40 L790,160 L870,30 L1000,110",
      "M0,100 L150,10 L280,190 L400,30 L520,150 L650,20 L780,180 L880,50 L1000,100",
    ],
  },
  {
    viewBox: "0 0 1000 60",
    compact: true,
    paths: [
      "M0,30 L150,10 L300,50 L550,20 L750,50 L1000,30",
      "M0,30 L150,10 L300,50 L550,20 L750,50 L1000,30",
    ],
  },
] as const;
