import React, { useEffect, useState } from 'react'
import { useInferFutureKrCapitalGainsTaxDefaultMvpKrCapitalGainsTaxHouseInferFutureDefaultPost } from '@/src/api/yuppieComponents';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import GainTaxChart from './gainTaxChart';
import GainTaxTable from './gainTaxTable';
import TaxReport from './taxReport';
import Link from 'next/link';



export const DefaultHouseTax = ({ Info, sellingPrice, setSellingPrice, }: { Info: any; sellingPrice: number; setSellingPrice: React.Dispatch<React.SetStateAction<number>>; }) => {

    const { default_universe_id, session_id } = useRecoilValue(tokenState);

    const [gainTax, setGainTax] = useState<any>();

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
                expectationSellingPrice: sellingPrice,
            },
        })
            .then((res) => {
                setGainTax(res);
            })
    }

    useEffect(() => {
        onGetGainTax();
    }, [sellingPrice]);

    if (!gainTax) return (<div></div>)

    if (sellingPrice < Number(Info.acquisitionPrice)) return (
        <div><div className="flex flex-col w-full mb-3">
            <div className='border-2 border-gray-100 rounded-2xl text-center text-[16px] text-blue-900 font-semibold p-5 py-20 mb-3'>
                <div className=" flex items-center justify-center gap-2 text-[18px] text-center">
                    예상 양도 금액이 취득 금액 이하임으로 양도세가 부과되지 않습니다
                </div>
            </div>
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
        </div>
        </div>
    )

    return (
        <div>
            <div className="flex flex-col w-full mb-3">
                <div className='border-2 border-gray-100 rounded-2xl text-center text-[16px] text-blue-900 font-semibold p-5 mb-3'>
                    &quot; {gainTax.summary} &quot;
                </div>
                <div className="flex w-full gap-3 h-96">
                    <div className='w-1/2 p-2 border-2 border-gray-100 rounded-2xl'>
                        <GainTaxChart gainTax={gainTax} />
                    </div><div className='p-6 w-1/2 border-2 border-gray-100 rounded-2xl overflow-auto'>
                        <GainTaxTable gainTax={gainTax} Info={Info} />
                    </div>
                </div>
            </div >
            <p className='text-gray-400 text-sm mb-5'>*  위 그래프는 상담을 위한 참고자료입니다. 실제 세금신고와 법률적 의사결정을 위해서는 반드시 세무전문가의 확인이 필요합니다.</p>
            <TaxReport Info={Info} sellingPrice={sellingPrice} setSellingPrice={setSellingPrice} acPrice={Number(Info.acquisitionPrice)} newHouse={null} />
        </div>
    )
}

export default DefaultHouseTax