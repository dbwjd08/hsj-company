import { useState, useRef, Fragment } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { signUp } from '@/lib/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog, Transition } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';
import tw, { css } from 'twin.macro';
import privacy from '@/docs/privacy.md';
import * as yup from 'yup';

interface SignupType {
  email: string;
  password: string;
  password_confirm: string;
  displayName: string;
  agreePrivacy: boolean;
}
const SignupPage = () => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .required('이메일을 입력해주세요.')
      .email('올바르지 않은 이메일 형식입니다.'),
    password: yup
      .string()
      .required('패스워드를 입력해주세요.')
      .min(8, '패스워드는 최소 8자 이상이여야 합니다.'),
    password_confirm: yup
      .string()
      .oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.'),
    displayName: yup
      .string()
      .required('이름을 입력해주세요.')
      .min(2, '이름은 최소 2자 이상이여야 합니다.'),
    agreePrivacy: yup.bool().oneOf([true], '개인정보처리방침에 동의해주세요.'),
  });
  const methods = useForm<SignupType>({
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dialogTitleRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: SignupType) => {
    try {
      await signUp(data.email, data.password, data.displayName);
      router.push('/email-verification');
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const markdownStyle = css`
    & p {
      margin: 0.5rem 0 0.5rem 0;
    }
    & h1 {
      margin: 1rem 0 1rem 0;
      font-size: 1rem;
      font-weight: bold;
    }
    & h2 {
      margin: 0.5rem 0 0.5rem 0;
      font-size: 0.875rem;
      font-weight: bold;
    }
    & ul {
      list-style: disc;
      padding-inline-start: 1rem;
    }
  `;

  return (
    <div className="sign-up-form container mx-auto max-w-lg mt-12 min-w-[1200px] font-system">
      <h2 className="mt-8 text-center text-5xl font-bold text-primary">
        회원 가입
      </h2>
      <h3 className="mt-4 text-center text-2xl text-primary">
        여P에 가입하신 후 blahblah 서비스를 이용해보세요.
      </h3>
      <FormProvider {...methods}>
        <form
          action=""
          className="mx-auto max-w-sm pb-12 px-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mt-6">
            <input
              type="text"
              placeholder="Name*"
              {...register('displayName')}
              className="border rounded-lg border-gray-200 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center"
            />
            {errors.displayName && (
              <p className="text-red-400">{errors.displayName.message}</p>
            )}
          </div>
          <div className="mt-6">
            <input
              type="email"
              placeholder="Email*"
              {...register('email')}
              className="border rounded-lg border-gray-200 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center"
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div className="mt-6">
            <input
              type="password"
              placeholder="Password*"
              {...register('password')}
              className="border rounded-lg border-gray-200 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center"
            />
            {errors.password && (
              <p className="text-red-400">{errors.password.message}</p>
            )}
          </div>
          <div className="mt-6">
            <input
              type="password"
              placeholder="Confirm Password*"
              {...register('password_confirm')}
              className="border rounded-lg border-gray-200 text-gray-500 text-normal py-3 h-12 px-6 text-lg w-full flex items-center"
            />
            {errors.password_confirm && (
              <p className="text-red-400">{errors.password_confirm.message}</p>
            )}
          </div>
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <label htmlFor="" className="block mb-3 text-primary">
                개인정보처리방침
              </label>
            </div>
            <input type="checkbox" {...register('agreePrivacy')} />
            <button
              className="appearance-none mx-4 text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
              }}
            >
              click to read
            </button>
            {errors.agreePrivacy && (
              <p className="text-red-400">{errors.agreePrivacy.message}</p>
            )}
          </div>
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="w-full h-12 text-center !bg-primary text-white text-2xl transition"
            >
              가입하기
            </button>
          </div>
        </form>
      </FormProvider>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 font-system"
          onClose={() => setIsOpen(false)}
          initialFocus={dialogTitleRef}
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
                    className="text-lg font-medium leading-6 text-gray-900"
                    ref={dialogTitleRef}
                  >
                    개인정보처리방침
                  </Dialog.Title>
                  <div css={[tw`mt-2 text-sm text-gray-500`, markdownStyle]}>
                    {
                      // eslint-disable-next-line
                    }
                    <ReactMarkdown>{privacy}</ReactMarkdown>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      닫기
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SignupPage;
