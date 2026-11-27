# 208 Fence and Gate — Website Builder

Web app for **208 Fence and Gate LLC**, a residential fence contractor. The code in this repository provides an estimate calculator, PDF proposal export, a Google Maps service-area view, a Gemini-powered assistant, Firebase/Firestore storage, and Google Workspace helpers.

This repository lives at `Autonomous-Agentic-Workflows/Website-Builder`.

## Quick start

Prerequisites: Node.js 18+ or Bun, plus Firebase and Google Cloud projects if you want live backend and maps/AI features.

```bash
git clone https://github.com/Autonomous-Agentic-Workflows/Website-Builder.git
cd Website-Builder
npm install
cp .env.example .env
npm run dev
```

`npm run dev` starts the Vite dev server. `package.json` also defines `build`, `preview`, and `test`.

## Configuration

Copy `.env.example` and set the variable **names** below. Never commit the values.

| Name | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Google Gemini API key for the in-app assistant (`services/geminiService.ts`). |
| `GOOGLE_MAPS_PLATFORM_KEY` | Google Maps Platform key for the service-area map. |

Firebase web credentials are read from `firebase-applet-config.json`. Keep production secrets out of git if that file is ever populated with real values. Firestore rules live in `firestore.rules` and should be applied in the Firebase console or with the Firebase CLI.

For Google Workspace features (`services/googleWorkspace.ts`), enable the Drive, Sheets, Gmail, Calendar, and Tasks APIs in Google Cloud and configure an OAuth consent screen. Restrict Maps and Gemini keys to your dev and production origins, and set budget alerts on the Google Cloud project.

## Usage

- Estimate calculator and bill of materials: `services/estimateCalculator.ts`
- PDF proposal export: `services/pdfExportService.ts`
- Gemini assistant: `services/geminiService.ts`
- Firebase helpers: `services/firebase.ts`
- Google Workspace helpers: `services/googleWorkspace.ts`
- UI entry: `index.tsx` / `App.tsx`, with presentational pieces under `components/`

Production build:

```bash
npm run build
```

Deploy the `dist/` folder to Firebase Hosting or another static host.

## Project layout

```
App.tsx, index.tsx, index.html, index.css
components/                 UI components
services/                   Estimate, PDF, Firebase, Gemini, Workspace
data/                       Static site data
types.ts                    Shared TypeScript types
firebase-applet-config.json Firebase web app config (do not put secrets in docs)
firebase-blueprint.json     Firebase blueprint
firestore.rules             Firestore security rules
vite.config.ts              Vite + React
package.json                Scripts: dev, build, preview, test (Vitest)
```

The npm package name in `package.json` is still `lumina-festival`; that does not change how you run the app.

## Contributing and testing

```bash
npm test
npm run build
```

Calculator coverage lives in `services/estimateCalculator.test.ts` and runs through Vitest (`vitest run`).

Open a pull request against `main`. Do not commit `.env` or live API keys.

## License

MIT — see [LICENSE](LICENSE).
