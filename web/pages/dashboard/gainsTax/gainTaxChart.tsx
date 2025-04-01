import { formatPrice } from '@/lib/utils';
import dynamic from 'next/dynamic';

export const GainTaxChart = (gainTax: any) => {

    const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

    const length = gainTax.gainTax.tax_for_price_expectation.length

    const defaultTax = new Array(length);
    for (var i = 0; i < length; i++)
        defaultTax[i] = gainTax.gainTax.tax_for_price_default[i][1]

    const higherTax = new Array(length);
    for (var i = 0; i < length; i++)
        higherTax[i] = gainTax.gainTax.tax_for_price_higher[i][1]

    const highestTax = new Array(length);
    for (var i = 0; i < length; i++)
        highestTax[i] = gainTax.gainTax.tax_for_price_highest[i][1]

    const lowTax = new Array(length);
    for (var i = 0; i < length; i++)
        lowTax[i] = gainTax.gainTax.tax_for_price_low[i][1]

    const expTax = new Array(length);
    for (var i = 0; i < length; i++)
        expTax[i] = gainTax.gainTax.tax_for_price_expectation[i][1]

    const year = new Array(length);
    for (var i = 0; i < length; i++)
        year[i] = gainTax.gainTax.tax_for_price_default[i][0][1].split("-")[0]

    if (gainTax)
        return (
            <div className='h-full'>
                <Chart
                    width="100%"
                    height="100%"
                    options={{
                        chart: {
                            type: 'line',
                            toolbar: {
                                show: false,
                            },
                        },
                        colors: ['#1600bf', '#4e5bd9', '#707be0', '#96a1f2', '#fa619c'],
                        xaxis: {
                            tickAmount: 6,
                            categories:
                                year
                            ,
                            crosshairs: {
                                show: false,
                            },
                            tooltip: {
                                enabled: false,
                            },
                        },
                        yaxis: {
                            forceNiceScale: true,
                            labels: {
                                style: {
                                    colors: '#9c88ff',
                                    fontSize: "12"
                                },
                                formatter: (value) => {
                                    return formatPrice(value);
                                },
                            },
                        },
                        tooltip: {
                            y: {
                                formatter: (value) => {
                                    if (value > 10000)
                                        return formatPrice(Math.round(value / 10000) * 10000);
                                    else
                                        return formatPrice(value);
                                },
                            }
                        },
                        legend: {
                            offsetY: 5,
                            fontSize: "14"
                        }
                    }}
                    series={[
                        {
                            name: formatPrice(gainTax.gainTax.selling_prices.highest),
                            data: highestTax,
                        },
                        {
                            name: formatPrice(gainTax.gainTax.selling_prices.higher),
                            data: higherTax,
                        },
                        {
                            name: formatPrice(gainTax.gainTax.selling_prices.default),
                            data: defaultTax,
                        },
                        {
                            name: formatPrice(gainTax.gainTax.selling_prices.low),
                            data: lowTax,
                        },
                        {
                            name: "예상가(~" + formatPrice(Math.round(gainTax.gainTax.selling_prices.expectation / 100000000) * 100000000) + ")",
                            data: expTax,
                        },
                    ]}
                />
            </div>
        )
    else return (
        <div></div>
    )
}

export default GainTaxChart