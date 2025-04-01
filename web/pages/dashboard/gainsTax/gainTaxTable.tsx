import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import Description from './description';

export const GainTaxTable = ({ gainTax, Info }: { gainTax: any; Info: any }) => {

    const length = gainTax.tax_for_price_expectation.length

    const tax = new Array(length);
    for (var i = 0; i < length; i++)
        if (gainTax.tax_for_price_expectation[i][1] > 10000)
            tax[i] = formatPrice(Math.round(gainTax.tax_for_price_expectation[i][1] / 10000) * 10000)
        else
            tax[i] = formatPrice(gainTax.tax_for_price_expectation[i][1])

    const year = new Array(length);
    for (var i = 0; i < length; i++)
        year[i] = gainTax.tax_for_price_default[i][0][1].split("T")[0]

    const desc = new Array(length);
    for (var i = 0; i < length; i++)
        desc[i] = gainTax.tax_for_price_default[i][0][0]

    const arr = new Array(length);
    for (var i = 0; i < length; i++) {
        arr[i] = new Array(3);
        arr[i][0] = year[i];
        arr[i][1] = tax[i];
        arr[i][2] = desc[i];
    }

    const [isOpen, setIsOpen] = useState(false);
    const [taxIndex, setTaxIndex] = useState(0);
    const [date, setDate] = useState("");

    const clicked = (index: number, item: any) => {
        setIsOpen(true)
        setTaxIndex(index)
        setDate(item)
    }

    return (
        <div>
            <div className="relative mt-2">
                <table className="w-full text-md text-left text-gray-800 ">
                    <thead className="text-center text-gray-700 bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 w-1/3">양도 날짜</th>
                            <th className="px-6 py-3 w-1/3">양도 소득세</th>
                            <th className="px-6 py-3 w-1/3">비고</th>
                        </tr>
                    </thead>
                    <tbody className="text-center text-sm">
                        {arr.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className="border-b py-2 dark:border-gray-700">{item[0].split('-')[0]}년 {item[0].split('-')[1]}월 {item[0].split('-')[2]}일</td>
                                    <td className="border-b py-2 dark:border-gray-700 underline cursor-pointer" onClick={() => clicked(index, item[0])}>{item[1]}</td>
                                    <td className="border-b py-2 dark:border-gray-700">{item[2]}</td>
                                </tr>)
                        })}
                    </tbody>
                </table>
            </div>
            <Description isOpen={isOpen} setIsOpen={setIsOpen} gainPrice={gainTax.selling_prices.expectation} gainTax={gainTax.tax_for_price_expectation[taxIndex][2]} Info={Info} date={date} />
        </div>
    )
}

export default GainTaxTable