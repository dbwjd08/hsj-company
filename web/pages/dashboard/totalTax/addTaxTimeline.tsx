import { Dialog, Listbox, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ko from 'date-fns/locale/ko';
import { formatPrice } from "@/lib/utils";
import { useGetDepositRatesFinanceDepositRatesGeneralGet, useGetDepositRatesFinanceDepositRatesSavingGet } from "@/src/api/yuppieComponents";

const AddTaxTimeline = ({ properties, isOpen, setIsOpen }: { properties: any; isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>> }) => {

    const [property, setProperty] = useState(properties[0])
    const [eventType, setEventType] = useState("sell")

    const [sellingDate, setSellingDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [sellingPrice, setSellingPrice] = useState(0)
    const [depositPrice, setDepositPrice] = useState(0)
    const [monthlyPrice, setMonthlyPrice] = useState(0)

    const resetValue = () => {
        setEventType('sell')
        setSellingDate(new Date())
        setEndDate(new Date())
        setSellingPrice(0)
        setDepositPrice(0)
        setMonthlyPrice(0)
        setBank(bankname[0])
        setIncreaseType(rentType[0])
        setEveryNumYear(0)
        setIncreasePrice(0)
    }

    const { data: deposit_general }: any =
        useGetDepositRatesFinanceDepositRatesGeneralGet({});

    const { data: deposit_saving }: any =
        useGetDepositRatesFinanceDepositRatesSavingGet({});

    const deposit_bank = deposit_general?.concat(deposit_saving)

    const bankname = new Array();
    for (var i = 0; i < deposit_general?.length; i++)
        if (bankname[bankname.length - 1] != deposit_general[i].bank_name)
            bankname.push(deposit_general[i].bank_name)
    for (var i = 0; i < deposit_saving?.length; i++)
        if (bankname[bankname.length - 1] != deposit_saving[i].bank_name)
            bankname.push(deposit_saving[i].bank_name)

    const [bank, setBank] = useState('')

    useEffect(() => {
        if (!bank)
            setBank(bankname[0])
    }, [bankname])

    const [deposit, setDeposit] = useState([])

    function findBank(element: any) {
        if (element.bank_name === bank) {
            return true;
        }
    }

    useEffect(() => {
        if (bank)
            setDeposit(deposit_bank.find(findBank))
    }, [bank])

    const [depositRate, setDepositRate] = useState(0)

    useEffect(() => {
        if (deposit)
            setDepositRate(deposit.interest_rate_12)
    }, [deposit])

    const [everyNumYear, setEveryNumYear] = useState(0)
    const [increasePrice, setIncreasePrice] = useState(0)

    const rentType = [
        {
            type: 'yearly',
            name: '보증금'
        },
        {
            type: 'monthly',
            name: '월세'
        }
    ]
    const [increseType, setIncreaseType] = useState(rentType[0])

    return (
        <div>
            <Transition
                appear
                show={isOpen}
                as={Fragment}
                afterLeave={resetValue}
            >
                <Dialog as="div"
                    className="relative z-10 font-system"
                    onClose={() => setIsOpen(false)}>
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
                                <Dialog.Panel className=" h-120 w-100 transform overflow-hidden rounded-2xl bg-white py-10 px-20 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                                    >
                                        <div className="py-4 text-primary font-bold text-[24px]">
                                            이벤트 추가하기
                                        </div>
                                    </Dialog.Title>
                                    <div className="pt-4">
                                        <div className="py-4 flex items-center gap-10">
                                            <div className="text-primary font-bold w-24">부동산 선택</div>
                                            <Listbox value={property} onChange={setProperty}>
                                                <div className="relative mt-1 z-100 w-40 text-primary">
                                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-1 px-3 text-left border-1 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                        <span className="block truncate">
                                                            {property.property.complex.complex_name} ▾
                                                        </span>
                                                    </Listbox.Button>
                                                    <Transition
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                                            {properties.map((item: any) => (
                                                                <Listbox.Option
                                                                    key={item.property.pk}
                                                                    className={({ active }) => `relative cursor-default select-none py-2 px-3 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}`}
                                                                    value={item}
                                                                >
                                                                    {({ selected }) => (
                                                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                            {item.property.complex.complex_name}
                                                                        </span>
                                                                    )}
                                                                </Listbox.Option>
                                                            ))}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </Listbox>

                                        </div>
                                        <div className="py-4">
                                            <label className="flex items-center gap-10">
                                                <div className="text-primary font-bold w-24">이벤트 내용</div>
                                                <div className={`text-primary ${eventType == 'sell' ? 'font-bold underline' : ''}`} onClick={() => setEventType("sell")}>양도세</div>
                                                <div className={`text-primary ${eventType == 'rent' ? 'font-bold underline' : ''}`} onClick={() => setEventType("rent")}>임대수익</div>
                                            </label>
                                        </div>
                                        {eventType == 'sell' && (
                                            <div>
                                                <div className="py-4">
                                                    <label className="flex items-center gap-10">
                                                        <div className="text-primary font-bold w-24">
                                                            양도 날짜
                                                        </div>
                                                        <div >
                                                            <DatePicker
                                                                wrapperClassName="relative flex-1 text-primary"
                                                                className="border-1 rounded-md px-3 text-right w-40"
                                                                locale={ko}
                                                                selected={sellingDate}
                                                                onChange={(date: Date) => setSellingDate(date)}
                                                                dateFormat="yyyy년 M월 d일"
                                                                popperPlacement="top"
                                                                dateFormatCalendar=" "
                                                                showMonthDropdown
                                                                showYearDropdown
                                                            />
                                                        </div>
                                                    </label>
                                                </div>
                                                <div className="py-4">
                                                    <label className="flex items-start gap-10">
                                                        <div className="text-primary font-bold w-24">
                                                            양도 금액
                                                        </div>
                                                        <div>
                                                            <input
                                                                type="number"
                                                                className="text-primary appearance-none w-40 text-right border-1 rounded-md px-3"
                                                                value={sellingPrice}
                                                                onChange={(e) =>
                                                                    setSellingPrice(Number(e.currentTarget.value))
                                                                }
                                                            />
                                                            <div>
                                                                <p className="text-right text-gray-400">
                                                                    {formatPrice(sellingPrice)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>)
                                        }
                                        {eventType == 'rent' && (
                                            <div>
                                                <div className="py-4">
                                                    <label className="flex items-center gap-10">
                                                        <div className="text-primary font-bold w-24">
                                                            임대 금액
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex justify-between gap-3">
                                                                <div className="text-primary text-left">보증금</div>
                                                                <input
                                                                    type="number"
                                                                    className="text-primary appearance-none w-32 text-right border-1 rounded-md px-3"
                                                                    value={depositPrice}
                                                                    onChange={(e) => setDepositPrice(Number(e.currentTarget.value))}
                                                                />
                                                            </div>
                                                            <p className="text-right text-gray-400">
                                                                {formatPrice(depositPrice)}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex justify-between gap-3">
                                                                <div className="text-primary text-left">월세</div>
                                                                <input
                                                                    type="number"
                                                                    className="text-primary appearance-none w-28 text-right border-1 rounded-md px-3"
                                                                    value={monthlyPrice}
                                                                    onChange={(e) => setMonthlyPrice(Number(e.currentTarget.value))}
                                                                />
                                                            </div>
                                                            <p className="text-right text-gray-400">
                                                                {formatPrice(monthlyPrice)}
                                                            </p>
                                                        </div>
                                                    </label>
                                                </div>
                                                <div className="py-4">
                                                    <label className="flex items-center gap-10">
                                                        <div className="text-primary font-bold w-24">
                                                            계약 기간
                                                        </div>
                                                        <div >
                                                            <DatePicker
                                                                wrapperClassName="relative flex-1 text-primary"
                                                                className="border-1 rounded-md px-3 text-right w-36"
                                                                locale={ko}
                                                                selected={sellingDate}
                                                                onChange={(date: Date) => setSellingDate(date)}
                                                                dateFormat="yyyy년 M월 d일"
                                                                popperPlacement="top"
                                                                dateFormatCalendar=" "
                                                                showMonthDropdown
                                                                showYearDropdown
                                                            />
                                                        </div>
                                                        ~
                                                        <div >
                                                            <DatePicker
                                                                wrapperClassName="relative flex-1 text-primary"
                                                                className="border-1 rounded-md px-3 text-right w-36"
                                                                locale={ko}
                                                                selected={endDate}
                                                                onChange={(date: Date) => setEndDate(date)}
                                                                dateFormat="yyyy년 M월 d일"
                                                                popperPlacement="top"
                                                                dateFormatCalendar=" "
                                                                showMonthDropdown
                                                                showYearDropdown
                                                            />
                                                        </div>
                                                    </label>
                                                </div>
                                                <div className="py-4">
                                                    <label className="flex items-center gap-10 mb-3">
                                                        <div className="text-primary font-bold w-24">
                                                            예금 정보
                                                        </div>
                                                        <Listbox value={bank} onChange={setBank}>
                                                            <div className="relative mt-1 z-100 w-[115px] text-primary">
                                                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-1 px-3 text-left border-1 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                                    <span className="block truncate">
                                                                        {bank} ▾
                                                                    </span>
                                                                </Listbox.Button>
                                                                <Transition
                                                                    as={Fragment}
                                                                    leave="transition ease-in duration-100"
                                                                    leaveFrom="opacity-100"
                                                                    leaveTo="opacity-0"
                                                                >
                                                                    <Listbox.Options className="absolute mt-1 h-[200%] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                                                        {bankname.map((item) => (
                                                                            <Listbox.Option
                                                                                key={item}
                                                                                className={({ active }) => `relative cursor-default select-none py-2 px-3 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}`}
                                                                                value={item}
                                                                            >
                                                                                {({ selected }) => (
                                                                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                                        {item}
                                                                                    </span>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        ))}
                                                                    </Listbox.Options>
                                                                </Transition>
                                                            </div>
                                                        </Listbox>
                                                        <Listbox value={deposit} onChange={setDeposit}>
                                                            <div className="relative mt-1 z-100 w-56 text-primary">
                                                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-1 px-3 text-left border-1 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                                    <span className="block truncate">
                                                                        {deposit.product_name} ▾
                                                                    </span>
                                                                </Listbox.Button>
                                                                <Transition
                                                                    as={Fragment}
                                                                    leave="transition ease-in duration-100"
                                                                    leaveFrom="opacity-100"
                                                                    leaveTo="opacity-0"
                                                                >
                                                                    <Listbox.Options className="absolute mt-1 h-[200%] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                                                        {deposit_bank.map((item: any) => (
                                                                            <div>
                                                                                {(item.bank_name == bank) && (<Listbox.Option
                                                                                    key={item.product_name}
                                                                                    className={({ active }) => `relative cursor-default select-none py-2 px-3 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}`}
                                                                                    value={item}
                                                                                >
                                                                                    {({ selected }) => (
                                                                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                                            {item.product_name}
                                                                                        </span>
                                                                                    )}
                                                                                </Listbox.Option>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </Listbox.Options>
                                                                </Transition>
                                                            </div>
                                                        </Listbox>
                                                    </label>
                                                    <div className="text-right">
                                                        <input
                                                            type="number"
                                                            className="text-primary appearance-none w-16 text-center border-1 px-2 rounded-md mr-1"
                                                            value={depositRate}
                                                            onChange={(e) => setDepositRate(Number(e.currentTarget.value))}
                                                        />
                                                        %
                                                    </div>
                                                </div>
                                                <div className="py-4">
                                                    <label className="flex items-center gap-10">
                                                        <div className="text-primary font-bold w-24">
                                                            기타 정보
                                                        </div>
                                                        <div className="flex gap-2 items-center">
                                                            매
                                                            <input
                                                                type="number"
                                                                className="text-primary appearance-none w-10 border-1 text-center rounded-md mr-1"
                                                                value={everyNumYear}
                                                                onChange={(e) => setEveryNumYear(Number(e.currentTarget.value))}
                                                            />
                                                            년 마다
                                                            <Listbox value={increseType} onChange={setIncreaseType}>
                                                                <div className="relative mt-1 z-100 text-primary">
                                                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-1 px-3 text-left border-1 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                                        <span className="block truncate">
                                                                            {increseType.name} ▾
                                                                        </span>
                                                                    </Listbox.Button>
                                                                    <Transition
                                                                        as={Fragment}
                                                                        leave="transition ease-in duration-100"
                                                                        leaveFrom="opacity-100"
                                                                        leaveTo="opacity-0"
                                                                    >
                                                                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                                                            {rentType.map((item) => (
                                                                                <Listbox.Option
                                                                                    key={item.type}
                                                                                    className={({ active }) => `relative cursor-default select-none py-2 px-3 ${active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}`}
                                                                                    value={item}
                                                                                >
                                                                                    {({ selected }) => (
                                                                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                                                                            {item.name}
                                                                                        </span>
                                                                                    )}
                                                                                </Listbox.Option>
                                                                            ))}
                                                                        </Listbox.Options>
                                                                    </Transition>
                                                                </div>
                                                            </Listbox>
                                                            값
                                                            <input
                                                                type="number"
                                                                className="text-primary appearance-none w-16 border-1 text-center rounded-md mr-1"
                                                                value={increasePrice}
                                                                onChange={(e) => setIncreasePrice(Number(e.currentTarget.value))}
                                                            />
                                                            만원 증가
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>)
                                        }
                                        <div className="text-center bg-blue-900 rounded-2xl p-2 mx-40 mt-5 font-semibold text-white">추가</div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    )

}

export default AddTaxTimeline