import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import { useGetPropertiesUniversesIdPropertiesGet } from '@/src/api/yuppieComponents';
import OneHouse from './oneHouse';
import TwoHouse from './twoHouse';
import { useCreatePropertyUniversesIdPropertiesPost } from '@/src/api/yuppieComponents';
import SearchProperty from '../../../components/searchProperty';
import { useEffect, useState } from 'react';
import { useCalculateKrTaxForRealEstateForMaintenanceHistoryAndFutureMvpKrTaxForRealEstateMaintenanceHistoryAndInferencePost } from '@/src/api/yuppieComponents';
import HoldingTaxMainChart from './holdingTaxMainChart';
import { userState } from '@/lib/auth';
import { useRecoilState } from 'recoil';
import { getJsonHouse } from '@/lib/utils';
import Link from 'next/link';
import Loading from '@/pages/loading';

const SavaTaxCard = () => {
  // fetch all properties
  const { default_universe_id, session_id } = useRecoilValue(tokenState);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useRecoilState(userState);

  const [holdingTaxInfo, setHoldingTaxInfo] = useState<any>();

  const { data: properties } = useGetPropertiesUniversesIdPropertiesGet({
    pathParams: {
      id: default_universe_id!,
    },
  });

  const isZeroHouse = !!properties && properties.length === 0;
  const isOneHouse = !!properties && properties.length === 1;
  const isTwoHouse = !!properties && properties.length === 2;
  const multiHouse = !!properties && properties.length >= 3;

  const addProperty = useCreatePropertyUniversesIdPropertiesPost();
  const { data, refetch: refetchProperties } =
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

  const getholdingTax = async () => {
    return await holdingTaxMutate
      .mutateAsync({
        body: {
          sessionId: session_id as string,
          taxYear: new Date().getFullYear(),
          age: user.age ? user.age : 'under_60',
          koreanProperties: properties
            ?.map((value) => {
              return getJsonHouse(value);
            })
            .filter((element) => element) as any,
        },
      })
      .then((res) => {
        setHoldingTaxInfo(res);
      });
  };

  const holdingTaxMutate =
    useCalculateKrTaxForRealEstateForMaintenanceHistoryAndFutureMvpKrTaxForRealEstateMaintenanceHistoryAndInferencePost();

  useEffect(() => {
    if (properties) {
      getholdingTax();
    }
  }, [properties]);

  if (!properties) return <Loading />;
  return (
    <>
      <div className="text-xl font-semibold text-gray-700 mb-5">▸ 절세팁</div>
      <div className="flex flex-col items-center justify-center w-full h-[45%] gap-6 p-6 border-2 border-gray-100 rounded-2xl mb-10">
        <div className="flex w-full h-full">
          {isOneHouse && <OneHouse propertyOwnership={properties[0]} />}
          {isTwoHouse && <TwoHouse properties={properties} />}
          {multiHouse && (
            <div className="flex flex-col justify-center gap-4 py-2 h-full w-3/5 items-center">
              <div className="text-xl font-semibold text-center">
                회원님은{' '}
                <p className="inline bg-blue-50 p-2 rounded-[20px] border-2 border-blue-200">
                  다주택자
                </p>{' '}
                입니다.
              </div>
            </div>
          )}

          {isZeroHouse && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <p className="text-xl font-semibold text-gray-700 mb-2">
                입력된 부동산이 없습니다.
              </p>
              <p className="text-base font-semibold text-gray-500 mb-3">
                부동산을 입력하면 보유세와 절세팁을 확인할 수 있습니다.
              </p>
              <button
                className="py-3 px-7 bg-blue-50 rounded-2xl text-base font-semibold text-blue-900"
                onClick={() => setIsOpen(true)}
              >
                부동산 추가하기 ⇢
              </button>
            </div>
          )}

          {properties?.length > 0 &&
            (holdingTaxInfo != null ? (
              <div className="flex flex-col h-full w-3/4 ml-5 items-center">
                <div className="h-full w-full mb-2">
                  <HoldingTaxMainChart holdingTaxInfo={holdingTaxInfo} />
                </div>
                <Link
                  href={{
                    pathname: '/dashboard/holdingTax',
                  }}
                  as="/dashboard/holdingTax"
                >
                  <div className="text-base font-semibold text-blue-600 bg-blue-50 p-2 rounded-lg w-fit cursor-pointer text-center hover:font-bold hover:text-blue-700">
                    보유세 자세히 확인하러 가기 ⇢
                  </div>
                </Link>{' '}
              </div>
            ) : (
              <Loading />
            ))}
        </div>
      </div>

      <SearchProperty
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onAddProperty={onAddProperty}
      />
    </>
  );
};

export default SavaTaxCard;
