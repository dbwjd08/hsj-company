import { tokenState } from '@/lib/auth';
import { useGetPropertiesUniversesIdPropertiesGet } from '@/src/api/yuppieComponents';
import { Dialog, Transition } from '@headlessui/react';
import { Dispatch, Fragment, SetStateAction } from 'react';
import { useRecoilValue } from 'recoil';
import {
  DETAIL_ACQ_TABLE_DATA,
  DETAIL_EDU_TABLE_DATA,
  DETAIL_RURAL_TABLE_DATA,
} from 'constants/tableData';

const DetailDescModal = ({
  isOpen,
  setIsOpen,
  modalType,
  property,
  propertyName,
  acPrice,
  taxInfo,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  modalType: string;
  property: any;
  propertyName: string;
  acPrice: string;
  taxInfo: string;
}) => {
  const { default_universe_id, session_id } = useRecoilValue(tokenState);

  const { data: properties } = useGetPropertiesUniversesIdPropertiesGet({
    pathParams: {
      id: default_universe_id!,
    },
  });

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

                {modalType == 'acq' && (
                  <div className="flex flex-col mr-5 w-[35rem]">
                    <Dialog.Title className="text-2xl font-system_semibold text-gray-800 mb-4 flex items-center py-2 px-4  bg-green-500/20 rounded-2xl">
                      취득세율 계산 방법
                    </Dialog.Title>
                    <div>
                      <div className="mb-4 text-lg text-center">
                        <p>
                          <p className="inline font-system_semibold text-xl text-blue-900">
                            {' '}
                            {propertyName} {property.dong} {property.ho}
                          </p>{' '}
                          취득 시 귀하는{' '}
                          <p className="inline font-system_semibold text-xl text-blue-900">
                            {properties ? properties.length + 1 : 1}
                            주택자
                          </p>
                          에 해당되며 <br />
                          취득가액은{' '}
                          <p className="inline font-system_semibold text-xl text-blue-900">
                            {acPrice}
                          </p>
                          으로 {taxInfo}
                          %의 세율이 적용됩니다.
                        </p>
                      </div>
                      <div className="relative overflow-x-auto mt-2">
                        <table className="w-full text-left text-gray-800 ">
                          <thead className="text-base text-center text-gray-700 bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 w-20">주택</th>
                              <th className="px-6 py-3 w-24">구분</th>
                              <th className="px-6 py-3 w-32">취득세율</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {DETAIL_ACQ_TABLE_DATA.map((item, idx) => {
                              const el = [];
                              el.push(
                                item.info.map((child, index) => {
                                  return (
                                    <tr
                                      key={index}
                                      className="border-b dark:bg-gray-800 dark:border-gray-700"
                                    >
                                      {!index && (
                                        <td rowSpan={item.info.length}>
                                          {item.주택}
                                        </td>
                                      )}
                                      <Fragment>
                                        <td>{child.구분}</td>
                                        <td>{child.취득세율}</td>
                                      </Fragment>
                                    </tr>
                                  );
                                }),
                              );
                              return el;
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {modalType == 'rural' && (
                  <div className="flex flex-col mr-5">
                    <Dialog.Title className="text-2xl font-system_semibold text-gray-800 mb-4 flex items-center py-2 px-4 bg-blue-100 rounded-2xl">
                      농어촌특별세율 계산 방법
                    </Dialog.Title>
                    <div>
                      <div className="mb-4 text-lg text-center">
                        <p>
                          농어촌특별세율은 전용면적 85m2 초과 주택에만
                          부과됩니다.
                        </p>
                        <p>
                          귀하는{' '}
                          <p className="inline font-system_semibold text-xl text-blue-900">
                            {taxInfo}%
                          </p>
                          의 세율이 적용됩니다
                        </p>
                      </div>
                      <div className="relative overflow-x-auto mt-2">
                        <table className="w-full text-left text-gray-800 ">
                          <thead className="text-base text-center text-gray-700 bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 w-20">주택</th>
                              <th className="px-6 py-3 w-24">구분</th>
                              <th className="px-6 py-3 w-32">농어촌특별세율</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {DETAIL_RURAL_TABLE_DATA.map((item, idx) => {
                              const el = [];
                              el.push(
                                item.info.map((child, index) => {
                                  return (
                                    <tr
                                      key={index}
                                      className="border-b dark:bg-gray-800 dark:border-gray-700"
                                    >
                                      {!index && (
                                        <td rowSpan={item.info.length}>
                                          {item.주택}
                                        </td>
                                      )}
                                      <Fragment>
                                        <td>{child.구분}</td>
                                        <td>{child.농어촌특별세율}</td>
                                      </Fragment>
                                    </tr>
                                  );
                                }),
                              );
                              return el;
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {modalType == 'edu' && (
                  <div className="flex flex-col mr-5 w-96">
                    <Dialog.Title className="text-2xl font-system_semibold text-gray-800 mb-4 flex items-center py-2 px-4  bg-purple-100 rounded-2xl">
                      지방교육세율 계산 방법
                    </Dialog.Title>
                    <div>
                      <div className="text-lg mb-4">
                        <p>
                          <p className="inline font-system_semibold text-xl text-blue-900">
                            {taxInfo}%
                          </p>
                          의 세율이 적용됩니다.
                        </p>
                      </div>
                      <div className="relative overflow-x-auto mt-2">
                        <table className="w-full text-left text-gray-800 ">
                          <thead className="text-base text-center text-gray-700 bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 w-20">주택</th>
                              <th className="px-6 py-3 w-24">구분</th>
                              <th className="px-6 py-3 w-32">취득세율</th>
                            </tr>
                          </thead>
                          <tbody className="text-center">
                            {DETAIL_EDU_TABLE_DATA.map((item, idx) => {
                              const el = [];
                              el.push(
                                item.info.map((child, index) => {
                                  return (
                                    <tr
                                      key={index}
                                      className="border-b dark:bg-gray-800 dark:border-gray-700"
                                    >
                                      {!index && (
                                        <td rowSpan={item.info.length}>
                                          {item.주택}
                                        </td>
                                      )}
                                      <Fragment>
                                        <td>{child.구분}</td>
                                        <td>{child.지방교육세율}</td>
                                      </Fragment>
                                    </tr>
                                  );
                                }),
                              );
                              return el;
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {modalType == 'base' && (
                  <div className="flex flex-col mr-5">
                    <Dialog.Title className="text-2xl font-system_semibold text-gray-800 mb-4 flex items-center py-2 px-4 bg-red-100/70 rounded-2xl">
                      과세표준액 계산 방법
                    </Dialog.Title>
                    <div className="w-full">
                      <div className="text-lg">
                        <p>2023년부터 과세표준액은 취득가액으로 설정됩니다.</p>
                        <p>
                          <p className="inline font-system_semibold text-xl text-blue-900">
                            {propertyName} {property.dong} {property.ho}
                          </p>{' '}
                          과세표준액은
                          <p className="inline font-system_semibold text-xl text-blue-900">
                            {acPrice}
                          </p>
                          입니다.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default DetailDescModal;
