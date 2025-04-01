import dynamic from 'next/dynamic';
import { rateObj } from './index.page';
import ArticleModal from './articleModal';
import CalculateModal from './calculateModal';
import { useState } from 'react';
const RentalCharts = ({
  data,
  rateList,
  area,
}: {
  data: any;
  rateList: rateObj | undefined;
  area: number;
}) => {
  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

  const [isPropertyOpen, setIsPropertyOpen] = useState(false);
  const [isCalculationOpen, setIsCalculationOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col h-fit rounded-xl border-2 border-gray-100 px-7 py-5 gap-5">
        <div
          className="cursor-pointer rounded-xl bg-gray-50 border-2 border-gray-100 p-3 font-semibold text-gray-800"
          onClick={() => setIsPropertyOpen(true)}
        >
          {Math.ceil(area)}m2 ({(area * 0.3025).toFixed(2)}평) 전체 매물 보기 ▸
        </div>
        <div
          className="cursor-pointer rounded-xl bg-gray-50 border-2 border-gray-100 p-3 font-semibold text-gray-800"
          onClick={() => setIsCalculationOpen(true)}
        >
          적정 전환율 계산법 보기 ▸
        </div>
        <Chart
          width="100%"
          height="80%"
          type="scatter"
          options={{
            chart: {
              fontFamily: 'system',
              height: 350,
              toolbar: {
                show: false,
              },

              zoom: {
                enabled: false,
              },
            },

            xaxis: {
              title: {
                text: '보증금(단위: 만원) / LTV',
              },
              tickAmount: 5,
              labels: {
                formatter: (value) => {
                  return value;
                },
              },
              tooltip: {
                enabled: false,
              },
              min: 0,
              max:
                Math.max.apply(
                  [],
                  data &&
                    Object.keys(data.points)
                      .filter((item) => data.points[item].conversion < 20)
                      .map((item: any) => {
                        return Number(data.points[item].xPos);
                      }),
                ) + 20000,
            },
            yaxis: {
              title: {
                text: '전환율 / 금리',
              },
              min: 0,
              max: Math.max(
                7.0,
                Math.max.apply(
                  [],
                  data &&
                    Object.keys(data.points)
                      .filter((item) => data.points[item].conversion < 20)
                      .map((item: any) => {
                        return Number(data.points[item].conversion.toFixed(2));
                      }),
                ) + 2,
              ),
              tickAmount: Math.max(
                7.0,
                Math.max.apply(
                  [],
                  data &&
                    Object.keys(data.points)
                      .filter((item) => data.points[item].conversion < 20)
                      .map((item: any) => {
                        return Number(data.points[item].conversion.toFixed(2));
                      }),
                ) + 2,
              ),

              labels: {
                formatter: (value) => {
                  return value.toFixed(1) + '%';
                },
              },
            },
            tooltip: {
              followCursor: true,
              custom: function ({ seriesIndex, dataPointIndex, w }) {
                const data =
                  w.globals.initialSeries[seriesIndex].data[dataPointIndex][2];

                if (data) {
                  return (
                    '<div class="w-full max-w-sm p-2 bg-white rounded-lg flex flex-col justify-center items-center">' +
                    '<div class="inline-flex px-2 text-center text-sm font-bold text-blue-900 bg-gray-100 rounded-lg">' +
                    data.detail +
                    '</div>' +
                    '<div class="font-medium">' +
                    data.name +
                    '</div>' +
                    '<div class="font-medium">' +
                    '전환율: ' +
                    data.conversion.toFixed(2) +
                    '%' +
                    '</div>' +
                    '</div>'
                  );
                }
              },
            },
            annotations: {
              yaxis: [
                {
                  y: rateList?.depGenMin,
                  y2: rateList?.depGenMax,
                  fillColor: '#9DADC8',
                  opacity: 0.4,
                  label: {
                    style: {
                      cssClass: 'display: hidden',
                    },
                  },
                },
                {
                  y: rateList?.depSavMin,
                  y2: rateList?.depSavMax,
                  fillColor: '#6CA783',
                  opacity: 0.4,
                  label: {
                    style: {
                      cssClass: 'display: hidden',
                    },
                  },
                },
                {
                  y: rateList?.loanGenMin,
                  y2: rateList?.loanGenMax,
                  width: '50%',
                  fillColor: '#FFEAB6',
                  opacity: 0.6,
                  label: {
                    style: {
                      cssClass: 'display: hidden',
                    },
                  },
                },
                {
                  y: rateList?.loanSavMin,
                  y2: rateList?.loanSavMax,
                  width: '50%',
                  offsetX: 235,
                  fillColor: '#F49999',
                  opacity: 0.4,
                  label: {
                    style: {
                      cssClass: 'display: hidden',
                    },
                  },
                },
                {
                  y: data && data.appConvRate,
                  borderColor: '#4347cd',
                  borderWidth: 4,
                  strokeDashArray: 0,
                  label: {
                    borderColor: '#4347cd',
                    style: {
                      color: '#fff',
                      background: '#4347cd',
                      fontSize: '13',
                    },
                    text: `적정전환율:
                  ${'\n'}
                  ${data?.appConvRate.toFixed(2)}%`,
                  },
                },
              ],
            },
          }}
          series={[
            {
              name: '매물',
              type: 'scatter',
              data: data
                ? Object.keys(data.points)
                    .filter((item) => data.points[item].conversion < 20)
                    .map((item: any) => {
                      return [
                        data.points[item].xPos,
                        data.points[item].conversion.toFixed(2),
                        data.points[item],
                      ];
                    })
                : [],
            },
          ]}
        />
        <div className="flex flex-col items-center gap-y-2 h-1/5">
          <div className="flex gap-3 w-full font-medium text-gray-800 items-center justify-center">
            <div className="bg-[#9DADC8] w-10 h-5 opacity-50"></div>
            <div>시중은행 예금금리</div>
            <div className="bg-[#6CA783] w-10 h-5 opacity-50 ml-6"></div>
            <div>저축은행 예금금리</div>
          </div>
          <div className="flex gap-3 w-full font-medium text-gray-800 items-center justify-center">
            <div className="bg-[#FFEAB6] w-10 h-5 opacity-70"></div>
            <div>시중은행 대출금리</div>
            <div className="bg-[#F49999] w-10 h-5 opacity-50 ml-6"></div>
            <div>저축은행 대출금리</div>
          </div>
        </div>
      </div>{' '}
      <ArticleModal
        isOpen={isPropertyOpen}
        setIsOpen={setIsPropertyOpen}
        data={data}
        area={area}
      />
      <CalculateModal
        isOpen={isCalculationOpen}
        setIsOpen={setIsCalculationOpen}
        data={data}
      />
    </>
  );
};

export default RentalCharts;
