import {
  TableContainer,
  Show,
  Hide,
  Tbody,
  Table,
  type TableProps,
  Tr,
  Td,
  Thead,
  Th,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { MobileDataTable } from './MobileDataTable';
import { type ColumnItem, type DataItem } from './types';

/**
 * Example
 *
 * data = [{ name: 'Eric', age: 21 }]
 * columns = [
 *  { title: 'Name', selector: (row) => row.name },
 *  { title: 'Age', selector: (row) => row.age }
 * ]
 */

interface DataTableProps extends TableProps {
  showColumns?: boolean;
  columns: ColumnItem[];
  data: DataItem[];
  loading?: boolean;
}

export const DataTable = ({
  showColumns = true,
  columns = [],
  data = [],
  loading = false,
  ...props
}: DataTableProps) => {
  const navigate = useNavigate();

  const getDesktopTableBody = () => {
    if (loading) {
      return Array.from([1, 2, 3]).map((_, index) => (
        <Tr key={index}>
          {columns.map((column) => (
            <Td key={`${column.title}-${index}`} {...column.tdProps}>
              {column.loadingElement}
            </Td>
          ))}
        </Tr>
      ));
    }

    return data.map((drop) => (
      <Tr
        key={drop.id}
        _hover={
          (drop.href as string | undefined)
            ? {
                cursor: 'pointer',
                background: 'gray.50',
              }
            : {}
        }
        onClick={
          (drop.href as string | undefined)
            ? () => {
                navigate(drop.href as string);
              }
            : undefined
        }
      >
        {columns.map((column) => (
          <Td key={`${column.title}-${drop.id}`} {...column.tdProps}>
            {column.selector(drop)}
          </Td>
        ))}
      </Tr>
    ));
  };

  return (
    <>
      {/* Desktop Table */}
      <Show above="md">
        <TableContainer>
          <Table {...props}>
            {showColumns && (
              <Thead>
                <Tr>
                  {columns.map((col) => (
                    <Th key={col.title} fontFamily="body" {...col.thProps}>
                      {col.title}
                    </Th>
                  ))}
                </Tr>
              </Thead>
            )}
            <Tbody>{getDesktopTableBody()}</Tbody>
          </Table>
        </TableContainer>
      </Show>

      {/* Mobile table */}
      <Hide above="md">
        <MobileDataTable columns={columns} data={data} {...props} />
      </Hide>
    </>
  );
};
