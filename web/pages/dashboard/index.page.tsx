import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardMain from './dashboardMain';
import SideBar from './sideBar';
import { useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { tokenState } from '@/lib/auth';
import { currentPropertyState } from '@/lib/store';
import { useGetPropertiesUniversesIdPropertiesGet } from '@/src/api/yuppieComponents';
const DashboardPage = () => {
  const [currentProperty, setCurrentProperty] =
    useRecoilState(currentPropertyState);
  const { default_universe_id } = useRecoilValue(tokenState);

  const { data } = useGetPropertiesUniversesIdPropertiesGet({
    pathParams: {
      id: default_universe_id!,
    },
  });

  useEffect(() => {
    if (data) {
      setCurrentProperty(data[0]);
    }
  }, [data, setCurrentProperty]);

  return (
    <ProtectedRoute>
      <div className="flex h-full w-full min-w-[1200px] overflow-hidden">
        <SideBar />
        <DashboardMain />
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
