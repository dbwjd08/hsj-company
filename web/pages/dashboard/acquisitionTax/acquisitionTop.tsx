import { formatPrice } from '@/lib/utils';
import DatePicker from 'react-datepicker';
import CalendarIcon from '@/public/calendar.svg';
import Pencil from '@/public/pencil.svg';
import { Dialog, Transition } from '@headlessui/react';
import ko from 'date-fns/locale/ko';
import { useState, Fragment } from 'react';
import { tokenState } from '@/lib/auth';
import { useRecoilState, useRecoilValue } from 'recoil';
import { format } from 'date-fns';
import { useCreatePropertyUniversesIdPropertiesPost } from '@/src/api/yuppieComponents';
import { currentAcqPropertyState } from '@/lib/store';
import { toast } from 'react-toastify';
import Router from 'next/router';
import 'react-datepicker/dist/react-datepicker.css';

const AcquisitionTop = () => {
  const [acqProperty, setAcqProperty] = useRecoilState(currentAcqPropertyState);
  const { default_universe_id, session_id } = useRecoilValue(tokenState);

  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [acquiredPrice, setAcquiredPrice] = useState(0);
  const [acquisitionDate, setAcquisitionDate] = useState(new Date());

  const date = acqProperty?.acquisitionDatetime?.split('-');

  const addList = useCreatePropertyUniversesIdPropertiesPost();
  const onAddList = async () => {
    return await addList.mutateAsync({
      body: {
        share: Number(acqProperty?.share) / 100,
        ownership: acqProperty?.ownershipType,
        kindOf: acqProperty?.kindOf,
        acqPrice: acqProperty?.acquisitionPrice,
        acquisitionDateTime: acqProperty?.acquisitionDatetime,
        sessionId: session_id,
        pk: acqProperty?.property.apart_pk as string,
      },
      pathParams: {
        id: default_universe_id!,
      },
    });
  };
  if (!acqProperty) return <></>;
  return (
    <div className="flex flex-col gap-7 mb-10">
      <section className="flex gap-4 items-end justify-between">
        <div className="px-6 w-1/3 rounded-3xl py-4 text-2xl text-center font-bold text-blue-800 bg-[#FAFAFA] shadow-sm ">
          {acqProperty.complex} {acqProperty.property.dong}{' '}
          {acqProperty.property.ho}
        </div>
        <button
          className="font-semibold text-blue-900 cursor-pointer bg-blue-50 px-5 py-3 rounded-2xl hover:bg-blue-100"
          onClick={() => {
            onAddList();
            toast.success('부동산이 추가됐습니다!', {
              autoClose: 2000,
            });
            Router.push('/dashboard');
          }}
        >
          + 보유 부동산에 추가
        </button>
      </section>
      <div className="flex w-full gap-4">
        <section className="flex flex-col w-1/4 gap-2 border-2 border-gray-100 rounded-2xl p-6 justify-center items-center font-medium text-gray-800">
          <p className="font-bold text-xl text-blue-900"> 공시지가 </p>
          <p className="text-2xl">
            {formatPrice(acqProperty.property.official_price)}{' '}
          </p>
        </section>
        <section className="flex flex-col w-1/4 gap-2 border-2 border-gray-100 rounded-2xl p-6 justify-center items-center font-medium text-gray-800">
          <div className="flex gap-3 font-bold text-xl text-blue-900 items-center">
            예상 취득 일자{' '}
            <button
              className="appearance-none h-fit bg-gray-50 px-3 py-1 rounded-full flex flex-col items-center text-sm"
              onClick={() => setIsDateOpen(true)}
            >
              <Pencil className="w-5 " />
              {/* <span>수정</span> */}
            </button>
          </div>
          <p className="text-2xl">
            {' '}
            {date![0]}년 {date![1]}월 {date![2]}일
          </p>
        </section>
        <section className="flex flex-col w-1/2 gap-2 border-2 border-blue-600/40 rounded-2xl p-6 justify-center items-center font-medium text-gray-800">
          <div className="flex gap-3 font-bold text-xl text-blue-900 items-center">
            {' '}
            예상 취득 금액
            <button
              className="appearance-none h-fit bg-gray-50 px-3 py-1 rounded-full flex flex-col items-center text-sm"
              onClick={() => setIsPriceOpen(true)}
            >
              <Pencil className="w-5 " />
              {/* <span>수정</span> */}
            </button>
          </div>
          <p className="text-2xl">
            {' '}
            {formatPrice(acqProperty.acquisitionPrice)}{' '}
          </p>
        </section>
      </div>
      <Transition appear show={isDateOpen || isPriceOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 font-system"
          onClose={() => {
            setIsPriceOpen(false);
            setIsDateOpen(false);
          }}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-gray-900 flex items-center bg-gray-50 p-3 rounded-xl"
                  >
                    <Pencil className="w-6 mr-3 " />

                    {isDateOpen ? ' 취득 날짜 변경' : '취득 금액 변경'}
                  </Dialog.Title>

                  <div
                    className={`${
                      isDateOpen && 'h-72'
                    } "border-b border-gray-900 py-4`}
                  >
                    {isDateOpen ? (
                      <label className="flex items-center justify-between text-lg">
                        <div className="text-primary font-bold">
                          예상 취득 일자:
                        </div>
                        <DatePicker
                          wrapperClassName="relative flex-1 text-center cursor-pointer"
                          locale={ko}
                          selected={acquisitionDate}
                          onChange={(date: Date) => setAcquisitionDate(date)}
                          dateFormat="yyyy년 M월 d일"
                          dateFormatCalendar=" "
                          showMonthDropdown
                          showYearDropdown
                        />
                        <CalendarIcon className="w-6 ml-[-2rem]" />
                      </label>
                    ) : (
                      <>
                        <label className="flex items-center justify-between text-lg">
                          <div className="text-primary font-bold">
                            예상 취득 금액:
                          </div>
                          <input
                            type="number"
                            className="appearance-none w-40 text-right"
                            value={acquiredPrice}
                            onChange={(e) =>
                              setAcquiredPrice(Number(e.currentTarget.value))
                            }
                          />
                        </label>
                        <div>
                          <p className="text-right text-gray-400">
                            {formatPrice(acquiredPrice)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    className="mt-4 px-3 py-2 bg-primary text-white text-sm rounded-lg"
                    onClick={() => {
                      {
                        isDateOpen
                          ? setAcqProperty((prev: any) => {
                              let newCondition = { ...prev };
                              newCondition.acquisitionDatetime = format(
                                acquisitionDate,
                                'yyyy-MM-dd',
                              ).toString();
                              return newCondition;
                            })
                          : setAcqProperty((prev: any) => {
                              let newCondition = { ...prev };
                              newCondition.acquisitionPrice = acquiredPrice;
                              return newCondition;
                            });
                      }
                      setIsDateOpen(false);
                      setIsPriceOpen(false);
                    }}
                  >
                    수정
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AcquisitionTop;
