import React, { Fragment } from 'react'

import { formatPrice } from '@/lib/utils';
import PropertyImage from '@/components/propertyImage';
import PropertyBadge from '@/components/propertyBadge';
import { useEffect, useState } from 'react';
import { TaxCalculation } from './taxCalculation';
import GainSelect from './gainSelect';
import { Dialog, Transition } from '@headlessui/react';
import Pencil from '@/public/pencil.svg';


const GainsQuery = (property: any) => {

    const [isOpen, setIsOpen] = useState(false);
    const [sellingPrice, setSellingPrice] = useState(0);
    const [tempPrice, setTempPrice] = useState(0);
    const [isPriceOpen, setIsPriceOpen] = useState(false)

    useEffect(() => {
        setSellingPrice(Number(property.property.expectationSellingPrice))
    }, [property]);

    return (
        <div className="w-full h-full py-10 overflow-hidden" >
            <div className='w-full' >
                <section className="flex">
                    <PropertyImage propertyType="apartment" className="w-8" />
                    <div className="font-semibold text-2xl ml-3">
                        양도세 계산
                    </div>
                </section>
                <section>
                    <div className="flex flex-col gap-7 py-5">
                        <section className="flex gap-4 items-end justify-between">
                            <div className="px-6 w-1/3 rounded-3xl py-4 text-2xl text-center font-bold text-blue-800 bg-[#FAFAFA] shadow-sm ">
                                {property.property.complex} {property.property.dong} {property.property.ho}
                            </div>
                            <button className="py-2 px-5 bg-blue-50 rounded-2xl text-[16px] font-medium text-blue-900" onClick={() => setIsOpen(true)}>
                                다시 조회 하기
                            </button>
                        </section>
                        <div className="flex w-full gap-4">
                            <section className="flex flex-col w-1/4 gap-2 border-2 border-gray-100 rounded-2xl p-6 justify-center items-center font-medium text-gray-800">
                                <p className="font-bold text-xl text-blue-900"> 공시지가 </p>
                                <p className="text-2xl">
                                    {formatPrice(Math.round(property.property.officialPrice / 10000) * 10000)}{' '}
                                </p>
                            </section>
                            <section className="flex flex-col w-1/4 gap-2 border-2 border-gray-100 rounded-2xl p-6 justify-center items-center font-medium text-gray-800">
                                <p className="font-bold text-xl text-blue-900"> 취득금액 </p>
                                <p className="text-2xl">
                                    {formatPrice(Math.round(property.property.acquisitionPrice / 10000) * 10000)}{' '}
                                </p>
                            </section>
                            <section className="flex flex-col w-1/2 gap-2 border-2 border-blue-600/40 rounded-2xl p-6 justify-center items-center font-medium text-gray-800">
                                <div className="flex gap-3 font-bold text-xl text-blue-900 items-center">
                                    예상 양도 금액
                                    <button
                                        className="appearance-none h-fit bg-gray-50 px-3 py-1 rounded-full flex flex-col items-center text-sm"
                                        onClick={() => setIsPriceOpen(true)}
                                    >
                                        <Pencil className="w-5 " />
                                    </button>
                                </div>
                                <p className="text-2xl">
                                    {formatPrice(Math.round(sellingPrice / 10000) * 10000)}
                                </p>
                            </section>
                        </div>
                        <Transition appear show={isPriceOpen} as={Fragment} beforeEnter={() => setTempPrice(sellingPrice)}
                        >
                            <Dialog as="div" className="relative z-10" onClose={() => setIsPriceOpen(false)}>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                                </Transition.Child>
                                <div className="fixed inset-0 overflow-y-auto">
                                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                                                    양도 금액 변경
                                                </Dialog.Title>
                                                <div className="border-b border-gray-900 py-4">
                                                    <label className="flex items-center justify-between">
                                                        <div className="text-primary font-bold w-24">예상 양도 금액:</div>
                                                        <input type="number" className="appearance-none w-40 text-right" value={tempPrice} onChange={(e) => setTempPrice(Number(e.currentTarget.value))} />
                                                    </label>
                                                    <div>
                                                        <p className='text-right text-gray-400'>{formatPrice(tempPrice)}</p>
                                                    </div>
                                                </div>
                                                <button className="mt-4 px-2 py-1 bg-primary text-white text-sm" onClick={() => {
                                                    setSellingPrice(tempPrice)
                                                    setIsPriceOpen(false);
                                                }}>수정</button>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div >
                            </Dialog >
                        </Transition >
                        <GainSelect
                            isOpen={isOpen}
                            setIsOpen={setIsOpen} />
                    </div>
                </section>
            </div>
            <TaxCalculation Info={property.property} sellingPrice={sellingPrice} setSellingPrice={setSellingPrice} />
        </div>
    )
}

export default GainsQuery