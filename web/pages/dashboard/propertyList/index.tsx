import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { tokenState } from '@/lib/auth';
import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import {
  useGetPropertiesUniversesIdPropertiesGet,
  useCreatePropertyUniversesIdPropertiesPost,
  useDeletePropertyUniversesIdPropertiesPkDelete,
  useUpdatePropertyUniversesIdPropertiesPkPut,
} from '@/src/api/yuppieComponents';
import { format } from 'date-fns';
import SearchProperty from '../../../components/searchProperty';
import UpdateProperty from './updateProperty';
import PropertyCard from './propertyCard';
import { toast } from 'react-toastify';

const PropertyList = () => {
  // fetch all properties
  const { default_universe_id, session_id } = useRecoilValue(tokenState);
  const { data, refetch: refetchProperties } =
    useGetPropertiesUniversesIdPropertiesGet({
      pathParams: {
        id: default_universe_id!,
      },
    });

  // add property
  const [isOpen, setIsOpen] = useState(false);
  const addProperty = useCreatePropertyUniversesIdPropertiesPost();
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

  // delete property
  const deleteProperty = useDeletePropertyUniversesIdPropertiesPkDelete();
  const onDeleteProperty = async ({ pk }: { pk: string }) => {
    await deleteProperty.mutateAsync({
      body: {
        sessionId: session_id,
      },
      pathParams: {
        id: default_universe_id!,
        pk,
      },
    });
    refetchProperties();
  };

  // update property
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<PropertyOwnership | null>(
    null,
  );
  const updateProperty = useUpdatePropertyUniversesIdPropertiesPkPut();
  const onUpdateProperty = async ({
    pk,
    acquisitionDate,
    acquiredPrice,
    stillLiving,
    movingInDateTime,
    livingYears,
    ownership,
    share,
  }: {
    pk: string;
    acquisitionDate: Date;
    acquiredPrice: number;
    stillLiving: boolean;
    movingInDateTime?: Date;
    livingYears?: number;
    ownership: string;
    share: number;
  }) => {
    await updateProperty.mutateAsync({
      body: {
        sessionId: session_id,
        acquisitionDateTime: format(acquisitionDate, 'yyyy-MM-dd'),
        acqPrice: acquiredPrice,
        isStillLiving: stillLiving,
        movingInDateTime:
          stillLiving && movingInDateTime
            ? format(movingInDateTime, 'yyyy-MM-dd')
            : undefined,
        livingYears: !stillLiving ? livingYears : undefined,
        ownership: ownership,
        share: share,
      },
      pathParams: {
        id: default_universe_id!,
        pk,
      },
    });
    refetchProperties();
    toast.success('정보가 성공적으로 업데이트 됐습니다!', {
      autoClose: 2000,
    });
  };

  return (
    <div className="flex flex-col h-4/6 w-full">
      <h2 className="text-xl font-bold p-2">
        부동산 목록 {data && `(총 ${data.length} 개)`}
      </h2>
      <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden items-center scrollbar p-2">
        {data?.map((item) => (
          <PropertyCard
            key={item.property.complex.key}
            propertyOwnership={item}
            onDeleteProperty={onDeleteProperty}
            onUpdateProperty={(propertyOwnership) => {
              setUpdateTarget(propertyOwnership);
              setIsUpdateOpen(true);
            }}
          />
        ))}
        <button
          className="w-full p-16 bg-white rounded-2xl text-3xl mr-1"
          onClick={() => setIsOpen(true)}
        >
          +
        </button>
      </div>
      <SearchProperty
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onAddProperty={onAddProperty}
      />
      <UpdateProperty
        propertyOwnership={updateTarget}
        isOpen={isUpdateOpen}
        setIsOpen={setIsUpdateOpen}
        onUpdateProperty={onUpdateProperty}
      />
    </div>
  );
};

export default PropertyList;
