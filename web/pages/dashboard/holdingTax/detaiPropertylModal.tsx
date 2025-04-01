import { Dispatch, SetStateAction, Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { getPropertyName } from '@/lib/utils';
import { Property } from '@/src/api/yuppieSchemas';
import { formatPrice } from '@/lib/utils';
import TitleIcon from '@/public/modaltitle.svg';
import { DETAIL_PROPERTY_TABLE_DATA } from 'constants/tableData';

const DetailPropertyModal = ({
  isOpen,
  modalType,
  setIsOpen,
  propertyTaxInfo,
  property,
}: {
  isOpen: boolean;
  modalType: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  propertyTaxInfo: any;
  property: Property;
}) => {
  const getModalTitle = () => {
    if (modalType === 'standard') {
      return '과세 표준액';
    } else if (modalType === 'taxrate') {
      return '누진세율';
    } else if (modalType === 'city') {
      return '도시 지역분';
    } else {
      return '지방 교육세';
    }
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const deduction = () => {
    const standardPrice =
      (property.official_price as number) *
      propertyTaxInfo[property.pk].fair_market_value_rate;

    if (standardPrice <= 60000000) {
      return { id: 0, price: 0 };
    } else if (standardPrice <= 150000000) {
      return { id: 1, price: 30000 };
    } else if (standardPrice <= 300000000) {
      return { id: 2, price: 180000 };
    } else {
      return { id: 3, price: 630000 };
    }
  };

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
              <Dialog.Panel className="flex rounded-2xl bg-white p-7 text-left align-middle shadow-xl transition-all">
                <div
                  className="fixed right-3 top-2 font-medium text-xl text-gray-400 cursor-pointer p-2"
                  onClick={() => closeModal()}
                >
                  ✕
                </div>
                <div className="flex flex-col mr-5">
                  <Dialog.Title className="text-2xl font-medium text-gray-800 mb-4 flex items-center p-2 bg-gray-50 rounded-2xl">
                    <TitleIcon className="w-[50px] animate-wiggle" />
                    {getModalTitle()}
                  </Dialog.Title>

                  {modalType === 'standard' && (
                    <div className="w-full">
                      <section className="w-full mb-5">
                        <div className="font-medium text-xl">
                          ▸ 과세 표준액은 공시가격과 공정시장가액비율로
                          결정됩니다.
                        </div>
                        <div className="font-normal text-lg ml-3">
                          {getPropertyName(property)}
                        </div>
                        <div className="font-normal text-lg ml-3">
                          공시가격: {formatPrice(property.official_price)}
                        </div>
                      </section>
                      <section>
                        <div className="font-medium text-xl">
                          ▸ {propertyTaxInfo[property.pk].comment_for_fair_rate}{' '}
                        </div>
                        <div className="font-normal text-lg ml-3">
                          {formatPrice(property.official_price)} *{' '}
                          {propertyTaxInfo[property.pk].fair_market_value_rate}{' '}
                          ={' '}
                          <p className="inline underline decoration-wavy decoration-cyan-400">
                            {formatPrice(
                              (property.official_price as number) *
                                propertyTaxInfo[property.pk]
                                  .fair_market_value_rate,
                            )}
                          </p>
                        </div>
                      </section>
                    </div>
                  )}

                  {modalType === 'taxrate' && (
                    <div className="w-full">
                      <section className="w-full mb-5">
                        <div className="font-medium text-xl mb-1">
                          ▸ 재산세 누진세율 계산 방법
                        </div>
                        <div className="font-medium text-lg ml-3 text-gray-700">
                          {getPropertyName(property)}

                          <div>
                            과세 표준액:{' '}
                            {formatPrice(
                              (property.official_price as number) *
                                propertyTaxInfo[property.pk]
                                  .fair_market_value_rate,
                            )}
                          </div>

                          <div>
                            세율:{' '}
                            {(
                              propertyTaxInfo[property.pk].tax_rate * 100
                            ).toFixed(2)}
                            %
                          </div>
                          <div>누진공제액:{formatPrice(deduction().price)}</div>
                          <hr className="my-3" />
                          <div>
                            누진세율을 적용한 재산 세액은
                            <br />{' '}
                            {formatPrice(
                              (property.official_price as number) *
                                propertyTaxInfo[property.pk].tax_rate,
                            )}{' '}
                            ✕{' '}
                            {(
                              propertyTaxInfo[property.pk].tax_rate * 100
                            ).toFixed(2)}
                            % - {formatPrice(deduction().price)}
                            <br />={' '}
                            <p className="inline underline decoration-wavy decoration-cyan-400">
                              {formatPrice(
                                propertyTaxInfo[property.pk]
                                  .my_basic_property_tax,
                              )}
                            </p>
                            입니다.
                          </div>
                        </div>
                      </section>

                      <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-800 dark:text-gray-400">
                          <thead className="text-base text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                              {['과세표준', '세율', '누진공제'].map(
                                (title, idx) => (
                                  <th
                                    scope="col"
                                    className="px-6 py-3"
                                    key={idx}
                                  >
                                    {title}
                                  </th>
                                ),
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {DETAIL_PROPERTY_TABLE_DATA.map((value, idx) => (
                              <tr
                                className={` ${
                                  deduction().id === idx
                                    ? 'bg-blue-200'
                                    : 'bg-white'
                                }  border-b dark:bg-gray-800 dark:border-gray-700`}
                                key={idx}
                              >
                                <td className="px-6 py-4">{value.과세표준}</td>
                                <td className="px-6 py-4">{value.세율}</td>
                                <td className="px-6 py-4">{value.누진공제}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {modalType === 'city' && (
                    <>
                      <div className="font-medium text-xl mb-3 p-3 rounded-xl bg-red-50/50 text-gray-800">
                        도시지역분은 도시지역에만 부과되는 세금으로,
                        <br />
                        도로개설유지 및 상하수도, 공원 등을 위한 세금입니다.
                      </div>
                      <div className="font-medium text-lg text-gray-800 ">
                        ▸ 과세표준액(
                        {formatPrice(propertyTaxInfo[property.pk].tax_base)}) ✕
                        0.14% ✕ 내 지분(
                        {propertyTaxInfo[property.pk].my_share * 100}%) ={' '}
                        <p className="inline underline decoration-wavy decoration-cyan-400">
                          {formatPrice(
                            propertyTaxInfo[property.pk].tax_base *
                              0.0014 *
                              propertyTaxInfo[property.pk].my_share,
                          )}
                        </p>
                      </div>
                    </>
                  )}

                  {modalType === 'local' && (
                    <>
                      <div className="font-medium text-xl mb-3 p-3 rounded-xl bg-red-50/50 text-gray-800">
                        지방 교육세는 지방교육의 질적 향상을 위한 세금입니다.
                      </div>
                      <div className="font-medium text-lg text-gray-800 text-center">
                        ▸ 내 재산세(
                        {formatPrice(
                          (property.official_price as number) *
                            propertyTaxInfo[property.pk]
                              .fair_market_value_rate *
                            propertyTaxInfo[property.pk].tax_rate -
                            deduction().price,
                        )}
                        ) ✕ 20.0% ={' '}
                        <p className="inline underline decoration-wavy decoration-cyan-400">
                          {formatPrice(
                            propertyTaxInfo[property.pk]
                              .my_suburban_education_tax,
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DetailPropertyModal;
