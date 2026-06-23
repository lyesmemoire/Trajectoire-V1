export async function GET() {
  return new Response("<?xml version='1.0'?><urlset></urlset>", {
    headers: { "Content-Type": "application/xml" },
  });
}
