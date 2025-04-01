import React, { Fragment, useEffect, useState } from 'react'

import { useToLiveOrNotToLiveMvpKrCapitalGainsTaxHouseToLiveOrNotToLivePost } from '@/src/api/yuppieComponents';

import { format } from 'date-fns';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import TaxReport from './taxReport';
import OneGainTaxChart from './oneGainTaxChart';
import OneGainTaxTable from './oneGainTaxTable';
import { Listbox, Transition } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import Link from 'next/link';


export const OneHouseTax = ({ Info, sellingPrice, setSellingPrice, chartType, taxExempted, longterm }: { Info: any; sellingPrice: number; setSellingPrice: React.Dispatch<React.SetStateAction<number>>; chartType: any, taxExempted: any; longterm: any; }) => {

    const { default_universe_id, session_id } = useRecoilValue(tokenState);

    const getGainTax = useToLiveOrNotToLiveMvpKrCapitalGainsTaxHouseToLiveOrNotToLivePost();
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
                capitalGainsTaxChartType: chartType,
                amI_1householderTaxExempted: taxExempted,
                amI_specialDeductionForLongtermHolder: longterm,
                sellingPrice: sellingPrice,
                estimatedMovedInDatetime: movingInDate.date + ' 00:00:00.000'
            },
        })
            .then((res) => {
                setGainTax(res);
            })
    }

    const today = new Date()
    const [specificDate, setSpecificDate] = useState(new Date())

    const dateOption = [
        {
            id: 1,
            date: format(today, "yyy-MM-dd").toString(),
            name: '오늘'
        },
        {
            id: 2,
            date: format(today.setFullYear(today.getFullYear() + 1), "yyy-MM-dd").toString(),
            name: '1년 뒤'
        },
        {
            id: 3,
            date: format(today.setFullYear(today.getFullYear() + 1), "yyy-MM-dd").toString(),
            name: '2년 뒤'
        },
        {
            id: 4,
            date: format(specificDate, "yyy-MM-dd").toString(),
            name: '상세 일자 선택'
        }
    ]

    const [gainTax, setGainTax] = useState<any>();
    const [movingInDate, setMovingInDate] = useState(dateOption[0]);

    useEffect(() => {
        onGetGainTax();
    }, [sellingPrice, movingInDate]);

    useEffect(() => {
        if (movingInDate.name == dateOption[3].name)
            setMovingInDate(dateOption[3]);
    }, [specificDate]);

    console.log(gainTax)

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

    else if (gainTax.tax_not_to_live[0][1] == 0) return (
        <div><div className="flex flex-col w-full mb-3">
            <div className='border-2 border-gray-100 rounded-2xl text-center text-[16px] text-blue-900 font-semibold p-5 py-20 mb-3'>
                <div className=" flex items-center justify-center gap-2 text-[18px] text-center">
                    {gainTax.tax_not_to_live[0][0][0]}으로 양도세가 부과되지 않습니다
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
                    <div className=" flex items-center justify-center		gap-2 text-[18px] text-center">
                        실 입주하면 얼마나 양도세를 아낄수 있을까?
                    </div>
                    &quot; {gainTax.summary} &quot;
                </div>
                <div className='border-2 border-gray-100 rounded-2xl text-center  mb-3 text-[18px] text-blue-900 font-semibold'>
                    <Listbox value={movingInDate} onChange={setMovingInDate}>
                        <div className='flex items-center justify-center m-1 gap-2'>
                            <Listbox.Button>{movingInDate.name} </Listbox.Button>▾
                            {movingInDate.name == dateOption[3].name &&
                                <DatePicker
                                    wrapperClassName="relative "
                                    className="border-2 border-gray-100 text-center"
                                    locale={ko}
                                    selected={specificDate}
                                    onChange={(date: Date) => setSpecificDate(date)}
                                    dateFormat="yyyy년 M월 d일"
                                    popperPlacement="top"
                                    dateFormatCalendar=" "
                                    showMonthDropdown
                                    showYearDropdown
                                />
                            } 입주 시
                        </div>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="relative mt-1 max-h-60 w-1/10 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {dateOption.map((date) => (
                                    <Listbox.Option
                                        key={date.id}
                                        className={({ active }) => `relative cursor-default select-none p-2 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'}`
                                        }
                                        value={date}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                    {date.name}
                                                </span>
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </Listbox>
                </div>
                <div className="flex w-full gap-3 h-96">
                    <div className='w-1/2 p-2 border-2 border-gray-100 rounded-2xl'>
                        <OneGainTaxChart gainTax={gainTax} movingInDate={movingInDate} setMovingInDate={setMovingInDate} dateOption={dateOption} />
                    </div>
                    <div className='p-6 w-1/2 border-2 border-gray-100 rounded-2xl overflow-auto'>
                        <div>
                        </div>
                        <OneGainTaxTable gainTax={gainTax} Info={Info} />
                    </div>
                </div>
            </div >
            <p className='text-gray-400 text-sm mb-5'>*  위 그래프는 상담을 위한 참고자료입니다. 실제 세금신고와 법률적 의사결정을 위해서는 반드시 세무전문가의 확인이 필요합니다.</p>
            <TaxReport Info={Info} sellingPrice={sellingPrice} setSellingPrice={setSellingPrice} acPrice={Number(Info.acquisitionPrice)} newHouse={null} />
        </div>
    )
}

export default OneHouseTax