import { currentAcqPropertyState } from '@/lib/store';
import { useRecoilValue } from 'recoil';
import { tokenState, userState } from '@/lib/auth';
import { getJsonHouse, getJsonAcqProperty } from '@/lib/utils';
import { useState, useEffect } from 'react';
import PropertyTaxChart from './propertyTaxChart';
import {
  useGetPropertiesUniversesIdPropertiesGet,
  useCalculateKrTaxForRealEstateForMaintenanceHistoryAndFutureMvpKrTaxForRealEstateMaintenanceHistoryAndInferencePost,
} from '@/src/api/yuppieComponents';
import Loading from '@/pages/loading';
import Image from 'next/image';

const AcquisitionPropertyDetail = () => {
  const user = useRecoilValue(userState);
  const acqProperty = useRecoilValue(currentAcqPropertyState);

  const { default_universe_id, session_id } = useRecoilValue(tokenState);
  const [holdingTaxInfo, setHoldingTaxInfo] = useState<any>();
  const [newholdingTaxInfo, setNewholdingTaxInfo] = useState<any>();

  const { data: properties } = useGetPropertiesUniversesIdPropertiesGet({
    pathParams: {
      id: default_universe_id!,
    },
  });

  const holdingTaxMutate =
    useCalculateKrTaxForRealEstateForMaintenanceHistoryAndFutureMvpKrTaxForRealEstateMaintenanceHistoryAndInferencePost();

  const getholdingTax = async () => {
    return await holdingTaxMutate
      .mutateAsync({
        body: {
          sessionId: session_id as string,
          taxYear: new Date().getFullYear(),
          age: user.age ? user.age : 'under_60',
          koreanProperties: properties
            ? properties?.map((value) => {
                return getJsonHouse(value);
              })
            : [],
        },
      })
      .then((res) => {
        setHoldingTaxInfo(res);
      });
  };

  const newProp = properties
    ?.map((value) => {
      return getJsonHouse(value);
    })
    .concat(getJsonAcqProperty(acqProperty!));

  const getnewholdingTax = async () => {
    return await holdingTaxMutate
      .mutateAsync({
        body: {
          sessionId: session_id as string,
          taxYear: new Date().getFullYear(),
          age: user.age ? user.age : 'under_60',
          koreanProperties: newProp ? newProp : [],
        },
      })
      .then((res) => {
        setNewholdingTaxInfo(res);
      });
  };

  useEffect(() => {
    if (properties) {
      getnewholdingTax();
      getholdingTax();
    }
  }, [acqProperty]);

  if (!acqProperty || !holdingTaxInfo || !newholdingTaxInfo)
    return (
      <section className="flex flex-col justify-center w-full h-full bg-white rounded-xl font-medium text-xl py-9 gap-4">
        <Loading />
      </section>
    );

  return (
    <div className="flex flex-col gap-8 w-full">
      <section className="flex flex-col justify-center w-full h-[50rem] bg-white rounded-xl font-medium text-xl px-10 py-8 gap-4">
        <section className="h-1/5 flex flex-col">
          <div className="flex font-bold text-2xl text-blue-900 items-center mb-7">
            <Image
              src="/calculate.png"
              width="55"
              height="50"
              alt="취득세"
            ></Image>
            새로 산 집, 세금 얼마나 낼까?
          </div>
          <hr className="mb-8 border-[1.5px] border-gray-100" />

          <div className="flex items-center ml-5">
            ▼{' '}
            <p className="inline font-semibold text-blue-800 p-2 bg-blue-50 rounded-md mx-2">
              {acqProperty.complex} {acqProperty.property.dong}{' '}
              {acqProperty.property.ho}
            </p>{' '}
            를 새로 취득할 때 보유세 추이
          </div>
        </section>

        <section className="h-[70%] p-10">
          <PropertyTaxChart
            holdingTaxInfo={holdingTaxInfo}
            newHoldingTaxInfo={newholdingTaxInfo}
          />
        </section>
        <section className="h-[10%] bg-red-50/50 p-5 rounded-lg text-red-500/90 text-center">
          ✔︎ 상담을 위한 참고자료입니다. 실제 세금신고와 법률적 의사결정을
          위해서는 반드시 세무전문가의 확인이 필요합니다.
        </section>
      </section>
    </div>
  );
};

export default AcquisitionPropertyDetail;
