import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { SideBarModule } from '@ag-grid-enterprise/side-bar';

// Register AG Grid Modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  SetFilterModule,
  MenuModule,
  ColumnsToolPanelModule,
  SideBarModule
]);

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Box, Text, Paper, Button, Menu, ActionIcon, Loader } from '@mantine/core';
import { AgGridReact } from 'ag-grid-react';
import { IconFilter, IconColumns, IconEye } from '@tabler/icons-react';
import { usePatient } from '../../contexts/PatientContext';
import { saveGridState, loadGridState } from '../../utils/gridUtils';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { SAVED_VIEWS, getFilterModelForView } from '../../utils/gridViews';

// Add this CSS to your global styles or component
const gridStyles = {
  '.ag-theme-material': {
    '--ag-font-family': 'var(--mantine-font-family)',
    '--ag-font-size': '14px',
    '--ag-header-height': '48px',
    '--ag-header-background-color': 'var(--mantine-color-gray-0)',
    '--ag-header-foreground-color': 'var(--mantine-color-dark-9)',
    '--ag-header-column-separator-display': 'block',
    '--ag-header-column-separator-color': 'var(--mantine-color-gray-3)',
    '--ag-row-hover-color': 'var(--mantine-color-gray-0)',
    '--ag-selected-row-background-color': 'var(--mantine-color-blue-0)',
    '--ag-odd-row-background-color': 'transparent',
    '--ag-row-border-color': 'var(--mantine-color-gray-2)',
    '--ag-cell-horizontal-padding': '16px',
    '--ag-borders': 'none',
    'border': '1px solid var(--mantine-color-gray-3)',
    'borderRadius': 'var(--mantine-radius-md)',
  },
  '.ag-theme-material .ag-header-cell': {
    fontWeight: 600,
  },
  '.ag-theme-material .ag-header-cell-text': {
    color: 'var(--mantine-color-dark-9)',
  },
  '.ag-theme-material .ag-cell': {
    display: 'flex',
    alignItems: 'center',
  },
  '.ag-theme-material .ag-row': {
    borderBottom: '1px solid var(--mantine-color-gray-2)',
    cursor: 'pointer',
  },
  '.ag-theme-material .ag-row-selected': {
    backgroundColor: 'var(--mantine-color-blue-0)',
  }
};

export default function PatientList() {
  const { patients, loading: patientsLoading } = usePatient();
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viewId = searchParams.get('view');
  const initialFilterApplied = useRef(false);

  // Debug logs
  console.log('PatientList render:', { patients, patientsLoading, rowData });

  useEffect(() => {
    if (patients?.length) {
      console.log('Raw patients data:', patients);
      const formattedData = patients.map(patient => ({
        name: `${patient.firstName} ${patient.lastName}`,
        age: patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : '',
        riskLevel: patient.riskLevel || 'low',
        lastVisit: patient.lastVisit || '',
        careGaps: patient.careGaps?.length || 0,
        provider: patient.provider || '',
        id: patient.id
      }));
      console.log('Formatted grid data:', formattedData);
      setRowData(formattedData);
    } else {
      console.log('No patients data available:', patients);
    }
  }, [patients]);

  const [columnDefs] = useState([
    { 
      field: 'name', 
      headerName: 'Patient Name',
      filter: true,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      flex: 2,
      minWidth: 200,
      cellStyle: { fontWeight: 500 }
    },
    { 
      field: 'age', 
      headerName: 'Age',
      filter: 'agNumberColumnFilter',
      width: 100,
      type: 'numericColumn',
      cellStyle: { justifyContent: 'center' }
    },
    { 
      field: 'riskLevel', 
      headerName: 'Risk Level',
      filter: true,
      cellRenderer: RiskLevelRenderer,
      width: 130,
      cellStyle: { display: 'flex', alignItems: 'center' },
      filterParams: {
        values: ['low', 'medium', 'high']
      }
    },
    { 
      field: 'lastVisit', 
      headerName: 'Last Visit',
      filter: 'agDateColumnFilter',
      width: 150,
      valueFormatter: params => 
        params.value ? new Date(params.value).toLocaleDateString() : ''
    },
    { 
      field: 'careGaps', 
      headerName: 'Care Gaps',
      filter: 'agNumberColumnFilter',
      width: 120,
      type: 'numericColumn',
      cellStyle: params => ({
        color: params.value > 0 ? '#fa5252' : 'inherit',
        fontWeight: params.value > 0 ? 500 : 400,
        justifyContent: 'center'
      })
    },
    { 
      field: 'provider', 
      headerName: 'Provider',
      filter: true,
      flex: 1,
      minWidth: 150
    }
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true,
    suppressMovable: true,
    suppressMenu: true
  }), []);

  const onGridReady = useCallback((params) => {
    console.log('Grid ready:', params);
    const savedState = loadGridState('patientsGrid');
    if (savedState) {
      gridRef.current.columnApi.applyColumnState({ state: savedState });
    }
    
    // Apply initial filter if view parameter exists
    if (viewId && !initialFilterApplied.current) {
      const filterModel = getFilterModelForView(viewId);
      params.api.setFilterModel(filterModel);
      initialFilterApplied.current = true;
    }
    
    params.api.sizeColumnsToFit();
  }, [viewId]);

  const saveCurrentView = () => {
    const columnState = gridRef.current.columnApi.getColumnState();
    saveGridState('patientsGrid', columnState);
  };

  const applyPresetFilter = useCallback((preset) => {
    if (gridRef.current?.api) {
      const filterModel = getFilterModelForView(preset);
      gridRef.current.api.setFilterModel(filterModel);
    }
  }, []);

  const onRowClicked = useCallback((event) => {
    navigate(`/patients/${event.data.id}`);
  }, [navigate]);

  if (patientsLoading) {
    return (
      <Paper p="md" radius="md" style={{ height: 'calc(100vh - 180px)' }}>
        <Group position="center" style={{ height: '100%' }}>
          <Loader size="xl" />
        </Group>
      </Paper>
    );
  }

  return (
    <Paper p="xl" radius="md" style={{ height: 'calc(100vh - 180px)' }}>
      <Group position="apart" mb="xl">
        <Text size="xl" weight={700} color="dark.9">
          Patient List ({rowData.length})
        </Text>
        <Group spacing="sm">
          <Menu position="bottom-end" shadow="md">
            <Menu.Target>
              <Button 
                variant="light" 
                leftIcon={<IconFilter size={16} />}
                size="sm"
              >
                Filters
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Preset Filters</Menu.Label>
              <Menu.Item onClick={() => applyPresetFilter('highRisk')}>
                High Risk Patients
              </Menu.Item>
              <Menu.Item onClick={() => applyPresetFilter('recentVisits')}>
                Recent Visits
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Button 
            variant="light"
            leftIcon={<IconColumns size={16} />}
            onClick={() => gridRef.current.api.showToolPanel()}
            size="sm"
          >
            Columns
          </Button>
          
          <Button 
            variant="subtle" 
            onClick={saveCurrentView}
            size="sm"
          >
            Save View
          </Button>
        </Group>
      </Group>

      <Box 
        className="ag-theme-material" 
        sx={{
          height: 'calc(100% - 60px)',
          width: '100%',
          ...gridStyles
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="multiple"
          suppressRowClickSelection={false}
          onGridReady={onGridReady}
          onRowClicked={onRowClicked}
          sideBar={{
            toolPanels: ['columns'],
            defaultToolPanel: ''
          }}
          domLayout='autoHeight'
          enableBrowserTooltips={true}
          rowHeight={48}
          headerHeight={48}
          pagination={true}
          paginationPageSize={20}
          animateRows={true}
          suppressCellFocus={true}
        />
      </Box>
    </Paper>
  );
}

// Helper function to calculate age
function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Update the RiskLevelRenderer component
const RiskLevelRenderer = ({ value }) => {
  const getStyle = () => {
    switch(value?.toLowerCase()) {
      case 'high':
        return {
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: '1px solid #fa5252'
        };
      case 'medium':
        return {
          backgroundColor: '#ffd43b',
          color: '#212529',
          border: '1px solid #fab005'
        };
      case 'low':
        return {
          backgroundColor: '#51cf66',
          color: 'white',
          border: '1px solid #40c057'
        };
      default:
        return {
          backgroundColor: '#868e96',
          color: 'white',
          border: '1px solid #495057'
        };
    }
  };

  return value ? (
    <Box
      sx={(theme) => ({
        ...getStyle(),
        padding: '4px 12px',
        borderRadius: theme.radius.sm,
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,
        display: 'inline-block',
        textTransform: 'capitalize'
      })}
    >
      {value}
    </Box>
  ) : null;
}; 