import { formatPrice } from '@/lib/utils';
import dynamic from 'next/dynamic';

export const OneGainTaxChart = (gainTax: any) => {

    const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

    const length = gainTax.gainTax.tax_not_to_live.length

    const notLive = new Array(length);
    for (var i = 0; i < length; i++)
        notLive[i] = gainTax.gainTax.tax_not_to_live[i][1]

    const live = new Array(length);
    for (var i = 0; i < length; i++)
        live[i] = gainTax.gainTax.tax_to_live[i][1]

    const win = new Array(length);
    if (gainTax.gainTax.tax_not_to_live.length == gainTax.gainTax.tax_win_win_partnership.length) {
        for (var i = 0; i < length; i++)
            win[i] = gainTax.gainTax.tax_win_win_partnership[i][1]
    }

    const year = new Array(length);
    for (var i = 0; i < length; i++)
        year[i] = gainTax.gainTax.tax_not_to_live[i][0][1].split("-")[0]

    if (gainTax.gainTax.tax_not_to_live.length == gainTax.gainTax.tax_win_win_partnership.length)
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
                        colors: ['#96a1f2', '#fa619c', '#66DE99'],
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
                    }
                    }
                    series={[
                        {
                            name: '현재대로',
                            data: notLive,
                        },
                        {
                            name: '입주한다면',
                            data: live,
                        },
                        {
                            name: '상생임대인',
                            data: win,
                        }
                    ]}
                />
            </div>
        )
    else if (gainTax)
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
                        colors: ['#96a1f2', '#fa619c'],
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
                            name: '현재대로',
                            data: notLive,
                        },
                        {
                            name: '입주한다면',
                            data: live,
                        },
                    ]}
                />
            </div>
        )
    else return (
        <div></div>
    )
}

export default OneGainTaxChart