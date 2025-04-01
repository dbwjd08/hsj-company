import { Transition, Dialog } from '@headlessui/react';
import { Fragment, Dispatch, SetStateAction, useState, useEffect } from 'react';
import TitleIcon from '@/public/modaltitle.svg';
import dynamic from 'next/dynamic';
import { NaverLand } from '@/src/api/yuppieSchemas';
import Loading from '@/pages/loading';
const ArticleModal = ({
  isOpen,
  setIsOpen,
  data,
  area,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  data: any;
  area: number;
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };
  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

  const [month, setMonth] = useState<Array<NaverLand>>();
  const [rent, setRent] = useState<Array<NaverLand>>();
  const [sell, setSell] = useState<Array<NaverLand>>();

  useEffect(() => {
    const tmp_month = data.articles.filter(
      (item: NaverLand) => item.tradTpNm === '월세',
    );
    const tmp_rent = data.articles.filter(
      (item: NaverLand) => item.tradTpNm === '전세',
    );
    const tmp_sell = data.articles.filter(
      (item: NaverLand) => item.tradTpNm === '매매',
    );

    setMonth(tmp_month);
    setRent(tmp_rent);
    setSell(tmp_sell);
  }, [data]);

  const donutData = {
    series: [month?.length, rent?.length, sell?.length],
    options: {
      chart: {
        fontFamily: 'system',
        type: 'donut',
        zoom: {
          enabled: false,
        },
      },
      colors: ['#94E3B4', '#F49999', '#FFEAB6'],
      legend: {
        show: false,
      },
      responsive: [
        {
          breakpoint: 480,
        },
      ],
      dataLabels: {
        enabled: false,
        dropShadow: {
          enabled: true,
          opacity: 0,
        },
      },
      tooltip: {
        custom: ({ series, seriesIndex, w }: any) => {
          return (
            '<div class="p-2 rounded-lg">' +
            w.config.labels[seriesIndex] +
            ' : ' +
            series[seriesIndex] +
            '개' +
            '</div>'
          );
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
                label: '전체 매물',
                fontSize: '1.5rem',
                fontWeight: 500,
              },
              value: {
                fontSize: '1.3rem',
                fontWeight: 500,
                show: true,
              },
            },
          },
        },
      },

      labels: ['월세', '전세', '메매'],
    },
  };

  const barData = {
    series: [{ data: [month?.length, rent?.length, sell?.length] }],
    options: {
      chart: {
        fontFamily: 'system',
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      colors: ['#94E3B4', '#F49999', '#FFEAB6'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      xaxis: {
        categories: [
          [`월세 ${month?.length}개`],
          [`전세 ${rent?.length}개`],
          [`매매 ${sell?.length}개`],
        ],
        labels: {
          style: {
            fontSize: '1rem',
            fontWeight: 500,
          },
        },
      },
      yaxis: {
        show: false,
        axisBorder: {
          show: false,
        },
      },
    },
  };

  if (!data || !month || !rent || !sell) return <Loading />;
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-2/3 h-[45rem] rounded-2xl bg-white pb-3 text-left align-middle shadow-xl transition-all p-2">
                <div
                  className="fixed right-3 top-2 font-medium text-xl text-gray-400 cursor-pointer p-2"
                  onClick={() => closeModal()}
                >
                  ✕
                </div>
                <div className="w-full flex flex-col text-gray-800 p-6 gap-6">
                  <Dialog.Title className="text-2xl font-medium text-gray-800 mb-4  flex items-center p-2 bg-gray-50 rounded-2xl">
                    <TitleIcon className="w-[50px] animate-wiggle" />
                    {Math.ceil(area)}m2 ({(area * 0.3025).toFixed(2)}평) 전체
                    매물 보기
                  </Dialog.Title>
                  <div className="flex w-full overflow-y-auto gap-5 h-full">
                    <section className="w-[60%] px-6 py-5 gap-5 text-gray-800 rounded-xl bg-gray-50/50 border-2 border-gray-100 overflow-y-auto scrollbar">
                      <div className="font-semibold text-2xl mb-5">
                        매물 요약
                      </div>
                      {data.articles.length == 0 ? (
                        <div>매물이 없습니다.</div>
                      ) : (
                        <div className="flex w-full justify-center gap-3 items-center">
                          <Chart
                            options={donutData.options as any}
                            series={donutData.series as any}
                            type="donut"
                            width="300"
                          />
                          <Chart
                            options={barData.options as any}
                            series={barData.series as any}
                            type="bar"
                            width="320"
                          />
                        </div>
                      )}
                    </section>
                    <section className="flex flex-col w-[37%] h-full px-6 py-5 gap-5 text-gray-800 rounded-xl border-2 border-gray-100">
                      <div className="font-semibold text-2xl">전체 매물</div>

                      <div className="w-full overflow-y-auto scrollbar">
                        {data.articles.map((item: any, idx: number) => (
                          <div
                            className="flex gap-10 items-center border-b-2 border-gray-100 mr-5"
                            key={idx}
                          >
                            <div className="w-fit font-semibold text-blue-900">
                              {idx + 1}
                            </div>
                            <div className="flex flex-col w-full font-medium">
                              <div className="font-semibold text-blue-900">
                                {item.tradTpNm} {item.prcInfo}
                              </div>
                              <div>
                                {item.bildNm}, {item.spc1}/{item.spc2}m2,{' '}
                                {item.flrInfo}, {item.direction}
                              </div>
                              <div>등록: {item.updated}</div>
                            </div>
                          </div>
                        ))}
                        {data.articles.length == 0 && (
                          <div>매물이 없습니다.</div>
                        )}
                      </div>
                    </section>{' '}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ArticleModal;
