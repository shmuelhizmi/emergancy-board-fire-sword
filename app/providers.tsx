"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, ColorModeScript, ThemeConfig, extendTheme } from "@chakra-ui/react";
import rtl from "stylis-plugin-rtl";

// NB: A unique `key` is important for it to work!

const theme = extendTheme({
  direction: "rtl",
  styles: { global: { body: { direction: "rtl" } } },
  // light theme
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  } as ThemeConfig,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider stylisPlugins={[rtl]}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
