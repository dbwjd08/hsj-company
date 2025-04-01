import { Listbox, Transition } from '@headlessui/react';
import { getPropertyName } from '@/lib/utils';
import { Fragment, useState, useEffect } from 'react';
import {
  useGetPropertiesUniversesIdPropertiesGet,
  useGetDepositRatesFinanceDepositRatesGeneralGet,
  useGetDepositRatesFinanceDepositRatesSavingGet,
  useGetLoanRatesFinanceLoanRatesGeneralGet,
  useGetLoanRatesFinanceLoanRatesSavingGet,
  useGetPriceStatFromPropertyFinanceConversionRatePropertyPkGet,
  useGetPriceStatFromPropertyOtherFinanceConversionRatePropertyPkOtherAreaGet,
} from '@/src/api/yuppieComponents';
import PropertyImage from '@/components/propertyImage';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import InterestRateCard from './interestRateCard';
import RentalCharts from './rentalCharts';
import RangeBarContainer from './rangeBarContainer';
import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import Loading from '@/pages/loading';
import { useRouter } from 'next/router';

export type rateObj = {
  depGenMin: number | null;
  depGenMax: number | null;
  depSavMin: number | null;
  depSavMax: number | null;
  loanGenMin: number | null;
  loanGenMax: number | null;
  loanSavMin: number | null;
  loanSavMax: number | null;
};

const RentalTax = () => {
  const router = useRouter();

  const { default_universe_id, session_id } = useRecoilValue(tokenState);
  const [selectedProperty, setSelectedProperty] = useState<PropertyOwnership>();
  const [rateObj, setRateObj] = useState<rateObj>();
  const [isArea, setIsArea] = useState<boolean>(false);
  const [area, setArea] = useState<number>(0);
  const [currentInfo, setCurrentInfo] = useState<any>();

  const { data: properties } = useGetPropertiesUniversesIdPropertiesGet({
    pathParams: {
      id: default_universe_id!,
    },
  });

  const { data: rentalInfo }: any =
    useGetPriceStatFromPropertyFinanceConversionRatePropertyPkGet(
      {
        pathParams: {
          pk: selectedProperty ? selectedProperty.property.pk : '',
        },
      },
      {
        enabled: !!selectedProperty,
      },
    );

  const { data: areaRentalInfo }: any =
    useGetPriceStatFromPropertyOtherFinanceConversionRatePropertyPkOtherAreaGet(
      {
        pathParams: {
          pk: selectedProperty ? selectedProperty.property.pk : '',
          area: area,
        },
      },
      {
        enabled: !!selectedProperty,
      },
    );

  const { data: deposit_general }: any =
    useGetDepositRatesFinanceDepositRatesGeneralGet({});

  const { data: deposit_saving }: any =
    useGetDepositRatesFinanceDepositRatesSavingGet({});

  const { data: loan_general }: any = useGetLoanRatesFinanceLoanRatesGeneralGet(
    {},
  );

  const { data: loan_saving }: any = useGetLoanRatesFinanceLoanRatesSavingGet(
    {},
  );

  useEffect(() => {
    let tmp_obj: rateObj = {
      depGenMin: null,
      depGenMax: null,
      depSavMin: null,
      depSavMax: null,
      loanGenMin: null,
      loanGenMax: null,
      loanSavMin: null,
      loanSavMax: null,
    };

    // 예금 금리 최소 최대
    const new_dep_gen_max = Math.max.apply(
      null,
      deposit_general?.map((item: any) => {
        return item.interest_rate_12;
      }),
    );
    tmp_obj.depGenMax = new_dep_gen_max;

    const new_dep_gen_min = Math.min.apply(
      null,
      deposit_general?.map((item: any) => {
        return item.interest_rate_12;
      }),
    );
    tmp_obj.depGenMin = new_dep_gen_min;

    const new_dep_sva_max = Math.max.apply(
      null,
      deposit_saving?.map((item: any) => {
        return item.interest_rate_12;
      }),
    );
    tmp_obj.depSavMax = new_dep_sva_max;

    const new_dep_sav_min = Math.min.apply(
      null,
      deposit_saving?.map((item: any) => {
        return item.interest_rate_12;
      }),
    );
    tmp_obj.depSavMin = new_dep_sav_min;

    // 대출 금리 최소 최대
    const tmp_loan_general_max = Math.max.apply(
      null,
      loan_general?.map((item: any) => {
        return item.cb_avg;
      }),
    );
    tmp_obj.loanGenMax = tmp_loan_general_max;

    const tmp_loan_general_min = Math.min.apply(
      null,
      loan_general?.map((item: any) => {
        return item.cb_avg != null ? item.cb_avg : 1e9;
      }),
    );
    tmp_obj.loanGenMin = tmp_loan_general_min;

    const tmp_loan_saving_max = Math.max.apply(
      null,
      loan_saving?.map((item: any) => {
        return item.rate_max != null && item.rate_max.toFixed(1);
      }),
    );
    tmp_obj.loanSavMax = tmp_loan_saving_max;

    const tmp_loan_saving_min = Math.min.apply(
      null,
      loan_saving?.map((item: any) => {
        return item.rate_min.toFixed(1);
      }),
    );
    tmp_obj.loanSavMin = tmp_loan_saving_min;

    setRateObj(tmp_obj);
  }, [deposit_general, deposit_saving, loan_general, loan_saving]);

  useEffect(() => {
    if (area == 0) {
      setCurrentInfo(rentalInfo);
    } else {
      setCurrentInfo(areaRentalInfo);
    }
  }, [area, areaRentalInfo, rentalInfo]);

  useEffect(() => {
    if (properties) {
      setSelectedProperty(properties[0]);
    }
  }, [properties]);

  useEffect(() => {
    setArea(0);
  }, [selectedProperty]);

  if (!properties || !selectedProperty || !rateObj || !currentInfo)
    return <Loading />;
  return (
    <div className="max-w-[1200px] min-w-[1200px] flex m-auto">
      <div className="py-10 flex-col flex gap-y-5 w-full h-full">
        <div className="flex">
          <PropertyImage propertyType="apartment" className="w-8" />
          <div className="font-semibold text-2xl ml-3">
            매물로 보는 전월세 전환율
          </div>
        </div>
        {isArea ? (
          <div className="flex gap-4 items-end">
            <div className="px-6 w-1/3 rounded-3xl py-4 text-xl text-center font-bold text-blue-800 bg-[#FAFAFA] shadow-sm ">
              {selectedProperty.property.complex.complex_name} {area}m2
            </div>{' '}
          </div>
        ) : (
          <Listbox value={selectedProperty} onChange={setSelectedProperty}>
            <div className="relative mt-1 h-1/7">
              <Listbox.Button
                style={{ backgroundColor: '#FAFAFA' }}
                className="z-[5] relative px-6 w-1/3 rounded-3xl py-4 text-xl font-bold text-blue-800 focus:outline-none shadow-sm "
              >
                {' '}
                <div className="flex justify-around px-3">
                  <span className="block truncate">
                    {getPropertyName(selectedProperty.property)}
                  </span>
                  ▾
                </div>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="z-20  absolute mt-1 max-h-60 overflow-auto rounded-md bg-white p-1 shadow-lg focus:outline-none w-1/3">
                  {properties &&
                    properties?.map((item: any) => (
                      <Listbox.Option
                        key={item.property.pk}
                        className={({ active }) =>
                          `relative text-center py-2 text-lg cursor-pointer font-medium ${active
                            ? 'bg-blue-50 text-blue-800'
                            : 'text-gray-900'
                          }`
                        }
                        value={item}
                      >
                        {({ selected }) => (
                          <span
                            className={`block truncate ${selected
                              ? 'font-semibold text-blue-800'
                              : 'font-normal'
                              }`}
                          >
                            {getPropertyName(item.property)}
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        )}

        {Object.keys(currentInfo).includes('appConvRate') ? (
          <div className="flex w-full gap-5 h-full">
            <RangeBarContainer
              selectedProperty={selectedProperty}
              numHouses={properties.length}
              conver={isArea ? currentInfo.otherTypes[area] : null}
            />
            <div className="flex flex-col gap-4 h-full w-[55%]">
              <RentalCharts
                data={currentInfo}
                rateList={rateObj}
                area={
                  isArea ? area! : selectedProperty.property.net_leasable_area!
                }
              />
              <InterestRateCard
                deposit_general={deposit_general}
                deposit_saving={deposit_saving}
                loan_general={loan_general}
                loan_saving={loan_saving}
                rateList={rateObj}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full rounded-xl border-2 border-gray-100 p-7 gap-5 font-medium items-center">
            <div className="font-semibold text-xl">
              전용면적 {selectedProperty.property.net_leasable_area}m2 (
              {(
                selectedProperty &&
                selectedProperty.property.net_leasable_area! * 0.3025
              ).toFixed(2)}{' '}
              평형)의 매물 정보가 없습니다.
            </div>
            {Object.keys(currentInfo.otherTypes).map(
              (item: any, idx: number) => (
                <>
                  {idx < 2 && (
                    <div
                      key={item}
                      onClick={() => {
                        setIsArea(true);
                        setArea(item);
                      }}
                      className="cursor-pointer p-3 rounded-2xl bg-blue-50/70 border-2 border-blue-100 w-60 text-center text-lg font-medium"
                    >
                      {item}m2 ({(item * 0.3025).toFixed(1)}
                      평형)보기 ⇢
                    </div>
                  )}
                </>
              ),
            )}
          </div>
        )}

        <div className="flex self-center gap-5">
          {isArea && (
            <div
              onClick={() => {
                setIsArea(false);
                setArea(0);
              }}
              className="bg-blue-800/80 text-white rounded-xl text-center font-semibold self-center p-4 cursor-pointer hover:bg-blue-800 hover:font-bold"
            >
              ← 다른 아파트 매물 찾기
            </div>
          )}
          <div
            className="self-center w-fit cursor-pointer font-semibold text-blue-900 bg-blue-50 rounded-xl p-4 hover:bg-blue-100 hover:font-bold"
            onClick={() => router.back()}
          >
            ⇠ 대시보드로 돌아가기
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalTax;
