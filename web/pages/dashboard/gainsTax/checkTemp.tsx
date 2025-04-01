import { tokenState } from '@/lib/auth';
import { useAmITmp2housesOwnerMvpKrAmITmp2housesOwnerPost } from '@/src/api/yuppieComponents';
import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO } from 'date-fns';
import ko from 'date-fns/locale/ko';
import format from 'date-fns/format';
import CalendarIcon from '@/public/calendar.svg';
import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import DefaultHouseTax from './defaultHouseTax';
import TempHouseTax from './tempHouseTax';

const CheckTemp = ({
  properties,
  onUpdateProperty,
  isOpen,
  setIsOpen,
  Info,
  sellingPrice,
  setSellingPrice,
}: {
  properties: PropertyOwnership[];
  onUpdateProperty: ({
    pk,
    acquisitionDate,
    livingYears,
  }: {
    pk: string;
    acquisitionDate: string;
    livingYears: number;
  }) => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  Info: any;
  sellingPrice: number;
  setSellingPrice: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { default_universe_id, session_id } = useRecoilValue(tokenState);

  const [enabled, setEnabled] = useState(
    !!session_id &&
      !!properties[0] &&
      !!properties[1] &&
      !!properties[0].acquisition_date &&
      !!properties[1].acquisition_date &&
      ((new Date(properties[0].acquisition_date) <=
        new Date(properties[1].acquisition_date) &&
        typeof properties[0].living_years === 'number') ||
        (new Date(properties[0].acquisition_date) >=
          new Date(properties[1].acquisition_date) &&
          typeof properties[1].living_years === 'number')),
  );

  const index = properties[0].property.pk == Info.pk ? 0 : 1;

  const today = new Date();

  const [dateOne, setDateOne] = useState(
    new Date(properties[0].acquisition_date ?? today),
  );
  const [dateTwo, setDateTwo] = useState(
    new Date(properties[1].acquisition_date ?? today),
  );

  const [livingOne, setLivingOne] = useState(
    typeof properties[0].living_years === 'number'
      ? properties[0].living_years
      : 0,
  );
  const [livingTwo, setLivingTwo] = useState(
    typeof properties[1].living_years === 'number'
      ? properties[1].living_years
      : 0,
  );

  useEffect(() => {
    if (index == 0) {
      setDateOne(new Date(Info.acquisitionDateTime));
      setLivingOne(Info.livingYears);
    } else {
      setDateTwo(new Date(Info.acquisitionDateTime));
      setLivingTwo(Info.livingYears);
    }
  }, []);

  const [showTax, setShowTax] = useState(false);

  const update = () => {
    onUpdateProperty({
      pk: properties[0].property.pk,
      acquisitionDate: format(parseISO(dateOne.toISOString()), 'yyyy-MM-dd'),
      livingYears: livingOne,
    });
    onUpdateProperty({
      pk: properties[1].property.pk,
      acquisitionDate: format(parseISO(dateTwo.toISOString()), 'yyyy-MM-dd'),
      livingYears: livingTwo,
    });
    setEnabled(true);
  };

  const { data }: any = useAmITmp2housesOwnerMvpKrAmITmp2housesOwnerPost(
    {
      body: {
        sessionId: session_id,
        myProperties: [
          {
            pk: properties[0] && properties[0].property.pk,
            kindOf: properties[0]?.kind_of as string,
            share: properties[0].share as number,
            netLeasableArea: properties[0].property.net_leasable_area as number,
            ownershipType: properties[0].ownership as string,
            officialPrice: properties[0].property.official_price as number,
            dong: properties[0].property.dong,
            ho: properties[0].property.ho,
            livingYears: livingOne,
            acquisitionDatetime:
              format(parseISO(dateOne.toISOString()), 'yyyy-MM-dd') +
              ' 00:00:00.000',
          },
          {
            pk: properties[1] && properties[1].property.pk,
            kindOf: properties[1]?.kind_of as string,
            share: properties[1].share as number,
            netLeasableArea: properties[1].property.net_leasable_area as number,
            ownershipType: properties[1].ownership as string,
            officialPrice: properties[1].property.official_price as number,
            dong: properties[1].property.dong,
            ho: properties[1].property.ho,
            livingYears: livingTwo,
            acquisitionDatetime:
              format(parseISO(dateTwo.toISOString()), 'yyyy-MM-dd') +
              ' 00:00:00.000',
          },
        ],
      },
    },
    {
      enabled,
    },
  );

  if (!showTax)
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
                <Dialog.Panel className="w-full h-120 max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                  >
                    <div className="py-4 text-primary font-bold text-[20px]">
                      일시적 2주택자 여부 확인하기
                    </div>
                  </Dialog.Title>
                  <div>
                    {!enabled && (
                      <div>
                        <div className="pt-4 text-primary font-bold text-[18px]">
                          {properties[0].property.complex.complex_name}{' '}
                          {properties[0].property.dong}{' '}
                          {properties[0].property.ho}
                        </div>
                        <div className="border-b border-gray-900 py-4">
                          <label className="flex items-center justify-between">
                            <div className="text-primary font-bold w-24">
                              취득 날짜:
                            </div>
                            <DatePicker
                              wrapperClassName="relative flex-1 text-center"
                              locale={ko}
                              selected={dateOne}
                              onChange={(date: Date) => setDateOne(date)}
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
                              실거주 기간:
                            </div>
                            <select
                              className="w-40"
                              value={livingOne}
                              onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>,
                              ) => setLivingOne(Number(e.currentTarget.value))}
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
                        <div className="pt-4 text-primary font-bold text-[18px]">
                          {properties[1].property.complex.complex_name}{' '}
                          {properties[1].property.dong}{' '}
                          {properties[1].property.ho}
                        </div>
                        <div className="border-b border-gray-900 py-4">
                          <label className="flex items-center justify-between">
                            <div className="text-primary font-bold w-24">
                              취득 날짜:
                            </div>
                            <DatePicker
                              wrapperClassName="relative flex-1 text-center"
                              locale={ko}
                              selected={dateTwo}
                              onChange={(date: Date) => setDateTwo(date)}
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
                              실거주 기간:
                            </div>
                            <select
                              className="w-40"
                              value={livingTwo}
                              onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>,
                              ) => setLivingTwo(Number(e.currentTarget.value))}
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
                        <button
                          className="w-full mt-5 px-2 py-1 bg-primary text-white text-sm"
                          onClick={() => update()}
                        >
                          조회하기
                        </button>
                      </div>
                    )}
                    {enabled && (
                      <div>
                        <div className=" text-primary font-semibold text-[18px]">
                          회원님은 {data?.income_tax.description.split(':')[1]}
                        </div>
                        <button
                          className="w-full mt-5 px-2 py-1 bg-primary text-white text-sm"
                          onClick={() => setShowTax(true)}
                        >
                          양도세 계산하기
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  else if (
    showTax &&
    data.income_tax.am_i_temp_two_owner == true &&
    new Date(Info.acquisitionDateTime) <= dateOne &&
    new Date(Info.acquisitionDateTime) <= dateTwo
  )
    return (
      <TempHouseTax
        Info={Info}
        properties={properties}
        sellingPrice={sellingPrice}
        setSellingPrice={setSellingPrice}
      />
    );
  else
    return (
      <DefaultHouseTax
        Info={Info}
        sellingPrice={sellingPrice}
        setSellingPrice={setSellingPrice}
      />
    );
};

export default CheckTemp;
