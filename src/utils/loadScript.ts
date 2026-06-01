const loadedScripts = new Map<string, Promise<void>>();

export function loadScript(src: string) {
  const pendingScript = loadedScripts.get(src);

  if (pendingScript) {
    return pendingScript;
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${src}"]`,
  );

  if (existingScript) {
    return Promise.resolve();
  }

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Unable to load ${src}`));
    document.head.appendChild(script);
  });

  loadedScripts.set(src, promise);
  return promise;
}
