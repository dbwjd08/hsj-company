import { Transition, Dialog } from '@headlessui/react';
import { formatPrice } from '@/lib/utils';
import TitleIcon from '@/public/modaltitle.svg';
import { Fragment, Dispatch, SetStateAction } from 'react';
const CalculateModal = ({
  isOpen,
  setIsOpen,
  data,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  data: any;
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeModal}>
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
              <Dialog.Panel className="flex w-[45%] rounded-2xl bg-white pb-3 text-left align-middle shadow-xl transition-all p-2">
                <div
                  className="fixed right-3 top-2 font-medium text-xl text-gray-400 cursor-pointer p-2"
                  onClick={() => closeModal()}
                >
                  ✕
                </div>
                <div className="flex flex-col text-gray-800 p-6 gap-6">
                  <Dialog.Title className="text-2xl font-medium text-gray-800 mb-4  flex items-center p-2 bg-gray-50 rounded-2xl">
                    <TitleIcon className="w-[50px] animate-wiggle" />
                    선택하신 매물의 적정 전환율 계산 과정
                  </Dialog.Title>
                  <section className="flex gap-4 items-center w-full justify-center">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 justify-center">
                        12 ✕{' '}
                        <div className="p-1 border-2 border-green-500/50 bg-green-500/30 rounded-md font-semibold">
                          <p className="inline text-sm">평균 월세가: </p>
                          {formatPrice(
                            Math.ceil(
                              (data?.priceStat.monthlyRentMax +
                                data?.priceStat.monthlyRentMin) /
                                2,
                            ) * 10000,
                          )}
                        </div>{' '}
                      </div>
                      <hr className="border-1 my-2 border-gray-500" />
                      <div className="flex items-center gap-3">
                        (
                        <div className="p-1 border-2 border-blue-500/50 bg-blue-500/30 rounded-md font-semibold">
                          <p className="inline text-sm">평균 전세가: </p>

                          {formatPrice(data?.priceStat.leaseAvgPrc * 10000)}
                        </div>{' '}
                        -
                        <div className="p-1 border-2 border-purple-500/50 bg-purple-500/30 rounded-md font-semibold">
                          <p className="inline text-sm">평균 보증금: </p>
                          {formatPrice(data?.priceStat.deposit * 10000)}
                        </div>{' '}
                        )
                      </div>
                    </div>
                    <div>✕ 100 = </div>
                    <div className="p-1 border-2 border-gray-500/50 bg-gray-500/30 rounded-md font-semibold">
                      <p className="inline text-sm">적정 전환율: </p>
                      {data?.appConvRate.toFixed(2)}%
                    </div>{' '}
                  </section>

                  <div className="rounded-lg ring-1 ring-black ring-opacity-5">
                    <div className="bg-gray-50 p-4">
                      <span className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          자료 출처
                        </span>
                      </span>
                      <span className="block text-sm text-gray-500">
                        1) 네이버 부동산
                      </span>
                      <span className="block text-sm text-gray-500">
                        2) 최근 2달 간 등록된 매물 시세
                      </span>
                      <br />
                      <span className="block text-sm text-gray-500">
                        네이버 부동산에서 제공하는 시세 범위로 계산된 결과이며
                        실거래가, 공인중개사 의견, 기타 자료 등을 통해
                        산정되었습니다. 조사 기관의 사정에 의해 자료가 제공되지
                        않는 단지의 경우 최근 2달 간 등록된 매물의 가격들을
                        기반으로 계산하였으며, 이에 따른 실제 시세와의 오차가
                        발생할 수 있습니다. 여피는 정보의 정확도, 신뢰도에 대해
                        보증하지 않으니 단순 참고용으로 활용하시길 바랍니다.
                      </span>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CalculateModal;
