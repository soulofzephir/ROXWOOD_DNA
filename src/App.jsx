{
  "name": "roxwood-dna",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "homepage": "https://soulofzephir.github.io/ROXWOOD_DNA",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "lucide-react": "^0.400.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "gh-pages": "^6.1.1",
    "vite": "^5.3.4",
    "@vitejs/plugin-react": "^4.3.1"
  }
}