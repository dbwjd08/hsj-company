const PropertyBadge = ({ propertyType }: { propertyType: string }) => (
  <div className="flex items-center justify-center w-14">
    <span className="rounded-full border border-violet-400 text-xs px-1 py-px">
      {propertyType === 'apartment' ? '아파트' : '오피스텔'}
    </span>
  </div>
);

export default PropertyBadge;
