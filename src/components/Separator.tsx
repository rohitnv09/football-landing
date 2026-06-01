type SeparatorProps = {
  paths: readonly string[];
  viewBox: string;
  compact?: boolean;
};

export function Separator({ paths, viewBox, compact = false }: SeparatorProps) {
  const [detailPath, mainPath] = paths;

  return (
    <div className="separator-container">
      <svg
        aria-hidden="true"
        className={`separator-svg ${compact ? "separator-svg--compact" : ""}`}
        fill="none"
        preserveAspectRatio="none"
        viewBox={viewBox}
      >
        {!compact && (
          <>
            <path
              className="separator-path"
              d={detailPath}
              opacity="0.3"
              strokeWidth="1"
            />
            <path
              className="separator-path"
              d={mainPath}
              opacity="0.15"
              strokeWidth="14"
            />
            <path
              className="separator-path"
              d={mainPath}
              opacity="0.6"
              strokeWidth="4"
            />
          </>
        )}
        <path
          className={compact ? "separator-path" : undefined}
          d={mainPath}
          stroke={compact ? undefined : "#ffffff"}
          strokeWidth={compact ? "2" : "1.5"}
        />
      </svg>
    </div>
  );
}
