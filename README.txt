JARVIS AI starter

This project connects the existing JARVIS webpage to Gemini through a Netlify server-side function.
The Gemini API key must NOT be placed in index.html.

Deployment notes:
1. Upload this project to a Git repository and connect that repository to Netlify.
2. In Netlify site settings, add an environment variable:
   Key: GEMINI_API_KEY
   Value: your Gemini API key
   Scope: Functions (or All scopes)
3. Trigger a new deploy.
4. Test the site and ask a general question.

The API key is sent from the server function, not from the browser. Keep it private.
Gemini API access and free quotas vary by account/model and can change. Check usage/limits in Google AI Studio.

Voice style: speech rate and pitch are set lower for a calm, synthetic, Ultron-inspired feel. Browser/device voices vary; this does not copy the exact movie character or actor voice.
