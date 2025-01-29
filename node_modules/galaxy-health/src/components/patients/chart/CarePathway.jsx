import React, { useMemo } from 'react';
import ReactFlow, { 
  Handle, 
  Position, 
  MarkerType,
  Background,
  Controls 
} from 'reactflow';
import { Paper, Title, Text, Badge, Group } from '@mantine/core';
import 'reactflow/dist/style.css';

// Custom node component for pathway steps
const PathwayNode = ({ data }) => {
  const getNodeStyle = (type) => {
    switch(type) {
      case 'condition':
        return {
          background: '#e03131',
          color: 'white',
          border: '2px solid #c92a2a'
        };
      case 'current':
        return {
          background: '#228be6',
          color: 'white',
          border: '2px solid #1c7ed6'
        };
      case 'recommended':
        return {
          background: '#40c057',
          color: 'white',
          border: '2px solid #37b24d'
        };
      case 'alternative':
        return {
          background: '#fab005',
          color: 'white',
          border: '2px solid #f59f00'
        };
      default:
        return {
          background: '#868e96',
          color: 'white',
          border: '2px solid #495057'
        };
    }
  };

  return (
    <div
      style={{
        padding: '12px 20px',
        borderRadius: '8px',
        minWidth: '180px',
        textAlign: 'center',
        ...getNodeStyle(data.type)
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div>
        <Text size="sm" weight={500}>{data.label}</Text>
        {data.severity && (
          <Badge size="sm" variant="filled" color="red">
            {data.severity}
          </Badge>
        )}
        {data.probability && (
          <Badge size="sm" variant="light" color={data.type === 'current' ? 'blue' : 'gray'}>
            {Math.round(data.probability * 100)}% probability
          </Badge>
        )}
        {data.details && (
          <Text size="xs" color="gray.2" mt={4}>
            {data.details}
          </Text>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

const nodeTypes = {
  pathway: PathwayNode
};

const CarePathway = ({ patient }) => {
  // Generate pathway data based on patient conditions
  const { nodes, edges } = useMemo(() => {
    const conditions = [
      {
        id: 'diabetes',
        name: 'Type 2 Diabetes',
        severity: 'Uncontrolled',
        actions: [
          {
            id: 'diabetes-med',
            label: 'Medication Adjustment',
            type: 'recommended',
            probability: 0.85,
            details: 'Increase Metformin to 1000mg BID',
            outcomes: [{
              id: 'diabetes-outcome',
              label: 'Target HbA1c',
              probability: 0.75,
              details: 'HbA1c < 7.0%'
            }]
          },
          {
            id: 'diabetes-lifestyle',
            label: 'Lifestyle Program',
            type: 'alternative',
            probability: 0.65,
            details: 'Diet & Exercise Plan',
            outcomes: [{
              id: 'diabetes-outcome',
              label: 'Target HbA1c',
              probability: 0.75,
              details: 'HbA1c < 7.0%'
            }]
          }
        ]
      },
      {
        id: 'hypertension',
        name: 'Hypertension',
        severity: 'Stage 2',
        actions: [
          {
            id: 'htn-med',
            label: 'Add ACE Inhibitor',
            type: 'recommended',
            probability: 0.9,
            details: 'Start Lisinopril 10mg daily',
            outcomes: [{
              id: 'htn-outcome',
              label: 'BP Control',
              probability: 0.8,
              details: 'BP < 130/80'
            }]
          }
        ]
      }
    ];

    let nodes = [];
    let edges = [];
    let yOffset = 0;

    conditions.forEach((condition, index) => {
      const baseY = index * 200;
      
      // Add condition node
      nodes.push({
        id: condition.id,
        type: 'pathway',
        position: { x: 50, y: baseY },
        data: { 
          label: condition.name,
          type: 'condition',
          severity: condition.severity
        }
      });

      // Add action nodes
      condition.actions.forEach((action, actionIndex) => {
        const actionY = baseY + (actionIndex * 100) - (condition.actions.length - 1) * 50;
        
        nodes.push({
          id: action.id,
          type: 'pathway',
          position: { x: 300, y: actionY },
          data: { 
            label: action.label,
            type: action.type,
            probability: action.probability,
            details: action.details
          }
        });

        edges.push({
          id: `${condition.id}-${action.id}`,
          source: condition.id,
          target: action.id,
          type: 'smoothstep',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: action.type === 'recommended' ? '#40c057' : '#fab005' }
        });

        // Add outcome nodes
        action.outcomes.forEach(outcome => {
          const outcomeNode = {
            id: `${action.id}-${outcome.id}`,
            type: 'pathway',
            position: { x: 550, y: actionY },
            data: { 
              label: outcome.label,
              type: 'recommended',
              probability: outcome.probability,
              details: outcome.details
            }
          };

          if (!nodes.find(n => n.id === outcomeNode.id)) {
            nodes.push(outcomeNode);
          }

          edges.push({
            id: `${action.id}-${outcome.id}`,
            source: action.id,
            target: `${action.id}-${outcome.id}`,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#40c057' }
          });
        });
      });
    });

    return { nodes, edges };
  }, [patient]);

  return (
    <Paper p="xl" radius="md">
      <Group position="apart" mb="lg">
        <Title order={3}>Care Pathway</Title>
        <Text size="sm" color="dimmed">Based on current conditions</Text>
      </Group>
      <div style={{ height: 500 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ zoom: 1 }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </Paper>
  );
};

export default CarePathway; 