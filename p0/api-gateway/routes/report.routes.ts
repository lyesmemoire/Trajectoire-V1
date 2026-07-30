
export function registerReportRoutes(app: _FastifyInstance) {
  app.get("/v1/reports/:sessionId", async (req) => {
    const sessionId = (req.params as unknown).sessionId;
    // Mock fetching JSON report from Report Store
    return { sessionId, reportType: "JSON", status: "READY" };
  });

  app.get("/v1/reports/:sessionId/pdf", async (req, res) => {
    const sessionId = (req.params as unknown).sessionId;
    // Mock fetching PDF report
    res.header("Content-Type", "application/pdf");
    return Buffer.from("mock pdf content");
  });

  app.get("/v1/reports/:sessionId/audit", async (req) => {
    const sessionId = (req.params as unknown).sessionId;
    // Mock fetching Audit Pack
    return { sessionId, type: "AuditPack", hashes: {} };
  });
}
