import { useState, Fragment, Dispatch, SetStateAction } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import { useUpdatePropertyUniversesIdPropertiesPkPut } from '@/src/api/yuppieComponents';
import PropertyImage from '@/components/propertyImage';
import { getPropertyName } from '@/lib/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AngleLeft from '@/public/angle-left.svg';
import CalendarIcon from '@/public/calendar.svg';
import { format, parseISO } from 'date-fns';
import ko from 'date-fns/locale/ko';

const OneHouseUpdate = ({
  isOpen,
  setIsOpen,
  propertyOwnership,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  propertyOwnership: PropertyOwnership;
}) => {
  const queryClient = useQueryClient();

  const [acquisitionDate, setAcquisitionDate] = useState(
    parseISO(propertyOwnership.acquisition_date ?? new Date().toISOString()),
  );
  const [stillLiving, setStillLiving] = useState(
    propertyOwnership.still_living ?? true,
  );
  const [livingYears, setLivingYears] = useState(
    propertyOwnership.living_years ?? 0,
  );
  const [movingInDateTime, setMovingInDateTime] = useState(
    parseISO(propertyOwnership.moving_in_date ?? new Date().toISOString()),
  );
  const [livingStatus, setLivingStatus] = useState<
    'stillLiving' | 'livingYears' | 'never'
  >(propertyOwnership.still_living ? 'stillLiving' : 'livingYears');

  const onRadioChange = (value: string) => {
    if (value === 'stillLiving') {
      setLivingStatus(value);
      setStillLiving(true);
      setLivingYears(0);
    } else if (value === 'livingYears') {
      setLivingStatus(value);
      setStillLiving(false);
      setLivingYears(0);
    } else if (value === 'never') {
      setLivingStatus(value);
      setStillLiving(false);
      setLivingYears(0);
    }
  };

  const { default_universe_id, session_id } = useRecoilValue(tokenState);
  const updateProperty = useUpdatePropertyUniversesIdPropertiesPkPut();
  const onUpdateProperty = async ({
    pk,
    acquisitionDate,
    stillLiving,
    livingYears,
    movingInDateTime,
  }: {
    pk: string;
    acquisitionDate: Date;
    stillLiving: boolean;
    livingYears?: number;
    movingInDateTime?: Date;
  }) => {
    await updateProperty.mutateAsync({
      body: {
        sessionId: session_id,
        acquisitionDateTime: format(acquisitionDate, 'yyyy-MM-dd'),
        isStillLiving: stillLiving,
        movingInDateTime:
          stillLiving && movingInDateTime
            ? format(movingInDateTime, 'yyyy-MM-dd')
            : undefined,
        livingYears: !stillLiving ? livingYears : undefined,
      },
      pathParams: {
        id: default_universe_id!,
        pk,
      },
    });
    queryClient.invalidateQueries([
      'universes',
      default_universe_id,
      'properties',
    ]);
  };

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-gray-900 flex items-center p-5"
                >
                  <button className="-ml-5" onClick={() => setIsOpen(false)}>
                    <AngleLeft className="w-5 inline-block" />
                  </button>
                  <div className="flex-1 text-center">추가 질문</div>
                </Dialog.Title>
                <h4 className="text-lg border-y bordre-gray-400 -mx-6 px-6 py-2 font-bold">
                  기존 주택 취득 날짜
                </h4>
                <div className="my-4 flex flex-col items-center justify-center">
                  <PropertyImage
                    className="w-16"
                    propertyType={
                      propertyOwnership.property.complex.property_type
                    }
                  />
                  <p className="text-center mt-4">
                    <span className="font-bold">
                      {getPropertyName(propertyOwnership.property)}에 대한
                    </span>
                    <br />
                    취득일(소유권 이전일/잔금을 낸 날)이 언제입니까?
                  </p>
                </div>
                <div className="border-b border-gray-900 pb-4">
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

                <h4 className="text-lg border-y bordre-gray-400 mt-8 -mx-6 px-6 py-2 font-bold">
                  기존 주택 실거주 기간
                </h4>
                <div className="my-4 flex flex-col items-center justify-center">
                  <PropertyImage
                    className="w-16"
                    propertyType={
                      propertyOwnership.property.complex.property_type
                    }
                  />
                  <p className="text-center mt-4">
                    <span className="font-bold">
                      {getPropertyName(propertyOwnership.property)}에
                    </span>
                    <br />
                    얼마동안 실제로 거주하셨나요?
                  </p>
                </div>

                <div className="mt-4">
                  <input
                    type="radio"
                    name="livingStatus"
                    value="stillLiving"
                    id="stillLiving"
                    className="mr-2"
                    checked={livingStatus === 'stillLiving'}
                    onChange={(e) => onRadioChange(e.currentTarget.value)}
                  />
                  <label htmlFor="stillLiving">계속 살고 있어요.</label>
                  <div className="flex w-full pl-5 mt-2">
                    <div className="border-b border-gray-900 pb-4 flex items-center justify-between">
                      <label className="text-primary font-bold w-24">
                        입주 날짜:
                      </label>
                      <DatePicker
                        wrapperClassName="relative flex-1 text-center"
                        locale={ko}
                        disabled={!stillLiving}
                        selected={movingInDateTime}
                        onChange={(date: Date) => setMovingInDateTime(date)}
                        dateFormat="yyyy년 M월 d일"
                        dateFormatCalendar=" "
                        showMonthDropdown
                        showYearDropdown
                      />
                      <CalendarIcon className="w-6 mr-3" />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <input
                    type="radio"
                    name="livingStatus"
                    value="livingYears"
                    id="livingYears"
                    className="mr-2"
                    checked={livingStatus === 'livingYears'}
                    onChange={(e) => onRadioChange(e.currentTarget.value)}
                  />
                  <select
                    className="border border-gray-900 rounded p-1 mr-2"
                    value={livingYears}
                    disabled={livingStatus !== 'livingYears'}
                    onChange={(e) =>
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
                  <label htmlFor="livingYears">
                    년 살았고 지금은 살지 않아요.
                  </label>
                </div>
                <div className="mt-4">
                  <input
                    type="radio"
                    name="livingStatus"
                    value="never"
                    id="never"
                    className="mr-2"
                    checked={livingStatus === 'never'}
                    onChange={(e) => onRadioChange(e.currentTarget.value)}
                  />
                  <label htmlFor="never">거주한 적 없어요.</label>
                </div>
                <div className="relative flex gap-x-4 mt-10 mb-10">
                  <button
                    className="flex-1 mt-4 px-2 py-1 bg-primary text-white text-sm"
                    onClick={() => {
                      onUpdateProperty({
                        pk: propertyOwnership.property.pk,
                        acquisitionDate,
                        stillLiving,
                        movingInDateTime: stillLiving
                          ? movingInDateTime
                          : undefined,
                        livingYears: !stillLiving ? livingYears : undefined,
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

export default OneHouseUpdate;
