import type { AppProps } from 'next/app';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { GlobalStyles } from 'twin.macro';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  QueryCache,
  MutationCache,
} from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/components/layout';
import { ToastContextProvider } from '@/components/toast';
import { toast } from 'react-toastify';
import '@/styles/globals.css';
import Router from 'next/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: (e: any) => {
      if (e.status == 409) {
        toast.error('중복 로그인이 감지되었습니다. 새로 로그인해주세요.', {
          autoClose: 2000,
        });
        Router.push('/login');
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (e: any) => {
      if (e.status == 409) {
        toast.error('중복 로그인이 감지되었습니다. 새로 로그인해주세요.', {
          autoClose: 2000,
        });
        Router.push('/login');
      }
    },
  }),
});

const MyApp = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <GlobalStyles />
      <ToastContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ToastContextProvider>
    </RecoilRoot>
  </QueryClientProvider>
);

export default MyApp;
