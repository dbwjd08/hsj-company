import { useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { tokenState, logIn, resetPassword, userState } from '@/lib/auth';
import { Dialog, Transition } from '@headlessui/react';
import { useToastContext } from '@/components/toast';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface LoginType {
  email: string;
  password: string;
}
const LoginPage = () => {
  const router = useRouter();
  const addToast = useToastContext();
  const setUser = useSetRecoilState(userState);
  const setToken = useSetRecoilState(tokenState);

  // login
  const schema = yup.object().shape({
    email: yup
      .string()
      .required('이메일을 입력해주세요.')
      .email('올바르지 않은 이메일 형식입니다.'),
    password: yup
      .string()
      .required('패스워드를 입력해주세요.')
      .min(8, '패스워드는 최소 8자 이상이여야 합니다.'),
  });
  const methods = useForm<LoginType>({
    resolver: yupResolver(schema),
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;
  const onSubmit = async (data: LoginType) => {
    try {
      const {
        emailVerified,
        access_token,
        default_universe_id,
        session_id,
        username,
        age,
      } = await logIn(data.email, data.password);
      if (emailVerified && default_universe_id !== null) {
        setToken({
          access_token,
          default_universe_id,
          session_id,
        });
        setUser((prev) => ({ ...prev, username, age }));
        router.push('/dashboard');
      } else if (emailVerified) {
        addToast('universe_id를 가져오지 못했습니다.');
        console.log('failed to get default_universe_id');
      } else {
        router.push('/email-verification');
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setError('email', {
          type: error.code,
          message: '등록되지 않은 이메일 입니다.',
        });
      } else if (error.code === 'auth/wrong-password') {
        setError('password', {
          type: error.code,
          message: '잘못된 비밀번호 입니다.',
        });
      } else {
        setError('password', {
          type: error.code,
          message: error.message,
        });
      }
    }
  };

  // password reset
  const [isOpen, setIsOpen] = useState(false);
  const methods2 = useForm<LoginType>({
    resolver: yupResolver(schema),
  });
  const onSubmit2 = async (data: LoginType) => {
    try {
      await resetPassword(data.email);
      addToast('이메일이 전송되었습니다.');
      setIsOpen(false);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        addToast('등록되지 않은 이메일 입니다.');
      } else {
        addToast('오류가 발생하였습니다.');
        console.log(error.message);
      }
    }
  };

  return (
    <div className="font-system sign-up-form container mx-auto max-w-lg mt-12 min-w-[1200px]">
      <h2 className="mt-8 text-center text-5xl font-system_bold text-primary">
        로그인
      </h2>
      <FormProvider {...methods}>
        <form
          action=""
          className="w-80 mx-auto pb-12 px-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mt-8">
            <input
              type="email"
              placeholder="Email"
              {...register('email')}
              className="border rounded-lg border-gray-200 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center"
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div className="mt-8">
            <input
              type="password"
              placeholder="Password"
              {...register('password')}
              className="border rounded-lg border-gray-200 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center"
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>
          <div className="mt-8">
            <button
              type="button"
              className="appearance-none text-gray-300"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(true);
              }}
            >
              패스워드 초기화
            </button>
          </div>
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="w-full h-12 text-center !bg-primary text-white text-2xl transition rounded-lg"
            >
              로그인
            </button>
          </div>
        </form>
      </FormProvider>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 font-system"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-system_medium leading-6 text-gray-900"
                  >
                    비밀번호 초기화 이메일 보내기
                  </Dialog.Title>
                  <FormProvider {...methods2}>
                    <form action="" onSubmit={methods2.handleSubmit(onSubmit2)}>
                      <div className="mt-8">
                        <div className="flex items-center justify-between">
                          <label
                            htmlFor=""
                            className="block mb-3 font-system text-gray-900"
                          >
                            Email
                          </label>
                        </div>
                        <input
                          type="email"
                          {...methods2.register('email')}
                          className={`border border-solid rounded-lg ring:0 focus:ring-0 focus:outline-none border-gray-400 text-gray-100 text-normal py-3 h-12 px-6 text-lg w-full flex items-center`}
                        />
                        {methods2.formState.errors.email && (
                          <p className="text-red-400">
                            {methods2.formState.errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex justify-between">
                        <button
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-blue-100 px-4 py-2 text-sm font-system_medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                          }}
                        >
                          닫기
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-blue-100 px-4 py-2 text-sm font-system_medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          보내기
                        </button>
                      </div>
                    </form>
                  </FormProvider>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default LoginPage;
