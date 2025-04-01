import dynamic from 'next/dynamic';
import { formatPrice } from '@/lib/utils';
import { useEffect, useState } from 'react';

const HoldingTaxChart = ({ holdingTaxInfo }: { holdingTaxInfo: any }) => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategoreis] = useState<Array<number>>();
  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

  useEffect(() => {
    let tmpArr = [];
    for (let i = currentYear - 3; i < currentYear + 2; i++) {
      const myEstateTax =
        holdingTaxInfo?.tax_for_me[i].cret.cret.imposition_amount;

      const myPropTax = getMyPropertyTax(i);

      const houseEstateTax =
        holdingTaxInfo?.tax_for_household_total[i].cret.household_total
          .imposition_amount;
      const housePropTax = getHousePropertyTax(i);

      if (myEstateTax + myPropTax != 0 || houseEstateTax + housePropTax != 0) {
        tmpArr.push(i);
      }
    }
    setCategoreis(tmpArr);
  }, [
    currentYear,
    holdingTaxInfo?.tax_for_household_total,
    holdingTaxInfo?.tax_for_me,
  ]);

  //년도를 받으면 내 재산세를 계산해주는 함수
  const getMyPropertyTax = (year: number | string) => {
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

  //년도를 보내면 배우자 포함 재산세를 계산해주는 함수
  const getHousePropertyTax = (year: number | string) => {
    let tmpPropertyTax = 0;
    const propertyPK =
      holdingTaxInfo?.tax_for_household_total[year].cret.me.payers_house_pks;
    if (propertyPK) {
      for (let i = 0; i < propertyPK?.length; i++) {
        tmpPropertyTax +=
          holdingTaxInfo?.tax_for_household_total[year].prop[propertyPK[i]]
            .my_total_property_tax_for_this_property;
      }
    }

    return tmpPropertyTax;
  };

  //차트에 들어갈 당해 내 보유세(재산세+종부세)를 반환해주는 함수
  const getMyEstateTax = (year: number) => {
    const data = holdingTaxInfo?.tax_for_me[year].cret.cret.imposition_amount;

    return data;
  };

  //차트에 들어갈 당해 배우자포함 보유세(재산세+종부세)를 반환해주는 함수
  const getHouseEstateTax = (year: number) => {
    const data =
      holdingTaxInfo?.tax_for_household_total[year].cret.household_total
        .imposition_amount;

    return data;
  };

  const numberToRoundToken = (num: number) => {
    return formatPrice(Math.round(num / 100000) * 100000);
  };

  if (!holdingTaxInfo || !categories) return <></>;
  else if (categories.length == 0)
    return (
      <div className="w-full h-full justify-center items-center">
        보유세 정보가 없습니다.
      </div>
    );
  return (
    <Chart
      type="bar"
      width="100%"
      height="100%"
      options={{
        chart: {
          fontFamily: 'system',
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        grid: {
          padding: {
            left: 55, // or whatever value that works
            right: 55, // or whatever value that works
          },
        },
        colors: ['#f9a3a4', '#69d2e7'],
        xaxis: {
          categories: categories,
          crosshairs: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
          labels: {
            formatter: (value: any) => {
              return Math.ceil(value).toString();
            },
          },
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
        tooltip: {
          shared: false,
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const data =
              w.globals.initialSeries[seriesIndex].data[dataPointIndex];

            const label = w.globals.initialSeries[seriesIndex].name;

            if (data && holdingTaxInfo) {
              if (label == '내 보유세') {
                return (
                  '<div class="w-full max-w-sm p-1 px-2 bg-white rounded-lg"> <ul>' +
                  '<li class="inline-flex px-2 text-center text-sm font-medium text-gray-800 bg-gray-100 rounded-lg mb-2"><b>' +
                  '약 ' +
                  numberToRoundToken(data.y) +
                  '</b> </li>' +
                  '<li class="text-sm text-[#f9a3a4]"><b>종부세</b>: 약 ' +
                  numberToRoundToken(getMyEstateTax(data.x)) +
                  '</li>' +
                  '<li class="text-sm text-[#f9a3a4]"><b>재산세</b>: 약 ' +
                  numberToRoundToken(getMyPropertyTax(data.x)) +
                  '</li>' +
                  '</ul></div>'
                );
              } else {
                return (
                  '<div class="w-full max-w-sm p-1 px-2 bg-white rounded-lg"> <ul>' +
                  '<li class="inline-flex px-2 text-center text-sm font-medium text-gray-800 bg-gray-100 rounded-lg mb-2"><b>' +
                  '약 ' +
                  numberToRoundToken(data.y) +
                  '</b> </li>' +
                  '<li class="text-sm text-[#65a5b2]"><b>종부세</b>: 약 ' +
                  numberToRoundToken(getHouseEstateTax(data.x)) +
                  '</li>' +
                  '<li class="text-sm text-[#65a5b2]"><b>재산세</b>: 약 ' +
                  numberToRoundToken(getHousePropertyTax(data.x)) +
                  '</li>' +
                  '</ul></div>'
                );
              }
            }
          },
        },
      }}
      series={[
        {
          name: '내 보유세',
          data: categories
            ? categories.map((value) => {
                return {
                  x: value,
                  y: getMyEstateTax(value) + getMyPropertyTax(value),
                };
              })
            : [],
          //   categories.map((value) => {
          //     return getMyEstateTax(value) + getMyPropertyTax(value);
          //   })
          // : [],
        },
        {
          name: '배우자 포함 보유세',
          data: categories
            ? categories.map((value) => {
                return {
                  x: value,
                  y: getHouseEstateTax(value) + getHousePropertyTax(value),
                };
              })
            : [],
        },
      ]}
    />
  );
};

export default HoldingTaxChart;
