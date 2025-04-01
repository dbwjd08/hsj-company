import PropertyInfoCard from '@/pages/dashboard/propertyInfoCard/index';
import { useRecoilValue } from 'recoil';
import { useState } from 'react';
import { currentPropertyState } from '@/lib/store';
import { tokenState } from '@/lib/auth';
import SearchProperty from '../../components/searchProperty';
import {
  useCreatePropertyUniversesIdPropertiesPost,
  useGetPropertiesUniversesIdPropertiesGet,
} from '@/src/api/yuppieComponents';
import SavaTaxCard from './saveTaxCard';
import TitleIcon from '@/public/title.svg';
import GainSelect from './gainsTax/gainSelect';
import { useResetRecoilState } from 'recoil';
import { currentAcqPropertyState } from '@/lib/store';
import { toast } from 'react-toastify';
import Router from 'next/router';

const DashboardMain = () => {
  const { default_universe_id, session_id } = useRecoilValue(tokenState);
  const addProperty = useCreatePropertyUniversesIdPropertiesPost();
  const { data: properties, refetch: refetchProperties } =
    useGetPropertiesUniversesIdPropertiesGet({
      pathParams: {
        id: default_universe_id!,
      },
    });

  const onAddProperty = async ({
    share,
    ownership,
    kindOf,
    pk,
  }: {
    share: number;
    ownership: string;
    kindOf: string;
    pk: string;
  }) => {
    await addProperty.mutateAsync({
      body: {
        share,
        ownership,
        kindOf,
        pk,
        sessionId: session_id,
      },
      pathParams: {
        id: default_universe_id!,
      },
    });
    refetchProperties();
  };

  const currentProperty = useRecoilValue(currentPropertyState);
  const [isOpen, setIsOpen] = useState(false);
  const [isGainOpen, setIsGainOpen] = useState(false);
  const [isAcquisition, setIsAcquisition] = useState(false);

  return (
    <div className='flex flex-col w-4/5 h-full'>
      {currentProperty ? (
        <div className="flex ml-14 mt-10 py-2 px-2 w-fit rounded-3xl bg-gray-50 text-blue-900 text-2xl font-semibold mb-3 items-center justify-center">
          <TitleIcon className="w-10 mr-2" />
          <div>
            {currentProperty?.property.complex.complex_name}
            {` `}
            {currentProperty?.property.dong} {` `}
            {currentProperty?.property.ho}{' '}
          </div>
        </div>
      ) : (
        <div className="ml-14 mt-10 py-2 px-2 w-1/3 rounded-3xl bg-gray-50 text-blue-900 text-2xl text-center font-semibold mb-3">
          -
        </div>
      )}
      <div className="flex w-full h-full px-10 py-5 ml-5">
        <div className="flex flex-col w-2/5 h-full gap-y-5">
          <div className="text-xl font-semibold text-gray-700">
            ▸ 공시지가, 실거래가, 조정지역
          </div>
          {currentProperty ? (
            <PropertyInfoCard propertyOwnership={currentProperty!} />
          ) : (
            <div className="flex min-h-full text-center w-full">
              <div className="flex flex-col items-center justify-center w-full gap-6 h-[82%] max-w-md p-6 border-2 border-gray-100 rounded-2xl">
                <p className="text-xl font-semibold text-gray-700">
                  입력된 부동산이 없습니다.
                </p>
                <p className="text-lg font-semibold text-gray-500 mb-3">
                  부동산을 입력하면 공시지가, 실거래가, 조정지역 여부를 확인할 수
                  있습니다.
                </p>
                <button
                  className="py-3 px-7 bg-blue-50 rounded-2xl text-lg font-semibold text-blue-900"
                  onClick={() => {
                    setIsOpen(true);
                    setIsAcquisition(false);
                  }}
                >
                  부동산 추가하기 ⇢
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col w-5/6 ml-10 h-full">
          <SavaTaxCard />

          <section className="h-1/4">
            <div className="text-xl font-semibold text-gray-700 mb-5">
              ▸ 세금 시나리오
            </div>
            <div className="h-full w-full flex gap-5">
              <div
                className="w-1/4 h-full bg-scenario1 rounded-2xl text-white"
                onClick={() => {
                  properties?.length == 0
                    ? toast.warn(
                      '보유 부동산이 1개 이상이어야 해당 기능을 사용하실 수 있습니다.',
                    )
                    : Router.push('/dashboard/acquisitionTax');
                }}
              >
                <div
                  className="group cursor-pointer w-full h-full flex flex-col justify-end p-4 backdrop-brightness-50 rounded-2xl hover:shadow-lg"
                  onClick={useResetRecoilState(currentAcqPropertyState)}
                >
                  <p className="inline font-semibold text-2xl">집을 더 산다면?</p>

                  <p>취득세 및 취득 후 보유세</p>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
                </div>
              </div>

              <div
                className="w-1/4 h-full bg-scenario2 rounded-2xl text-white"
                onClick={() => {
                  properties?.length == 0
                    ? toast.warn(
                      '보유 부동산이 1개 이상이어야 해당 기능을 사용하실 수 있습니다.',
                    )
                    : setIsGainOpen(true);
                }}
              >
                <div className="group cursor-pointer w-full h-full flex flex-col justify-end p-4 backdrop-brightness-50 rounded-2xl hover:shadow-lg">
                  <p className="inline font-semibold text-2xl">집을 판다면?</p>
                  <p>양도소득세</p>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
                </div>
              </div>

              <div
                className="w-1/4 h-full bg-scenario3 rounded-2xl text-white"
                onClick={() => {
                  properties?.length == 0
                    ? toast.warn(
                      '보유 부동산이 1개 이상이어야 해당 기능을 사용하실 수 있습니다.',
                    )
                    : Router.push('/dashboard/rentalTax');
                }}
              >
                <div className="group cursor-pointer w-full h-full flex flex-col justify-end p-4 backdrop-brightness-50 rounded-2xl hover:shadow-lg">
                  <p className="inline font-semibold text-2xl">
                    내 집을
                    <br />
                    임대한다면?
                  </p>
                  <p>전/월세 세후 수익률</p>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
                </div>
              </div>

              <div
                className="w-1/4 h-full bg-scenario4 rounded-2xl text-white"
                onClick={() => {
                  properties?.length == 0
                    ? toast.warn(
                      '보유 부동산이 1개 이상이어야 해당 기능을 사용하실 수 있습니다.',
                    )
                    : Router.push('/dashboard/totalTax');
                }}
              >
                <div className="group cursor-pointer w-full h-full flex flex-col justify-end p-4 backdrop-brightness-50 rounded-2xl hover:shadow-lg">
                  <p className="inline font-semibold text-2xl">
                    세후 총 수익
                    <br />
                    시뮬레이션
                  </p>
                  <p>운용 방법에 따라 총 수익이 달라질까?</p>
                  <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-white"></span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <SearchProperty
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onAddProperty={isAcquisition ? null : onAddProperty}
        />

        <GainSelect isOpen={isGainOpen} setIsOpen={setIsGainOpen} />
      </div>
    </div>
  );
};

export default DashboardMain;
