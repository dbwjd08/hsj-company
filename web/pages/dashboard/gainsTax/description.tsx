import { useState, Fragment, Dispatch, SetStateAction } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { formatPrice } from '@/lib/utils';
import TitleIcon from '@/public/modaltitle.svg';

import DetailDescription from './detailDescription';

const Description = ({
  isOpen,
  setIsOpen,
  gainPrice,
  gainTax,
  Info,
  date,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  gainPrice: number;
  gainTax: any;
  Info: any;
  date: string;
}) => {
  const [modalType, setModalType] = useState('');
  const [isDescOpen, setIsDescOpen] = useState(false);

  const formatPriceRound = (price: number) => {
    if (price > 10000)
      return (formatPrice(Number((price / 10000).toFixed(0)) * 10000))
    else
      return (formatPrice(price))
  }

  if (!gainTax)
    return (<div></div>)

  return (
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
              <Dialog.Panel className="flex rounded-2xl bg-white p-7 text-left align-middle shadow-xl transition-all">
                <div
                  className="fixed right-3 top-2 font-medium text-xl text-gray-400 cursor-pointer p-2"
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </div>
                <div className="flex flex-col mr-5">
                  <Dialog.Title className="text-[26px] font-medium text-gray-800 mb-4 flex items-center p-2 bg-gray-50 rounded-2xl">
                    <TitleIcon className="w-[50px] animate-wiggle" />
                    양도소득세 계산법
                  </Dialog.Title>
                  <div className='flex'>
                    <div className="flex flex-col gap-4">
                      <section className="w-full py-10 bg-white rounded-2xl shadow-sm flex flex-col justify-center gap-3 font-medium text-gray-800">
                        <div className="flex justify-center items-center gap-3">
                          {'('}
                          <div
                            className=" p-1 border-2 border-blue-400 bg-blue-200 rounded-md cursor-pointer"
                            onClick={() => {
                              setIsDescOpen(true);
                              setModalType('diff');
                            }}
                          >
                            양도차익
                          </div>
                          -
                          <div
                            className="p-1 border-2 border-purple-400 bg-purple-200 rounded-md cursor-pointer"
                            onClick={() => {
                              setIsDescOpen(true);
                              setModalType('long');
                            }}
                          >
                            장기보유특별공제
                          </div>
                          <div className="flex justify-center items-center gap-4">
                            -
                            <div
                              className=" p-1 border-2 border-gray-300 bg-gray-100 rounded-md"
                            >
                              기본공제
                            </div>
                            {')'}
                          </div>
                          x
                          <div
                            className=" p-1 border-2 border-green-600 bg-green-200  rounded-md cursor-pointer"
                            onClick={() => {
                              setIsDescOpen(true);
                              setModalType('rate');
                            }}
                          >
                            양도세율
                          </div>
                          = 납부할세액
                        </div>
                      </section>
                      <section className="flex flex-col justify-center gap-10 font-medium text-gray-800 w-full overflow-auto pb-5 scrollbar">
                        <section className="mb-2">
                          <div className="text-lg font-semibold flex items-center mb-2">
                            1. 양도차익에 장기보유특별공제액을 빼서 양도소득금액을 계산합니다.
                          </div>
                          <section className="flex justify-center gap-3 items-center">
                            <div
                              className="group relative p-1 border-2 border-blue-400 bg-blue-200 rounded-md cursor-pointer"
                              onClick={() => {
                                setIsDescOpen(true);
                                setModalType('diff');
                              }}
                            >
                              {formatPriceRound(gainTax.capital_gains_for_tax)}
                            </div>{' '}
                            -{' '}
                            <div
                              className="group relative p-1 border-2 border-purple-400 bg-purple-200 rounded-md cursor-pointer"
                              onClick={() => {
                                setIsDescOpen(true);
                                setModalType('long');
                              }}
                            >
                              {formatPriceRound(Number((gainTax.capital_gains_for_tax * gainTax.special_deduction_rate_for_longterm_hold).toFixed(0)))}
                            </div>{' '}
                            ={' '}
                            <div className="group relative p-1 border-2 border-gray-300  rounded-md ">
                              {formatPriceRound(gainTax.transfer_income.toFixed(0))}
                            </div>
                          </section>
                        </section>
                        <section className='mb-2'>
                          <div className="text-lg font-semibold flex items-center mb-1">
                            2. 양도소득금액에서 기본공제를 제하고 과세표준액을 구합니다.
                          </div>
                          <div className='text-sm font-light mb-2'>
                            미분양주택, 신축주택의 경우 감면소득금액이 추가로 공제될 수 있습니다.
                          </div>
                          <section className="flex justify-center gap-3 items-center">
                            <div
                              className=" p-1 border-2 border-gray-300 rounded-md"
                            >
                              {formatPriceRound(gainTax.transfer_income.toFixed(0))}

                            </div>{' '}
                            -{' '}
                            <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
                              {formatPriceRound(gainTax.initial_deduction)}
                            </div>{' '}
                            ={' '}
                            <div className="group relative p-1 border-2 border-red-300 bg-red-100 rounded-md ">
                              {formatPriceRound(gainTax.tax_base)}
                            </div>
                          </section>
                        </section>
                        <section>
                          <div className="text-lg font-semibold flex items-center mb-2">
                            3. 양도세 과세표준액에 양도세율을 적용하여 내 양도세가 나옵니다.
                          </div>
                          <section className="flex justify-center gap-3 items-center">
                            <div
                              className="group relative p-1 border-2 border-red-300 bg-red-100 rounded-md "
                            >
                              {formatPriceRound(gainTax.tax_base)}
                            </div>{' '}
                            x{' '}
                            <div
                              className="group relative p-1 border-2 border-green-600 bg-green-200 rounded-md cursor-pointer"
                              onClick={() => {
                                setIsDescOpen(true);
                                setModalType('rate');
                              }}
                            >
                              {gainTax.tax_rate * 100}%
                            </div>{' '}
                            -{' '}
                            <div
                              className=" p-1 border-2 border-gray-300 bg-gray-100 rounded-md"
                            >
                              {formatPriceRound(gainTax.progressive_deduction)}
                            </div>{' '}
                            +{' '}
                            <div
                              className=" p-1 border-2 border-gray-300 bg-gray-100 rounded-md"
                            >
                              10%
                            </div>{' '}
                            ={' '}
                            <div className="group relative p-1 border-2 border-gray-300  rounded-md ">
                              {formatPriceRound(gainTax.imposition_amount
                              )}
                            </div>
                          </section>
                        </section>
                      </section>
                    </div>
                    {isOpen && isDescOpen && (
                      <DetailDescription
                        isOpen={isDescOpen}
                        setIsOpen={setIsDescOpen}
                        modalType={modalType}
                        gainPrice={gainPrice}
                        gainTax={gainTax}
                        Info={Info}
                        date={date}
                      />
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition >
  );
};

export default Description;
