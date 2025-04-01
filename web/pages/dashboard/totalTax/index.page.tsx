import ProtectedRoute from "@/components/ProtectedRoute";
import { useRecoilValue } from "recoil";
import { tokenState, userState } from "@/lib/auth";
import { useGetPropertiesUniversesIdPropertiesGet } from "@/src/api/yuppieComponents";
import TotalTaxMain from "./totalTaxMain";

const TotalTax = () => {
    const { default_universe_id, session_id } = useRecoilValue(tokenState);

    const { data: properties } = useGetPropertiesUniversesIdPropertiesGet({
        pathParams: {
            id: default_universe_id!,
        },
    });


    if (properties)
        return (
            <ProtectedRoute>
                <TotalTaxMain properties={properties} />
            </ProtectedRoute>
        );
    else
        return (
            <div>

            </div>)
};

export default TotalTax;
