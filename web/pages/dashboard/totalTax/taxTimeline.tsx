import 'react-datepicker/dist/react-datepicker.css';
import AddTaxTimeline from "./addTaxTimeline";
import { useState } from 'react';
import { useGetPropertyUniversesNonePropertyPkGet } from '@/src/api/yuppieComponents';

const TaxTimeline = ({ properties }: { properties: any }) => {

    const [isOpen, setIsOpen] = useState(false)


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
                sellingDate: '2025-11-20',
                sellingPrice: 1212321000
            }
        },
        {
            propertyPk: properties[2].property.pk,
            type: 'transfer_tax',
            data: {
                sellingDate: '2027-11-21',
                sellingPrice: 1812321000
            }
        }
    ]

    //console.log(senario)


    const propertyInfo = (pk: string) => {
        const { data: property } = (useGetPropertyUniversesNonePropertyPkGet({
            pathParams: {
                pk: pk!,
            },
        }))
        return (
            <div className='text-sm'>
                {property?.complex.complex_name} {property?.dong} {property?.ho}
            </div>
        )
    }


    return (
        <div className="bg-gray-200 p-5 h-full">
            <div className='font-bold'>시나리오 타임라인</div>
            <section className='flex flex-col gap-5 my-5'>
                {senarios.map((item) => {
                    return (
                        <div>
                            {item.type == 'property_tax' &&
                                <div className='bg-white p-2'>
                                    <div>{item.data.acquisitionDate}</div>
                                    <div>{propertyInfo(item.propertyPk)}</div>
                                    보유세 발생
                                </div>
                            }
                            {item.type == 'transfer_tax' &&
                                <div className='bg-white p-2'>
                                    <div>{item.data.sellingDate}</div>
                                    <div>{propertyInfo(item.propertyPk)}</div>
                                    양도세 발생
                                </div>
                            }
                            {item.type == 'rental_income' &&
                                <div className='bg-white p-2'>
                                    <div>{item.data.startDate}~{item.data.endDate}</div>
                                    <div>{propertyInfo(item.propertyPk)}</div>
                                    임대수익 발생
                                </div>
                            }
                        </div>
                    )
                })}
            </section>
            <div className="bg-white p-2 self-end text-center" onClick={() => setIsOpen(true)}>+ 새로운 시나리오 추가하기</div>

            <AddTaxTimeline properties={properties} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
};

export default TaxTimeline