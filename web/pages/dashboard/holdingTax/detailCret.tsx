import { GetPropertiesUniversesIdPropertiesGetResponse } from '@/src/api/yuppieComponents';
import { useState, useEffect, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { formatPrice, getPropertyName } from '@/lib/utils';
import DetailCretModal from './detailCretModal';
import one from '@/public/onefinger.png';
import two from '@/public/twofinger.png';
import three from '@/public/threefinger.png';
import four from '@/public/fourfinger.png';
import Image from 'next/image';
import Loading from '@/pages/loading';

export interface modalInfoProp {
  pk: string;
  name: string;
  official_price: number;
  share: number;
  prop_price: number;
}

const DetailCret = ({
  properties,
  cretInfo,
}: {
  properties: GetPropertiesUniversesIdPropertiesGetResponse | undefined;
  cretInfo: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalInfo, setModalInfo] = useState<modalInfoProp[]>();

  const [selectedInfo, setSelectedInfo] = useState('내 종부세');

  useEffect(() => {
    if (cretInfo && properties) {
      if (selectedInfo === '내 종부세') {
        const new_obj = cretInfo.me.payers_house_pks.map((pk: string) => {
          for (let i = 0; i < properties.length; i++) {
            if (properties[i].property.pk === pk) {
              return {
                pk: pk,
                name: getPropertyName(properties[i].property),
                official_price: properties[i].property.official_price,
                share: properties[i].share,
                prop_price: cretInfo.me.already_paid_property_tax[pk],
              };
            }
          }
        });
        setModalInfo(new_obj);
      } else {
        const new_obj = cretInfo.spouse.payers_house_pks.map((pk: string) => {
          for (let i = 0; i < properties.length; i++) {
            if (properties[i].property.pk === pk) {
              return {
                pk: pk,
                name: getPropertyName(properties[i].property),
                official_price: properties[i].property.official_price,
                share: 1 - Number(properties[i].share),
                prop_price: cretInfo.spouse.already_paid_property_tax[pk],
              };
            }
          }
        });
        setModalInfo(new_obj);
      }
    }
  }, [cretInfo, selectedInfo]);

  {
    if (!cretInfo) {
      return <Loading />;
    }
  }
  return (
    <div className="flex flex-col gap-4 h-full max-h-full">
      {' '}
      <Listbox value={selectedInfo} onChange={setSelectedInfo}>
        <div className="relative mt-1">
          <Listbox.Button
            style={{ backgroundColor: 'white' }}
            className="relative w-1/2 rounded-lg py-2 font-medium text-gray-700 bg-blue-50 focus:outline-none shadow-sm "
          >
            <span className="block truncate">{selectedInfo} ▾</span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-1/2 overflow-auto rounded-md bg-white p-1 shadow-lg focus:outline-none ">
              {['내 종부세', '배우자 종부세'].map(
                (item: string, idx: number) => (
                  <Listbox.Option
                    key={idx}
                    className={({ active }) =>
                      `relative text-center py-2 text-sm cursor-pointer ${active ? 'bg-blue-50 text-blue-800' : 'text-gray-900'
                      }`
                    }
                    value={item}
                  >
                    {({ selected }) => (
                      <span
                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                          }`}
                      >
                        {item}
                      </span>
                    )}
                  </Listbox.Option>
                ),
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      <section className="w-full h-1/4 bg-white rounded-2xl shadow-sm flex flex-col justify-center gap-3 font-medium text-gray-800">
        <div className="flex justify-center items-center gap-4">
          {'('}{' '}
          <div
            className=" p-1 border-2 border-red-300 bg-red-100 rounded-md cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              setModalType('standard');
            }}
          >
            과세 표준액
          </div>
          ✕
          <div
            className=" p-1 border-2 border-green-600 bg-green-200 rounded-md cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              setModalType('taxrate');
            }}
          >
            누진세율
          </div>
          -
          <div
            className=" p-1 border-2 border-orange-300 bg-orange-100 rounded-md cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              setModalType('prop_deduction');
            }}
          >
            공제할 재산세
          </div>
          {')'} <div>✕{` `}1.2</div>
        </div>
        <div className="flex justify-center items-center gap-4">
          -
          <div
            className="p-1 border-2 border-blue-400 bg-blue-200 rounded-md cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              setModalType('deduction');
            }}
          >
            세액공제 (해당 대상인 경우)
          </div>
          = 납부할 세액
        </div>
      </section>
      <section className="overflow-auto pb-5 h-3/4 scrollbar block font-medium text-gray-800">
        <section className="mb-7">
          <div className="text-lg font-semibold flex items-center">
            <Image
              src={one}
              alt="one"
              width={55}
              height={55}
              className="animate-bounce"
            ></Image>
            1. 종부세 과세 표준액을 구한 뒤 누진세율을 적용하고
          </div>

          <section className="flex justify-center gap-y-5 items-center flex-col">
            <div className="p-2 bg-slate-100 rounded-lg w-fit underline decoration-wavy decoration-green-400 font-medium text-gray-800">
              {' '}
              귀하의 과세 표준액:{' '}
              {selectedInfo == '내 종부세'
                ? formatPrice(cretInfo.me.tax_base)
                : formatPrice(cretInfo.spouse.tax_base)}
            </div>
            <div className="flex justify-center gap-3 items-center">
              <div
                className="group relative p-1 border-2 border-red-300 bg-red-100 rounded-md cursor-pointer"
                onClick={() => {
                  setIsOpen(true);
                  setModalType('standard');
                }}
              >
                <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                  과세 표준액
                </span>
                {selectedInfo == '내 종부세'
                  ? formatPrice(cretInfo.me.tax_base)
                  : formatPrice(cretInfo.spouse.tax_base)}
              </div>{' '}
              ✕{' '}
              <div
                className="group relative p-1 border-2 border-green-600 bg-green-200 rounded-md cursor-pointer"
                onClick={() => {
                  setIsOpen(true);
                  setModalType('taxrate');
                }}
              >
                <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                  누진세율
                </span>
                {selectedInfo == '내 종부세'
                  ? cretInfo.me.tax_rate.toFixed(2) + '%'
                  : cretInfo.spouse.tax_rate.toFixed(2) + '%'}
              </div>{' '}
              =
              <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
                <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                  종합부동산세액
                </span>
                약{' '}
                {selectedInfo == '내 종부세'
                  ? formatPrice(
                    Math.round(
                      (cretInfo.me.tax_base * cretInfo.me.tax_rate) / 10000,
                    ) *
                    10000 -
                    cretInfo.me.progressive_deduction,
                  )
                  : formatPrice(
                    Math.round(
                      (cretInfo.spouse.tax_base * cretInfo.spouse.tax_rate) /
                      10000,
                    ) *
                    10000 -
                    cretInfo.spouse.progressive_deduction,
                  )}
              </div>
            </div>
          </section>
        </section>
        <section className="mb-7">
          <div className="text-lg font-semibold flex items-center mb-2">
            <Image
              src={two}
              alt="two"
              width={60}
              height={60}
              className="animate-bounce"
            ></Image>
            2. 올해 납부한 재산세와의 이중과세를 방지하기 위해
            <br />
            중복분을 차감합니다.
          </div>

          <section className="flex flex-col justify-center gap-y-5 items-center">
            <div className=" p-2 bg-slate-100 rounded-lg w-fit underline decoration-wavy decoration-yellow-300 font-medium text-gray-800">
              {' '}
              귀하의 중복분: 약{' '}
              {selectedInfo == '내 종부세'
                ? formatPrice(
                  Math.round(
                    cretInfo.me.deduction_from_double_count / 10000,
                  ) * 10000,
                )
                : formatPrice(
                  Math.round(
                    cretInfo.spouse.deduction_from_double_count / 10000,
                  ) * 10000,
                )}
            </div>
            <div className="flex justify-center gap-3 items-center">
              <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
                <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                  종합부동산세액
                </span>
                약{' '}
                {selectedInfo == '내 종부세'
                  ? formatPrice(
                    Math.round(
                      (cretInfo.me.tax_base * cretInfo.me.tax_rate) / 10000,
                    ) *
                    10000 -
                    cretInfo.me.progressive_deduction,
                  )
                  : formatPrice(
                    Math.round(
                      (cretInfo.spouse.tax_base * cretInfo.spouse.tax_rate) /
                      10000,
                    ) *
                    10000 -
                    cretInfo.spouse.progressive_deduction,
                  )}
              </div>
              -{' '}
              <div
                className="group relative p-1 border-2 border-orange-300 bg-orange-100 rounded-md cursor-pointer"
                onClick={() => {
                  setIsOpen(true);
                  setModalType('prop_deduction');
                }}
              >
                <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                  공제할재산세
                </span>
                약{' '}
                {selectedInfo == '내 종부세'
                  ? formatPrice(
                    Math.round(
                      cretInfo.me.deduction_from_double_count / 10000,
                    ) * 10000,
                  )
                  : formatPrice(
                    Math.round(
                      cretInfo.spouse.deduction_from_double_count / 10000,
                    ) * 10000,
                  )}
              </div>{' '}
              =
              <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
                <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                  중복차감분
                </span>
                약{' '}
                {selectedInfo == '내 종부세'
                  ? formatPrice(
                    Math.round(
                      (cretInfo.me.tax_base * cretInfo.me.tax_rate) / 10000,
                    ) *
                    10000 -
                    cretInfo.me.progressive_deduction -
                    Math.round(
                      cretInfo.me.deduction_from_double_count / 10000,
                    ) *
                    10000,
                  )
                  : formatPrice(
                    Math.round(
                      (cretInfo.spouse.tax_base * cretInfo.spouse.tax_rate) /
                      10000,
                    ) *
                    10000 -
                    cretInfo.spouse.progressive_deduction -
                    Math.round(
                      cretInfo.spouse.deduction_from_double_count / 10000,
                    ) *
                    10000,
                  )}
              </div>
            </div>
          </section>
        </section>
        <section className="mb-7">
          <div className="text-lg font-semibold flex items-center mb-2">
            <Image
              src={three}
              alt="three"
              width={60}
              height={60}
              className="animate-bounce"
            ></Image>
            3. 농어촌특별세 20%를 추가합니다.
          </div>
          <section className="flex justify-center gap-3 items-center">
            <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
              {' '}
              <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                중복차감분
              </span>
              약{' '}
              {selectedInfo == '내 종부세'
                ? formatPrice(
                  Math.round(
                    (cretInfo.me.tax_base * cretInfo.me.tax_rate) / 10000,
                  ) *
                  10000 -
                  cretInfo.me.progressive_deduction -
                  Math.round(
                    cretInfo.me.deduction_from_double_count / 10000,
                  ) *
                  10000,
                )
                : formatPrice(
                  Math.round(
                    (cretInfo.spouse.tax_base * cretInfo.spouse.tax_rate) /
                    10000,
                  ) *
                  10000 -
                  cretInfo.spouse.progressive_deduction -
                  Math.round(
                    cretInfo.spouse.deduction_from_double_count / 10000,
                  ) *
                  10000,
                )}
            </div>
            ✕ <div>1.2</div>=
            <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
              {' '}
              <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                산출세액
              </span>
              약{' '}
              {selectedInfo == '내 종부세'
                ? formatPrice(
                  Math.round(
                    ((Math.round(
                      (cretInfo.me.tax_base * cretInfo.me.tax_rate) / 10000,
                    ) *
                      10000 -
                      cretInfo.me.progressive_deduction -
                      Math.round(
                        cretInfo.me.deduction_from_double_count / 10000,
                      ) *
                      10000) *
                      1.2) /
                    10000,
                  ) * 10000,
                )
                : formatPrice(
                  Math.round(
                    ((Math.round(
                      (cretInfo.spouse.tax_base * cretInfo.spouse.tax_rate) /
                      10000,
                    ) *
                      10000 -
                      cretInfo.spouse.progressive_deduction -
                      Math.round(
                        cretInfo.spouse.deduction_from_double_count / 10000,
                      ) *
                      10000) *
                      1.2) /
                    10000,
                  ) * 10000,
                )}
            </div>
          </section>
        </section>

        {cretInfo.me.final_deduction_rate > 0 && (
          <section className="flex flex-col items-center">
            <div className="text-lg font-semibold flex items-center self-start mb-2">
              <Image
                src={four}
                alt="four"
                width={60}
                height={60}
                className="animate-bounce"
              ></Image>
              4. 1세대 1주택자 세액공제가 적용됩니다.
            </div>
            <div className=" p-2 bg-slate-100 rounded-lg w-fit font-medium text-gray-800 mb-4">
              ✔︎ 1세대 1주택자 적용여부는 종부세 납부시 정말 중요한 문제입니다.
              <br />
              <p className="ml-5">
                하지만 다양한 조건이 있기에 적용받지 못할 수 있습니다.
              </p>
            </div>
            <section className="flex justify-center gap-3 items-center">
              <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
                {' '}
                <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                  산출세액
                </span>
                약{' '}
                {selectedInfo == '내 종부세'
                  ? formatPrice(cretInfo.me.imposition_amount)
                  : formatPrice(cretInfo.spouse.imposition_amount)}
              </div>
              ✕ (100% -
              <div
                className="group relative p-1 border-2 border-blue-400 bg-blue-200 rounded-md cursor-pointer"
                onClick={() => {
                  setIsOpen(true);
                  setModalType('deduction');
                }}
              >
                {' '}
                <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-[50px] px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                  세액공제
                </span>
                {cretInfo.me.final_deduction_rate * 100}%
              </div>
              ) =
              <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
                {' '}
                <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                  납부할세액
                </span>{' '}
                {selectedInfo == '내 종부세'
                  ? formatPrice(
                      cretInfo.me.imposition_amount *
                        cretInfo.me.final_deduction_rate,
                    )
                  : formatPrice(
                      cretInfo.spouse.imposition_amount *
                        cretInfo.spouse.final_deduction_rate,
                    )}
              </div>
            </section>
          </section>
        )}
      </section>
      {isOpen && (
        <DetailCretModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalType={modalType}
          cretInfo={
            selectedInfo === '내 종부세' ? cretInfo.me : cretInfo.spouse
          }
          modalInfo={modalInfo}
        />
      )}
    </div>
  );
};

export default DetailCret;
