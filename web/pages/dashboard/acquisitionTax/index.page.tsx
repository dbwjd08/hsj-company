import ProtectedRoute from '@/components/ProtectedRoute';
import PropertyImage from '@/components/propertyImage';
import { useState } from 'react';
import SearchProperty from '../../../components/searchProperty';
import {
  useCreatePropertyUniversesIdPropertiesPost,
  useGetPropertiesUniversesIdPropertiesGet,
} from '@/src/api/yuppieComponents';
import { useRecoilValue, useRecoilState } from 'recoil';
import { tokenState } from '@/lib/auth';
import AcquisitionTop from './acquisitionTop';
import AcquisitionBody from './acquisitionBody';
import { currentAcqPropertyState } from '@/lib/store';
import Router from 'next/router';
import Image from 'next/image';

const AcquisitionTaxPage = () => {
  const [acqProperty, setAcqProperty] = useRecoilState(currentAcqPropertyState);
  const [isOpen, setIsOpen] = useState(false);
  const [isAcquisition, setIsAcquisition] = useState(false);
  const { default_universe_id, session_id } = useRecoilValue(tokenState);
  const addProperty = useCreatePropertyUniversesIdPropertiesPost();
  const { data, refetch: refetchProperties } =
    useGetPropertiesUniversesIdPropertiesGet({
      pathParams: {
        id: default_universe_id!,
      },
    });
  const onAddProperty = async ({
    share,
    ownership,
    kindOf,
    pk,
  }: {
    share: number;
    ownership: string;
    kindOf: string;
    pk: string;
  }) => {
    await addProperty.mutateAsync({
      body: {
        share,
        ownership,
        kindOf,
        pk,
        sessionId: session_id,
      },
      pathParams: {
        id: default_universe_id!,
      },
    });
    refetchProperties();
  };

  return (
    <ProtectedRoute>
      <div className="max-w-[1200px] min-w-[1200px] flex m-auto">
        <div className="py-10 flex-col flex gap-y-5 w-full h-full">
          <section className="flex">
            <PropertyImage propertyType="apartment" className="w-8" />
            <div className="font-semibold text-2xl ml-3">
              취득세 및 취득 후 보유세
            </div>
          </section>

          {acqProperty ? (
            <AcquisitionTop />
          ) : (
            <section className="flex flex-col items-center justify-center gap-10 w-full p-10 border-2 border-gray-100 rounded-3xl bg-slate-50/50">
              <div className="font-bold text-2xl text-blue-900 ">
                취득할 부동산을 입력하고 예상 취득세를 확인해보세요
              </div>
              <div className="animate-pulse flex text-5xl text-blue-600 mt-[-30px]">
                ⌵
              </div>
              <section className="flex gap-10">
                <div className="w-[25rem] h-[25rem] bg-purple-300/10 rounded-3xl">
                  <Image
                    className="rounded-t-lg w-full h-full"
                    src="/acquisitionTutorial_1.png"
                    width="500"
                    height="300"
                    alt="취득세"
                  />

                  <div className="p-7">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                      간편하게 보는 취득세 계산법
                    </h5>

                    <p className="mb-3 font-normal text-gray-700 ">
                      취득할 부동산 입력을 통해 예상 취득세와 나에게 해당하는
                      취득세 계산법까지 살펴봐요.
                    </p>
                  </div>
                </div>
                <div className="w-[25rem] h-[25rem] bg-indigo-300/20 rounded-3xl bg-">
                  <Image
                    className="rounded-t-lg w-full h-full"
                    src="/acquisitionTutorial_2.png"
                    width="500"
                    height="300"
                    alt="취득세"
                  />

                  <div className="p-7">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
                      취득시 보유세 추이 확인
                    </h5>

                    <p className="mb-3 font-normal text-gray-700 ">
                      부동산을 새로 취득할 시 향후 변화되는 보유세까지 한 눈에
                      확인해요.
                    </p>
                  </div>
                </div>
              </section>

              <div>
                <span className="relative flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-400"></span>
                </span>
                <span
                  className="bg-blue-800 py-4 px-8 rounded-2xl font-semibold text-white cursor-pointer text-2xl hover:bg-blue-800 hover:text-white ease-in-out duration-300"
                  onClick={() => {
                    setIsOpen(true);
                    setIsAcquisition(true);
                  }}
                >
                  취득할 부동산 입력하기
                </span>
              </div>
            </section>
          )}

          {acqProperty && <AcquisitionBody />}

          <div
            className="cursor-pointer font-semibold text-blue-900 bg-blue-50 rounded-xl p-4 w-fit self-center hover:text-blue-700 hover:font-bold"
            onClick={() => Router.back()}
          >
            ⇠ 대시보드로 돌아가기
          </div>
        </div>
      </div>

      <SearchProperty
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onAddProperty={isAcquisition ? null : onAddProperty}
        setAcqProperty={setAcqProperty}
      />
    </ProtectedRoute>
  );
};

export default AcquisitionTaxPage;
