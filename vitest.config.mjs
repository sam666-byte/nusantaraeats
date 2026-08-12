import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "jsdom",
        include: ["test/**/*.test.js"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "json-summary"],
            // The scripts index.html loads. recipes-data.js is excluded: its only
            // declaration is shadowed by script.js, which loads after it.
            include: ["script.js", "supabase-config.js"],
        },
    },
});
