import { useState, useRef, Fragment, Dispatch, SetStateAction } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { debounce } from 'ts-debounce';
import PropertyImage from '@/components/propertyImage';
import PropertyBadge from '@/components/propertyBadge';
import {
  useApartmentsSearchApartmentsSearchGet,
  useQueryDongsApartmentsKeyDongsGet,
  useQueryDongsApartmentsKeyAreasGet,
  useQueryHosApartmentsKeyHosGet,
  useQueryAllHosApartmentsKeyAreaHosGet,
} from '@/src/api/yuppieComponents';
import AngleLeft from '@/public/angle-left.svg';
import SearchIcon from '@/public/search.svg';
import DatePicker from 'react-datepicker';
import CalendarIcon from '@/public/calendar.svg';
import format from 'date-fns/format';
import ko from 'date-fns/locale/ko';
import { formatPrice } from '@/lib/utils';
import { AcqPropertyType } from '@/lib/store';

const SearchProperty = ({
  isOpen,
  setIsOpen,
  onAddProperty,
  setAcqProperty,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  onAddProperty:
    | (({
        share,
        ownership,
        kindOf,
        pk,
      }: {
        share: number;
        ownership: string;
        kindOf: string;
        pk: string;
      }) => void)
    | null;
  setAcqProperty?: Dispatch<SetStateAction<AcqPropertyType | undefined>>;
}) => {
  const [searchState, setSearchState] = useState<'apt' | 'dong' | 'ho' | 'add'>(
    'apt',
  );
  const modalTitle =
    {
      apt: '부동산 검색',
      dong: '동 선택',
      ho: '호 선택',
      add: '선택 완료',
    }[searchState] || '';
  const goBack = () => {
    if (searchState === 'apt') {
      setIsOpen(false);
    } else if (searchState === 'dong') {
      setSearchState('apt');
      setSearchDong(true);
    } else if (searchState === 'ho') {
      setSearchState('dong');
    } else if (searchState === 'add') {
      setSearchState('ho');
    }
  };

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [apt, setApt] = useState<any>(undefined);
  const [dong, setDong] = useState('');
  const [ho, setHo] = useState<any>(undefined);
  const [searchDong, setSearchDong] = useState(true);

  const [ownership, setOwnership] = useState('wholly_mine');
  const [share, setShare] = useState('100');
  const [kindOf, setKindOf] = useState('house');

  const [acquisitionDate, setAcquisitionDate] = useState(new Date());
  const [acquiredPrice, setAcquiredPrice] = useState(0);

  // search apartments
  const [searchText, setSearchText] = useState('');
  const { data: aptSearchResult } = useApartmentsSearchApartmentsSearchGet(
    {
      queryParams: {
        q: searchText,
      },
    },
    {
      enabled: searchText.length > 0,
      keepPreviousData: searchText.length > 0,
    },
  );
  const searchAptDebounce = debounce((q: string) => {
    setSearchText(q);
  }, 400);

  // search dong
  const { data: dongSearchResult } = useQueryDongsApartmentsKeyDongsGet(
    {
      pathParams: {
        key: apt?.key,
      },
    },
    {
      enabled: !!apt && searchState === 'dong',
    },
  );

  // search area
  const { data: areaSearchResult } = useQueryDongsApartmentsKeyAreasGet(
    {
      pathParams: {
        key: apt?.key,
      },
    },
    {
      enabled: !!apt && searchState === 'dong',
    },
  );

  // search ho
  const { data: hoSearchResult } = useQueryHosApartmentsKeyHosGet(
    {
      pathParams: {
        key: `${apt?.key}_${dong}`,
      },
    },
    {
      enabled: !!apt && dong.length > 0 && searchState === 'ho',
    },
  );

  // search ho
  const { data: areahoSearchResult } = useQueryAllHosApartmentsKeyAreaHosGet(
    {
      pathParams: {
        key: `${apt?.key}`,
        area: Number(dong),
      },
    },
    {
      enabled: !!apt && searchDong === false && searchState === 'ho',
    },
  );

  const resetValues = () => {
    setSearchState('apt');
    setSearchText('');
    setApt(undefined);
    setDong('');
    setHo(undefined);
    setSearchDong(true);
    setAcquiredPrice(0);
    setAcquisitionDate(new Date());
  };

  const renderSelectedApt = (apt: any, dong: any) => (
    <div className="mt-4 px-2 py-3 border border-gray-200 flex shadow rounded-xl">
      <div className="flex-1">
        {(searchDong || (!searchDong && !dong)) && (
          <div>
            {apt.complex_name} {dong}
          </div>
        )}
        {!searchDong && dong && (
          <div>
            {apt.complex_name} {dong}m2({(Number(dong) * 0.3025).toFixed(2)}
            평형)
          </div>
        )}
        <div className="text-sm">
          {apt.old_address}
          {apt.road_name}
        </div>
      </div>
      <PropertyBadge propertyType={apt.property_type} />
    </div>
  );

  const calculateDongOp = (dongs: string[] | undefined, dong: any) => {
    if (dongs) {
      let min: number = Number(dongs[0][1]);
      let max: number = Number(dongs[0][1]);
      for (let i = 0; i < dongs.length; i++) {
        if (Number(dongs[i][1]) < min) min = Number(dongs[i][1]);
        if (Number(dongs[i][1]) > max) max = Number(dongs[i][1]);
      }
      if (min === max) return 50;

      return (
        Number((Math.abs((dong[1] - min) / (max - min)) * 10).toFixed(0)) * 10
      );
    }
  };

  const calculateHoOp = (Hos: any[] | undefined, Ho: any) => {
    if (Hos) {
      let min: number = Hos[0].official_price;
      let max: number = Hos[0].official_price;
      for (let i = 0; i < Hos.length; i++) {
        if (Hos[i].official_price < min) min = Hos[i].official_price;
        if (Hos[i].official_price > max) max = Hos[i].official_price;
      }
      if (min === max) return 0.5;
      return (
        Number(
          (Math.abs((Ho.official_price - min) / (max - min)) * 10).toFixed(0),
        ) * 10
      );
    }
  };

  type OpacityType = Record<number, string>;
  const opacity: OpacityType = {
    0: 'bg-opacity-5',
    10: 'bg-opacity-10',
    20: 'bg-opacity-20',
    30: 'bg-opacity-30',
    40: 'bg-opacity-40',
    50: 'bg-opacity-50',
    60: 'bg-opacity-60',
    70: 'bg-opacity-70',
    80: 'bg-opacity-80',
    90: 'bg-opacity-90',
    100: 'bg-opacity-95',
  };

  const renderDong = () => (
    <div className="grid grid-cols-3">
      {dongSearchResult?.dongs?.map((_dong) => (
        <div
          key={_dong[0]}
          className={`p-4 flex items-center justify-center cursor-pointer bg-yuppie	 ${
            opacity[Number(calculateDongOp(dongSearchResult.dongs, _dong))]
          }`}
          onClick={() => {
            setDong(_dong[0]);
            setSearchState('ho');
          }}
        >
          {_dong[0]}
        </div>
      ))}
    </div>
  );

  const renderHo = () =>
    searchDong === true ? (
      <div className="grid grid-cols-3">
        {hoSearchResult?.items?.map((item) => (
          <div
            key={item.ho}
            className={`p-4 flex items-center justify-center cursor-pointer bg-yuppie ${
              opacity[Number(calculateHoOp(hoSearchResult.items, item))]
            }`}
            onClick={() => {
              setHo(item);
              setSearchState('add');
            }}
          >
            {item.ho}
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-3">
        {areahoSearchResult?.items?.map((item) => (
          <div
            key={item.apart_pk}
            className={`p-4 flex items-center justify-center cursor-pointer bg-yuppie ${
              opacity[Number(calculateHoOp(areahoSearchResult.items, item))]
            }`}
            onClick={() => {
              setHo(item);
              setSearchState('add');
            }}
          >
            {item.dong} {item.ho}
          </div>
        ))}
      </div>
    );

  const renderDescription = () => (
    <div className="flex h-10 items-center justify-center">
      <div>최저</div>
      <div className="px-2 grid grid-cols-5 w-28 h-2 ">
        <div className="bg-yuppie bg-opacity-20 border-y-1 border-l-1 border-black"></div>
        <div className="bg-yuppie bg-opacity-40 border-y-1 border-l-1 border-black"></div>
        <div className="bg-yuppie bg-opacity-60 border-y-1 border-l-1 border-black"></div>
        <div className="bg-yuppie bg-opacity-80 border-y-1 border-l-1 border-black"></div>
        <div className="bg-yuppie bg-opacity-100 border-y-1 border-x-1 border-black"></div>
      </div>
      <div>최고</div>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment} afterLeave={resetValues}>
      <Dialog
        as="div"
        className="relative z-10 font-system"
        initialFocus={searchInputRef}
        onClose={() => setIsOpen(false)}
      >
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-system_medium leading-6 text-gray-900 flex items-center"
                >
                  <button className="text-gray-900" onClick={goBack}>
                    <AngleLeft className="w-5 inline-block" />{' '}
                    {!onAddProperty && '취득 예정'} {modalTitle}
                  </button>
                </Dialog.Title>
                {searchState === 'apt' && (
                  <>
                    <div className="flex rounded-full mt-6 px-4 py-2 gap-2 border-2 border-gray-800">
                      <SearchIcon className="w-4 text-gray-800" />
                      <input
                        ref={searchInputRef}
                        className="flex-1 text-gray-800 placeholder-gray-300 bg-transparent focus:outline-none"
                        placeholder="주소 검색"
                        onKeyUp={(e) => {
                          searchAptDebounce(e.currentTarget.value);
                        }}
                      />
                    </div>
                    <ul className="mt-2">
                      {(aptSearchResult as any)?.items?.map((item: any) => (
                        <li
                          key={`${item.key}_${item.complex_name}`}
                          className="appearance-none px-2 py-3 border-b border-gray-200 flex cursor-pointer"
                          onClick={() => {
                            setApt(item);
                            setSearchState('dong');
                          }}
                        >
                          <div className="flex-1">
                            <div>{item.complex_name}</div>
                            <div className="text-sm">
                              {item.old_address}
                              {item.road_name}
                            </div>
                          </div>
                          <PropertyBadge propertyType={item.property_type} />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {searchState === 'dong' && searchDong === true && (
                  <>
                    {renderSelectedApt(apt, null)}
                    <div className="pt-2 grid grid-cols-2 items-center cursor-pointer">
                      <div className="flex justify-center underline underline-offset-4	">
                        동선택
                      </div>
                      <div
                        className="flex justify-center"
                        onClick={() => setSearchDong(false)}
                      >
                        평선택
                      </div>
                    </div>
                    {renderDescription()}
                    {renderDong()}
                  </>
                )}
                {searchState === 'dong' && searchDong === false && (
                  <>
                    {renderSelectedApt(apt, null)}
                    <div className="pt-2 grid grid-cols-2 items-center cursor-pointer">
                      <div
                        className="flex justify-center"
                        onClick={() => setSearchDong(true)}
                      >
                        동선택
                      </div>
                      <div className="flex justify-center underline underline-offset-4">
                        평선택
                      </div>
                    </div>
                    <div className="flex h-10 items-center justify-center">
                      전용면적
                    </div>
                    <div className="grid grid-cols-1">
                      {(areaSearchResult as any)?.area_types?.map(
                        (_area: any) => (
                          <div
                            key={_area.net_leasable_area}
                            className="p-4 flex items-center justify-center cursor-pointer"
                            onClick={() => {
                              setDong(_area.net_leasable_area);
                              setSearchState('ho');
                            }}
                          >
                            {_area.net_leasable_area}m2 (
                            {(Number(_area.net_leasable_area) * 0.3025).toFixed(
                              2,
                            )}
                            평형) {_area.count} 세대{' '}
                          </div>
                        ),
                      )}
                    </div>
                  </>
                )}
                {searchState === 'ho' && (
                  <>
                    {renderSelectedApt(apt, dong)}
                    {renderDescription()}
                    {renderHo()}
                  </>
                )}
                {searchState === 'add' && (
                  <div className="flex flex-col items-center">
                    <PropertyImage
                      propertyType={apt.property_type}
                      className="w-16 mb-2"
                    />
                    <PropertyBadge propertyType={apt.property_type} />
                    <div className="mt-4">
                      {apt.complex_name} {ho.dong} {ho.ho}
                    </div>
                    <div className="text-sm">
                      {apt.old_address}
                      {apt.road_name}
                    </div>
                    <div className="mt-4 text-2xl">
                      공시지가 {(ho.official_price / 100000000).toFixed(1)}억
                    </div>
                    <div className="text-2xl">조정지역 대상입니다.</div>
                    {/* should_adjust */}
                    <div className="flex flex-col gap-2">
                      <div className="w-40 mt-4">
                        <input
                          type="radio"
                          name="ownership"
                          value="wholly_mine"
                          id="wholly_mine"
                          className="mr-2"
                          defaultChecked
                          onChange={(e) => {
                            setOwnership(e.currentTarget.value);
                            setShare('100');
                          }}
                        />
                        <label htmlFor="wholly_mine">단독명의</label>
                      </div>
                      <div className="w-50">
                        <input
                          type="radio"
                          name="ownership"
                          value="owned_with_spouse"
                          id="owned_with_spouse"
                          className="mr-2"
                          onChange={(e) => {
                            setOwnership(e.currentTarget.value);
                          }}
                        />
                        <label htmlFor="owned_with_spouse">
                          부부 공동 명의
                        </label>
                        <input
                          placeholder="내 지분율 (%)"
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          className="appearance-none border border-gray-300 ml-2 pl-2 w-24"
                          value={ownership === 'owned_with_spouse' ? share : ''}
                          onChange={(e) => {
                            if (
                              Number(e.currentTarget.value) < 0 ||
                              Number(e.currentTarget.value) > 100
                            ) {
                              alert('범위에서 벗어났습니다.');
                            } else {
                              setShare(e.currentTarget.value);
                            }
                          }}
                        />
                      </div>
                      <div className="w-40">
                        <input
                          type="radio"
                          name="ownership"
                          value="owned_with_other"
                          id="owned_with_other"
                          className="mr-2"
                          onChange={(e) => {
                            setOwnership(e.currentTarget.value);
                            setShare('');
                          }}
                        />
                        <label htmlFor="owned_with_other">그 외</label>
                        <input
                          placeholder="지분율 (%)"
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          className="appearance-none border border-gray-300 ml-2 pl-2 w-24"
                          value={ownership === 'etc' ? share : ''}
                          onChange={(e) => {
                            if (
                              Number(e.currentTarget.value) < 0 ||
                              Number(e.currentTarget.value) > 100
                            ) {
                              alert('범위에서 벗어났습니다.');
                            } else {
                              setShare(e.currentTarget.value);
                            }
                          }}
                        />
                      </div>
                    </div>
                    {apt.property_type === 'officetel' && (
                      <>
                        <div className="w-40 mt-4">
                          <input
                            type="radio"
                            name="kindOf"
                            value="house"
                            id="house"
                            checked={kindOf === 'house'}
                            className="mr-2"
                            onChange={(e) => setKindOf(e.currentTarget.value)}
                          />
                          <label htmlFor="house">주거용</label>
                        </div>
                        <div className="w-40">
                          <input
                            type="radio"
                            name="kindOf"
                            value="building"
                            id="building"
                            checked={kindOf === 'building'}
                            className="mr-2"
                            onChange={(e) => setKindOf(e.currentTarget.value)}
                          />
                          <label htmlFor="building">영업용</label>
                        </div>
                      </>
                    )}

                    {onAddProperty ? (
                      <button
                        className="mt-4 px-2 py-1 bg-primary text-white text-sm"
                        onClick={() => {
                          setIsOpen(false);
                          onAddProperty({
                            share: Number(share) / 100,
                            ownership,
                            kindOf,
                            pk: ho.apart_pk,
                          });
                        }}
                      >
                        + 내 보유 부동산 목록에 담기
                      </button>
                    ) : (
                      <>
                        <div className="border-b border-gray-900 py-4 w-80">
                          <label className="flex items-center justify-between">
                            <div className="text-primary font-system_bold w-24">
                              예상 취득 일자:
                            </div>
                            <DatePicker
                              wrapperClassName="relative flex-1 text-center"
                              locale={ko}
                              selected={acquisitionDate}
                              onChange={(date: Date) =>
                                setAcquisitionDate(date)
                              }
                              dateFormat="yyyy년 M월 d일"
                              dateFormatCalendar=" "
                              showMonthDropdown
                              showYearDropdown
                            />
                            <CalendarIcon className="w-6 mr-3" />
                          </label>
                        </div>
                        <div className="border-b border-gray-900 py-4 w-80">
                          <label className="flex items-center justify-between">
                            <div className="text-primary font-bold w-24">
                              예상 취득 금액:
                            </div>
                            <input
                              type="number"
                              className="appearance-none w-40 text-right"
                              value={acquiredPrice}
                              onChange={(e) =>
                                setAcquiredPrice(Number(e.currentTarget.value))
                              }
                            />
                          </label>
                          <div>
                            <p className="text-right text-gray-400">
                              {formatPrice(acquiredPrice)}
                            </p>
                          </div>
                        </div>
                        <button
                          className="mt-4 px-2 py-1 bg-primary text-white text-sm"
                          onClick={() => {
                            setIsOpen(false);
                            setAcqProperty &&
                              setAcqProperty({
                                share: Number(share),
                                ownershipType: ownership,
                                kindOf: kindOf,
                                acquisitionPrice: acquiredPrice,
                                acquisitionDatetime: format(
                                  acquisitionDate,
                                  'yyyy-MM-dd',
                                ).toString(),
                                property: ho,
                                complex: apt.complex_name,
                              });
                          }}
                        >
                          <a> 취득세 계산하기</a>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SearchProperty;
