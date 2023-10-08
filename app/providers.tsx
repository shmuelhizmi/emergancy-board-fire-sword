"use client";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { CacheProvider } from "@chakra-ui/next-js";
import {
  ChakraProvider,
  ColorModeScript,
  IconButton,
  ThemeConfig,
  extendTheme,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const path = usePathname();
  const shouldShowBack = path !== "/";
  return (
    <CacheProvider stylisPlugins={[rtl]}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        {shouldShowBack && (
          <IconButton
            aria-label="חזרה"
            icon={<ArrowBackIcon />}
            style={{ position: "absolute", top: "5px", left: "5px", zIndex: 1 }}
            onClick={() => router.push("/")}
          />
        )}
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
