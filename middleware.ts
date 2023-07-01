import {
  NextFetchEvent,
  NextRequest,
  NextResponse,
  userAgent
} from 'next/server';

export const middleware = async (req: NextRequest, ev: NextFetchEvent) => {
  if (userAgent(req).isBot) {
    // 새로운 error 화면을 만들고 그쪽으로 rewrite 시켜줄것
    return new Response("Plz don't be a bot. Be human.", { status: 403 });
  }
  if (!req.cookies.has('carrotsession') && !req.url.includes('/enter')) {
    req.nextUrl.searchParams.set('from', req.nextUrl.pathname);
    req.nextUrl.pathname = '/enter';
    return NextResponse.redirect(req.nextUrl);
  }
};

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico).*)']
};
