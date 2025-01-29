import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@galaxy/shared/config/firebase';
import { useUser } from '../../contexts/UserContext';
import { Box, Text, Loader, Paper, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { AgGridReact } from 'ag-grid-react';

// Updated AG Grid style imports
import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-material.min.css';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Custom AG Grid theme to match Mantine
  const gridTheme = {
    '--ag-font-family': theme.fontFamily,
    '--ag-font-size': '14px',
    '--ag-background-color': isDark ? theme.colors.dark[7] : theme.white,
    '--ag-header-background-color': isDark ? theme.colors.dark[8] : theme.colors.gray[0],
    '--ag-odd-row-background-color': isDark ? theme.colors.dark[6] : theme.colors.gray[0],
    '--ag-row-hover-color': isDark ? theme.colors.dark[5] : theme.colors.gray[1],
    '--ag-selected-row-background-color': isDark ? theme.colors.blue[9] : theme.colors.blue[1],
    '--ag-header-foreground-color': isDark ? theme.colors.gray[4] : theme.colors.gray[7],
    '--ag-foreground-color': isDark ? theme.white : theme.colors.dark[9],
    '--ag-border-color': isDark ? theme.colors.dark[4] : theme.colors.gray[3],
    '--ag-row-border-color': isDark ? theme.colors.dark[4] : theme.colors.gray[3],
    '--ag-cell-horizontal-padding': theme.spacing.sm,
    '--ag-header-column-separator-display': 'block',
    '--ag-header-column-separator-color': isDark ? theme.colors.dark[4] : theme.colors.gray[3],
    '--ag-header-column-separator-height': '100%',
    '--ag-header-column-resize-handle-color': theme.colors.blue[5],
    '--ag-input-border-color': isDark ? theme.colors.dark[4] : theme.colors.gray[4],
    '--ag-input-background-color': isDark ? theme.colors.dark[6] : theme.white,
    '--ag-input-focus-box-shadow': `0 0 2px ${theme.colors.blue[5]}`,
    '--ag-range-selection-border-color': theme.colors.blue[5],
    '--ag-range-selection-background-color': isDark ? 
      theme.fn.rgba(theme.colors.blue[9], 0.2) : 
      theme.fn.rgba(theme.colors.blue[1], 0.2),
    '--ag-scrollbar-background': 'transparent',
    '--ag-scrollbar-thumb-color': isDark ? theme.colors.dark[3] : theme.colors.gray[3],
    '--ag-scrollbar-track-color': 'transparent',
    '--ag-borders': 'none',
    '--ag-row-border-style': 'solid',
    '--ag-row-border-width': '1px',
    '--ag-border-radius': theme.radius.sm,
    '--ag-grid-size': '6px',
    '--ag-list-item-height': '40px',
  };

  // Column Definitions
  const columnDefs = [
    { 
      field: 'name',
      headerName: 'Patient Name',
      valueGetter: (params) => 
        `${params.data.firstName || ''} ${params.data.lastName || ''}`,
      sortable: true,
      filter: true,
      flex: 1,
      cellStyle: { fontWeight: 500 }
    },
    { 
      field: 'dateOfBirth', 
      headerName: 'Date of Birth',
      sortable: true,
      filter: true,
      width: 130
    },
    { 
      field: 'gender',
      sortable: true,
      filter: true,
      width: 120
    },
    { 
      field: 'contact',
      valueGetter: (params) => 
        params.data.phone || params.data.email || 'N/A',
      sortable: true,
      filter: true,
      flex: 1
    },
    { 
      field: 'lastVisit',
      headerName: 'Last Visit',
      valueFormatter: (params) => 
        params.value ? new Date(params.value).toLocaleDateString() : 'N/A',
      sortable: true,
      filter: true,
      width: 130
    },
    {
      field: 'riskLevel',
      headerName: 'Risk Level',
      cellRenderer: (params) => {
        const colors = {
          high: isDark ? theme.colors.red[6] : theme.colors.red[7],
          medium: isDark ? theme.colors.yellow[6] : theme.colors.yellow[7],
          low: isDark ? theme.colors.green[6] : theme.colors.green[7]
        };
        const bgColors = {
          high: isDark ? theme.fn.rgba(theme.colors.red[9], 0.2) : theme.fn.rgba(theme.colors.red[0], 0.5),
          medium: isDark ? theme.fn.rgba(theme.colors.yellow[9], 0.2) : theme.fn.rgba(theme.colors.yellow[0], 0.5),
          low: isDark ? theme.fn.rgba(theme.colors.green[9], 0.2) : theme.fn.rgba(theme.colors.green[0], 0.5)
        };
        const color = colors[params.value?.toLowerCase()] || theme.colors.gray[5];
        const bgColor = bgColors[params.value?.toLowerCase()] || theme.fn.rgba(theme.colors.gray[5], 0.1);
        return `<div style="
          color: ${color}; 
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
          background: ${bgColor};
          display: inline-block;
        ">${params.value || 'Unknown'}</div>`;
      },
      sortable: true,
      filter: true,
      width: 130,
      cellStyle: { display: 'flex', alignItems: 'center' }
    }
  ];

  // Default Column Definition
  const defaultColDef = {
    resizable: true,
    minWidth: 100,
    flex: 1,
    suppressSizeToFit: false,
    filter: 'agTextColumnFilter',
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true
    }
  };

  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true);
        const patientsRef = collection(db, 'patients');
        const q = query(
          patientsRef,
          orderBy('lastName'),
          limit(100)
        );

        const querySnapshot = await getDocs(q);
        const patientsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setPatients(patientsList);
        setError(null);
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchPatients();
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center' }} py={10}>
        <Loader size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center' }} p={4}>
        <Text color="red">{error}</Text>
      </Box>
    );
  }

  return (
    <Paper p="md" radius="md" style={{ height: 'calc(100vh - 180px)' }}>
      <div 
        className="ag-theme-material"
        style={{ 
          width: '100%',
          height: '100%',
          ...gridTheme
        }}
      >
        <AgGridReact
          rowData={patients}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowSelection="single"
          pagination={true}
          paginationPageSize={20}
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          onGridReady={(params) => {
            params.api.sizeColumnsToFit();
            window.addEventListener('resize', () => {
              setTimeout(() => {
                params.api.sizeColumnsToFit();
              });
            });
          }}
          onFirstDataRendered={(params) => {
            params.api.sizeColumnsToFit();
          }}
          domLayout="autoHeight"
          suppressHorizontalScroll={true}
          suppressScrollOnNewData={true}
          overlayNoRowsTemplate={
            `<div style="text-align: center; color: ${isDark ? theme.colors.gray[4] : theme.colors.gray[6]}">
              No patients found
            </div>`
          }
          loadingOverlayComponent={
            `<div style="text-align: center; color: ${isDark ? theme.colors.gray[4] : theme.colors.gray[6]}">
              Loading patients...
            </div>`
          }
          rowHeight={48}
          headerHeight={48}
          suppressMovableColumns={true}
          suppressCellFocus={true}
          tooltipShowDelay={0}
          tooltipHideDelay={2000}
        />
      </div>
    </Paper>
  );
} 