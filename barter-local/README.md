# ScotchCorner

A mock-first Barter Exchange platform allowing users to post offers and find direct or multi-way match chains.

## 🚀 One-Click Demo
To run the application locally:

1.  **Install**: `npm install`
2.  **Run**: `npm start`
3.  **Open**: `http://localhost:4200`

## 🔑 Demo Accounts
Login with any of the following (Password: *any*):
-   `user1@barter.com` (Ali)
-   `user2@barter.com` (Sara)
-   `user3@barter.com` (Usman)

## 🏗 Architecture
-   **Frontend**: Angular 18 (Standalone Components, Signals)
-   **Styling**: Tailwind CSS
-   **Backend**: Simulated via `MockApiInterceptor` (Pure Client-Side)
-   **Persistence**: `localStorage` (Browser Session)
-   **Matching**: Client-side Graph Cycle Detection (2-way, 3-way, 4-way)

## 📦 Deployment
Run `npm run build`. The artifacts will be in `dist/barter-local/browser`.
These static files can be hosted on:
-   Vercel / Netlify
-   GitHub Pages
-   AWS S3 / CloudFront
