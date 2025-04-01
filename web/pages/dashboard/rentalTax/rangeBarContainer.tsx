import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import {
  useGetPriceStatFromPropertyFinanceConversionRatePropertyPkGet,
  useGetMortgageRegulationFinanceMortgageRegulationPost,
} from '@/src/api/yuppieComponents';
import { useEffect, useState } from 'react';
import { getJsonHouse } from '@/lib/utils';
import { formatPrice } from '@/lib/utils';
import RangeBar from '@/components/rangeBar';

const RangeBarContainer = ({
  selectedProperty,
  numHouses,
  conver,
}: {
  selectedProperty: PropertyOwnership;
  numHouses: number;
  conver?: any;
}) => {
  const { session_id } = useRecoilValue(tokenState);

  const [regulation, setRegulation] = useState<any>();

  const [conversationRate, setConversationRate] = useState<any>();
  const [appConvRate, setAppConvRate] = useState<any>();

  const { data: tmp_conversationRate }: any =
    useGetPriceStatFromPropertyFinanceConversionRatePropertyPkGet({
      pathParams: {
        pk: selectedProperty.property.pk,
      },
    });

  const [deposit, setDeposit] = useState<Array<number>>([0]);

  const [rent, setRent] = useState<Array<number>>([0]);
  const [maxLoan, setMaxLoan] = useState<string>('0');
  const [currentLoan, setCurrentLoan] = useState<Array<number>>([0]);

  const [income, setIncome] = useState<Array<number>>([1.2e4]);
  const [currentDTI, setCurrentDTI] = useState<string>('0');
  const [maxDTI, setMaxDTI] = useState<string>('0');

  const avgRate = 4.0;

  const getRegulation = async () => {
    return await regulationMutate
      .mutateAsync({
        body: {
          sessionId: session_id as string,
          house: getJsonHouse(selectedProperty),
          value: conversationRate?.dealAvgPrc,
          numHouses: numHouses,
        },
      })
      .then((res) => {
        setRegulation(res);
      });
  };

  useEffect(() => {
    if (tmp_conversationRate) {
      if (conver) {
        setConversationRate(conver.avgStat);
        setAppConvRate(conver.appConvRate);
      } else {
        setConversationRate(tmp_conversationRate.priceStat);
        setAppConvRate(tmp_conversationRate.appConvRate);
      }
    }
  }, [selectedProperty, conver]);

  useEffect(() => {
    if (conversationRate) {
      getRegulation();
      setDeposit([conversationRate.deposit]);
      setRent([conversationRate.monthlyRentMin]);
    }
  }, [conversationRate]);

  useEffect(() => {
    if (regulation) {
      setMaxLoan((regulation?.maxLoanValue).toString());
      setCurrentLoan([regulation?.maxLoanValue]);
      setMaxDTI(regulation?.dti);
      setCurrentDTI(
        calculateDTI(
          1.2e4,
          Number((regulation?.maxLoanValue).toString()),
          avgRate,
        ).toString(),
      );
    }
  }, [regulation]);

  const regulationMutate =
    useGetMortgageRegulationFinanceMortgageRegulationPost();

  const connDepositToRent = (_deposit: number) => {
    setDeposit([_deposit]);
    setRent([
      Math.floor(
        Math.max(
          0.0,
          (appConvRate * (conversationRate?.leaseAvgPrc - Number(_deposit))) /
            1200,
        ),
      ),
    ]);
  };

  const connRentToDeposit = (_rent: number) => {
    setRent([_rent]);
    const new_deposit = Math.max(
      0.0,
      conversationRate?.leaseAvgPrc - (_rent * 1200) / appConvRate,
    );

    if (Math.floor(new_deposit / 100) * 100 == 100) {
      setDeposit([0]);
    } else {
      setDeposit([Math.floor(new_deposit / 100) * 100]);
    }
  };

  const calculateDTI = (
    annualIncome: number,
    loanAmount: number,
    avgRate: number,
  ) => {
    const monthlyRate = avgRate / 100.0 / 12;
    const period = 480;
    const numerator =
      loanAmount * monthlyRate * Math.pow(1 + monthlyRate, period);
    const denominator = Math.pow(1 + monthlyRate, period) - 1;
    const monthlyPayment = numerator / denominator;
    if (annualIncome == 0) return 0.0;
    return (monthlyPayment * 12) / annualIncome;
  };

  const calculateMaxLoan = (
    annualIncome: number,
    maxDTI: number,
    avgRate: number,
  ) => {
    const monthlyRate = avgRate / 100.0 / 12;
    const period = 480;
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, period);
    const denominator = Math.pow(1 + monthlyRate, period) - 1;
    if (numerator == 0 || denominator == 0) return 0.0;
    const monthlyAmount = numerator / denominator;
    return (maxDTI * annualIncome) / (monthlyAmount * 12);
  };

  const hadleIncomeChange = (value: number) => {
    setIncome([value]);

    const _maxLoanByDTI = calculateMaxLoan(value, Number(maxDTI), avgRate);

    setMaxLoan(
      Math.max(0, Math.min(_maxLoanByDTI, regulation?.maxLoanValue)).toString(),
    );
  };

  //maxLoan이 바뀐 후 동기적으로 실행하기 위해 useEffect로 따로 처리
  useEffect(() => {
    setCurrentLoan([Math.min(Number(maxLoan), Number(currentLoan[0]))]);
    setCurrentDTI(
      calculateDTI(
        Number(income[0]),
        Number(currentLoan[0]),
        avgRate,
      ).toString(),
    );
  }, [maxLoan, currentLoan[0]]);

  const handleLoanChange = (value: number) => {
    if (value - 1000 <= Number(maxLoan)) {
      setCurrentLoan([value]);
      setCurrentDTI(
        calculateDTI(Number(income), Number(value), avgRate).toString(),
      );
    }
  };

  return (
    <div className="w-[45%] font-semibold text-lg text-gray-800">
      <section className="w-full flex flex-col gap-8 h-full">
        <article className="flex flex-col justify-between w-full gap-10 bg-gray-100/30 border-1 rounded-xl p-12">
          <div className="flex items-center w-full justify-between">
            <div className="text-xl">보증금</div>

            <RangeBar
              max={conversationRate?.leaseAvgPrc}
              value={deposit}
              onHandle={connDepositToRent}
              color={'#5a7bf5'}
              step={100}
            />
          </div>
          <div className="flex items-center gap-4 w-full justify-between">
            <div className="text-xl">월세</div>

            <RangeBar
              max={(appConvRate * conversationRate?.leaseAvgPrc) / 1200}
              value={rent}
              onHandle={connRentToDeposit}
              color={'#5a7bf5'}
              step={1}
            />
          </div>
        </article>

        <article className="flex flex-col justify-center gap-14 bg-gray-100/30 border-1 rounded-xl px-12 py-14">
          <div className="flex items-center gap-4 w-full justify-between">
            <div className="text-xl">종합연소득</div>

            <RangeBar
              max={2e4}
              value={income}
              onHandle={hadleIncomeChange}
              color={'#f56f58'}
              step={100}
            />
          </div>
          <div className="flex items-center gap-4 w-full justify-between">
            <div className="text-xl">대출금액</div>

            <RangeBar
              max={regulation?.maxLoanValue}
              value={currentLoan}
              onHandle={handleLoanChange}
              color={'#f56f58'}
              step={1}
            />
          </div>{' '}
          <hr className=" border-1 border-gray-200/60 w-full" />
          <section className="flex flex-col gap-5">
            <div>
              ✔︎{' '}
              <p className="inline border-b-4 border-blue-100 text-blue-900 font-bold">
                최대 대출 가능 금액
              </p>
              :{' '}
              <p className="inline text-red-500/90 font-bold">
                {formatPrice(
                  Math.ceil((Number(maxLoan) * 10 ** 4) / 100) * 100,
                )}
              </p>
            </div>
            <div>
              {' '}
              ✔︎{' '}
              <p className="inline border-b-4 border-blue-100 text-blue-900 font-bold">
                LTV
              </p>
              : {regulation?.condition} {regulation?.ltv} 까지
            </div>
            <div>
              ✔︎{' '}
              <p className="inline border-b-4 border-blue-100 text-blue-900 font-bold">
                DTI
              </p>
              :{' '}
              <p className="inline text-red-500/90 font-bold">
                {Math.min(
                  Number(currentDTI) * 100,
                  Number(maxDTI) * 100,
                ).toFixed(1)}
                %{' '}
              </p>
              / {(Number(maxDTI) * 100).toFixed(0)}%까지
            </div>
          </section>
        </article>
      </section>
    </div>
  );
};

export default RangeBarContainer;
