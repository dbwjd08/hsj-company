import React from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { userState } from '@/lib/auth';
import Link from 'next/link';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const user = useRecoilValue(userState);

  return (
    <>
      {!user.uid && (
        <div className="w-full pt-20 text-center">
          로그인 해주세요.{' '}
          <Link href="/login">
            <a className="underline">클릭 하여 로그인 페이지로 이동.</a>
          </Link>
        </div>
      )}
      {user.uid &&
        !user.emailVerified &&
        router.route !== '/email-verification' && (
          <div className="w-full pt-20 text-center">
            이메일 인증이 필요합니다.{' '}
            <Link href="/email-verification">
              <a className="underline">클릭 하여 이메일 인증 페이지로 이동.</a>
            </Link>
          </div>
        )}
      {user.uid &&
        (user.emailVerified || router.route === '/email-verification') &&
        children}
    </>
  );
};

export default ProtectedRoute;
