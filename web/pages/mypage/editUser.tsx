import { useRecoilState, useRecoilValue } from 'recoil';
import produce from 'immer';
import * as yup from 'yup';
import { userState, updateName, updatePassword, logOut } from '@/lib/auth';
import { useUpdateUserUserPut } from '@/src/api/yuppieComponents';
import { useToastContext } from '@/components/toast';
import { useRouter } from 'next/router';
import prompt from '@/components/prompt';
import { tokenState } from '@/lib/auth';

const EditUser = () => {
  const router = useRouter();
  const addToast = useToastContext();
  const [user, setUser] = useRecoilState(userState);
  const { default_universe_id } = useRecoilValue(tokenState);

  const formatAge = () => {
    if (user.age == null || user.age == '') return '나이를 설정해주세요';
    else if (user.age == 'under_60') return '60세 미만';
    else if (user.age == 'from_60_under_65') return '60세 이상 65세 미만';
    else if (user.age == 'from_65_under_70') return '65세 이상 70세 미만';
    else return '70세 이상';
  };

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/login');
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const updateNameFunc = async () => {
    const newName = await prompt({
      title: '사용자명',
      message: '새로운 사용자명을 입력해주세요.',
      schema: yup
        .string()
        .required('사용자명을 입력해주세요.')
        .min(2, '사용자명은 최소 2자 이상이여야 합니다.'),
    });
    try {
      await updateName(newName);
      setUser(
        produce(user, (draft) => {
          draft.displayName = newName;
        }),
      );
      addToast('사용자명이 업데이트 되었습니다.');
    } catch (error: any) {
      addToast('오류가 발생하였습니다.');
      console.log(error.message);
    }
  };

  const updateAge = useUpdateUserUserPut();

  const updateAgeFunc = async () => {
    const newAge = await prompt({
      title: '나이',
      message: '새로운 나이를 설정해주세요.',
      schema: yup
        .string()
        .required('나이를 입력해주세요.')
        .min(1, '나이는 최소 1자 이상이여야 합니다.'),
    });
    try {
      await updateAge.mutateAsync({
        body: {
          username: user.username as string,
          name: user.displayName as string,
          email: user?.email as string,
          defaultUniverseId: default_universe_id,
          age: newAge,
          isAlarmOn: true,
        },
      });
      setUser(
        produce(user, (draft) => {
          draft.age = newAge;
        }),
      );
      addToast('나이가 업데이트 되었습니다.');
    } catch (error: any) {
      addToast('오류가 발생하였습니다.');
      console.log(error.message);
    }
  };

  const updatePasswordFunc = async () => {
    const newName = await prompt({
      title: '패스워드',
      message: '새로운 패스워드를 입력해주세요.',
      inputType: 'password',
      schema: yup
        .string()
        .required('패스워드를 입력해주세요.')
        .min(8, '패스워드는 최소 8자 이상이여야 합니다.'),
    });
    try {
      await updatePassword(newName);
      addToast('패스워드가 업데이트 되었습니다.');
    } catch (error: any) {
      addToast('오류가 발생하였습니다.');
      console.log(error.message);
    }
  };

  return (
    <div className="w-full h-full">
      <h2 className="text-2xl font-bold text-gray-900">회원 정보</h2>
      <div className="w-full h-full flex mt-6 gap-10">
        <div className="flex flex-col w-1/4 h-3/5 rounded-lg py-2 px-4 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_7px] items-center justify-center">
          {' '}
          <div className="w-[7rem] h-[7rem] rounded-full bg-gray-200 mb-4"></div>
          <h1 className="font-bold text-2xl text-gray-800">
            {user.displayName}
          </h1>
          <h1 className="text-sm text-gray-500 mb-3">
            @{user.email?.split('@')[0]}
          </h1>
          <div
            className="py-1 px-3 rounded-2xl bg-blue-50 border-2 border-blue-200 text-blue-800 text-sm text-center font-semibold mt-3 cursor-pointer"
            onClick={() => handleLogout()}
          >
            로그아웃
          </div>
        </div>
        <div className="rounded-lg py-4 px-5  flex flex-col h-3/5 w-3/4 border-2 border-gray-100">
          <div className="py-2">
            <div className="font-semibold text-gray-800 text-xl w-full bg-gray-50 100 p-3 rounded-2xl mb-4">
              기본 정보
            </div>
            <div className="flex items-center justify-between py-2 px-4">
              <div className="font-bold text-2xl">
                <p className="inline mr-5 text-gray-400 font-semibold">
                  이름 l{' '}
                </p>
                {user.displayName}
              </div>
              <button
                className="appearance-none rounded-xl px-4 py-1 text-sm bg-gray-100 text-gray-600 border-2 border-gray-300 font-semibold"
                onClick={async (e) => {
                  e.preventDefault();
                  updateNameFunc();
                }}
              >
                수정
              </button>
            </div>
            <div className="flex items-center justify-between py-2 px-4">
              <div className="font-bold text-2xl">
                {' '}
                <p className="inline mr-5 text-gray-400 font-semibold">
                  나이 l{' '}
                </p>
                {formatAge()}
              </div>
              <button
                className="appearance-none rounded-xl px-4 py-1 text-sm bg-gray-100 text-gray-600 border-2 border-gray-300 font-semibold"
                onClick={async (e) => {
                  e.preventDefault();
                  updateAgeFunc();
                }}
              >
                수정
              </button>
            </div>
            <div className="text-sm text-gray-40 px-4">{user.email}</div>
          </div>
          <div className="flex items-center justify-between py-2 px-4">
            <div className="text-sm text-gray-400">비밀번호 수정하기</div>
            <button
              className="appearance-none rounded-xl px-4 py-1 text-sm bg-gray-100 text-gray-600 border-2 border-gray-300 font-semibold"
              onClick={async (e) => {
                e.preventDefault();
                updatePasswordFunc();
              }}
            >
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
