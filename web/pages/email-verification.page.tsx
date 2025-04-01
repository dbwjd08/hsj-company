import { useRouter } from 'next/router';
import { logOut, sendEmail } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';

const EmailVerification = () => {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex py-2 container mx-auto">
        <div className="text-gray-600 px-12 py-24 mt-24 overflow-y-hidden mx-auto">
          <h2 className="text-2xl font-system_semibold text-center">
            이메일을 인증해주세요.
          </h2>
          <div>
            <button
              className={`p-4 m-2 text-center text-black bg-gray-200 rounded-md text-lg transition`}
              onClick={async () => {
                await sendEmail();
                alert('이메일이 발송되었습니다');
              }}
            >
              이메일 다시 보내기
            </button>
          </div>
          <div>
            <button
              className={`p-4 m-2 text-center text-black bg-gray-200 rounded-md text-lg transition`}
              onClick={async () => {
                await logOut();
                router.push('/login');
              }}
            >
              다시 로그인 하기
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EmailVerification;
