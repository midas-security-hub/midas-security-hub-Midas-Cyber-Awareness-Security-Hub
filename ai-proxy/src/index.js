/**
 * Midas Cyber Security AI Assistant - Secure Gemini Proxy
 *
 * This Cloudflare Worker keeps the Gemini API key secret on the server side.
 * The browser (faq.html) calls this worker; the worker calls the Gemini API.
 *
 * SECURITY NOTES:
 * - The Gemini API key is stored as a Cloudflare Worker Secret named GEMINI_API_KEY.
 *   It is NEVER hardcoded here and is NEVER sent to the browser.
 * - Set it once: `npx wrangler secret put GEMINI_API_KEY`
 * - This worker is stateless, logs no user content, and only forwards to Gemini.
 */

// Allowed method + a tiny content length guard to prevent abuse
export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Read and validate the request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = (typeof body.prompt === "string" ? body.prompt : "").trim().slice(0, 500);
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Pull the key from the worker secret environment
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server misconfigured: GEMINI_API_KEY secret not set." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const model = body.model || "gemini-2.0-flash";
    const systemInstruction =
      "You are Midas Cyber Security Hub AI Assistant. Answer concisely, under 120 words, and keep responses helpful for employee security awareness.";

    // Call Google Gemini REST API (v1beta, generateContent)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

    try {
      const geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 250, temperature: 0.4 }
        })
      });

      const geminiText = await geminiRes.text();

      if (!geminiRes.ok) {
        return new Response(
          JSON.stringify({ error: "AI service error.", detail: geminiRes.status }),
          { status: geminiRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      let data;
      try {
        data = JSON.parse(geminiText);
      } catch (e) {
        data = null;
      }

      const answer = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") || "";

      if (!answer) {
        return new Response(
          JSON.stringify({ error: "AI returned an empty response." }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ reply: answer }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (e) {
      return new Response(
        JSON.stringify({ error: "Upstream request failed." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }
};
