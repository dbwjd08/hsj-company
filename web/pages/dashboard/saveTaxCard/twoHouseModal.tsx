import { Dialog, Transition } from '@headlessui/react';
import { Fragment, Dispatch, SetStateAction } from 'react';
import Loading from '@/pages/loading';

const TwoHouseModal = ({
  setIsOpen,
  isOpen,
  modalType,
  taxData,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  modalType: string;
  taxData: any;
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  if (!taxData) {
    return <></>;
  }
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 font-system"
        onClose={closeModal}
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
              <Dialog.Panel className="flex flex-col items-start w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {modalType}
                </Dialog.Title>
                <div className="mt-2 whitespace-pre-line">
                  <p className="text-sm text-gray-500 whitespace-pre-line text-left">
                    {modalType === '지방세' &&
                      taxData.local_tax.description.slice(4)}
                    {modalType === '양도세' &&
                      taxData.income_tax.description.slice(4)}
                    {modalType === '종부세' &&
                      taxData.cret.description.slice(4)}
                  </p>
                </div>

                <div className="mt-4 self-end">
                  <button
                    type="button"
                    className=" justify-center rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-100 focus:outline-none"
                    onClick={closeModal}
                  >
                    확인
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TwoHouseModal;
