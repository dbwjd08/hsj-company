import { useAmITmp2housesOwnerMvpKrAmITmp2housesOwnerPost } from '@/src/api/yuppieComponents';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import { useState } from 'react';
import AngleRight from '@/public/angle-right.svg';
import TwoHouseUpdate from './twoHouseUpdate';
import TwoHouseModal from './twoHouseModal';
import { getJsonHouse } from '@/lib/utils';

const TwoHouse = ({ properties }: { properties: PropertyOwnership[] }) => {
  const { session_id: sessionId } = useRecoilValue(tokenState);
  const enabled =
    !!sessionId &&
    !!properties[0] &&
    !!properties[1] &&
    typeof properties[0].living_years === 'number' &&
    !!properties[0].acquisition_date &&
    !!properties[1].acquisition_date;
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const { data, isFetched }: any =
    useAmITmp2housesOwnerMvpKrAmITmp2housesOwnerPost(
      {
        body: {
          sessionId,
          myProperties: [
            getJsonHouse(properties[0]),
            getJsonHouse(properties[1]),
          ],
        },
      },
      {
        enabled,
      },
    );

  const taxFilter = (item: string) => {
    if (item === '양도세') {
      return data?.income_tax.am_i_temp_two_owner == false;
    } else if (item === '지방세') {
      return data?.local_tax.am_i_temp_two_owner == false;
    } else {
      return data?.cret.am_i_temp_two_owner == false;
    }
  };
  return (
    <div className="h-full w-3/4">
      {!enabled && (
        <div className="flex flex-col justify-center gap-4 py-2 h-full w-full items-center">
          <div className="text-lg font-semibold text-center">
            회원님은{' '}
            <p className="inline bg-blue-50 p-2 rounded-[20px] border-2 border-blue-200">
              2 주택자
            </p>{' '}
            입니다.
            <div className="text-base font-medium text-center mt-3">
              취득 정보를 입력하고 일시적 2주택자 여부를 확인해보세요
            </div>
          </div>
          <button
            className="py-3 px-7 bg-blue-50 rounded-2xl text-base font-semibold text-blue-900 mt-5 transition ease-in-out hover:bg-blue-100"
            onClick={() => setIsOpen(true)}
          >
            취득 정보 입력하기 <AngleRight className="w-5 inline-block" />
          </button>
        </div>
      )}
      {isOpen && (
        <TwoHouseUpdate
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          oldProperty={properties[0]}
          newProperty={properties[1]}
        />
      )}
      {isFetched && properties && (
        <div className="h-full w-full flex flex-col justify-around">
          <div className=" bg-blue-50 p-2 rounded-[25px] w-fit border-2 border-blue-200 text-2xl text-blue-900 font-semibold mr-5">
            2 주택자
          </div>
          <div className="bg-red-100/40 py-2 px-5 text-center rounded-2xl font-semibold text-lg text-gray-800">
            일시적 2주택자는 세금에 따라 그 조건이 다릅니다. <br />각 세금을
            클릭하여 자세한 내용을 확인하세요.
          </div>
          {['지방세', '양도세', '종부세'].map((item, idx) => (
            <div
              className="font-medium text-lg cursor-pointer"
              key={idx}
              onClick={() => {
                setIsModalOpen(true);
                setModalType(item);
              }}
            >
              {item}: 일시적 2주택자 요건{' '}
              {taxFilter(item) ? (
                <p className="inline text-red-500">불충족</p>
              ) : (
                <p className="inline text-blue-500">충족</p>
              )}
            </div>
          ))}
        </div>
      )}
      {setIsModalOpen && (
        <TwoHouseModal
          setIsOpen={setIsModalOpen}
          isOpen={isModalOpen}
          modalType={modalType}
          taxData={data}
        />
      )}
    </div>
  );
};

export default TwoHouse;
