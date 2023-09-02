import useUser from '@libs/client/useUser';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { SWRConfig } from 'swr';
import '../styles/globals.scss';

const publicPages = ['enter']; // 로그인 없이 볼수 있는 공개 페이지

/**
 * Script Component

Next.js Script 컴포넌트인 next/script는 HTML script 태그의 확장입니다.
이를 통해 개발자는 애플리케이션에서 써드 파티 스크립트의 로드되는 우선 순위를 설정할 수 있으므로 개발자 시간을 절약하면서 로드하는 성능을 향상시킬 수 있습니다.

 * beforeInteractive: 페이지가 interactive 되기 전에 로드
afterInteractive: (기본값) 페이지가 interactive 된 후에 로드
lazyOnload: 다른 모든 데이터나 소스를 불러온 후에 로드
worker: (실험적인) web worker에 로드
 */

function MyApp({ Component, pageProps }: AppProps) {
  useUser(publicPages);
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then(response => response.json())
      }}
    >
      <div className='w-full max-w-xl mx-auto'>
        <Component {...pageProps} />
      </div>
      <Script
        src='https://developers.kakao.com/sdk/js/kakao.js'
        strategy='lazyOnload'
      />
      <Script
        src='https://connect.facebook.net/en_US/sdk.js'
        onLoad={() => {
          window.fbAsyncInit = function () {
            FB.init({
              appId: 'your-app-id',
              autoLogAppEvents: true,
              xfbml: true,
              version: 'v13.0'
            });
          };
        }}
      />
    </SWRConfig>
  );
}

export default MyApp;
