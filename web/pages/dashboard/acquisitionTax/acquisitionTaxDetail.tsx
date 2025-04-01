import { currentAcqPropertyState } from '@/lib/store';
import {
  useCalculateKrAcquisitionTaxMvpKrAcquisitionTaxCalculatePost,
  useGetPropertiesUniversesIdPropertiesGet,
  useAmITmp2housesOwnerMvpKrAmITmp2housesOwnerPost,
} from '@/src/api/yuppieComponents';
import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import { getJsonHouse, getJsonAcqProperty } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import DetailDescModal from './detailDescModal';
import Image from 'next/image';
const AcquisitionTaxDetail = () => {
  const acqProperty = useRecoilValue(currentAcqPropertyState);
  const { default_universe_id, session_id } = useRecoilValue(tokenState);
  const [taxInfo, setTaxInfo] = useState('');
  const [modalType, setModalType] = useState('');
  const [isDescOpen, setIsDescOpen] = useState(false);
  const [acquisitionTax, setAcquisitionTax] = useState<any>();
  const [isTmp2housesOwner, setIsTmp2housesOwner] = useState(false);

  const { data: properties } = useGetPropertiesUniversesIdPropertiesGet({
    pathParams: {
      id: default_universe_id!,
    },
  });
  const tax = acquisitionTax?.acquisition?.my_total_imposition_amount
    ?.toString()
    .split('.')[0];
  const getAcquisitionTax =
    useCalculateKrAcquisitionTaxMvpKrAcquisitionTaxCalculatePost();

  const { data: istmp2house, isFetched }: any =
    useAmITmp2housesOwnerMvpKrAmITmp2housesOwnerPost(
      {
        body: {
          sessionId: session_id,
          myProperties: [
            getJsonHouse(properties![0]),
            getJsonAcqProperty(acqProperty!),
          ],
        },
      },
      {
        enabled: !!properties,
      },
    );

  const onGetAcquisitionTax = async () => {
    return await getAcquisitionTax
      .mutateAsync({
        body: {
          sessionId: session_id as string,
          acquisitionKoreanProperty: getJsonAcqProperty(acqProperty!),
          causeOfAcquisition: 'trade',
          alreadyOwnedKoreanProperties: properties
            ? properties.map((value) => {
                return getJsonHouse(value);
              })
            : [],
          isTmp2housesOwner: isTmp2housesOwner,
        },
      })
      .then((res) => {
        setAcquisitionTax(res);
      });
  };

  useEffect(() => {
    onGetAcquisitionTax();
  }, [acqProperty]);

  useEffect(() => {
    if (properties?.length !== 1) {
      setIsTmp2housesOwner(false);
    } else {
      if (isFetched) {
        setIsTmp2housesOwner(istmp2house.cret.am_i_temp_two_owner);
      }
    }
  }, [properties]);

  if (!acqProperty) return <></>;
  return (
    <div className="flex flex-col gap-8 w-full">
      <section className="flex flex-col justify-center items-center w-full h-full bg-white rounded-xl font-medium text-xl py-9 gap-4">
        <div>
          <p className="inline font-semibold text-blue-800 p-2 bg-blue-50 rounded-md text-2xl">
            {acqProperty.complex} {acqProperty.property.dong}{' '}
            {acqProperty.property.ho}
          </p>{' '}
          를 새로 취득할 때 예상 취득세는
        </div>
        <div>
          <p className="inline font-bold text-orange-500 rounded-md text-2xl">
            {formatPrice(Math.round(tax / 10000) * 10000)}{' '}
          </p>
          입니다
        </div>
      </section>
      <section className="flex flex-col justify-center w-full h-full bg-white rounded-xl font-medium text-xl px-10 py-8 gap-4">
        <div className="flex flex-col h-full">
          <div className="flex font-bold text-2xl text-blue-900 items-center mb-7">
            <Image
              src="/calculate.png"
              width="55"
              height="50"
              alt="취득세"
            ></Image>
            취득세 계산법
          </div>
          <section className="w-full flex flex-col justify-center gap-3 font-medium text-gray-800">
            <div className="flex justify-center items-center gap-5">
              {'('}
              <div
                className=" p-1 border-2 border-green-600 bg-green-200 rounded-md cursor-pointer"
                onClick={() => {
                  setIsDescOpen(true);
                  setModalType('acq');
                  setTaxInfo(
                    (acquisitionTax?.acquisition.tax_rate * 100).toString(),
                  );
                }}
              >
                취득세율
              </div>
              +
              <div
                className="p-1 border-2 border-blue-400 bg-blue-200 rounded-md cursor-pointer"
                onClick={() => {
                  setIsDescOpen(true);
                  setModalType('rural');
                  setTaxInfo(
                    (
                      acquisitionTax?.acquisition.rural_special_tax_rate * 100
                    ).toString(),
                  );
                }}
              >
                농어촌특별세율
              </div>
              <div className="flex justify-center items-center gap-4">
                +
                <div
                  className=" p-1 border-2 border-purple-400 bg-purple-200 rounded-md cursor-pointer"
                  onClick={() => {
                    setIsDescOpen(true);
                    setModalType('edu');
                    setTaxInfo(
                      (
                        acquisitionTax?.acquisition
                          ?.suburban_education_tax_rate * 100
                      ).toString(),
                    );
                  }}
                >
                  지방교육세율
                </div>
                {')'}
              </div>
              x
              <div
                className=" p-1 border-2 border-red-300 bg-red-100 rounded-md cursor-pointer"
                onClick={() => {
                  setIsDescOpen(true);
                  setModalType('base');
                  setTaxInfo(formatPrice(Math.round(tax / 10000) * 10000));
                }}
              >
                과세 표준액
              </div>
              = 납부할 세액
            </div>
          </section>
          <hr className="border-2 border-gray-100 my-10" />
          <section className="flex flex-col gap-10 font-medium text-gray-800 w-full pb-5">
            <section className="mb-2">
              <div className="text-xl font-semibold flex items-center mb-4">
                1. 농어촌특별세와 지방교육세를 포함해서 내 총 취득세율을
                계산합니다.
              </div>
              <section className="flex gap-3 items-center">
                <div className="text-4xl font-bold text-blue-900">→ </div>
                <div
                  className="group relative p-1 border-2 border-green-600 bg-green-200 rounded-md cursor-pointer"
                  onClick={() => {
                    setIsDescOpen(true);
                    setModalType('acq');
                    setTaxInfo(
                      (acquisitionTax?.acquisition.tax_rate * 100).toString(),
                    );
                  }}
                >
                  <p className="text-gray-600 text-sm inline"> 취득세율:</p>{' '}
                  {acquisitionTax?.acquisition.tax_rate * 100}%
                </div>{' '}
                +{' '}
                <div
                  className="group relative p-1 border-2 border-blue-400 bg-blue-200 rounded-md cursor-pointer"
                  onClick={() => {
                    setIsDescOpen(true);
                    setModalType('rural');
                    setTaxInfo(
                      (
                        acquisitionTax?.acquisition.rural_special_tax_rate * 100
                      ).toString(),
                    );
                  }}
                >
                  <p className="text-gray-600 text-sm inline">
                    농어촌특별세율:
                  </p>{' '}
                  {acquisitionTax?.acquisition.rural_special_tax_rate * 100}%
                </div>{' '}
                +{' '}
                <div
                  className=" p-1 border-2 border-purple-400 bg-purple-200 rounded-md cursor-pointer"
                  onClick={() => {
                    setIsDescOpen(true);
                    setModalType('edu');
                    setTaxInfo(
                      (
                        acquisitionTax?.acquisition
                          .suburban_education_tax_rate * 100
                      ).toString(),
                    );
                  }}
                >
                  <p className="text-gray-600 text-sm inline">지방교육세율:</p>{' '}
                  {acquisitionTax?.acquisition.suburban_education_tax_rate *
                    100}
                  %
                </div>{' '}
                ={' '}
                <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
                  <p className="text-gray-600 text-sm inline">총 취득세율:</p>{' '}
                  {(acquisitionTax?.acquisition.total_tax_rate * 100).toFixed(
                    1,
                  )}
                  %
                </div>
              </section>
            </section>
            <section className="mb-2">
              <div className="text-xl font-semibold flex items-center mb-4">
                2. 과세표준액에 내 지분과 취득세율을 곱해 취득세를 계산합니다.
              </div>
              <section className="flex gap-3 items-center">
                <div className="text-4xl font-bold text-blue-900">→ </div>
                <div
                  className=" p-1 border-2 border-red-300 bg-red-100 rounded-md cursor-pointer"
                  onClick={() => {
                    setIsDescOpen(true);
                    setModalType('base');
                    setTaxInfo(
                      formatPrice(
                        Math.round(acqProperty.acquisitionPrice! / 10000) *
                          10000,
                      ),
                    );
                  }}
                >
                  <p className="text-gray-600 text-sm inline"> 과세표준액: </p>
                  {formatPrice(
                    Math.round(acqProperty.acquisitionPrice! / 10000) * 10000,
                  )}
                </div>{' '}
                x{' '}
                <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
                  <p className="text-gray-600 text-sm inline">총 취득세율: </p>
                  {(acquisitionTax?.acquisition.total_tax_rate * 100).toFixed(
                    1,
                  )}
                  %
                </div>{' '}
                ={' '}
                <div className="group relative p-1 border-2 border-gray-300 bg-gray-100 rounded-md ">
                  <p className="text-gray-600 text-sm inline">납부할 세액: </p>
                  {formatPrice(
                    Math.round(
                      acquisitionTax?.acquisition.my_total_imposition_amount /
                        10000,
                    ) * 10000,
                  )}
                </div>
              </section>
            </section>
            <section>
              <div className="text-xl font-semibold flex items-center mb-2">
                3. 그 외 등록세 및 법무사 비용 등이 발생합니다.
              </div>
            </section>
          </section>
          {isDescOpen && (
            <DetailDescModal
              isOpen={isDescOpen}
              setIsOpen={setIsDescOpen}
              modalType={modalType}
              property={acqProperty.property}
              propertyName={acqProperty.complex as string}
              acPrice={formatPrice(
                Math.round(acqProperty.acquisitionPrice! / 10000) * 10000,
              )}
              taxInfo={taxInfo}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default AcquisitionTaxDetail;
