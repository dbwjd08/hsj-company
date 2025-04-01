import dynamic from 'next/dynamic';
import { formatPrice } from '@/lib/utils';

const HoldingTaxMainChart = ({ holdingTaxInfo }: { holdingTaxInfo: any }) => {
  const currentYear = new Date().getFullYear();
  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

  //차트에 들어갈 내 종부세를 반환해주는 함수
  const getMyTaxChartData = () => {
    let tmpTaxList = [];

    if (holdingTaxInfo) {
      for (let i = currentYear; i < currentYear + 2; i++) {
        tmpTaxList.push(
          holdingTaxInfo?.tax_for_me[i].cret.cret.imposition_amount,
        );
      }
    }
    return tmpTaxList;
  };

  //차트에 들어갈 내 재산세를 계산해주는 함수
  const geyMyPropertyTax = () => {
    let tmpPropertyList = [];
    for (let year = currentYear; year < currentYear + 2; year++) {
      const propertyPK =
        holdingTaxInfo?.tax_for_me[year].cret.cret.payers_house_pks;

      let tmpPropertyTax = 0;
      for (let i = 0; i < propertyPK?.length; i++) {
        tmpPropertyTax +=
          holdingTaxInfo?.tax_for_me[year].prop[propertyPK[i]]
            .my_total_property_tax_for_this_property;
      }
      tmpPropertyList.push(tmpPropertyTax);
    }

    return tmpPropertyList;
  };

  //차트에 들어갈 당해 배우자포함 종부세를 반환해주는 함수
  const getHouseTaxChartData = () => {
    let tmpTaxList = [];

    if (holdingTaxInfo) {
      for (let i = currentYear; i < currentYear + 2; i++) {
        tmpTaxList.push(
          holdingTaxInfo?.tax_for_household_total[i].cret.household_total
            .imposition_amount,
        );
      }
    }

    return tmpTaxList;
  };

  //배우자 포함 재산세를 반환해주는 함수
  const getHousePropertyTax = () => {
    let tmpPropertyList = [];

    for (let year = currentYear; year < currentYear + 2; year++) {
      const propertyPK =
        holdingTaxInfo?.tax_for_household_total[year].cret.me.payers_house_pks;

      let tmpPropertyTax = 0;
      if (propertyPK) {
        for (let i = 0; i < propertyPK?.length; i++) {
          tmpPropertyTax +=
            holdingTaxInfo?.tax_for_household_total[year].prop[propertyPK[i]]
              .my_total_property_tax_for_this_property;
        }
      }
      tmpPropertyList.push(tmpPropertyTax);
    }

    return tmpPropertyList;
  };

  const numberToRoundToken = (num: number) => {
    return formatPrice(Math.round(num / 100000) * 100000);
  };
  return (
    <Chart
      type="bar"
      width="100%"
      height="100%"
      options={{
        chart: {
          fontFamily: 'system',
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ['#f9a3a4', '#ff8cc2', '#69d2e7', '#369aff'],
        xaxis: {
          categories: [currentYear, currentYear + 1],
          crosshairs: {
            show: false,
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          tickAmount: 3,
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
          y: {
            formatter: (value) => {
              return '약 ' + numberToRoundToken(value);
            },
          },
        },
      }}
      series={[
        {
          name: '내 종부세',
          data: holdingTaxInfo && getMyTaxChartData(),
        },
        {
          name: '내 재산세',
          data: holdingTaxInfo && geyMyPropertyTax(),
        },
        {
          name: '배우자 포함 종부세',
          data: holdingTaxInfo && getHouseTaxChartData(),
        },
        {
          name: '배우자 포함 재산세',
          data: holdingTaxInfo && getHousePropertyTax(),
        },
      ]}
    />
  );
};

export default HoldingTaxMainChart;
