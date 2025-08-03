/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';

const DataTable = ({
  rows,
  columns,
  rowHeight = 52,
  getRowHeight,
  checkboxSelection = false,
  onRowSelectionModelChange,
  columnVisibilityModel,
  getRowId,
  pageSizeOptions = [10, 25, 50, 100],
  noRowsLabel = 'No data available',
  sx,
  loading,
}) => {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSizeOptions[0],
    page: 0,
  });

  return (
    <Box 
    sx={{ }}>
      <DataGrid
        sx={{ bgcolor: '#fff', ...sx }}
        rows={rows}
        columns={columns}
        autoHeight
        loading={loading}
        getRowId={getRowId}
        rowHeight={rowHeight}
        getRowHeight={getRowHeight}
        checkboxSelection={checkboxSelection}
        onRowSelectionModelChange={onRowSelectionModelChange}
        columnVisibilityModel={columnVisibilityModel}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={pageSizeOptions}
        localeText={{
          noRowsLabel,
          footerRowSelected: (count) =>
            `${count.toLocaleString()} Selected`,
        }}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnSorting
        disableColumnMenu
      />
    </Box>
  );
};

export default DataTable;
