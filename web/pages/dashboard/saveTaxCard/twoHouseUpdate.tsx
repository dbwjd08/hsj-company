import { useState, Fragment, Dispatch, SetStateAction } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import { useUpdatePropertyUniversesIdPropertiesPkPut } from '@/src/api/yuppieComponents';
import { getPropertyName } from '@/lib/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AngleLeft from '@/public/angle-left.svg';
import CalendarIcon from '@/public/calendar.svg';
import { parseISO, format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import PropertyImage from '@/components/propertyImage';

const TwoHouseUpdate = ({
  isOpen,
  setIsOpen,
  oldProperty,
  newProperty,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  oldProperty: PropertyOwnership;
  newProperty: PropertyOwnership;
}) => {
  const queryClient = useQueryClient();

  const [oldPropertyAcquisitionDatetime, setOldPropertyAcquisitionDatetime] =
    useState(
      parseISO(oldProperty.acquisition_date ?? new Date().toISOString()),
    );
  const [newPropertyAcquisitionDatetime, setNewPropertyAcquisitionDatetime] =
    useState(
      parseISO(newProperty.acquisition_date ?? new Date().toISOString()),
    );
  const [oldPropertyLivingYears, setOldPropertyLivingYears] = useState(
    oldProperty.living_years ?? 0,
  );
  const [propertyAcqType, setPropertyAcqType] = useState(
    localStorage.getItem(
      `propertyAcqType:${oldProperty.property.pk}:${newProperty.property.pk}`,
    ) || 'after_construction',
  );

  const { default_universe_id, session_id } = useRecoilValue(tokenState);
  const updateProperty = useUpdatePropertyUniversesIdPropertiesPkPut();
  const onUpdateProperty = async () => {
    // store propertyAcqType in localStorage
    localStorage.setItem(
      `propertyAcqType:${oldProperty.property.pk}:${newProperty.property.pk}`,
      propertyAcqType,
    );
    console.log('setNewActType : ' + propertyAcqType);

    // update oldProperty
    await updateProperty.mutateAsync({
      body: {
        sessionId: session_id,
        acquisitionDateTime: format(
          oldPropertyAcquisitionDatetime,
          'yyyy-MM-dd',
        ),
        livingYears: oldPropertyLivingYears,
      },
      pathParams: {
        id: default_universe_id!,
        pk: oldProperty.property.pk,
      },
    });
    // update newProperty
    await updateProperty.mutateAsync({
      body: {
        sessionId: session_id,
        acquisitionDateTime: format(
          newPropertyAcquisitionDatetime,
          'yyyy-MM-dd',
        ),
      },
      pathParams: {
        id: default_universe_id!,
        pk: newProperty.property.pk,
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
                  <div className="flex-1 text-center">일시적 2주택자</div>
                </Dialog.Title>
                <h4 className="text-lg border-y bordre-gray-400 -mx-6 px-6 py-2 font-bold">
                  기존 주택과 신규 주택 취득 시점
                </h4>
                <div className="my-4 flex flex-col items-center justify-center">
                  <PropertyImage
                    className="w-16"
                    propertyType={oldProperty.property.complex.property_type}
                  />
                  <p className="text-center mt-4 font-bold">
                    {getPropertyName(oldProperty.property)}
                  </p>
                </div>
                <div className="border-b border-gray-900 py-4">
                  <label className="flex items-center justify-between">
                    <div className="text-primary font-bold w-24">
                      취득 날짜:
                    </div>
                    <DatePicker
                      wrapperClassName="relative flex-1 text-center"
                      locale={ko}
                      selected={oldPropertyAcquisitionDatetime}
                      onChange={(date: Date) =>
                        setOldPropertyAcquisitionDatetime(date)
                      }
                      dateFormat="yyyy년 M월 d일"
                      dateFormatCalendar=" "
                      showMonthDropdown
                      showYearDropdown
                    />
                    <CalendarIcon className="w-6 mr-3" />
                  </label>
                </div>
                <div className="py-4">
                  <label className="flex items-center">
                    <div className="text-primary font-bold w-24">
                      실거주 기간:
                    </div>
                    <select
                      className="border border-gray-900 rounded p-1 ml-10"
                      value={oldPropertyLivingYears}
                      onChange={(e) =>
                        setOldPropertyLivingYears(Number(e.currentTarget.value))
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

                <div className="my-4 flex flex-col items-center justify-center">
                  <PropertyImage
                    className="w-16"
                    propertyType={newProperty.property.complex.property_type}
                  />
                  <p className="text-center mt-4 font-bold">
                    {getPropertyName(newProperty.property)}
                  </p>
                </div>
                <div className="border-b border-gray-900">
                  <select
                    className="w-full py-4"
                    value={propertyAcqType}
                    onChange={(e) => setPropertyAcqType(e.currentTarget.value)}
                  >
                    <option value="after_construction">지어진 후에 취득</option>
                    <option value="right_to_purchase">분양권으로 취득</option>
                    <option value="right_to_residency">입주권으로 취득</option>
                  </select>
                  <p>
                    입주권 또는 분양권으로 신규 주택을 취득하신 경우에는
                    입주권/분양권의 취득 날짜를 입력해 주세요.
                  </p>
                </div>
                <div className="border-b border-gray-900 py-4">
                  <label className="flex items-center justify-between">
                    <div className="text-primary font-bold w-24">
                      취득 날짜:
                    </div>
                    <DatePicker
                      wrapperClassName="relative flex-1 text-center"
                      locale={ko}
                      selected={newPropertyAcquisitionDatetime}
                      onChange={(date: Date) =>
                        setNewPropertyAcquisitionDatetime(date)
                      }
                      dateFormat="yyyy년 M월 d일"
                      dateFormatCalendar=" "
                      showMonthDropdown
                      showYearDropdown
                    />
                    <CalendarIcon className="w-6 mr-3" />
                  </label>
                </div>
                <div className="relative flex gap-x-4 mt-10 mb-10">
                  <button
                    className="flex-1 mt-4 px-2 py-1 bg-primary text-white text-sm"
                    onClick={() => {
                      onUpdateProperty();
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

export default TwoHouseUpdate;
