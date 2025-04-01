import { Transition, Dialog } from '@headlessui/react';
import { Fragment, Dispatch, SetStateAction } from 'react';
import money from '@/public/money.png';
import Image from 'next/image';
const InterestRateModal = ({
  isOpen,
  setIsOpen,
  title,
  information,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: Array<string>;
  information: any;
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
              <Dialog.Panel className="flex w-2/3 h-[45rem] rounded-2xl bg-white pb-3 text-left align-middle shadow-xl transition-all p-2">
                <div className="flex flex-col w-full justify-center items-center">
                  <Dialog.Title className="text-2xl font-semibold leading-6 text-gray-800 mb-16 flex items-center gap-3 bg-gray-50 px-10 rounded-full">
                    <Image
                      src={money}
                      alt="money-icon"
                      width={55}
                      height={65}
                    ></Image>
                    {title[1]} {title[0]}
                  </Dialog.Title>

                  <div className="h-3/5 w-full overflow-y-auto scrollbar px-12 pb-6 mb-6">
                    {/* 예금 금리 모달 */}
                    {title[0] == '예금 금리' && (
                      <div className="grid grid-cols-3 gap-10">
                        {information?.map((item: any, idx: number) => (
                          <>
                            {(idx == 0 ||
                              information[idx].bank_name !==
                                information[idx - 1].bank_name) && (
                              <div>
                                <div className="font-semibold text-lg text-blue-900">
                                  {item.bank_name}
                                </div>
                                <hr />
                                {information?.map((item2: any, idx: number) => (
                                  <>
                                    {item2.bank_name == item.bank_name && (
                                      <div className="flex justify-between">
                                        <div className="font-medium text-base">
                                          {item2.product_name}
                                        </div>
                                        <div>
                                          {item2.interest_rate_12.toFixed(1)}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ))}
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                    )}

                    {/* 대출 금리 시중 은행 모달 */}
                    {title[1] == '시중 은행' && title[0] == '대출 금리' && (
                      <table className="w-full text-left text-gray-800 text-lg">
                        <thead className="text-center text-blue-900 bg-gray-50/50 border-y-1">
                          <tr>
                            <th colSpan={1} className="pt-3">
                              상품
                            </th>
                            <th colSpan={3} className="pt-3">
                              신용점수별 금리 (단위: 점)
                            </th>
                          </tr>
                          <tr>
                            {['은행명', '1000~951', '800~751', '600↓'].map(
                              (title, idx) => (
                                <th scope="col" className="px-6 py-3" key={idx}>
                                  {title}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody className="text-center w-full">
                          {information.map((value: any, idx: number) => (
                            <>
                              {value.cb_company !== '' && (
                                <tr className="border-b w-full" key={idx}>
                                  <td width="40%" className="w-[40%]">
                                    {value.bank_name}
                                  </td>
                                  <td width="20%" className="px-6 py-4 w-[20%]">
                                    {value.cb_1000 ? value.cb_1000 : '-'}
                                  </td>
                                  <td width="20%" className="px-6 py-4 w-[20%]">
                                    {value.cb_800 ? value.cb_800 : '- '}
                                  </td>
                                  <td width="20%" className="px-6 py-4 w-[20%]">
                                    {value.cb_600 ? value.cb_600 : '- '}
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* 대출 금리 저축 은행 모달 */}
                    {title[1] == '저축 은행' && title[0] == '대출 금리' && (
                      <>
                        <div className="flex justify-center font-semibold text-xl text-blue-900 py-2 bg-gray-50/50 border-y-1">
                          <div className="w-1/3 text-center">상품</div>
                          <div className="w-1/3 text-center">최저 금리</div>
                          <div className="w-1/3 text-center">최대 금리</div>
                        </div>
                        {information?.map((item: any, idx: number) => (
                          <div key={idx} className="flex-col my-2 py-2">
                            <div className="flex justify-between items-center text-center">
                              <div className="w-1/3 text-center font-semibold text-lg text-blue-900">
                                {item.bank_name}
                              </div>
                              <div className="w-1/3 text-center font-medium text-lg">
                                {item.rate_min?.toFixed(1)}
                              </div>
                              <div className="w-1/3 text-center font-medium text-lg">
                                {item.rate_max?.toFixed(1)}
                              </div>
                            </div>
                            <div className="font-medium p-2 bg-gray-50/70 text-gray-900 text-center mt-2">
                              대출한도: {item.ltv_desc}
                            </div>
                            <hr className="mt-4" />
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <div
                    className="w-28 text-center p-3 rounded-2xl bg-blue-800/80 font-medium text-white cursor-pointer"
                    onClick={() => closeModal()}
                  >
                    확인
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

export default InterestRateModal;
