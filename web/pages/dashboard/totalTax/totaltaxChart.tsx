import dynamic from 'next/dynamic';
import { formatPrice, getJsonHouse } from '@/lib/utils';
import { useCalculateKrTaxForRealEstateForMaintenanceHistoryAndFutureMvpKrTaxForRealEstateMaintenanceHistoryAndInferencePost, useInferFutureKrCapitalGainsTaxDefaultMvpKrCapitalGainsTaxHouseInferFutureDefaultPost } from '@/src/api/yuppieComponents';
import { tokenState, userState } from '@/lib/auth';
import { useRecoilValue } from 'recoil';
import { useEffect } from 'react';
import { PropertyOwnership } from '@/src/api/yuppieSchemas';

const TotaltaxChart = ({ properties, totalTax, holdingTax, maxYear }: { properties: any; totalTax: any; holdingTax: any; maxYear: number }) => {


    const { default_universe_id, session_id } = useRecoilValue(tokenState);

    const user = useRecoilValue(userState);


    const holdingTaxMutate = useCalculateKrTaxForRealEstateForMaintenanceHistoryAndFutureMvpKrTaxForRealEstateMaintenanceHistoryAndInferencePost();


    const senarios = [
        {
            propertyPk: properties[1].property.pk,
            type: "property_tax",
            data: {
                acquisitionDate: '2020-11-20',
                acquisitionPrice: 641213000,
                ownershipType: 'wholly_mine',
                stillLiving: false
            }
        },
        {
            propertyPk: properties[1].property.pk,
            type: "rental_income",
            data: {
                deposit: 15000000,
                monthlyRent: 2000001,
                startDate: '2023-11-20',
                endDate: '2026-11-21',
                depositRate: 3.3,
                option: {
                    everyYears: 1,
                    monthlyRent: 100000,
                }
            }
        },
        {
            propertyPk: properties[0].property.pk,
            type: 'transfer_tax',
            data: {
                sellingDate: '2025-11-21',
                sellingPrice: 1212320000
            }
        },
        {
            propertyPk: properties[2].property.pk,
            type: 'transfer_tax',
            data: {
                sellingDate: '2027-11-20',
                sellingPrice: 1812320000
            }
        }
    ]

    useEffect(() => {
        onGetGainTax();
        senarioHoldingTax();
    }, [])

    const yearIndex = (new Date()).getFullYear() - 3


    const setDetailHoldingTaxInfo = (res: any, propertiesList: any[], year: number, property: string) => {
        let totalDetailPrice = 0
        for (var i = 0; i < propertiesList.length; i++)
            totalDetailPrice += propertiesList[i].property.official_price
        for (var i = 0; i < properties.length; i++) {
            for (var j = year - yearIndex + 1; j < maxYear - yearIndex + 2; j++) {
                if (holdingTax[i][0] == property)
                    totalTax[i][j] -= holdingTax[i][j + 1]
                else if (i < propertiesList.length) {
                    for (var k = 0; k < propertiesList.length; k++) {
                        if (holdingTax[i][0] == propertiesList[k].property.pk)
                            if (j < 5) {
                                totalTax[i][j] -= holdingTax[i][j + 1]
                                totalTax[i][j] += Math.round(res.tax_for_me[yearIndex + j - 1].cret.cret.imposition_amount * (propertiesList[k].property.official_price / totalDetailPrice)) + res.tax_for_me[yearIndex + j - 1].prop[propertiesList[k].property.pk].my_total_property_tax_for_this_property
                            }
                            else {
                                totalTax[i][j] -= holdingTax[i][j + 1]
                                totalTax[i][j] += Math.round(res.tax_for_me[yearIndex + 4].cret.cret.imposition_amount * (propertiesList[k].property.official_price / totalDetailPrice)) + res.tax_for_me[yearIndex + 4].prop[propertiesList[k].property.pk].my_total_property_tax_for_this_property
                            }
                    }
                }
            }
        }
    }

    const senarioHoldingTax = () => {
        const filter = [];
        for (var i = 0; i < senarios.length; i++) {
            if (senarios[i].type == 'transfer_tax') {
                filter.push(new Array(2))
                filter[filter.length - 1][0] = senarios[i].propertyPk
                filter[filter.length - 1][1] = senarios[i].data.sellingDate?.split('-')[0]
            }
        }
        const propertiesList = [...properties]
        filter.map((senario, index) => {
            propertiesList?.map((value: PropertyOwnership) => {
                if (value.property.pk == senario[0])
                    propertiesList.splice(index, 1);
            })
            const gainHoldingTax = async () => {
                return await holdingTaxMutate
                    .mutateAsync({
                        body: {
                            sessionId: session_id as string,
                            taxYear: new Date().getFullYear(),
                            age: user.age ? user.age : 'under_60',
                            koreanProperties: propertiesList
                                ?.map((value: PropertyOwnership) => {
                                    return getJsonHouse(value);
                                })
                                .filter((element: any) => element) as any,
                        },
                    })
                    .then((res) => {
                        setDetailHoldingTaxInfo(res, propertiesList, senario[1], senario[0]);
                    });
            };
            gainHoldingTax();
            console.log(holdingTax)
        })
    }

    useEffect(() => {
        for (var i = 0; i < properties.length; i++) {
            for (var j = 0; j < maxYear - yearIndex + 1; j++) {
                totalTax[properties.length][j] += totalTax[i][j]
            }
        }
    }, [totalTax])


    const getGainTax = useInferFutureKrCapitalGainsTaxDefaultMvpKrCapitalGainsTaxHouseInferFutureDefaultPost();
    const onGetGainTax = async () => {
        try {
            properties.map(async (property: any, index: number) => {
                senarios.map(async (senario: any) => {
                    if (senario.propertyPk == property.property.pk && senario.type == 'transfer_tax') {
                        return await getGainTax.mutateAsync({
                            body: {
                                sessionId: session_id ?? "",
                                sellingHouse: {
                                    pk: property.property.pk,
                                    complex: property.property.complex.complex_name,
                                    dong: property.property.dong,
                                    ho: property.property.ho,
                                    kindOf: property.kind_of ?? '',
                                    share: property.share ?? 0,
                                    netLeasableArea: property.property.net_leasable_area ?? 0,
                                    ownershipType: property.ownership ?? '',
                                    officialPrice: property.property.official_price ?? 0,
                                    movingInDate: property.moving_in_date + ' 00:00:00.000',
                                    livingYears: property.living_years,
                                    stillLiving: property.still_living,
                                    acquisitionDatetime: property.acquisition_date + ' 00:00:00.000',
                                    acquisitionPrice: property.acquired_price
                                },
                                numOfHousesSellerHas: properties.length,
                                expectationSellingPrice: senario.data.sellingPrice,
                                sellingDatetime: senario.data.sellingDate + ' 00:00:00.000'
                            },
                        })
                            .then((res) => {
                                totalTax[index][(new Date(senario.data.sellingDate)).getFullYear() - (new Date()).getFullYear() + 3] += res.tax_for_price_expectation[0][1]
                            })
                    }
                })
            })
        }
        catch (error) {
            console.error(error)
        }
    }

    const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

    return (
        <div>
            <div className="text-center font-semibold">세후 총 수익</div>
            <Chart
                type='line'
                options={{
                    chart: {
                        toolbar: {
                            show: false,
                        },
                    },
                    colors: ['#FAA9A9', '#FFE297', '#A0B4E1', '#72A674'],
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                        },
                    },
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031'],
                    },
                    yaxis: {
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
                }}

                series={
                    [
                        {
                            name: properties[0].property.complex.complex_name,
                            type: 'bar',
                            data: totalTax[0]
                        },
                        {
                            name: properties[1].property.complex.complex_name,
                            type: 'bar',
                            data: totalTax[1]
                        },
                        {
                            name: properties[2].property.complex.complex_name,
                            type: 'bar',
                            data: totalTax[2]
                        },
                        {
                            name: '총합',
                            type: 'line',
                            data: totalTax[3]
                        }
                    ]}
            />
        </div>
    )
};

export default TotaltaxChart