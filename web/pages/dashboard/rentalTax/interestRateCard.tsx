import {
  GetDepositRatesFinanceDepositRatesGeneralGetResponse,
  GetDepositRatesFinanceDepositRatesSavingGetResponse,
  GetLoanRatesFinanceLoanRatesGeneralGetResponse,
  GetLoanRatesFinanceLoanRatesSavingGetResponse,
} from '@/src/api/yuppieComponents';
import HoldingTaxIcon from '@/public/holdingTax.svg';

import { useState } from 'react';
import InterestRateModal from './interestRateModal';
import { rateObj } from './index.page';

const InterestRateCard = ({
  deposit_general,
  deposit_saving,
  loan_general,
  loan_saving,
  rateList,
}: {
  deposit_general: GetDepositRatesFinanceDepositRatesGeneralGetResponse;
  deposit_saving: GetDepositRatesFinanceDepositRatesSavingGetResponse;
  loan_general: GetLoanRatesFinanceLoanRatesGeneralGetResponse;
  loan_saving: GetLoanRatesFinanceLoanRatesSavingGetResponse;
  rateList: rateObj | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setIsModalTitle] = useState<Array<string>>([]);
  const [modalInformation, setModalInformation] = useState<any>([]);

  return (
    <div className="flex gap-2 w-full h-fit">
      <section className="flex flex-col w-full h-full">
        <div className="flex gap-4 items-center ml-2 mb-2">
          <HoldingTaxIcon className="w-10" />
          <div className="font-semibold text-xl rounded-xlp-2 text-blue-800">
            예금 금리
          </div>
        </div>
        <div className="flex gap-4 p-2 font-medium text-xl text-gray-800 w-full h-full">
          <div
            className="group relative p-4 rounded-2xl bg-gray-50 flex items-center justify-center w-full h-full cursor-pointer overflow-hidden"
            onClick={() => {
              setIsModalTitle(['예금 금리', '시중 은행']);
              setIsOpen(true);
              setModalInformation(deposit_general);
            }}
          >
            <div className="absolute inset-0 w-3 bg-[#9DADC8] transition-all duration-[250ms] ease-out group-hover:w-full"></div>
            <span className="relative text-black group-hover:text-white">
              시중 은행
              <br />
              <p className="inline text-base">
                ({rateList?.depGenMin?.toFixed(1)}%~
                {rateList?.depGenMax?.toFixed(1)}%)
              </p>
            </span>
          </div>
          <div
            className="group relative p-4 rounded-2xl bg-gray-50 flex items-center justify-center w-full h-full cursor-pointer overflow-hidden"
            onClick={() => {
              setIsModalTitle(['예금 금리', '저축 은행']);
              setIsOpen(true);
              setModalInformation(deposit_saving);
            }}
          >
            <div className="absolute inset-0 w-3 bg-[#6CA783] transition-all duration-[250ms] ease-out group-hover:w-full"></div>
            <span className="relative text-black group-hover:text-white">
              저축 은행 <br />
              <p className="inline text-base">
                ({rateList?.depSavMin?.toFixed(1)}%~
                {rateList?.depSavMax?.toFixed(1)}%)
              </p>
            </span>
          </div>
        </div>
      </section>

      <section className="flex flex-col w-full h-full">
        <div className="flex gap-4 items-center ml-2 mb-2">
          <HoldingTaxIcon className="w-10" />
          <div className="font-semibold text-xl rounded-xl p-2 text-blue-800">
            대출 금리
          </div>
        </div>
        <div className="flex gap-4 p-2 font-medium text-xl text-gray-800 w-full h-full">
          <div
            className="group relative p-4 rounded-2xl bg-gray-50 flex items-center justify-center w-full h-full cursor-pointer overflow-hidden"
            onClick={() => {
              setIsModalTitle(['대출 금리', '시중 은행']);
              setModalInformation(loan_general);
              setIsOpen(true);
            }}
          >
            <div className="absolute inset-0 w-3 bg-[#FFEAB6] transition-all duration-[250ms] ease-out group-hover:w-full"></div>
            <span className="relative text-black">
              시중 은행
              <br />
              <p className="inline text-base">
                ({rateList?.loanGenMin?.toFixed(1)}%~
                {rateList?.loanGenMax?.toFixed(1)}%)
              </p>
            </span>
          </div>
          <div
            className="group relative p-4 rounded-2xl bg-gray-50 flex items-center justify-center w-full h-full cursor-pointer overflow-hidden"
            onClick={() => {
              setIsModalTitle(['대출 금리', '저축 은행']);
              setModalInformation(loan_saving);
              setIsOpen(true);
            }}
          >
            {' '}
            <div className="absolute inset-0 w-3 bg-[#F49999] transition-all duration-[250ms] ease-out group-hover:w-full"></div>
            <span className="relative text-black group-hover:text-white">
              저축 은행 <br />
              <p className="inline text-base">
                ({rateList?.loanSavMin?.toFixed(1)}%~
                {rateList?.loanSavMax?.toFixed(1)}%)
              </p>
            </span>
          </div>
        </div>
      </section>

      <InterestRateModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={modalTitle}
        information={modalInformation}
      />
    </div>
  );
};

export default InterestRateCard;
