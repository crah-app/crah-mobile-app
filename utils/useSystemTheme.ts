import { useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

type ColorSchemeUpdated = 'light' | 'dark';

/**
 * Hook für das dynamische System-Theme
 * @returns {ColorSchemeUpdated} 'light' oder 'dark'
 */
export function useSystemTheme(): ColorSchemeUpdated {
  const [theme, setTheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  useEffect(() => {
    // Event-Listener für Theme-Änderungen hinzufügen
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme);
    });

    // Cleanup-Funktion zum Entfernen des Event-Listeners
    return () => {
      listener.remove();
    };
  }, []);

  return theme!;
}
