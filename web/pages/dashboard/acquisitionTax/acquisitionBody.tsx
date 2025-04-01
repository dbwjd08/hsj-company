import { Tab } from '@headlessui/react';
import tw from 'twin.macro';
import AcquisitionTaxDetail from './acquisitionTaxDetail';
import AcquisitionPropertyDetail from './acquisitionPropertyDetail';
const AcquisitionBody = () => {
  const styles = {
    tab: tw`min-w-[10rem] px-7 py-2 focus:outline-none rounded-t-3xl bg-gray-100 text-xl text-gray-800 font-medium [&[data-headlessui-state='selected']]:bg-blue-100 [&[data-headlessui-state='selected']]:text-blue-800 [&[data-headlessui-state='selected']]:font-semibold`,
    tabPanel: tw`h-full bg-gray-100 p-6 focus:outline-none rounded-b-3xl rounded-tr-3xl`,
  };
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-1 h-[2.5rem] mb-[-1.3rem]">
        <Tab key="tab-1" css={styles.tab}>
          취득세
        </Tab>
        <Tab key="tab-2" css={styles.tab}>
          취득 후 보유세
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel key="panel-1" css={styles.tabPanel}>
          <AcquisitionTaxDetail />
        </Tab.Panel>
        <Tab.Panel key="panel-2" css={styles.tabPanel}>
          <AcquisitionPropertyDetail />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default AcquisitionBody;
