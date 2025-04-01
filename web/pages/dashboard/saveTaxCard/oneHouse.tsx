import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import { useAmI1householderBeneficialMvpKrBeforeCapitalGainsTaxFor1householderPost } from '@/src/api/yuppieComponents';
import { getJsonHouse } from '@/lib/utils';
import OneHouseUpdate from './oneHouseUpdate';
import AngleRight from '@/public/angle-right.svg';

const OneHouse = ({
  propertyOwnership,
}: {
  propertyOwnership: PropertyOwnership;
}) => {
  const { session_id: sessionId } = useRecoilValue(tokenState);
  const [oneHouseBenefitInfo, setOneHouseBenefitInfo] = useState<any>();

  const get1householderBenefit = async () => {
    return await getOneHouse
      .mutateAsync({
        body: {
          sessionId,
          house: getJsonHouse(propertyOwnership),
        },
      })
      .then((res) => {
        setOneHouseBenefitInfo(res);
      });
  };

  const getOneHouse =
    useAmI1householderBeneficialMvpKrBeforeCapitalGainsTaxFor1householderPost();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (propertyOwnership.acquisition_date) {
      get1householderBenefit();
    }
  }, [propertyOwnership]);
  return (
    <div className="h-full w-full">
      {oneHouseBenefitInfo ? (
        <div className="flex flex-col h-full">
          <div className="flex mb-5 h-1/5 items-center">
            <div className="inline bg-blue-50 p-2 rounded-[25px] border-2 min-w-fit border-blue-200 text-2xl text-blue-900 font-semibold mr-5">
              1 주택자
            </div>
            <div className="flex flex-col">
              <div className="font-semibold text-lg">
                1주택 비과세 요건:{' '}
                {oneHouseBenefitInfo?.am_i_1householder_tax_exempted ==
                  false ? (
                  <p className="inline text-red-500">불충족</p>
                ) : (
                  <p className="inline text-blue-500">충족</p>
                )}
              </div>
              <div className="font-semibold text-lg">
                장기보유 특별공제 요건:{' '}
                {oneHouseBenefitInfo?.am_i_special_deduction_for_longterm_holder ==
                  false ? (
                  <p className="inline text-red-500">불충족</p>
                ) : (
                  <p className="inline text-blue-500">충족</p>
                )}
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-gray-800 overflow-auto h-4/5 scrollbar">
            <div className="whitespace-pre-line font-medium">
              {oneHouseBenefitInfo?.description}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center gap-4 py-2 h-full w-full items-center">
          <div className="text-xl font-semibold text-center">
            회원님은{' '}
            <p className="inline bg-blue-50 p-2 rounded-[20px] border-2 border-blue-200">
              1 주택자
            </p>{' '}
            입니다.
            <div className="text-base font-medium text-center mt-5">
              취득 및 거주 정보를 입력하고 보유세와 절세팁을 확인해보세요
            </div>
          </div>
          <button
            className="py-3 px-7 bg-blue-50 rounded-2xl text-base font-semibold text-blue-900 transition ease-in-out hover:bg-blue-100"
            onClick={() => setIsOpen(true)}
          >
            취득 및 거주 정보 입력하기{' '}
            <AngleRight className="w-5 inline-block" />
          </button>
        </div>
      )}
      {isOpen && (
        <OneHouseUpdate
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          propertyOwnership={propertyOwnership}
        />
      )}
    </div>
  );
};

export default OneHouse;
