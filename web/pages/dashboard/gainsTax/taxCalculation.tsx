import { useEffect, useState } from "react";
import OneHouseTax from "./oneHouseTax";
import DefaultHouseTax from "./defaultHouseTax";
import { useAmI1householderBeneficialMvpKrBeforeCapitalGainsTaxFor1householderPost, useGetPropertiesUniversesIdPropertiesGet, useUpdatePropertyUniversesIdPropertiesPkPut } from "@/src/api/yuppieComponents";
import { useRecoilValue } from "recoil";
import { tokenState } from "@/lib/auth";
import CheckTemp from "./checkTemp";

export const TaxCalculation = ({ Info, sellingPrice, setSellingPrice, }: { Info: any; sellingPrice: number; setSellingPrice: React.Dispatch<React.SetStateAction<number>>; }) => {

  const { default_universe_id, session_id } = useRecoilValue(tokenState);

  const { data: properties, refetch: refetchProperties } =
    useGetPropertiesUniversesIdPropertiesGet({
      pathParams: {
        id: default_universe_id!,
      },
    });

  const updateProperty = useUpdatePropertyUniversesIdPropertiesPkPut();

  const onUpdateProperty = async ({
    pk,
    acquisitionDate,
    livingYears,
  }: {
    pk: string;
    acquisitionDate: string;
    livingYears?: number;
  }) => {
    await updateProperty.mutateAsync({
      body: {
        sessionId: session_id,
        acquisitionDateTime: acquisitionDate,
        livingYears: livingYears
      },
      pathParams: {
        id: default_universe_id!,
        pk,
      },
    });
    refetchProperties();
  };

  const get1houseHoulder = useAmI1householderBeneficialMvpKrBeforeCapitalGainsTaxFor1householderPost();

  const onGet1houseHoulder = async () => {
    return await get1houseHoulder.mutateAsync({
      body: {
        sessionId: session_id,
        house: {
          pk: Info.pk,
          complex: Info.complex,
          dong: Info.dong,
          ho: Info.ho,
          kindOf: Info.kindOf,
          share: Number(Info.share),
          netLeasableArea: Number(Info.netLeasableArea),
          ownershipType: Info.ownershipType,
          officialPrice: Number(Info.officialPrice),
          movingInDate: Info.movingInDate + ' 00:00:00.000',
          livingYears: Number(Info.livingYears),
          stillLiving: Info.stillLiving,
          acquisitionDatetime: Info.acquisitionDateTime + ' 00:00:00.000',
          acquisitionPrice: Number(Info.acquisitionPrice)
        },
      },
    })
      .then((res) => {
        setOneHouseType(res);
      })
  }

  const [oneHouseType, setOneHouseType] = useState<any>();
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    onGet1houseHoulder();
  }, [Info]);

  if (!oneHouseType) return (<div></div>)
  else if (Info.numOfHousesSellerHas == 1 && (oneHouseType.capital_gains_tax_chart_type == 'as_time_goes_by_i_will_be_nobless' || oneHouseType.capital_gains_tax_chart_type == 'move_right_now'))
    return (<OneHouseTax Info={Info} sellingPrice={sellingPrice} setSellingPrice={setSellingPrice} chartType={oneHouseType.capital_gains_tax_chart_type} taxExempted={oneHouseType.am_i_1householder_tax_exempted} longterm={oneHouseType.am_i_special_deduction_for_longterm_holder} />)
  else if (Info.numOfHousesSellerHas == 2)
    return (<CheckTemp properties={properties ?? []} onUpdateProperty={onUpdateProperty} isOpen={true} setIsOpen={setIsOpen} Info={Info} sellingPrice={sellingPrice} setSellingPrice={setSellingPrice} />)
  else
    return (<DefaultHouseTax Info={Info} sellingPrice={sellingPrice} setSellingPrice={setSellingPrice} />)
}

export default TaxCalculation