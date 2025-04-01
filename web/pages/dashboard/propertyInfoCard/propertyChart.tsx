import {
  GetOfficialPriceOfficialPricePkGetResponse,
  GetTradeHistoryTradeHistoryPkGetResponse,
  GetAdjustedAreaHistoryAdjustedAreaHistoryComplexComplexPkAllGetResponse,
} from '@/src/api/yuppieComponents';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';

const PropertyChart = ({
  officialData,
  tradeData,
  adjustData,
}: {
  officialData: GetOfficialPriceOfficialPricePkGetResponse;
  tradeData: GetTradeHistoryTradeHistoryPkGetResponse;
  adjustData: GetAdjustedAreaHistoryAdjustedAreaHistoryComplexComplexPkAllGetResponse;
}) => {
  const [adjustAnnotationDate, setAdjustAnnotationDate] = useState<number[]>(
    [],
  );

  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

  const findOfficialPrice = (data: string) => {
    let tmp = '';
    for (let i = 0; i < officialData?.length; i++) {
      if (
        new Date(data).getMonth() + 1 < 6 &&
        new Date(data).getFullYear() - 1 === officialData[i].reference_year
      ) {
        tmp = formatPrice(officialData[i].price);
        break;
      } else if (
        new Date(data).getMonth() + 1 >= 6 &&
        new Date(data).getFullYear() === officialData[i].reference_year
      ) {
        tmp = formatPrice(officialData[i].price);
        break;
      }
    }
    return tmp;
  };

  useEffect(() => {
    if (adjustData) {
      const tmp = adjustData.filter((item) => item.should_adjust === 1);
      if (tmp.length > 0) {
        const tmp_list: number[] = [
          new Date(tmp[0].reference_date).getTime(),
          new Date(tmp[tmp.length - 1].reference_date).getTime(),
        ];
        setAdjustAnnotationDate(tmp_list);
      }
    }
  }, [adjustData]);

  return (
    <div className="h-[70%] w-full">
      <Chart
        width="100%"
        height="100%"
        options={{
          chart: {
            fontFamily: 'system',
            type: 'candlestick',
            toolbar: {
              show: false,
            },
            zoom: {
              enabled: false,
            },
            background: 'transparent',
            events: {
              mouseMove: (event, chartContext, config) => {
                const tooltip = chartContext.el.querySelector(
                  '.apexcharts-tooltip',
                );
                const pointsArray = config.globals.pointsArray;
                const seriesIndex = config.seriesIndex;
                const dataPointIndex =
                  config.dataPointIndex === -1 ? 0 : config.dataPointIndex;

                if (seriesIndex !== -1 && seriesIndex && dataPointIndex) {
                  const position = pointsArray[seriesIndex][dataPointIndex];

                  tooltip.style.top = position[1] + 'px';
                  tooltip.style.left = position[0] + 'px';
                }
              },
            },
          },
          stroke: {
            curve: 'smooth',
            width: 2,
          },
          yaxis: {
            labels: {
              style: {
                colors: '#9c88ff',
              },
              formatter: (value) => {
                return formatPrice(value);
              },
            },
          },
          markers: {
            size: [4, 0],
          },
          xaxis: {
            type: 'datetime',
            crosshairs: {
              show: false,
            },
            tickAmount: 6,
            min: new Date(
              Math.min(
                officialData && officialData[0].reference_year,
                tradeData?.length > 0
                  ? Number(tradeData[0]?.reference_date.slice(0, 4))
                  : 1e9,
              ) + '-01-01',
            ).getTime(),
            max: new Date(
              Math.max(
                officialData &&
                  officialData[officialData.length - 1].reference_year,
                tradeData?.length > 0
                  ? Number(
                      tradeData[tradeData.length - 1]?.reference_date.slice(
                        0,
                        4,
                      ),
                    )
                  : 0,
              ) + '-12-31',
            ).getTime(),
            labels: {
              style: {
                colors: '#9c88ff',
              },
              datetimeFormatter: {
                year: 'yyyy',
              },
            },
            tooltip: {
              enabled: false,
            },
          },
          tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              const data =
                w.globals.initialSeries[seriesIndex].data[dataPointIndex];

              if (data && data.z !== null && data.z !== undefined) {
                return (
                  '<div class="w-full max-w-sm p-1 px-2 bg-white rounded-lg"> <ul>' +
                  '<li class="inline-flex px-2 items-center justify-center text-xs font-medium text-blue-900 bg-blue-100 rounded-lg mb-2"><b>' +
                  new Date(data.x).getFullYear() +
                  '년 ' +
                  (new Date(data.x).getMonth() + 1) +
                  '월 ' +
                  new Date(data.x).getDate() +
                  '일 ' +
                  '</b> </li>' +
                  '<li class="text-xs"><b>실거래가</b>: ' +
                  formatPrice(data.y) +
                  `${
                    data.z == ''
                      ? ''
                      : '</li>' +
                        '<li class="text-xs"><b>당해 공시지가</b>: ' +
                        data.z +
                        '</li>' +
                        '</ul></div>'
                  } `
                );
              } else if (data) {
                return (
                  '<div class="w-full max-w-sm p-1 bg-white rounded-lg"> <ul>' +
                  '<li class="inline-flex px-2 items-center justify-center text-xs font-medium text-blue-900 bg-blue-100 rounded-lg mb-2"><b>' +
                  new Date(data.x).getFullYear() +
                  '년 ' +
                  '</b> </li>' +
                  '<li class="text-xs"><b>공시지가</b>: ' +
                  formatPrice(data.y) +
                  '</li>' +
                  '</ul></div>'
                );
              }
            },
          },

          annotations: {
            xaxis: [
              {
                x: adjustAnnotationDate[0],
                x2: adjustAnnotationDate[1],
                fillColor: '#B3F7CA',
                opacity: 0.4,
                label: {
                  borderColor: '#c2c2c2',
                  text: '조정지역',
                },
              },
            ],
          },
        }}
        series={[
          {
            type: 'line',
            name: '공시지가',
            data: officialData
              ? officialData.map((value) => {
                  return {
                    x: new Date(
                      value.reference_year.toString() + '-06-01',
                    ).getTime(),
                    y: value.price,
                    z: null,
                  };
                })
              : [],
          },
          {
            type: 'line',
            name: '실거래가',
            data: tradeData
              ? [...tradeData].map((value) => {
                  return {
                    x: new Date(value.reference_date).getTime(),
                    y: value.price,
                    z: findOfficialPrice(value.reference_date),
                  };
                })
              : [],
          },
        ]}
      />
    </div>
  );
};

export default PropertyChart;
