import useUser from '@libs/client/useUser';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

const publicPages = ['enter']; // 로그인 없이 볼수 있는 공개 페이지

function MyApp({ Component, pageProps }: AppProps) {
  useUser(publicPages);
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) =>
          fetch(url).then((response) => response.json()),
      }}
    >
      <div className='w-full max-w-xl mx-auto'>
        <Component {...pageProps} />
      </div>
    </SWRConfig>
  );
}

export default MyApp;
