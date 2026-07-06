export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === 'www.nusantaraeats.com') {
    url.hostname = 'nusantaraeats.com';
    return Response.redirect(url.toString(), 301);
  }

  const response = await context.next();

  const isStaticPage = url.pathname.match(/^\/($|recipes|categories|regions|resep|about|search)/);
  const isAsset = url.pathname.match(/\.(js|css|jpg|jpeg|png|gif|webp|svg|woff2?)$/);

  if (isStaticPage || isAsset) {
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }

  return response;
}
