import { formatPrice } from '@/lib/utils';
import { useState } from 'react';
import Description from './description';

export const OneGainTaxTable = ({ gainTax, Info }: { gainTax: any; Info: any }) => {

    const length = gainTax.tax_not_to_live.length

    const tax = new Array(length);
    for (var i = 0; i < length; i++)
        if (gainTax.tax_not_to_live[i][1] > 10000)
            tax[i] = formatPrice(Math.round(gainTax.tax_not_to_live[i][1] / 10000) * 10000)
        else
            tax[i] = formatPrice(gainTax.tax_not_to_live[i][1])

    const year = new Array(length);
    for (var i = 0; i < length; i++)
        year[i] = gainTax.tax_not_to_live[i][0][1].split("T")[0]

    const desc = new Array(length);
    for (var i = 0; i < length; i++)
        desc[i] = gainTax.tax_not_to_live[i][0][0]

    const live = new Array(length);
    for (var i = 0; i < length; i++)
        if (gainTax.tax_to_live[i][1] > 10000)
            live[i] = formatPrice(Math.round(gainTax.tax_to_live[i][1] / 10000) * 10000)
        else
            live[i] = formatPrice(gainTax.tax_to_live[i][1])

    const win = new Array(length);
    if (gainTax.tax_not_to_live.length == gainTax.tax_win_win_partnership.length) {
        for (var i = 0; i < length; i++)
            if (gainTax.tax_to_live[i][1] > 10000)
                live[i] = formatPrice(Math.round(gainTax.tax_win_win_partnership[i][1] / 10000) * 10000)
            else
                live[i] = formatPrice(gainTax.tax_win_win_partnership[i][1])
    }

    const arr = new Array(length);
    for (var i = 0; i < length; i++) {
        if (gainTax.tax_not_to_live.length == gainTax.tax_win_win_partnership.length) {
            arr[i] = new Array(5);
            arr[i][0] = year[i];
            arr[i][1] = tax[i];
            arr[i][2] = desc[i];
            arr[i][3] = live[i];
            arr[i][4] = win[i];
        }
        else {
            arr[i] = new Array(4);
            arr[i][0] = year[i];
            arr[i][1] = tax[i];
            arr[i][2] = desc[i];
            arr[i][3] = live[i];
        }
    }

    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState("");
    const [data, setData] = useState<any>();

    const clickNotLive = (index: number, item: any) => {
        setIsOpen(true)
        setDate(item)
        setData(gainTax.tax_not_to_live[index][2])
    }

    const clickLive = (index: number, item: any) => {
        setIsOpen(true)
        setDate(item)
        setData(gainTax.tax_to_live[index][2])
    }

    const clickWin = (index: number, item: any) => {
        setIsOpen(true)
        setDate(item)
        setData(gainTax.tax_win_win_partnership[index][2])
    }

    return (
        <div>
            <div className="relative  mt-2">
                <table className="w-full text-md text-left text-gray-800 ">
                    <thead className="text-center bg-gray-50">
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
                                    <td className="border-b py-2 dark:border-gray-700 underline cursor-pointer" >
                                        <div className='flex flex-col gap-1'>
                                            <div onClick={() => clickNotLive(index, item[0])}>{item[1]}</div>
                                            <div className='text-gray-400' onClick={() => clickLive(index, item[0])}>입주시 : {item[3]}</div>
                                            {gainTax.tax_not_to_live.length == gainTax.tax_win_win_partnership.length &&
                                                <div className='text-gray-400' onClick={() => clickWin(index, item[0])}>상생임대인 : {item[4]}</div>}
                                        </div>
                                    </td>
                                    <td className="border-b py-2 dark:border-gray-700">{item[2]}</td>
                                </tr>)
                        })}
                    </tbody>
                </table>
            </div>
            <Description isOpen={isOpen} setIsOpen={setIsOpen} gainPrice={gainTax.selling_price} gainTax={data} Info={Info} date={date} />
        </div>
    )
}

export default OneGainTaxTable