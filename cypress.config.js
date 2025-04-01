import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:8080',
    // baseUrl: 'http://150.165.75.99:8080',
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});