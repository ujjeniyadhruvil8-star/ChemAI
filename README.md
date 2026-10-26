# AI Chemistry Analyzer

## Run locally

1. Install Node.js 20 or newer, then open PowerShell in this project folder.
2. In this folder, install dependencies:

   ```powershell
   npm install
   ```

3. Create your local environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

   Open `.env` and replace the example value with your Anthropic API key.
4. Start the local app:

   ```powershell
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173).

The React app runs in Vite, and its AI requests go through a local Express server. The API key stays in `.env` and is not sent to the browser. Restart `npm run dev` after changing `.env`.
