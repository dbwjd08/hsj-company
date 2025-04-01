import { formatPrice } from '@/lib/utils';
import dynamic from 'next/dynamic';

const PropertyTaxChart = ({
  holdingTaxInfo,
  newHoldingTaxInfo,
}: {
  holdingTaxInfo: any;
  newHoldingTaxInfo: any;
}) => {
  const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

  const currentYear = new Date().getFullYear();

  const numberToRoundToken = (num: number) => {
    return formatPrice(Math.round(num / 100000) * 100000);
  };

  // 기존 유지 내 보유세를 반환해주는 함수
  const getMyTax = (flag: string) => {
    let tmpTaxList = [];
    let Info;
    if (flag === 'origin') {
      Info = holdingTaxInfo;
    } else {
      Info = newHoldingTaxInfo;
    }

    if (Info) {
      for (let i = currentYear; i < currentYear + 2; i++) {
        let tmp_tax = Info?.tax_for_me[i].cret.cret.imposition_amount;
        // 종부세와 재산세 합해주기
        tmp_tax += calculateMyPropertyTax(i, flag);
        tmpTaxList.push(tmp_tax);
      }
    }
    return tmpTaxList;
  };

  //기존 유지 배우자포함 보유세를 반환해주는 함수
  const getHouseTax = (flag: string) => {
    let tmpTaxList = [];

    let Info;
    if (flag === 'origin') {
      Info = holdingTaxInfo;
    } else {
      Info = newHoldingTaxInfo;
    }

    if (Info) {
      for (let i = currentYear; i < currentYear + 2; i++) {
        let tmp_tax =
          Info?.tax_for_household_total[i].cret.household_total
            .imposition_amount;
        tmp_tax += calculateHousePropertyTax(i, flag);
        tmpTaxList.push(tmp_tax);
      }
    }

    return tmpTaxList;
  };

  const calculateMyPropertyTax = (year: number | string, flag: string) => {
    let tmpPropertyTax = 0;

    let Info;
    if (flag === 'origin') {
      Info = holdingTaxInfo;
    } else {
      Info = newHoldingTaxInfo;
    }

    const propertyPK = Info?.tax_for_me[year].cret.cret.payers_house_pks;
    if (propertyPK) {
      for (let i = 0; i < propertyPK?.length; i++) {
        tmpPropertyTax +=
          Info?.tax_for_me[year].prop[propertyPK[i]]
            .my_total_property_tax_for_this_property;
      }
    }

    return tmpPropertyTax;
  };

  const calculateHousePropertyTax = (year: number | string, flag: string) => {
    let tmpPropertyTax = 0;

    let Info;
    if (flag === 'origin') {
      Info = holdingTaxInfo;
    } else {
      Info = newHoldingTaxInfo;
    }

    const propertyPK =
      Info?.tax_for_household_total[year].cret.me.payers_house_pks;
    if (propertyPK) {
      for (let i = 0; i < propertyPK?.length; i++) {
        tmpPropertyTax +=
          Info?.tax_for_household_total[year].prop[propertyPK[i]]
            .my_total_property_tax_for_this_property;
      }
    }

    return tmpPropertyTax;
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
          zoom: {
            enabled: false,
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
        legend: {
          fontSize: '16px',
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
          labels: {
            style: {
              colors: '#9c88ff',
              fontSize: '15px',
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#9c88ff',
              fontSize: '15px',
            },

            formatter: (value) => {
              return formatPrice(value);
            },
          },
        },
        tooltip: {
          shared: false,
          style: {
            fontSize: '16px',
          },
          y: {
            formatter: (value) => {
              return '약 ' + numberToRoundToken(value);
            },
          },
        },
      }}
      series={[
        {
          name: '기존 유지',
          data: holdingTaxInfo && getMyTax('origin'),
        },
        {
          name: '기존 유지(배우자 포함)',
          data: holdingTaxInfo && getHouseTax('origin'),
        },
        {
          name: '새집 취득시',
          data: holdingTaxInfo && getMyTax('new'),
        },
        {
          name: '새집 취득시 (배우자 포함)',
          data: holdingTaxInfo && getHouseTax('new'),
        },
      ]}
    />
  );
};

export default PropertyTaxChart;
