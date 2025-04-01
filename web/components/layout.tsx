import type { ReactNode } from 'react';
import Head from 'next/head';
import Navbar from './navbar';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Yuppie</title>
        <meta name="description" content="여피 (여P: 여러분의 PB)" />
        <meta name="keywords" content="" />
        <meta property="og:url" content="" />
        <meta property="og:image" content="" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="여피 (여P: 여러분의 PB)" />
        <meta property="og:description" content="여피 (여P: 여러분의 PB)" />
        <meta property="og:image:width" content="" />
        <meta property="og:image:height" content="" />

        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="format-detection" content="telephone=no" />

        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon/favicon.png" />
        <link
          rel="stylesheet preload"
          as="style"
          crossOrigin=""
          href="https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.3.6/variable/pretendardvariable-dynamic-subset.css"
        />
      </Head>
      <Navbar className="h-[5rem] font-system" />
      <main className="relative h-[calc(100vh-6rem)] font-system">
        {children}
      </main>
    </>
  );
};

export default Layout;
