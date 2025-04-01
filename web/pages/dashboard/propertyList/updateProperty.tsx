import { useState, useRef, Fragment, Dispatch, SetStateAction } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';
import ko from 'date-fns/locale/ko';
import { getPropertyName, formatPrice } from '@/lib/utils';
import CalendarIcon from '@/public/calendar.svg';

const UpdateProperty = ({
  propertyOwnership,
  isOpen,
  setIsOpen,
  onUpdateProperty,
}: {
  propertyOwnership: PropertyOwnership | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onUpdateProperty: ({
    pk,
    acquisitionDate,
    acquiredPrice,
    stillLiving,
    movingInDateTime,
    livingYears,
    ownership,
    share,
  }: {
    pk: string;
    acquisitionDate: Date;
    acquiredPrice: number;
    stillLiving: boolean;
    movingInDateTime?: Date;
    livingYears?: number;
    ownership: string;
    share: number;
  }) => void;
}) => {
  const titleRef = useRef(null);
  const [acquisitionDate, setAcquisitionDate] = useState(new Date());
  const [acquiredPrice, setAcquiredPrice] = useState(0);
  const [stillLiving, setStillLiving] = useState(false);
  const [livingYears, setLivingYears] = useState(0);
  const [ownership, setOwnership] = useState<string>();
  const [share, setShare] = useState<number>();

  const [movingInDateTime, setMovingInDateTime] = useState(new Date());
  const setValues = () => {
    setAcquisitionDate(
      parseISO(propertyOwnership?.acquisition_date ?? new Date().toISOString()),
    );
    setAcquiredPrice(propertyOwnership?.acquired_price ?? 0);
    setStillLiving(propertyOwnership?.still_living ?? false);
    setLivingYears(propertyOwnership?.living_years ?? 0);
    setMovingInDateTime(
      parseISO(propertyOwnership?.moving_in_date ?? new Date().toISOString()),
    );
    setShare(propertyOwnership?.share ? propertyOwnership?.share * 100 : 100);
    setOwnership(propertyOwnership?.ownership ?? 'wholly_mine');
  };
  const resetValues = () => {
    setAcquisitionDate(new Date());
    setAcquiredPrice(0);
    setStillLiving(false);
    setLivingYears(0);
    setMovingInDateTime(new Date());
    setShare(100);
    setOwnership('wholly_mine');
  };

  if (!propertyOwnership) {
    return <></>;
  }

  return (
    <Transition
      appear
      show={isOpen}
      as={Fragment}
      beforeEnter={setValues}
      afterLeave={resetValues}
    >
      <Dialog
        as="div"
        className="relative z-10 font-system"
        onClose={() => setIsOpen(false)}
        initialFocus={titleRef}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-6 py-10 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  ref={titleRef}
                  as="h3"
                  className="text-xl font-bold leading-6 text-gray-900 flex items-center justify-center p-5"
                >
                  {getPropertyName(propertyOwnership.property)}
                </Dialog.Title>
                <div className="border-b border-gray-900 py-4">
                  <label className="flex items-center justify-between">
                    <div className="text-primary font-bold w-24">
                      취득 날짜:
                    </div>
                    <DatePicker
                      wrapperClassName="relative flex-1 text-center"
                      locale={ko}
                      selected={acquisitionDate}
                      onChange={(date: Date) => setAcquisitionDate(date)}
                      dateFormat="yyyy년 M월 d일"
                      dateFormatCalendar=" "
                      showMonthDropdown
                      showYearDropdown
                    />
                    <CalendarIcon className="w-6 mr-3" />
                  </label>
                </div>
                <div className="border-b border-gray-900 py-4">
                  <label className="flex items-center justify-between">
                    <div className="text-primary font-bold w-24">
                      취득 금액:
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
                </div>
                <div className="border-b border-gray-900 py-4">
                  <label className="flex items-center justify-between">
                    <div className="text-primary font-bold w-24">
                      현재 거주 여부:
                    </div>
                    <select
                      className="w-40"
                      value={stillLiving ? 'true' : ''}
                      onChange={(e) => setStillLiving(!!e.currentTarget.value)}
                    >
                      <option value={''}>아니오</option>
                      <option value={'true'}>예</option>
                    </select>
                  </label>
                </div>
                {stillLiving && (
                  <div className="border-b border-gray-900 py-4">
                    <label className="flex items-center justify-between">
                      <div className="text-primary font-bold w-24">
                        입주 날짜:
                      </div>
                      <DatePicker
                        wrapperClassName="relative flex-1 text-center"
                        locale={ko}
                        selected={movingInDateTime}
                        onChange={(date: Date) => setMovingInDateTime(date)}
                        dateFormat="yyyy년 M월 d일"
                        popperPlacement="top"
                        dateFormatCalendar=" "
                        showMonthDropdown
                        showYearDropdown
                      />
                      <CalendarIcon className="w-6 mr-3" />
                    </label>
                  </div>
                )}
                {!stillLiving && (
                  <div className="border-b border-gray-900 py-4">
                    <label className="flex items-center justify-between">
                      <div className="text-primary font-bold w-24">
                        실거주 기간:
                      </div>
                      <select
                        className="w-40"
                        value={livingYears}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setLivingYears(Number(e.currentTarget.value))
                        }
                      >
                        {Array(51)
                          .fill(undefined)
                          .map((_item, index) => (
                            <option
                              key={index}
                              value={index}
                            >{`${index}년`}</option>
                          ))}
                      </select>
                    </label>
                  </div>
                )}

                <div className="border-b border-gray-900 py-4">
                  <label className="flex items-center justify-between">
                    <div className="text-primary font-bold w-20">소유권:</div>
                    <div className="flex flex-col gap-2">
                      <div>
                        <input
                          type="radio"
                          name="ownership"
                          value="wholly_mine"
                          id="wholly_mine"
                          className="mr-2"
                          checked={ownership === 'wholly_mine'}
                          onChange={(e) => {
                            setOwnership(e.currentTarget.value);
                            setShare(100);
                          }}
                        />
                        <label htmlFor="wholly_mine">단독명의</label>
                      </div>
                      <div className="w-50">
                        <input
                          type="radio"
                          name="ownership"
                          value="owned_with_spouse"
                          checked={ownership === 'owned_with_spouse'}
                          id="owned_with_spouse"
                          className="mr-2"
                          onChange={(e) => {
                            setOwnership(e.currentTarget.value);
                          }}
                        />
                        <label htmlFor="owned_with_spouse">
                          부부 공동 명의
                        </label>
                        <input
                          placeholder="내 지분율 (%)"
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          className="appearance-none border border-gray-300 ml-2 pl-2 w-32"
                          value={ownership === 'owned_with_spouse' ? share : ''}
                          onChange={(e) => {
                            if (
                              Number(e.currentTarget.value) < 0 ||
                              Number(e.currentTarget.value) > 100
                            ) {
                              alert('범위에서 벗어났습니다.');
                            } else {
                              setShare(Number(e.currentTarget.value));
                            }
                          }}
                        />
                      </div>
                    </div>
                  </label>
                </div>

                <div className="relative flex gap-x-4 mt-10 mb-10">
                  <button
                    className="flex-1 mt-4 px-2 py-1 bg-primary text-white text-sm"
                    onClick={() => {
                      onUpdateProperty({
                        pk: propertyOwnership.property.pk,
                        acquisitionDate,
                        acquiredPrice,
                        stillLiving,
                        movingInDateTime: stillLiving
                          ? movingInDateTime
                          : undefined,
                        livingYears: !stillLiving ? livingYears : undefined,
                        share: Number(share) * 0.01,
                        ownership: ownership as string,
                      });
                      setIsOpen(false);
                    }}
                  >
                    저장
                  </button>
                  <button
                    className="flex-1 mt-4 px-2 py-1 bg-primary text-white text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    취소
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

export default UpdateProperty;
