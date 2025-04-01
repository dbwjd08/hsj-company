import HouseList from "./houseList";
import TotaltaxChart from "./totaltaxChart";
import TaxTimeline from "./taxTimeline";
import { useRecoilValue } from "recoil";
import { tokenState, userState } from "@/lib/auth";
import { useCalculateKrTaxForRealEstateForMaintenanceHistoryAndFutureMvpKrTaxForRealEstateMaintenanceHistoryAndInferencePost, useGetPropertiesUniversesIdPropertiesGet, useInferFutureKrCapitalGainsTaxDefaultMvpKrCapitalGainsTaxHouseInferFutureDefaultPost } from "@/src/api/yuppieComponents";
import { getJsonHouse } from "@/lib/utils";
import { useEffect, useState } from "react";
import PropertyImage from '@/components/propertyImage';
import router from "next/router";
import { PropertyOwnership } from "@/src/api/yuppieSchemas";

const TotalTaxMain = ({ properties }: { properties: any }) => {

    const { default_universe_id, session_id } = useRecoilValue(tokenState);
    const user = useRecoilValue(userState);

    const [holdingTaxInfo, setHoldingTaxInfo] = useState<any>();

    const holdingTaxMutate = useCalculateKrTaxForRealEstateForMaintenanceHistoryAndFutureMvpKrTaxForRealEstateMaintenanceHistoryAndInferencePost();

    const getholdingTax = async () => {
        return await holdingTaxMutate
            .mutateAsync({
                body: {
                    sessionId: session_id as string,
                    taxYear: new Date().getFullYear(),
                    age: user.age ? user.age : 'under_60',
                    koreanProperties: properties
                        ?.map((value: PropertyOwnership) => {
                            return getJsonHouse(value);
                        })
                        .filter((element: any) => element) as any,
                },
            })
            .then((res) => {
                setHoldingTaxInfo(res);
            });
    };

    useEffect(() => {
        getholdingTax()
    }, [properties])


    const senarios = [
        {
            propertyPk: properties[1].property.pk,
            type: "property_tax",
            data: {
                acquisitionDate: '2020-11-21',
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
                monthlyRent: 2000000,
                startDate: '2023-11-21',
                endDate: '2026-11-20',
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
                sellingDate: '2025-11-20',
                sellingPrice: 1212321000
            }
        },
        {
            propertyPk: properties[2].property.pk,
            type: 'transfer_tax',
            data: {
                sellingDate: '2027-11-20',
                sellingPrice: 1812321001
            }
        }
    ]

    const [maxYear, setMaxYear] = useState((new Date()).getFullYear() + 1)

    const findMaxYear = () => {
        senarios.map((senario) => {
            if (senario.type == 'transfer_tax') {
                if (new Date(senario.data.sellingDate ?? 0).getFullYear() > maxYear)
                    setMaxYear(new Date(senario.data.sellingDate ?? 0).getFullYear() + 2)
            }
            else if (senario.type == 'rental_income')
                if (new Date(senario.data.endDate ?? 0).getFullYear() > maxYear)
                    setMaxYear(new Date(senario.data.endDate ?? 0).getFullYear() + 2)
        })
    }

    const yearIndex = (new Date()).getFullYear() - 3
    const holdingTax = new Array(properties.length)
    let totalPrice = 0
    for (var i = 0; i < properties.length; i++)
        totalPrice += properties[i].property.official_price
    for (var i = 0; i < properties.length; i++) {
        holdingTax[i] = new Array(maxYear - yearIndex + 2)
        holdingTax[i][0] = properties[i].property.pk
        for (var j = 1; j < maxYear - yearIndex + 2; j++)
            if (j < 5)
                holdingTax[i][j] = Math.round(holdingTaxInfo?.tax_for_me[yearIndex + j - 1].cret.cret.imposition_amount * (properties[i].property.official_price / totalPrice)) + holdingTaxInfo?.tax_for_me[yearIndex + j - 1].prop[properties[i].property.pk].my_total_property_tax_for_this_property
            else
                holdingTax[i][j] = Math.round(holdingTaxInfo?.tax_for_me[yearIndex + 4].cret.cret.imposition_amount * properties[i].property.official_price / totalPrice) + holdingTaxInfo?.tax_for_me[yearIndex + 4].prop[properties[i].property.pk].my_total_property_tax_for_this_property
    }

    /* const setDetailHoldingTaxInfo = (res: any, propertiesList: any[], year: number, property: string) => {
        let totalDetailPrice = 0
        for (var i = 0; i < propertiesList.length; i++)
            totalDetailPrice += propertiesList[i].property.official_price
        for (var i = 0; i < properties.length; i++) {
            for (var j = year - yearIndex + 1; j < maxYear - yearIndex + 2; j++) {
                if (holdingTax[i][0] == property)
                    holdingTax[i][j] = 0
                else if (i < propertiesList.length) {
                    for (var k = 0; k < propertiesList.length; k++) {
                        if (holdingTax[i][0] == propertiesList[k].property.pk)
                            if (j < 5)
                                holdingTax[i][j] = Math.round(res.tax_for_me[yearIndex + j - 1].cret.cret.imposition_amount * (propertiesList[k].property.official_price / totalDetailPrice)) + res.tax_for_me[yearIndex + j - 1].prop[propertiesList[k].property.pk].my_total_property_tax_for_this_property
                            else
                                holdingTax[i][j] = Math.round(res.tax_for_me[yearIndex + 4].cret.cret.imposition_amount * (propertiesList[k].property.official_price / totalDetailPrice)) + res.tax_for_me[yearIndex + 4].prop[propertiesList[k].property.pk].my_total_property_tax_for_this_property
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
    } */

    useEffect(() => {
        findMaxYear()
        //senarioHoldingTax()
    }, [])



    const totalTax = new Array(properties.length + 1)
    for (var i = 0; i < properties.length + 1; i++) {
        totalTax[i] = new Array(maxYear - yearIndex + 1)
        for (var j = 0; j < maxYear - yearIndex + 1; j++) {
            totalTax[i][j] = 0
        }
    }

    useEffect(() => {
        for (var i = 0; i < properties.length; i++) {
            for (var j = 0; j < maxYear - yearIndex + 1; j++) {
                totalTax[i][j] += holdingTax[i][j + 1]
            }
        }

    }, [holdingTax])

    useEffect(() => {
        for (var i = 0; i < properties.length; i++) {
            for (var j = 0; j < maxYear - yearIndex + 1; j++) {
                totalTax[properties.length][j] += totalTax[i][j]
            }
        }
    }, [totalTax])


    console.log(totalTax)

    if (holdingTaxInfo)
        return (
            <div className="max-w-[1200px] min-w-[1200px] m-auto">
                <div className="flex py-10 items-center">
                    <PropertyImage propertyType="apartment" className="w-8" />
                    <div className="text-2xl font-semibold mx-3">세후 총 수익 시뮬레이션</div>
                    <div>운용 방법에 따라 총 수익이 달라질까?</div>
                </div>
                <div className="flex gap-2 pb-10">
                    <div className="w-1/5">
                        <HouseList property={properties} />
                    </div>
                    <div className="flex flex-col w-3/5">
                        <TotaltaxChart properties={properties} totalTax={totalTax} holdingTax={holdingTax} maxYear={maxYear} />
                    </div>
                    <div className="w-1/5">
                        <TaxTimeline properties={properties} />
                    </div>
                </div>
                <div className="self-center items-center text-center">
                    <div
                        className="self-center  text-center w-fit cursor-pointer font-semibold text-blue-900 bg-blue-50 rounded-xl p-4 hover:bg-blue-100 hover:font-bold"
                        onClick={() => router.back()}
                    >
                        ⇠ 대시보드로 돌아가기
                    </div>
                </div>
            </div>
        );
    else return (
        <div></div>
    )
};

export default TotalTaxMain;
