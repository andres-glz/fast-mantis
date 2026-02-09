import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
    globalCss: {
        html: {
            colorPalette: "blue",
        },
    },
    theme: {
        tokens: {
            colors: {
                hola: { value: "#EE0F0F" },
            },
        },
        
    },
});

export const myTheme = createSystem(defaultConfig, customConfig);
