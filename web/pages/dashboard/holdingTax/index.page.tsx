import { useState, useEffect } from 'react';
import HoldingTaxIcon from '@/public/holdingTax.svg';
import ExpectedHoldingTaxIcon from '@/public/expectedHoldingTax.svg';
import { Tab } from '@headlessui/react';
import { userState, tokenState } from '@/lib/auth';
import tw from 'twin.macro';
import { formatPrice, getJsonHouse } from '@/lib/utils';
import DetailPropertyTax from './detailPropertyTax';
import DetailCret from './detailCret';
import {
  useGetPropertiesUniversesIdPropertiesGet,
  useCalculateKrTaxForRealEstateForMaintenanceHistoryAndFutureMvpKrTaxForRealEstateMaintenanceHistoryAndInferencePost,
} from '@/src/api/yuppieComponents';
import { useRecoilValue } from 'recoil';
import HoldingTaxChart from './holdingTaxChart';
import { useRouter } from 'next/router';
import Loading from '@/pages/loading';

const HoldingTax = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const { default_universe_id, session_id } = useRecoilValue(tokenState);
  const [holdingTaxInfo, setHoldingTaxInfo] = useState<any>();
  const user = useRecoilValue(userState);

  const { data: properties } = useGetPropertiesUniversesIdPropertiesGet({
    pathParams: {
      id: default_universe_id!,
    },
  });

  const getholdingTax = async () => {
    return await holdingTaxMutate
      .mutateAsync({
        body: {
          sessionId: session_id as string,
          taxYear: new Date().getFullYear(),
          age: user.age ? user.age : 'under_60',
          koreanProperties: properties
            ?.map((value) => {
              const date = new Date();

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

  const styles = {
    tab: tw`min-w-[10rem] px-5 py-1 text-sm focus:outline-none rounded-t-3xl bg-gray-100 text-lg text-gray-800 font-medium [&[data-headlessui-state='selected']]:bg-blue-100 [&[data-headlessui-state='selected']]:text-blue-800 [&[data-headlessui-state='selected']]:font-semibold`,
    tabPanel: tw`h-full bg-gray-50 p-3 focus:outline-none rounded-b-3xl rounded-tr-3xl`,
  };

  //년도를 받으면 내 재산세를 계산해주는 함수
  const calculateMyPropertyTax = (year: number | string) => {
    let tmpPropertyTax = 0;
    const propertyPK =
      holdingTaxInfo?.tax_for_me[year].cret.cret.payers_house_pks;
    if (propertyPK) {
      for (let i = 0; i < propertyPK?.length; i++) {
        tmpPropertyTax +=
          holdingTaxInfo?.tax_for_me[year].prop[propertyPK[i]]
            .my_total_property_tax_for_this_property;
      }
    }

    return tmpPropertyTax;
  };

  const numberToRoundToken = (num: number) => {
    return formatPrice(Math.round(num / 100000) * 100000);
  };

  //년도를 보내면 당해 보유세(재산세+종부세)를 반환해주는 함수
  const getSumHoldingTax = (year: number) => {
    return numberToRoundToken(
      calculateMyPropertyTax(year) +
      holdingTaxInfo?.tax_for_me[year].cret.cret.imposition_amount,
    );
  };

  const findProperties = () => {
    let tmp = 0;
    if (properties) {
      for (let i = 0; i < properties.length; i++) {
        if (
          properties[i].acquisition_date &&
          new Date(properties[i].acquisition_date as string) <
          new Date(new Date().getFullYear().toString() + '-06-01')
        ) {
          tmp += 1;
        }
      }
    }
    return tmp;
  };

  if (!holdingTaxInfo) return <Loading />;
  return (
    <div className="flex h-full w-full min-w-[1200px] flex-col items-center p-5">
      <div className="flex min-h-full max-w-[1200px] w-full p-3 text-left align-middle">
        <div className="flex flex-col mr-5 w-1/2 h-[93%]">
          <div className="text-2xl font-medium leading-6 text-gray-800 mb-4">
            ☁︎ 내 세금 정보
          </div>
          <div className="text-lg font-semibold text-gray-800 my-2">
            ‣ 내 보유세
            <div className="inline ml-2 text-base font-semibold text-red-500/90 w-fit p-2 rounded-lg bg-gray-50">
              보유세 과세 대상은 올해 6월 이전 취득한 부동산에만 해당됩니다.
            </div>
          </div>

          <div className="flex-col items-center justify-center w-full h-[90%] p-3 overflow-hidden  transform bg-white border-2 border-gray-100 rounded-2xl">
            <section className="bg-blue-50 p-3 pt-1 rounded-xl mb-3 w-full">
              <div className="flex items-center ml-2">
                <HoldingTaxIcon className="w-10 mr-4" />
                <div className="font-semibold text-lg">
                  {new Date().getFullYear()}년의 보유세:{' '}
                  <p className="inline text-blue-800">
                    약 {getSumHoldingTax(currentYear)}
                  </p>
                </div>
              </div>
              <div className="ml-[4rem]">
                내 종부세:{' '}
                <p className="inline text-blue-800 font-semibold">
                  약{' '}
                  {numberToRoundToken(
                    holdingTaxInfo?.tax_for_me[currentYear].cret.cret
                      .imposition_amount,
                  )}
                  {'   '}
                </p>
              </div>
              <div className="ml-[4rem]">
                내 재산세:{' '}
                <p className="inline text-blue-800 font-semibold">
                  약 {numberToRoundToken(calculateMyPropertyTax(currentYear))}
                  {'   '}
                </p>
              </div>
            </section>
            <section className="h-2/3 w-full">
              <div className="flex items-center mb-2 ml-2">
                <ExpectedHoldingTaxIcon className="w-10 mr-2" />

                <button className="group relative px-4 py-1 rounded-lg inline-block text-blue-800 font-semibold text-lg hover:bg-blue-50 duration-300">
                  최근 보유세 추이 및 전망
                  <span className="absolute hidden group-hover:flex -left-5 -top-2 -translate-y-full transition-opacity duration-300 w-[30rem] px-2 py-1 bg-gray-700 rounded-lg text-center font-normal text-white text-sm after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-gray-700">
                    보유하신 부동산에 대한 지난 3년과 미래 1년의 보유세 추이를
                    보여줍니다.
                    <br /> 부동산의 실제 취득일자를 고려하지 않고 모두
                    과세대상이라고 생각하고 계산합니다.
                  </span>
                </button>
              </div>
              <div className="w-full h-full">
                <HoldingTaxChart holdingTaxInfo={holdingTaxInfo} />
              </div>
            </section>
          </div>
        </div>

        <div className="flex w-1/2 h-[85%] self-center">
          <div className="flex-[4] min-w-0">
            <Tab.Group>
              <Tab.List className="flex space-x-1 h-[2.5rem]">
                <Tab key="tab-1" css={styles.tab}>
                  종부세
                </Tab>
                <Tab key="tab-2" css={styles.tab}>
                  재산세
                </Tab>
              </Tab.List>
              <Tab.Panels className="h-[calc(100%-2.5rem)]">
                <Tab.Panel key="panel-1" css={styles.tabPanel}>
                  {findProperties() !== 0 ? (
                    <DetailCret
                      properties={properties}
                      cretInfo={
                        holdingTaxInfo &&
                        holdingTaxInfo.tax_for_household_total[currentYear].cret
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <div className="font-medium">
                        올해 6월 이전 취득한 부동산이 없습니다
                      </div>
                    </div>
                  )}
                </Tab.Panel>
                <Tab.Panel key="panel-2" css={styles.tabPanel}>
                  {findProperties() !== 0 ? (
                    <DetailPropertyTax properties={properties} />
                  ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <div className="font-medium">
                        올해 6월 이전 취득한 부동산이 없습니다
                      </div>
                    </div>
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>
      <div
        className="cursor-pointer font-semibold text-blue-900 bg-blue-50 rounded-xl p-4 mt-[-3rem] hover:text-blue-700 hover:font-bold"
        onClick={() => router.back()}
      >
        ⇠ 대시보드로 돌아가기
      </div>
    </div>
  );
};

export default HoldingTax;
