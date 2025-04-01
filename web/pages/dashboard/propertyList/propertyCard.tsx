import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import PropertyImage from '@/components/propertyImage';
import PropertyBadge from '@/components/propertyBadge';
import { formatPrice, getKindOfName, getOwnershipName } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import Trash from '@/public/trash.svg';
import Pencil from '@/public/pencil.svg';
import { useRecoilState } from 'recoil';
import { currentPropertyState } from '@/lib/store';

const PropertyCard = ({
  propertyOwnership,
  onDeleteProperty,
  onUpdateProperty,
}: {
  propertyOwnership: PropertyOwnership;
  onDeleteProperty: ({ pk }: { pk: string }) => void;
  onUpdateProperty: (propertyOwnership: PropertyOwnership) => void;
}) => {
  const [currentProperty, setCurrentProperty] =
    useRecoilState(currentPropertyState);

  return (
    <>
      <div
        key={propertyOwnership.property.complex.key}
        className={` ${
          propertyOwnership === currentProperty
            ? 'bg-blue-50 border-2 border-blue-200'
            : 'bg-white'
        } px-2 py-4 rounded-2xl flex mr-1 cursor-pointer w-full`}
        onClick={() => setCurrentProperty(propertyOwnership)}
      >
        <div className="flex flex-col items-center">
          <PropertyImage
            propertyType={propertyOwnership.property.complex.property_type}
            className="w-8"
          />
          <PropertyBadge
            propertyType={propertyOwnership.property.complex.property_type}
          />
        </div>
        <div className="w-full">
          <div className="flex w-full justify-between">
            <div
              className={` ${
                propertyOwnership === currentProperty
                  ? 'text-blue-700 font-bold'
                  : 'text-black font-semibold'
              } text-ml`}
            >
              {propertyOwnership.property.complex.complex_name}
              <br />
              {propertyOwnership.property.dong} {propertyOwnership.property.ho}
            </div>{' '}
            <button
              className="flex flex-col h-fit items-center gap-y-1 mr-3"
              onClick={() =>
                onDeleteProperty({ pk: propertyOwnership.property.pk })
              }
            >
              <Trash className="w-5" />
              <div className="text-[0.5rem]">삭제</div>
            </button>
          </div>
          <div className="text-xs text-gray-400">
            {propertyOwnership.property.complex.old_address}
            {propertyOwnership.property.complex.road_name}
          </div>
          <div className="text-xs text-gray-400">
            {getKindOfName(propertyOwnership.kind_of!)}{' '}
            {getOwnershipName(propertyOwnership.ownership!)}
            {propertyOwnership.ownership === 'etc' &&
              propertyOwnership.share !== undefined &&
              ` (${propertyOwnership.share * 100}%)`}
            <br />
            공시지가: {formatPrice(propertyOwnership.property.official_price)}
          </div>
          <div className="mt-2 bg-gray-200 px-2 py-1 border-l-2 border-primary text-xs flex justify-between">
            <div>
              <div>
                취득 날짜:{' '}
                {propertyOwnership.acquisition_date
                  ? format(
                      parseISO(propertyOwnership.acquisition_date),
                      'yyyy/MM/dd',
                    )
                  : '정보 없음'}
              </div>
              <div>
                취득 금액:{' '}
                {propertyOwnership.acquired_price != undefined
                  ? formatPrice(propertyOwnership.acquired_price)
                  : '정보 없음'}
              </div>
              <div>
                현재 거주 여부:{' '}
                {propertyOwnership.still_living === true
                  ? '예'
                  : propertyOwnership.still_living === false
                  ? '아니오'
                  : '정보 없음'}
              </div>
              {propertyOwnership.still_living === true && (
                <div>
                  입주 날짜:{' '}
                  {propertyOwnership.moving_in_date != undefined
                    ? format(
                        parseISO(propertyOwnership.moving_in_date),
                        'yyyy/MM/dd',
                      )
                    : '정보 없음'}
                </div>
              )}
              {propertyOwnership.still_living === false && (
                <div>
                  실거주 기간:{' '}
                  {propertyOwnership.living_years != undefined
                    ? `${propertyOwnership.living_years}년`
                    : '정보 없음'}
                </div>
              )}

              {propertyOwnership.ownership === 'wholly_mine' ? (
                <div>소유권: 내 명의 (100%)</div>
              ) : propertyOwnership.ownership === 'owned_with_spouse' ? (
                <div>
                  소유권: 나({(propertyOwnership.share! * 100).toFixed(0)})%
                  배우자(
                  {((1 - propertyOwnership.share!) * 100).toFixed(0)})%
                </div>
              ) : (
                <div>
                  소유권: 나({(propertyOwnership.share! * 100).toFixed(0)}) 그
                  외(
                  {((1 - propertyOwnership.share!) * 100).toFixed(0)})
                </div>
              )}
            </div>
            <button
              className="appearance-none h-fit border-2 border-gray-800 bg-white px-0.5 py-px rounded flex flex-col items-center text-[0.625rem]"
              onClick={() => onUpdateProperty(propertyOwnership)}
            >
              <Pencil className="w-4" />
              <span>수정</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyCard;
