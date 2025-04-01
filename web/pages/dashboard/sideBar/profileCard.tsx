import { useRecoilState } from 'recoil';
import { userState, logOut } from '@/lib/auth';
import { useRouter } from 'next/router';

const ProfileCard = () => {
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);
  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/login');
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <div className="w-4/6 h-1/3 rounded-3xl border-2 border-gray-200 bg-white flex flex-col justify-center items-center mb-3">
      <div className="w-[4rem] h-[4rem] rounded-full bg-gray-400 mb-1"></div>
      <h1 className="font-bold text-2xl text-gray-800">{user.displayName}</h1>
      <h1 className="text-sm text-gray-500 mb-3">
        {' '}
        @{user.email?.split('@')[0]}
      </h1>
      <div
        className="py-1 px-3 rounded-2xl bg-blue-50 border-2 border-blue-200 text-blue-800 text-sm text-center font-semibold mb-2 cursor-pointer"
        onClick={() => router.push('/mypage')}
      >
        내 프로필 보기
      </div>
      <div
        className="py-1 px-3 rounded-2xl bg-blue-50 border-2 border-blue-200 text-blue-800 text-sm text-center font-semibold cursor-pointer"
        onClick={() => handleLogout()}
      >
        로그아웃
      </div>
    </div>
  );
};

export default ProfileCard;
