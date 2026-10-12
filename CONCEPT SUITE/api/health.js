/**
 * THE CONCEPT STUDIO. — VERCEL SERVERLESS FUNCTION: HEALTH CHECK
 * GET /api/health
 */

export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "THE CONCEPT STUDIO. — Production API Gateway",
    deployment: "Vercel Preliminary Production",
    version: "1.0.0"
  });
}
