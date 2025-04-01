import { useCalculateKrPropertyTaxMvpKrPropertyTaxCalculatePost } from '@/src/api/yuppieComponents';
import { GetPropertiesUniversesIdPropertiesGetResponse } from '@/src/api/yuppieComponents';
import { format, parseISO } from 'date-fns';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import { useState, useEffect, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { getPropertyName } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import DetailPropertyModal from './detaiPropertylModal';
import one from '@/public/onefinger.png';
import two from '@/public/twofinger.png';
import three from '@/public/threefinger.png';
import { getJsonHouse } from '@/lib/utils';
import Loading from '@/pages/loading';
import Image from 'next/image';

const DetailPropertyTax = ({
  properties,
}: {
  properties: GetPropertiesUniversesIdPropertiesGetResponse | undefined;
}) => {
  const { session_id } = useRecoilValue(tokenState);
  const [propertyTaxInfo, setPropertyTaxInfo] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const [selectedProperty, setSelectedProperty] = useState<any>();

  const getPropertyTax = async () => {
    return await propertyTaxMutate
      .mutateAsync({
        body: {
          sessionId: session_id as string,
          taxYear: new Date().getFullYear(),
          koreanProperties: properties
            ?.map((value) => {
              const date = new Date();
              if (
                new Date(value.acquisition_date as string) <
                new Date(date.getFullYear() + '-06-01')
              ) {
                return getJsonHouse(value);
              }
            })
            .filter((element) => element) as any,
        },
      })
      .then((res) => {
        setPropertyTaxInfo(res);
      });
  };

  const propertyTaxMutate =
    useCalculateKrPropertyTaxMvpKrPropertyTaxCalculatePost();

  useEffect(() => {
    if (properties) {
      getPropertyTax();
      for (let i = 0; i < properties.length; i++) {
        if (
          properties[i].acquisition_date &&
          new Date(properties[i].acquisition_date as string) <
          new Date(new Date().getFullYear().toString() + '-06-01')
        ) {
          setSelectedProperty(properties[i].property);
          break;
        }
      }
    }
  }, [properties]);

  {
    if (!propertyTaxInfo || !selectedProperty) {
      return <Loading />;
    }
  }
  return (
    <div className="flex flex-col gap-4 h-full max-h-full">
      {' '}
      <Listbox value={selectedProperty} onChange={setSelectedProperty}>
        <div className="relative mt-1">
          <Listbox.Button
            style={{ backgroundColor: 'white' }}
            className="relative px-5 rounded-lg py-2 font-medium text-gray-700 bg-blue-50 focus:outline-none shadow-sm "
          >
            <span className="block truncate">
              {getPropertyName(selectedProperty)} ▾
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-1/2 overflow-auto rounded-md bg-white p-1 shadow-lg focus:outline-none ">
              {properties &&
                properties?.map(
                  (item: any) =>
                    new Date(item.acquisition_date) <
                    new Date(
                      new Date().getFullYear().toString() + '-06-01',
                    ) && (
                      <Listbox.Option
                        key={item.property.pk}
                        className={({ active }) =>
                          `relative text-center py-2 text-sm cursor-pointer ${active
                            ? 'bg-blue-50 text-blue-800'
                            : 'text-gray-900'
                          }`
                        }
                        value={item.property}
                      >
                        {({ selected }) => (
                          <span
                            className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                              }`}
                          >
                            {getPropertyName(item.property)}
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
          ✕
          <div className=" p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
            내 지분
          </div>
          {')'}
        </div>
        <div className="flex justify-center items-center gap-4">
          +
          <div
            className="p-1 border-2 border-blue-400 bg-blue-200 rounded-md cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              setModalType('city');
            }}
          >
            도시지역분
          </div>
          +
          <div
            className=" p-1 border-2 border-purple-400 bg-purple-200 rounded-md cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              setModalType('local');
            }}
          >
            지방교육세
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
            1. 재산세 과세 표준액을 구한 뒤
          </div>

          <div className="ml-14 p-2 bg-slate-100 rounded-lg w-fit underline decoration-wavy decoration-green-400 font-medium text-gray-800">
            {' '}
            {getPropertyName(selectedProperty)}의 과세 표준액:{' '}
            {formatPrice(propertyTaxInfo[selectedProperty?.pk].tax_base)}
          </div>
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
            2. 과세 표준액에 누진세율을 적용하고 내 지분을 곱하면
            <br />내 재산세가 나옵니다.
          </div>
          <section className="flex justify-center gap-3 items-center">
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
              {formatPrice(propertyTaxInfo[selectedProperty?.pk].tax_base)}
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
              {(propertyTaxInfo[selectedProperty.pk].tax_rate * 100).toFixed(2)}
              %
            </div>{' '}
            ✕
            <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
              <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                내지분
              </span>
              {propertyTaxInfo[selectedProperty.pk].my_share * 100}%
            </div>
            =
            <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
              <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                내 재산세
              </span>
              약{' '}
              {formatPrice(
                Math.round(
                  propertyTaxInfo[selectedProperty?.pk].my_basic_property_tax /
                  10000,
                ) * 10000,
              )}
            </div>
          </section>
        </section>
        <section>
          <div className="text-lg font-semibold flex items-center mb-2">
            <Image
              src={three}
              alt="three"
              width={60}
              height={60}
              className="animate-bounce"
            ></Image>
            3. 내 재산세에 도시지역분과 지방교육세를 합쳐서 <br />
            이를 7월,9월에 절반씩 나눠서 납부합니다.
          </div>
          <section className="flex justify-center gap-3 items-center">
            <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
              {' '}
              <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                내 재산세
              </span>
              약{' '}
              {formatPrice(
                Math.round(
                  propertyTaxInfo[selectedProperty?.pk].my_basic_property_tax /
                  10000,
                ) * 10000,
              )}
            </div>
            +{' '}
            <div
              className="group relative p-1 border-2 border-blue-400 bg-blue-200 rounded-md cursor-pointer"
              onClick={() => {
                setIsOpen(true);
                setModalType('city');
              }}
            >
              <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                도시지역분
              </span>
              약{' '}
              {formatPrice(
                Math.round(
                  propertyTaxInfo[selectedProperty.pk].my_city_tax / 10000,
                ) * 10000,
              )}
            </div>
            +
            <div
              className="group relative p-1 border-2 border-purple-400 bg-purple-200 rounded-md cursor-pointer"
              onClick={() => {
                setIsOpen(true);
                setModalType('local');
              }}
            >
              {' '}
              <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                지방교육세
              </span>
              약{' '}
              {formatPrice(
                Math.round(
                  propertyTaxInfo[selectedProperty.pk]
                    .my_suburban_education_tax / 10000,
                ) * 10000,
              )}
            </div>
            =
            <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
              {' '}
              <span className="absolute hidden group-hover:flex -top-2 -translate-y-full transition-opacity duration-300 w-fit px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                납부할세액
              </span>
              약{' '}
              {formatPrice(
                Math.round(
                  propertyTaxInfo[selectedProperty.pk]
                    .my_total_property_tax_for_this_property / 10000,
                ) * 10000,
              )}
            </div>
          </section>
        </section>
      </section>
      {isOpen && (
        <DetailPropertyModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          modalType={modalType}
          propertyTaxInfo={propertyTaxInfo}
          property={selectedProperty}
        />
      )}
    </div>
  );
};

export default DetailPropertyTax;
