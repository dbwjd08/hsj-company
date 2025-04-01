import React, { useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';
import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import {
  useGetOfficialPriceOfficialPricePkGet,
  useGetTradeHistoryTradeHistoryPkGet,
  useGetAdjustedAreaHistoryPropAdjustedAreaHistoryPropertyPkAllGet,
  GetTradeHistoryTradeHistoryPkGetResponse,
} from '@/src/api/yuppieComponents';
import PropertyChart from './propertyChart';
import PropertyTable from './propertyTable';

const PropertyInfoCard = ({
  propertyOwnership,
}: {
  propertyOwnership: PropertyOwnership;
}) => {
  const propertyInfo = propertyOwnership?.property;
  const [tradeData, setTradeData] =
    useState<GetTradeHistoryTradeHistoryPkGetResponse>();
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  const getFullYmdStr = (d: string) => {
    //년월일시분초 문자열 생성
    const new_d = new Date(d);
    return (
      new_d.getFullYear() +
      '년 ' +
      (new_d.getMonth() + 1) +
      '월 ' +
      new_d.getDate() +
      '일 '
    );
  };

  const { data: officialData, refetch: refetchOfficialData } =
    useGetOfficialPriceOfficialPricePkGet({
      pathParams: {
        pk: propertyInfo.pk,
      },
    });

  const { data: tmpTradeData, refetch: refetchTradeData } =
    useGetTradeHistoryTradeHistoryPkGet({
      pathParams: {
        pk: propertyInfo.pk,
      },
    });

  const { data: adjustData, refetch: refetchAdjustData } =
    useGetAdjustedAreaHistoryPropAdjustedAreaHistoryPropertyPkAllGet({
      pathParams: {
        pk: propertyInfo.pk,
      },
    });

  useEffect(() => {
    if (tmpTradeData) {
      const tmp = [...tmpTradeData!]
        .reverse()
        .filter(
          (item) => item.net_leasable_area === propertyInfo.net_leasable_area,
        );
      setTradeData(tmp);
    }
  }, [tmpTradeData]);

  return (
    <div className="flex min-h-full text-center w-full">
      <div className="flex-col items-center justify-center w-full h-[82%] max-w-md p-6 overflow-hidden transition-all transform bg-white border-2 border-gray-100 rounded-2xl">
        <Tab.Group>
          <Tab.List className="flex justify-around mb-4 border-b border-gray-200 dark:border-gray-700">
            {['차트', '표'].map((item, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  classNames(
                    'w-1/2 inline-flex items-center justify-center p-4 transition ease-in-out border-b-2',
                    selected
                      ? ' text-blue-600 border-blue-600 rounded-t-lg font-bold '
                      : 'border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 ',
                  )
                }
              >
                {item}
              </Tab>
            ))}
          </Tab.List>
          <div className="w-full p-2 mb-3 text-sm text-gray-800 rounded-lg bg-gray-100/80">
            <div>
              {officialData && officialData?.length > 0 ? (
                <div>
                  공시지가: {officialData[0].reference_year}년 -{' '}
                  {officialData &&
                    officialData[officialData.length - 1].reference_year}
                  년
                </div>
              ) : (
                <div>정보가 없습니다</div>
              )}
              {tradeData && tradeData?.length > 0 ? (
                <div>
                  실거래가: {` `}
                  {getFullYmdStr(tradeData[0].reference_date)}-{` `}{' '}
                  {getFullYmdStr(
                    tradeData[tradeData.length - 1].reference_date,
                  )}
                </div>
              ) : (
                <div>실거래가: 정보가 없습니다</div>
              )}
              {adjustData && adjustData?.length > 0 ? (
                <div>
                  조정지역: {` `}
                  {getFullYmdStr(
                    adjustData[adjustData.length - 1].reference_date,
                  )}
                  -{` `} {getFullYmdStr(adjustData[0].reference_date)}
                </div>
              ) : (
                <div>조정지역: 정보가 없습니다</div>
              )}
            </div>
          </div>
          <Tab.Panels className="w-full h-full">
            <Tab.Panel className="w-full h-full">
              <PropertyChart
                officialData={officialData!}
                tradeData={tradeData!}
                adjustData={adjustData!}
              />
            </Tab.Panel>
            <Tab.Panel className="w-full">
              <Tab.Group>
                <Tab.List className="flex flex-wrap mb-3 text-sm font-medium text-center text-gray-500 bg-gray-50 rounded-[30px]">
                  {['공시지가', '실거래가', '조정지역'].map((item, idx) => (
                    <Tab
                      key={idx}
                      className={({ selected }) =>
                        classNames(
                          'w-1/3 inline-flex items-center justify-center p-4 transition ease-in-out bg-black',
                          selected
                            ? ' text-blue-600 bg-red-100 rounded-t-lg font-bold '
                            : 'rounded-t-lg hover:text-gray-600',
                        )
                      }
                    >
                      {item}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="h-[18rem] w-full overflow-y-auto scrollbar">
                  {[officialData, tradeData, adjustData].map((item, idx) => (
                    <Tab.Panel key={idx} className="w-full">
                      {item && item?.length > 0 ? (
                        <PropertyTable
                          tableType={idx + 1}
                          officialData={officialData!}
                          tradeData={tradeData!}
                          adjustData={adjustData!}
                        />
                      ) : (
                        <div className="text-gray-600"> 정보가 없습니다 </div>
                      )}
                    </Tab.Panel>
                  ))}
                </Tab.Panels>
              </Tab.Group>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default PropertyInfoCard;
