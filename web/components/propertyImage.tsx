import Apartment from '@/public/apartment.svg';
import Officetel from '@/public/officetel.svg';

const PropertyImage = ({
  propertyType,
  className = '',
}: {
  propertyType: string;
  className?: string;
}) => {
  return propertyType === 'apartment' ? (
    <Apartment className={className} />
  ) : (
    <Officetel className={className} />
  );
};

export default PropertyImage;
