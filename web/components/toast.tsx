import { createContext, useCallback, useContext, useRef } from 'react';
import tw from 'twin.macro';
import { Slide, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext((toast: string) => {});
export default ToastContext;

export function useToastContext() {
  return useContext(ToastContext);
}

export function ToastContextProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addToast = useCallback((message: string) => {
    if (timerRef.current === null) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
      }, 1000);
      toast(<Toast message={message} />, {
        style: {
          width: 'fit-content',
          padding: '0px',
          background: 'transparent',
        },
        bodyStyle: {
          padding: '0px',
        },
      });
    }
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <ToastContainer
        position={'top-right'}
        autoClose={5000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        transition={Slide}
      />
    </ToastContext.Provider>
  );
}

export const Toast = ({
  message,
  closeToast,
  toastProps,
}: {
  message: string;
  closeToast?: any;
  toastProps?: any;
}) => {
  return (
    <div
      css={tw`font-system flex items-center bg-gray-700/90 text-white rounded-xl`}
    >
      <div
        css={tw`flex-1 w-fit border-r border-r-gray-500 px-9 py-3 font-system_bold text-white text-base`}
      >
        {message}
      </div>
      <button
        css={tw`w-24 h-20 font-system_bold text-white text-base place-self-center`}
        onClick={closeToast}
      >
        닫기
      </button>
    </div>
  );
};
