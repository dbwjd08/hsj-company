import {
  GetOfficialPriceOfficialPricePkGetResponse,
  GetTradeHistoryTradeHistoryPkGetResponse,
  GetAdjustedAreaHistoryAdjustedAreaHistoryComplexComplexPkAllGetResponse,
} from '@/src/api/yuppieComponents';
import { useTable, useGlobalFilter, useSortBy } from 'react-table';
import { useMemo } from 'react';
import PropertyTableSearch from './propertyTableSearch';
import { formatPrice } from '@/lib/utils';
import { PROPERTY_TABLE_COL_DATA } from 'constants/tableData';

const PropertyTable = ({
  tableType,
  officialData,
  tradeData,
  adjustData,
}: {
  tableType: number;
  officialData: GetOfficialPriceOfficialPricePkGetResponse;
  tradeData: GetTradeHistoryTradeHistoryPkGetResponse;
  adjustData: GetAdjustedAreaHistoryAdjustedAreaHistoryComplexComplexPkAllGetResponse;
}) => {
  const columns = useMemo(() => {
    return PROPERTY_TABLE_COL_DATA[tableType - 1];
  }, []);

  const data = useMemo(() => {
    let new_data: any;
    if (tableType === 1) {
      new_data = officialData.map((value) => {
        return {
          년도: value.reference_year,
          공시지가: formatPrice(value.price),
        };
      });
    } else if (tableType === 2) {
      new_data = tradeData.map((value) => {
        return {
          거래일: value.reference_date,
          거래금액: formatPrice(value.price),
          면적: value.net_leasable_area,
          층: value.floor,
        };
      });
    } else {
      new_data = adjustData.map((value) => {
        return {
          지정일: value.reference_date,
          조정지역여부: value.should_adjust == 1 ? '조정대상' : '비조정대상',
        };
      });
    }
    return new_data;
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id:
              tableType === 1 ? '년도' : tableType === 2 ? '거래일' : '지정일',
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useSortBy,
  );

  return (
    <>
      <PropertyTableSearch onSubmit={setGlobalFilter} />
      <table {...getTableProps()} className="w-full text-center border-t-[2px]">
        <thead className=" h-10 text-blue-800 text-center  bg-blue-50 p-5 border-b-[2px] ">
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="text-center">
          {rows.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()} className="text-center border-b-[1px]">
                {row.cells.map((cell) => (
                  // eslint-disable-next-line react/jsx-key
                  <td
                    {...cell.getCellProps()}
                    className="text-center border-r-[1px]"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default PropertyTable;
