import { atom, selector } from 'recoil';
import { PropertyOwnership } from '@/src/api/yuppieSchemas';
import { recoilPersist } from 'recoil-persist';
import { Property } from '@/src/api/yuppieSchemas';

const { persistAtom } = recoilPersist();
export const currentPropertyState = atom<PropertyOwnership | undefined>({
  key: 'current_property',
  default: undefined,
});

export interface AcqPropertyType {
  share: number;
  ownershipType: string;
  kindOf: string;
  acquisitionDatetime?: string;
  acquisitionPrice?: number;
  complex?: string;
  property: any;
}

export const currentAcqPropertyState = atom<AcqPropertyType | undefined>({
  key: 'current_Acq_property',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
});
