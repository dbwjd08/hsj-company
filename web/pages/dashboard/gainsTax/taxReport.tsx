import { formatPrice } from "@/lib/utils";
import DatePicker from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import format from 'date-fns/format'
import { useEffect, useState } from "react";
import { useDeletePropertyUniversesIdPropertiesPkDelete, useInferFutureKrCapitalGainsTaxDefaultMvpKrCapitalGainsTaxHouseInferFutureDefaultPost, useKrCapitalGainsTaxHouseForTmp2houseOwnerMvpKrCapitalGainsTaxHouseForTmp2houseOwnerToSellOldPost } from "@/src/api/yuppieComponents";
import { useRecoilValue } from "recoil";
import { tokenState } from "@/lib/auth";
import Link from "next/link";

export const TaxReport = ({ Info, sellingPrice, setSellingPrice, acPrice, newHouse }: { Info: any; sellingPrice: number; setSellingPrice: React.Dispatch<React.SetStateAction<number>>; acPrice: number; newHouse: any }) => {

    const { default_universe_id, session_id } = useRecoilValue(tokenState);

    const getGainTax = useInferFutureKrCapitalGainsTaxDefaultMvpKrCapitalGainsTaxHouseInferFutureDefaultPost();
    const onGetGainTax = async () => {
        return await getGainTax.mutateAsync({
            body: {
                sessionId: session_id ?? "",
                sellingHouse: {
                    pk: Info.pk,
                    complex: Info.complex,
                    dong: Info.dong,
                    ho: Info.ho,
                    kindOf: Info.kindOf,
                    share: Number(Info.share),
                    netLeasableArea: Number(Info.netLeasableArea),
                    ownershipType: Info.ownershipType,
                    officialPrice: Number(Info.officialPrice),
                    movingInDate: Info.movingInDate + ' 00:00:00.000',
                    livingYears: Number(Info.livingYears),
                    stillLiving: Info.stillLiving,
                    acquisitionDatetime: Info.acquisitionDateTime + ' 00:00:00.000',
                    acquisitionPrice: Number(Info.acquisitionPrice)
                },
                numOfHousesSellerHas: Number(Info.numOfHousesSellerHas),
                expectationSellingPrice: price,
                sellingDatetime: format(date, "yyy-MM-dd").toString() + ' 00:00:00.000',
            },
        })
            .then((res) => {
                setGainTax(res);
            })
    }

    const getTempTax = useKrCapitalGainsTaxHouseForTmp2houseOwnerMvpKrCapitalGainsTaxHouseForTmp2houseOwnerToSellOldPost();
    const onGetTempTax = async () => {
        return await getTempTax.mutateAsync({
            body: {
                sessionId: session_id ?? "",
                oldHouse: {
                    pk: Info.pk,
                    complex: Info.complex,
                    dong: Info.dong,
                    ho: Info.ho,
                    kindOf: Info.kindOf,
                    share: Number(Info.share),
                    netLeasableArea: Number(Info.netLeasableArea),
                    ownershipType: Info.ownershipType,
                    officialPrice: Number(Info.officialPrice),
                    movingInDate: Info.movingInDate + ' 00:00:00.000',
                    livingYears: Number(Info.livingYears),
                    stillLiving: Info.stillLiving,
                    acquisitionDatetime: Info.acquisitionDateTime + ' 00:00:00.000',
                    acquisitionPrice: Number(Info.acquisitionPrice)
                },
                newHouse: {
                    pk: newHouse.property.pk,
                    complex: newHouse.property.complex.complex_name,
                    dong: newHouse.property.dong,
                    ho: newHouse.property.ho,
                    kindOf: newHouse.kind_of,
                    share: Number(newHouse.share),
                    netLeasableArea: Number(newHouse.property.net_leasable_area),
                    ownershipType: newHouse.ownership,
                    officialPrice: Number(newHouse.property.official_price),
                    movingInDate: newHouse.moving_in_date + ' 00:00:00.000',
                    livingYears: Number(newHouse.living_years),
                    stillLiving: newHouse.still_living,
                    acquisitionDatetime: newHouse.acquisition_date + ' 00:00:00.000',
                    acquisitionPrice: Number(newHouse.acquired_price)
                },
                expectationSellingPrice: price,
                sellingDatetime: format(date, "yyy-MM-dd").toString() + ' 00:00:00.000',
            },
        })
            .then((res) => {
                setGainTax(res);
            })
    }

    const [gainTax, setGainTax] = useState<any>();
    const [date, setDate] = useState(new Date())

    const onInput = (e: any) => {
        setPrice(e.target.value);
    }

    const [price, setPrice] = useState(0);

    const formatPriceRound = (price: number) => {
        if (price > 10000)
            return (formatPrice(Number((price / 10000).toFixed(0)) * 10000))
        else
            return (formatPrice(price))
    }

    useEffect(() => {
        setPrice(sellingPrice);
    }, [sellingPrice])

    const deleteProperty = useDeletePropertyUniversesIdPropertiesPkDelete();
    const onDeleteProperty = async () => {
        await deleteProperty.mutateAsync({
            body: {
                sessionId: session_id,
            },
            pathParams: {
                id: default_universe_id!,
                pk: Info.pk,
            },
        });
    };

    const getTax = () => {
        if (newHouse)
            onGetTempTax();
        else onGetGainTax();
        setSellingPrice(price);
    }

    return (
        <div>
            <div className="flex flex-col w-full mb-3 border-2 py-10 px-20 border-gray-100 rounded-2xl">
                <div className="text-[20px] text-blue-900 font-semibold mb-5">
                    최종 보고서
                </div>
                <div className="flex flex-col text-[18px]  text-blue-900 font-semibold py-2 gap-2 ">
                    <div className="px-40">
                        <div className="flex flex-col gap-5">
                            <div className="flex gap-5">
                                <p>양도 일자</p>
                                <DatePicker
                                    wrapperClassName="relative flex-1 text-left "
                                    className="border-2 border-gray-100"
                                    locale={ko}
                                    selected={date}
                                    onChange={(date: Date) => setDate(date)}
                                    dateFormat="yyyy년 M월 d일"
                                    popperPlacement="top"
                                    dateFormatCalendar=" "
                                    showMonthDropdown
                                    showYearDropdown
                                />
                            </div>
                            <div className="flex gap-5 items-start">
                                <p>양도 금액</p>
                                <div className="flex flex-col gap-1 text-left">
                                    <input className="border-2 border-gray-100" onChange={onInput} value={price} />
                                    <p className="text-[14px] text-gray-400 font-normal">{formatPrice(price)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="text-right pr-10">
                                <button onClick={() => setGainTax(null)} className="border-2 border-blue-100 rounded-2xl py-2 px-5">취소</button>
                            </div>
                            <div className="text-right pr-10">
                                <button onClick={() => getTax()} className="bg-blue-50 rounded-2xl py-2 px-5">조회하기</button>
                            </div>
                        </div>
                    </div>
                    {gainTax &&
                        <div>
                            <div className="border-t-1 pt-10 flex gap-10 mt-10 px-40 items-center">
                                <div className="justify-self-end flex flex-col items-center gap-3 bg-blue-900 rounded-2xl p-3 text-[18px] text-white font-semibold">
                                    <div className="text-[20px]">
                                        {Info.complex} {Info.dong} {Info.ho}
                                    </div>
                                    <div className="bg-white rounded-2xl p-5 flex flex-col gap-5 text-black">
                                        <div className="flex gap-2 ">
                                            <p>총 양도세: </p>
                                            <p className="text-blue-700">{formatPriceRound(gainTax?.tax_for_price_expectation[0][2].imposition_amount)}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <p>세금 납부 후 총 금액: </p>
                                            <p className="text-blue-700">{formatPriceRound(sellingPrice - gainTax?.tax_for_price_expectation[0][2].imposition_amount)}</p>
                                        </div>
                                        <div className="text-[14px] font-normal">
                                            *보유 몇년, 거주몇년으로 장기보유특별공제 얼마{ }
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 text-[18px] text-black font-normal">
                                    <div className="flex gap-3">
                                        <p>►</p><p> 취득 날짜 </p>
                                        <p>{format(new Date(Info.acquisitionDateTime), "yyyy년 M월 d일")}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <p>►</p><p>취득 금액</p>
                                        <p>{formatPriceRound(acPrice)}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <p>►</p><p> 양도 금액</p>
                                        <p>{formatPriceRound(sellingPrice)}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <p>►</p><p> 양도 차익</p>
                                        <p>{formatPriceRound(sellingPrice - acPrice)}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <p>►</p><p>총 양도세</p>
                                        <p>{formatPriceRound(gainTax?.tax_for_price_expectation[0][2].imposition_amount)}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <p>►</p><p>내 양도세</p>
                                        <p>{formatPriceRound(gainTax?.tax_for_price_expectation[0][2].imposition_amount * Number(Info.share))}</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                    }
                </div>

            </div >
            <div className="mt-10 text-center">
                <Link
                    href="/dashboard/" >
                    <a>
                        <button className="cursor-pointer font-semibold text-blue-900 bg-blue-50 rounded-xl p-3 w-fit self-center" >
                            대시보드로 돌아가기
                        </button>
                    </a>
                </Link>
            </div>
        </div >
    )
}

export default TaxReport