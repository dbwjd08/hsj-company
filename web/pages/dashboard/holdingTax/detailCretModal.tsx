import { Dispatch, SetStateAction, Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { formatPrice } from '@/lib/utils';
import TitleIcon from '@/public/modaltitle.svg';
import { modalInfoProp } from './detailCret';
import Loading from '@/pages/loading';
import { DETAIL_CRET_TABLE_DATA } from 'constants/tableData';
const DetailCretModal = ({
  isOpen,
  modalType,
  setIsOpen,
  cretInfo,
  modalInfo,
}: {
  isOpen: boolean;
  modalType: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  cretInfo: any;
  modalInfo: modalInfoProp[] | undefined;
}) => {
  const getModalTitle = () => {
    if (modalType === 'standard') {
      return '과세 표준액';
    } else if (modalType === 'taxrate') {
      return '누진세율';
    } else if (modalType === 'prop_deduction') {
      return '공제할 재산세';
    } else {
      return '세액 공제';
    }
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const deduction_price = () => {
    const standardPrice = cretInfo.tax_base;

    if (standardPrice <= 300000000) {
      return { id: 0, price1: 0, price2: 0 };
    } else if (standardPrice <= 600000000) {
      return { id: 1, price1: 600000, price2: 600000 };
    } else if (standardPrice <= 1200000000) {
      return { id: 2, price1: 2400000, price2: 2400000 };
    } else if (standardPrice <= 2500000000) {
      return { id: 2, price1: 6000000, price2: 14400000 };
    } else if (standardPrice <= 5000000000) {
      return { id: 2, price1: 11000000, price2: 39500000 };
    } else if (standardPrice <= 9400000000) {
      return { id: 2, price1: 36000000, price2: 89400000 };
    } else {
      return { id: 3, price1: 101800000, price2: 183400000 };
    }
  };

  const prop_deduction = () => {
    const standardPrice = cretInfo.sum_of_korean_house_official_price;

    if (standardPrice <= 60000000) {
      return { tax_rate: 0.001, price: 0 };
    } else if (standardPrice <= 150000000) {
      return { tax_rate: 0.0015, price: 30000 };
    } else if (standardPrice <= 300000000) {
      return { tax_rate: 0.0025, price: 180000 };
    } else {
      return { tax_rate: 0.004, price: 630000 };
    }
  };

  const getPropertySum = () => {
    let tmp_sum = 0;
    if (modalInfo) {
      for (let i = 0; i < modalInfo.length; i++) {
        tmp_sum += modalInfo[i].prop_price;
      }
    }
    return tmp_sum;
  };

  if (!modalInfo) return <Loading />;
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

                  {/* 과세 표준액 모달 */}
                  {modalType === 'standard' && (
                    <div className="w-full">
                      <section className="w-full mb-5">
                        <section className="w-full flex flex-col justify-center gap-3 font-medium text-gray-800 mb-5">
                          <div className="flex justify-center items-center gap-4">
                            {'('}
                            <div className=" p-1 border-2 border-purple-300 bg-purple-100 rounded-md">
                              내 주택 합계액
                            </div>
                            -
                            <div className=" p-1 border-2 border-green-600/70 bg-green-500/20 rounded-md">
                              내 공제 금액
                            </div>
                            {')'} ✕
                            <div className=" p-1 border-2 border-blue-300 bg-blue-100 rounded-md">
                              공정가액비율
                            </div>
                          </div>
                        </section>
                        <hr className="mb-5" />
                        <div className="font-medium text-xl px-2 bg-purple-50/80 rounded-lg w-fit mb-2">
                          ▸ 내가 보유한 주택 공시가격의 합계에서
                        </div>
                        {modalInfo.map((value) => {
                          return (
                            <section
                              key={value.pk}
                              className="font-normal text-lg text-gray-700"
                            >
                              <div className=" ml-3 text-neutral-900 font-bold">
                                • {value.name}
                              </div>
                              <div className=" ml-6">
                                {formatPrice(value.official_price)} ✕{' '}
                                {(value.share * 100).toFixed(0)}%
                              </div>
                            </section>
                          );
                        })}
                        <div className="font-normal text-lg ml-3">
                          총 :{' '}
                          <p className="inline underline decoration-wavy decoration-purple-500/70">
                            {formatPrice(
                              cretInfo.sum_of_korean_house_official_price,
                            )}
                          </p>
                        </div>
                      </section>
                      <section className="w-full mb-5">
                        <div className="font-medium text-xl px-2 bg-green-500/10 rounded-lg w-fit mb-2">
                          ▸ 공제 금액을 빼고
                        </div>
                        <div className="text-lg ml-3 text-gray-700">
                          {cretInfo.comment_for_initial_deduction}
                        </div>
                        <div className="text-lg ml-3">
                          •{' '}
                          {formatPrice(
                            cretInfo.sum_of_korean_house_official_price,
                          )}{' '}
                          - {formatPrice(cretInfo.initial_deduction)} ={' '}
                          <p className="inline underline decoration-wavy decoration-green-500/70">
                            {formatPrice(
                              cretInfo.sum_of_korean_house_official_price -
                                cretInfo.initial_deduction >
                                0
                                ? cretInfo.sum_of_korean_house_official_price -
                                    cretInfo.initial_deduction
                                : 0,
                            )}
                          </p>
                        </div>
                      </section>
                      <section className="w-full mb-5">
                        <div className="font-medium text-xl px-2 bg-blue-50/80 rounded-lg w-fit mb-2">
                          ▸ 공정시장가액 비율을 곱해줍니다.
                        </div>

                        <div className="text-lg ml-3">
                          •{' '}
                          {formatPrice(
                            cretInfo.sum_of_korean_house_official_price -
                              cretInfo.initial_deduction >
                              0
                              ? cretInfo.sum_of_korean_house_official_price -
                                  cretInfo.initial_deduction
                              : 0,
                          )}{' '}
                          ✕ {cretInfo.fair_value_rate * 100}% ={' '}
                          <p className="inline underline decoration-wavy decoration-blue-400">
                            {formatPrice(
                              cretInfo.sum_of_korean_house_official_price -
                                cretInfo.initial_deduction >
                                0
                                ? (cretInfo.sum_of_korean_house_official_price -
                                    cretInfo.initial_deduction) *
                                    cretInfo.fair_value_rate
                                : 0,
                            )}
                          </p>
                        </div>
                      </section>
                    </div>
                  )}

                  {/* 누진세율 모달 */}
                  {modalType === 'taxrate' && (
                    <div className="w-full">
                      <section className="w-full mb-5">
                        <div className="font-medium text-xl mb-1">
                          ▸ 재산세 누진세율 계산 방법
                        </div>
                        <div className="font-medium text-lg ml-3 text-gray-700">
                          귀하께서는 과세표준액이{' '}
                          {formatPrice(cretInfo.tax_base)}
                          <br />
                          세율이 {(cretInfo.tax_rate * 100).toFixed(2)}%
                          <br />
                          누진공제액이{' '}
                          {formatPrice(cretInfo.progressive_deduction)}이어서
                          <br />
                          누진세율을 적용하면 종합부동산세액은
                        </div>
                        <div className="text-lg ml-3 text-blue-900 font-semibold">
                          • {formatPrice(cretInfo.tax_base)} ✕{' '}
                          {(cretInfo.tax_rate * 100).toFixed(2)}% -{' '}
                          {formatPrice(cretInfo.progressive_deduction)} ={' '}
                          <p className="inline underline decoration-wavy decoration-cyan-400">
                            {formatPrice(
                              cretInfo.tax_base * cretInfo.tax_rate -
                                cretInfo.progressive_deduction,
                            )}{' '}
                          </p>
                          입니다.
                        </div>
                      </section>

                      <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-800 ">
                          <thead className="text-base text-center text-gray-700 bg-gray-50">
                            <tr>
                              <th colSpan={1} className="px-6 py-3 "></th>
                              <th colSpan={2} className="px-6 py-3">
                                일반(2주택 이하)
                              </th>
                              <th colSpan={2} className="px-6 py-3">
                                3주택 등
                              </th>
                            </tr>
                            <tr>
                              {[
                                '과세표준',
                                '세율',
                                '누진공제',
                                '세율',
                                '누진공제',
                              ].map((title, idx) => (
                                <th scope="col" className="px-6 py-3" key={idx}>
                                  {title}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {DETAIL_CRET_TABLE_DATA.map((value, idx) => (
                              <tr
                                className={` ${
                                  deduction_price().id === idx
                                    ? 'bg-blue-200'
                                    : 'bg-white'
                                }  border-b dark:bg-gray-800 dark:border-gray-700`}
                                key={idx}
                              >
                                <td className="px-6 py-4">{value.과세표준}</td>
                                <td className="px-6 py-4">{value.세율[0]}</td>
                                <td className="px-6 py-4">
                                  {value.누진공제[0]}
                                </td>
                                <td className="px-6 py-4">{value.세율[1]}</td>
                                <td className="px-6 py-4">
                                  {value.누진공제[1]}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 공제할 재산세 모달 */}
                  {modalType === 'prop_deduction' && (
                    <>
                      <div className="font-medium text-xl mb-5 p-3 rounded-xl bg-gray-50/50 text-gray-800">
                        종부세 과세표준금액에는 7월과 9월에 납부한 재산세에 이미
                        부과된 부분이 있어서
                        <br />
                        이중 과세를 방지하기 위해 공제를 해주게 됩니다.
                      </div>
                      <section className="w-full flex flex-col justify-center gap-3 font-medium text-gray-800 mb-6">
                        <div className="flex justify-center items-center gap-4">
                          <div className=" p-1 border-2 border-purple-300 bg-purple-100 rounded-md ">
                            내 지분만큼 납부한 재산세 합계액
                          </div>
                          ✕
                          <div className=" p-1 border-2 border-green-600/70 bg-green-500/20 rounded-md ">
                            과세표준 표준세율 재산세액
                          </div>
                          /
                          <div className=" p-1 border-2 border-blue-300 bg-blue-100 rounded-md ">
                            총 재산세 금액
                          </div>
                        </div>
                      </section>
                      <hr className="mb-5" />
                      <section className="w-full mb-10">
                        <div className="font-medium text-xl px-2 bg-purple-50/80 rounded-lg w-fit  mb-2">
                          ▸ 내 지분만큼 납부한 재산세 합계액
                        </div>
                        {modalInfo.map((value) => {
                          return (
                            <section
                              key={value.pk}
                              className="font-normal text-lg text-gray-700"
                            >
                              <div className=" ml-3 text-neutral-900 font-bold">
                                • {value.name}
                              </div>
                              <div className=" ml-6">
                                {formatPrice(value.prop_price)}
                              </div>
                            </section>
                          );
                        })}
                        <div className="font-medium text-lg ml-3">
                          → 총 :{' '}
                          <p className="inline underline decoration-wavy decoration-purple-400">
                            {formatPrice(getPropertySum())}
                          </p>
                        </div>
                      </section>
                      <section className="w-full mb-10">
                        <div className="font-medium text-xl px-2 bg-green-500/10 rounded-lg w-fit  mb-2">
                          ▸ 과세표준 표준세율 재산세액
                        </div>
                        <div className="text-lg ml-3 text-gray-700">
                          • 내 과세표준액 ({formatPrice(cretInfo.tax_base)}) ✕{' '}
                          {cretInfo.house_prop_tax_fair_value_rate * 100}%
                          (재산세 공정시장가액비율) ✕{' '}
                          {prop_deduction().tax_rate * 100}% (재산세 표준세율)
                        </div>

                        <div className="font-medium text-lg ml-3 ">
                          → 총 :{' '}
                          <p className="inline underline decoration-wavy decoration-green-500/60">
                            {formatPrice(
                              cretInfo.tax_base *
                                cretInfo.house_prop_tax_fair_value_rate *
                                prop_deduction().tax_rate,
                            )}
                          </p>
                        </div>
                      </section>
                      <section className="w-full mb-5">
                        <div className="font-medium text-xl px-2 bg-blue-50/80 rounded-lg w-fit  mb-2">
                          ▸ 총 재산세 금액
                        </div>
                        <div className="text-lg ml-3 text-gray-700">
                          • 내가 보유한 주택 공시가격의 합계 (
                          {formatPrice(
                            cretInfo.sum_of_korean_house_official_price,
                          )}
                          ) ✕ {cretInfo.house_prop_tax_fair_value_rate * 100}%
                          (재산세 공정시장가액비율)
                        </div>

                        <div className="text-lg ml-6 text-gray-700">
                          ={' '}
                          <p className="inline underline decoration-wavy decoration-gray-300">
                            {formatPrice(
                              cretInfo.sum_of_korean_house_official_price *
                                cretInfo.house_prop_tax_fair_value_rate,
                            )}
                          </p>
                        </div>

                        <div className="text-lg ml-3 text-gray-700">
                          • 재산세 누진세율을 적용하면
                        </div>
                        <div className="text-lg ml-6 text-gray-700">
                          {formatPrice(
                            cretInfo.sum_of_korean_house_official_price *
                              cretInfo.house_prop_tax_fair_value_rate,
                          )}{' '}
                          ✕ {prop_deduction().tax_rate * 100}% (재산세
                          공정시장가액비율) -{' '}
                          {formatPrice(prop_deduction().price)}
                        </div>
                        <div className="text-lg ml-6 text-gray-700">
                          ={' '}
                          <p className="inline underline decoration-wavy decoration-gray-300">
                            {formatPrice(
                              cretInfo.sum_of_korean_house_official_price *
                                cretInfo.house_prop_tax_fair_value_rate *
                                prop_deduction().tax_rate -
                                prop_deduction().price,
                            )}
                          </p>
                        </div>
                        <div className="font-medium text-lg ml-3">
                          → {formatPrice(getPropertySum())}✕{' '}
                          {formatPrice(
                            cretInfo.tax_base *
                              cretInfo.house_prop_tax_fair_value_rate *
                              prop_deduction().tax_rate,
                          )}{' '}
                          /{' '}
                          {formatPrice(
                            cretInfo.sum_of_korean_house_official_price *
                              cretInfo.house_prop_tax_fair_value_rate *
                              prop_deduction().tax_rate -
                              prop_deduction().price,
                          )}{' '}
                          ={' '}
                          <p className="inline underline decoration-wavy decoration-blue-400">
                            {formatPrice(cretInfo.deduction_from_double_count)}
                          </p>
                        </div>
                      </section>
                    </>
                  )}

                  {/* 세액공재 모달 */}
                  {modalType === 'deduction' && (
                    <>
                      <div className="font-medium text-xl text-gray-800 mb-2">
                        ▸ 세액공제 내역
                      </div>
                      <div className="font-medium text-lg text-gray-800">
                        귀하께서는 보유기간 별 공제율{' '}
                        {cretInfo.long_holding_final_deduction_rate * 100}%,
                        연령별 공제율
                        {cretInfo.old_final_deduction_rate * 100}%으로
                      </div>
                      <div className="font-medium text-lg text-gray-800 underline decoration-wavy decoration-cyan-400">
                        총 공제율은 {cretInfo.final_deduction_rate * 100}%
                        입니다.
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

export default DetailCretModal;
