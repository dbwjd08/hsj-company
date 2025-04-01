import { tokenState } from '@/lib/auth';
import {
  useGetPropertiesUniversesIdPropertiesGet,
  useUpdatePropertyUniversesIdPropertiesPkPut,
} from '@/src/api/yuppieComponents';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
import format from 'date-fns/format';
import CalendarIcon from '@/public/calendar.svg';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

const GainSelect = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { default_universe_id, session_id } = useRecoilValue(tokenState);

  const { data: properties, refetch: refetchProperties } =
    useGetPropertiesUniversesIdPropertiesGet({
      pathParams: {
        id: default_universe_id!,
      },
    });

  const updateProperty = useUpdatePropertyUniversesIdPropertiesPkPut();

  const onUpdateProperty = ({
    pk,
    acquisitionDate,
    acqPrice,
    movingInDateTime,
    isStillLiving,
    livingYears,
  }: {
    pk: string;
    acquisitionDate: string;
    acqPrice?: number;
    movingInDateTime?: string;
    isStillLiving?: boolean;
    livingYears?: number;
  }) => {
    updateProperty
      .mutateAsync({
        body: {
          sessionId: session_id,
          acquisitionDateTime: acquisitionDate,
          acqPrice: acqPrice,
          movingInDateTime: movingInDateTime,
          isStillLiving: isStillLiving,
          livingYears: livingYears,
        },
        pathParams: {
          id: default_universe_id!,
          pk,
        },
      })
      .then(() => {
        setIsOpen(false);
      });
    refetchProperties();
  };

  const [selected, setSelected] = useState<any>();
  const [acquisitionDate, setAcquisitionDate] = useState(new Date());
  const [acquiredPrice, setAcquiredPrice] = useState(0);
  const [stillLiving, setStillLiving] = useState(false);
  const [livingYears, setLivingYears] = useState(0);
  const [movingInDateTime, setMovingInDateTime] = useState(new Date());
  const [gainPrice, setGainPrice] = useState(0);

  useEffect(() => {
    if (properties) setSelected(properties[0]);
  }, [properties]);

  useEffect(() => {
    setValues();
  }, [selected]);

  const setValues = () => {
    setAcquisitionDate(
      selected?.acquisition_date
        ? new Date(selected.acquisition_date)
        : new Date(),
    );
    setAcquiredPrice(selected?.acquired_price ?? 0);
    setStillLiving(selected?.still_living ?? false);
    setLivingYears(selected?.living_years ?? 0);
    setMovingInDateTime(
      selected?.moving_in_date ? new Date(selected.moving_in_date) : new Date(),
    );
  };

  const resetValues = () => {
    setAcquisitionDate(new Date());
    setAcquiredPrice(0);
    setStillLiving(false);
    setLivingYears(0);
    setMovingInDateTime(new Date());
  };

  if (!selected) return <div></div>;

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
              <Dialog.Panel className="w-full h-120 max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                >
                  <div className="py-4 text-primary font-bold text-[20px]">
                    매도할 부동산을 선택하세요
                  </div>
                </Dialog.Title>
                <Listbox value={selected} onChange={setSelected}>
                  <div className="relative mt-1 z-100">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 px-3 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">
                        {selected?.property.complex.complex_name}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        ▾
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                        {properties?.map((item) => (
                          <Listbox.Option
                            key={item.property.pk}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 px-3 ${
                                active
                                  ? 'bg-blue-50 text-blue-900'
                                  : 'text-gray-900'
                              }`
                            }
                            value={item}
                          >
                            {({ selected }) => (
                              <span
                                className={`block truncate ${
                                  selected ? 'font-medium' : 'font-normal'
                                }`}
                              >
                                {item.property.complex.complex_name}
                              </span>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
                <div className="pt-4">
                  <div className="pt-4 text-primary font-bold text-[20px]">
                    {' '}
                    부동산 정보{' '}
                  </div>
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
                      <div>
                        <input
                          type="number"
                          className="appearance-none w-40 text-right"
                          value={acquiredPrice}
                          onChange={(e) =>
                            setAcquiredPrice(Number(e.currentTarget.value))
                          }
                        />
                        <div>
                          <p className="text-right text-gray-400">
                            {formatPrice(acquiredPrice)}
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="border-b border-gray-900 py-4">
                    <label className="flex items-center justify-between">
                      <div className="text-primary font-bold w-24">
                        현재 거주 여부:
                      </div>
                      <select
                        className="w-40"
                        value={stillLiving ? 'true' : ''}
                        onChange={(e) =>
                          setStillLiving(!!e.currentTarget.value)
                        }
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
                </div>
                <div className="border-b border-gray-900 py-4">
                  <label className="flex items-center justify-between">
                    <div className="text-primary font-bold w-24">
                      예상 양도 금액:
                    </div>
                    <div>
                      <input
                        type="number"
                        className="appearance-none w-40 text-right"
                        value={gainPrice}
                        onChange={(e) =>
                          setGainPrice(Number(e.currentTarget.value))
                        }
                      />
                      <div>
                        <p className="text-right text-gray-400">
                          {formatPrice(gainPrice)}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
                <div className="relative flex gap-x-4 mb-10 pt-8">
                  <Link
                    href={{
                      pathname: '/dashboard/gainsTax',
                      query: {
                        pk: selected?.property.pk,
                        complex: selected?.property.complex.complex_name,
                        dong: selected?.property.dong,
                        ho: selected?.property.ho,
                        kindOf: selected?.kind_of,
                        share: selected?.share,
                        netLeasableArea: selected?.property.net_leasable_area,
                        ownershipType: selected?.ownership,
                        officialPrice: selected?.property.official_price,
                        movingInDate: format(
                          movingInDateTime,
                          'yyy-MM-dd',
                        ).toString(),
                        livingYears: livingYears,
                        stillLiving: stillLiving,
                        acquisitionDateTime: format(
                          acquisitionDate,
                          'yyy-MM-dd',
                        ).toString(),
                        acquisitionPrice: acquiredPrice,
                        numOfHousesSellerHas: properties?.length,
                        expectationSellingPrice: gainPrice,
                        propertyType: selected.property.complex.property_type,
                      },
                    }}
                    as="/dashboard/gainsTax"
                  >
                    <button
                      className="flex-1 px-2 py-1 bg-primary text-white text-sm"
                      onClick={() => {
                        onUpdateProperty({
                          pk: selected?.property.pk,
                          acquisitionDate: format(
                            acquisitionDate,
                            'yyy-MM-dd',
                          ).toString(),
                          acqPrice: acquiredPrice,
                          movingInDateTime: format(
                            movingInDateTime,
                            'yyy-MM-dd',
                          ).toString(),
                          isStillLiving: stillLiving,
                          livingYears: livingYears,
                        });
                      }}
                    >
                      <a> 양도세 계산하기</a>
                    </button>
                  </Link>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default GainSelect;
