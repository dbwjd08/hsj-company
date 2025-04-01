import {
  Property,
  ServerSchemasRequestsKoreanProperty,
  PropertyOwnership,
} from '@/src/api/yuppieSchemas';
import { AcqPropertyType } from './store';
import { format, parseISO } from 'date-fns';

export const formatPrice = (price: number | undefined) => {
  if (price === undefined) {
    return '';
  }
  const million = Math.floor(price / 100000000);
  const tenThousand = Math.floor((price % 100000000) / 10000);
  const rest = price % 10000;
  const tokens = [
    million ? `${million}억` : '',
    tenThousand ? `${tenThousand}만` : '',
    rest ? `${rest.toFixed(0)}` : '',
  ].filter(Boolean);
  return `${tokens.length === 0 ? '0' : tokens.join(' ')}원`;
};

const kindOfNameMap = {
  house: '주거용',
  building: '영업용',
  land: '토지',
  etc: '기타',
};
export const getKindOfName = (kindOf: string) =>
  kindOfNameMap[kindOf as keyof typeof kindOfNameMap];

const ownershipNameMap = {
  sole: '단독명의',
  joint: '부부 공동명의',
  etc: '공동명의',
};
export const getOwnershipName = (ownership: string) =>
  ownershipNameMap[ownership as keyof typeof ownershipNameMap];

export const getPropertyName = (property: Property) =>
  `${property.complex.complex_name} ${property.dong} ${property.ho}`;

export const getJsonHouse = (
  property: PropertyOwnership,
): ServerSchemasRequestsKoreanProperty => {
  return {
    pk: property.property.pk,
    // complex: property.property.complex as string,
    dong: property.property.dong,
    ho: property.property.ho,
    kindOf: property.kind_of as string,
    share: property.share as number,
    netLeasableArea: property.property.net_leasable_area as number,
    ownershipType: property.ownership as string,
    officialPrice: property.property.official_price as number,
    movingInDate:
      format(
        parseISO(property.moving_in_date ?? new Date().toISOString()),
        'yyyy-MM-dd',
      ) + ' 00:00:00.000',
    livingYears: property.living_years,
    stillLiving: property.still_living,
    acquisitionDatetime:
      format(
        parseISO(property.acquisition_date ?? new Date().toISOString()),
        'yyyy-MM-dd',
      ) + ' 00:00:00.000',
    acquisitionPrice: property.acquired_price,
    // acquisitionType: ?.toString(),
  };
};

export const getJsonAcqProperty = (
  property: AcqPropertyType,
): ServerSchemasRequestsKoreanProperty => {
  return {
    pk: property.property.apart_pk,
    // complex: property.property.complex as string,
    dong: property.property.dong,
    ho: property.property.ho,
    kindOf: property.kindOf as string,
    share: (property.share / 100) as number,
    netLeasableArea: property.property.net_leasable_area as number,
    ownershipType: property.ownershipType as string,
    officialPrice: property.property.official_price as number,
    acquisitionDatetime:
      format(
        parseISO(property.acquisitionDatetime ?? new Date().toISOString()),
        'yyyy-MM-dd',
      ) + ' 00:00:00.000',
    acquisitionPrice: property.acquisitionPrice,
    // acquisitionType: ?.toString(),
  };
};
