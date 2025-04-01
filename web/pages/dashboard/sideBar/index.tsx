import ProfileCard from './profileCard';
import PropertyList from '../propertyList';

const SideBar = () => {
  return (
    <div className="bg-gray-100 rounded-r-3xl w-1/5 min-w-[290px] p-8 h-full flex flex-col items-center shadow-lg">
      <ProfileCard />
      <PropertyList />
    </div>
  );
};

export default SideBar;
