import ProtectedRoute from '@/components/ProtectedRoute';
import EditUser from './editUser';

const MypagePage = () => {
  return (
    <ProtectedRoute>
      <div className='min-w-[1200px] h-full'>
        <div className="max-w-7xl mx-auto flex px-12 py-8 h-full">
          <EditUser />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MypagePage;
