export function GET() {
  // Verifica somente o processo web; a API tem sua própria checagem de banco.
  return Response.json({ status: "ok", service: "postvision-web" });
}
