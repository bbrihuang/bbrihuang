// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: "https://www.bbrihuang.com",
    redirects: {
        "/about": "/",
        "/experience": "/#experience",
    },
});
