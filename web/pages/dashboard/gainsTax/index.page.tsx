import ProtectedRoute from '@/components/ProtectedRoute';
import GainsTaxMain from './gainsTaxMain';

const GainsTaxPage = () => {

    return (
        <ProtectedRoute>
            <div className="max-w-[1200px] min-w-[1200px] flex m-auto">
                <GainsTaxMain />
            </div>
        </ProtectedRoute>
    );
};

export default GainsTaxPage