import { formatPrice } from '@/lib/utils';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Dispatch, Fragment, SetStateAction } from 'react';

const DetailDescription = ({
  isOpen,
  setIsOpen,
  modalType,
  gainPrice,
  gainTax,
  Info,
  date,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  modalType: string;
  gainPrice: number;
  gainTax: any;
  Info: any;
  date: string;
}) => {
  const rateData = [
    {
      과세표준: '1400만원 이하',
      세율: '6%',
      누진공제: '-',
    },
    {
      과세표준: '5000만원 이하',
      세율: '15%',
      누진공제: '126만원',
    },
    {
      과세표준: '8800만원 이하',
      세율: '24%',
      누진공제: '576만원',
    },
    {
      과세표준: '1.5억원 이하',
      세율: '35%',
      누진공제: '1544만원',
    },
    {
      과세표준: '3억원 이하',
      세율: '38%',
      누진공제: '1994만원',
    },
    {
      과세표준: '5억원 이하',
      세율: '40%',
      누진공제: '2594만원',
    },
    {
      과세표준: '10억원 이하',
      세율: '42%',
      누진공제: '3594만원',
    },
    {
      과세표준: '10억원 초과',
      세율: '45%',
      누진공제: '6594만원',
    },
  ];

  const liveData = [
    {
      보유기간: '2년이상 3년미만',
      보유기간공제율: '-',
      거주기간공제율: '8%',
    },
    {
      보유기간: '3년이상 4년미만',
      보유기간공제율: '12%',
      거주기간공제율: '12%',
    },
    {
      보유기간: '4년이상 5년미만',
      보유기간공제율: '16%',
      거주기간공제율: '16%',
    },
    {
      보유기간: '5년이상 6년미만',
      보유기간공제율: '20%',
      거주기간공제율: '20%',
    },
    {
      보유기간: '6년이상 7년미만',
      보유기간공제율: '24%',
      거주기간공제율: '24%',
    },
    {
      보유기간: '7년이상 8년미만',
      보유기간공제율: '28%',
      거주기간공제율: '28%',
    },
    {
      보유기간: '8년이상 9년미만',
      보유기간공제율: '32%',
      거주기간공제율: '32%',
    },
    {
      보유기간: '9년이상 10년미만',
      보유기간공제율: '36%',
      거주기간공제율: '36%',
    },
    {
      보유기간: '10년이상',
      보유기간공제율: '40%',
      거주기간공제율: '40%',
    },
  ];

    const newDate = new Array(3)
    for (var i = 0; i < 3; i++)
        newDate[i] = date.split("-")[i]

    const formatPriceRound = (price: number) => {
        if (price > 10000)
            return (formatPrice(Number((price / 10000).toFixed(0)) * 10000))
        else
            return (formatPrice(price))
    }

    return (
        <div className="ml-10">

            {modalType == 'diff' &&
                <div className="flex flex-col w-96">
                    <div className="text-[20px] font-medium text-gray-800 mb-4 flex justify-between	items-center p-2 border-2 border-blue-400 bg-blue-200 rounded-2xl">
                        양도차익 계산 방법
                        <div
                            className="text-right font-medium text-xl text-gray-400 cursor-pointer p-2"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            <p className="font-semibold text-lg">{Info.complex} {Info.dong} {Info.ho}의</p>
                            <p>+양도가액: {formatPriceRound(gainPrice)}</p>
                            <p>-취득가액: {formatPriceRound(Number(Info.acquisitionPrice))}</p>
                            <p>-필요경비: {formatPriceRound(gainTax.other_cost)}</p>
                            {gainTax.capital_gains_for_tax != gainTax.gain_on_transfer && <p>-1주택자 비과세 공제: {formatPriceRound(gainTax.gain_on_transfer - gainTax.capital_gains_for_tax)}</p>}
                            <p>=양도차익: {formatPriceRound(gainTax.capital_gains_for_tax)}</p>
                        </div>
                        <div className="text-sm">
                            필요경비는 매수매도 중개수수료, 취등록세 및 등기비용, 인테리어(자본적지출), 명도비용 및 양도세 신고수수료를 대략적으로 산출하였으며 변경될 수 있습니다.
                        </div>
                    </div>
                </div>
            }

            {modalType == 'long' && Number((gainTax.special_deduction_rate_for_longterm_hold * 100).toFixed(0)) > (gainTax.owning_years * 2) &&
                <div className="flex flex-col w-96">
                    <div className="text-[20px] font-medium text-gray-800 mb-4 flex justify-between	items-center p-2 border-2 border-purple-400 bg-purple-200 rounded-2xl">
                        장기보유특별공제율
                        <div
                            className="text-right font-medium text-xl text-gray-400 cursor-pointer p-2"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold text-lg">
                            {Info.complex} {Info.dong} {Info.ho}
                        </div>
                        <div>
                            귀하는 {Info.numOfHousesSellerHas < 3 ? Info.numOfHousesSellerHas + '주택자' : '3주택자 이상'}에 해당되며 {newDate[0]}년 {newDate[1]}월 {newDate[2]}일 이후 양도 시 보유기간은 {gainTax.owning_years}년 거주기간은 {gainTax.living_years}년 입니다.
                            {gainTax.owning_years >= 3 &&
                                <div> {(gainTax.special_deduction_rate_for_longterm_hold * 100).toFixed(0)}% 의 장기보유특별공제율이 적용됩니다
                                    ({formatPriceRound(Number((gainTax.capital_gains_for_tax * gainTax.special_deduction_rate_for_longterm_hold).toFixed(0)))})</div>}
                        </div>
                    </div>
                    <table>
                        <thead className="text-md text-center text-gray-700 bg-gray-50">
                            <tr >
                                <th className="px-6 py-1 w-1/3">보유기간</th>
                                <th className="px-6 py-1 w-1/3">보유기간공제율</th>
                                <th className="px-6 py-1 w-1/3">거주기간공제율</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {liveData.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="border-b py-1 dark:border-gray-700">{item.보유기간}</td>
                                        <td className="border-b py-1 dark:border-gray-700" >{item.보유기간공제율}</td>
                                        <td className="border-b py-1 dark:border-gray-700">{item.거주기간공제율}</td>
                                    </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
            }

            {modalType == 'long' && (Number((gainTax.special_deduction_rate_for_longterm_hold * 100).toFixed(0)) <= gainTax.owning_years * 2) &&
                <div className="flex flex-col w-96">
                    <div className="text-[20px] font-medium text-gray-800 mb-4 flex justify-between	items-center p-2 border-2 border-purple-400 bg-purple-200 rounded-2xl">
                        장기보유특별공제율
                        <div
                            className="text-right font-medium text-xl text-gray-400 cursor-pointer p-2"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="font-semibold text-lg">
                            {Info.complex} {Info.dong} {Info.ho}
                        </div>
                        <div>
                            귀하는 {Info.numOfHousesSellerHas < 3 ? Info.numOfHousesSellerHas + '주택자' : '3주택자 이상'}에 해당되며 {newDate[0]}년 {newDate[1]}월 {newDate[2]}일 이후 양도 시 보유기간은 {gainTax.owning_years}년 거주기간은 {gainTax.living_years}년 입니다.
                            {gainTax.owning_years >= 3 && gainTax.special_deduction_rate_for_longterm_hold != 0 &&
                                <div> 2 x {gainTax.owning_years} = {(gainTax.special_deduction_rate_for_longterm_hold * 100).toFixed(0)}% 의 장기보유특별공제율이 적용됩니다
                                    ({formatPriceRound(Number(((gainTax.capital_gains_for_tax) * gainTax.special_deduction_rate_for_longterm_hold).toFixed(0)))})</div>}
                            {(gainTax.owning_years < 3 || gainTax.special_deduction_rate_for_longterm_hold == 0) &&
                                <div> {(gainTax.special_deduction_rate_for_longterm_hold * 100)}% 의 장기보유특별공제율이 적용됩니다</div>}
                        </div>
                    </div>
                </div>
            }

            {modalType == 'rate' &&
                <div className="flex flex-col w-96">
                    <div className="text-[20px] font-medium text-gray-800 mb-4 flex justify-between	items-center p-2 border-2 border-green-600 bg-green-200 rounded-2xl">
                        양도세율 계산 방법
                        <div
                            className="text-right font-medium text-xl text-gray-400 cursor-pointer p-2"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div>
                            과세표준액 {formatPriceRound(gainTax.tax_base)}
                            으로 {gainTax.tax_rate * 100}%의 세율, 누진공제액 {formatPriceRound(gainTax.progressive_deduction)}이 적용됩니다.
                        </div>
                        <table>
                            <thead className="text-md text-center text-gray-700 bg-gray-50">
                                <tr >
                                    <th className="px-6 py-1 w-1/3">과세표준</th>
                                    <th className="px-6 py-1 w-1/3">세율</th>
                                    <th className="px-6 py-1 w-1/3">누진공제</th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {rateData.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="border-b py-1 dark:border-gray-700">{item.과세표준}</td>
                                            <td className="border-b py-1 dark:border-gray-700" >{item.세율}</td>
                                            <td className="border-b py-1 dark:border-gray-700">{item.누진공제}</td>
                                        </tr>)
                                })}
                            </tbody>
                        </table>
                        <Link href="https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2312&cntntsId=7711">
                            <a className="text-sm text-blue-600 underline">양도소득세 세율 변동 연혁표 보기</a>
                        </Link>
                    </div>
                </div>
            }

        </div>
    );
};
export default DetailDescription
