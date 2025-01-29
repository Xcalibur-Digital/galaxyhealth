import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Grid, 
  Paper, 
  Text, 
  Select, 
  Group, 
  RingProgress,
  Stack,
  Badge,
  ThemeIcon,
  Box,
  Divider
} from '@mantine/core';
import { 
  IconTrendingUp, 
  IconTrendingDown, 
  IconMinus, 
  IconChartBar, 
  IconCoin,
  IconUsers,
  IconStethoscope,
  IconReportMedical
} from '@tabler/icons-react';

const contracts = [
  { value: 'all', label: 'All Contracts' },
  { value: 'cigna-ma', label: 'Cigna Medicare Advantage' },
  { value: 'humana-ma', label: 'Humana Medicare Advantage' },
  { value: 'aetna-ma', label: 'Aetna Medicare Advantage' },
  { value: 'uhc-ma', label: 'UnitedHealthcare Medicare Advantage' }
];

const MetricCard = ({ title, value, trend, description, icon: Icon, color }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <IconTrendingUp size={16} color="#40c057" />;
    if (trend === 'down') return <IconTrendingDown size={16} color="#fa5252" />;
    return <IconMinus size={16} />;
  };

  return (
    <Paper p="md" radius="md" withBorder h="100%">
      <Group position="apart" mb="xs">
        <ThemeIcon size="xl" radius="md" color={color} variant="light">
          <Icon size={24} />
        </ThemeIcon>
        <Group spacing="xs">
          {getTrendIcon()}
          <Text size="sm" color={trend === 'up' ? 'green' : trend === 'down' ? 'red' : 'gray'}>
            {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{Math.abs(trend)}%
          </Text>
        </Group>
      </Group>
      <Text size="xl" weight={700} mb="xs">
        {value}
      </Text>
      <Text size="sm" weight={500} mb="xs">{title}</Text>
      <Text size="xs" color="dimmed">
        {description}
      </Text>
    </Paper>
  );
};

const ContractScoreCard = ({ contract, score, metrics }) => (
  <Paper p="xl" radius="md" withBorder>
    <Group position="apart" mb="lg">
      <Stack spacing={0}>
        <Text size="lg" weight={500}>{contract}</Text>
        <Text size="sm" color="dimmed">VBC Success Score</Text>
      </Stack>
      <RingProgress
        size={80}
        thickness={8}
        sections={[{ value: score, color: score >= 75 ? 'green' : score >= 50 ? 'yellow' : 'red' }]}
        label={
          <Text size="lg" weight={700} align="center">
            {score}%
          </Text>
        }
      />
    </Group>
    <Grid>
      {metrics.map((metric, index) => (
        <Grid.Col key={index} span={6}>
          <Group spacing="xs">
            <Text size="sm" color="dimmed">{metric.label}:</Text>
            <Text size="sm" weight={500}>{metric.value}</Text>
          </Group>
        </Grid.Col>
      ))}
    </Grid>
  </Paper>
);

const Performance = () => {
  const [selectedContract, setSelectedContract] = useState('all');

  const contractData = {
    'cigna-ma': {
      score: 82,
      metrics: [
        { label: 'Quality Score', value: '85%' },
        { label: 'RAF Score', value: '1.25' },
        { label: 'Cost of Care', value: '$842 PMPM' },
        { label: 'Member Satisfaction', value: '4.2/5' }
      ]
    },
    'humana-ma': {
      score: 75,
      metrics: [
        { label: 'Quality Score', value: '78%' },
        { label: 'RAF Score', value: '1.15' },
        { label: 'Cost of Care', value: '$891 PMPM' },
        { label: 'Member Satisfaction', value: '4.0/5' }
      ]
    }
  };

  const overallMetrics = [
    {
      title: 'Total Patients',
      value: '2,547',
      trend: 12,
      description: 'Active patients across all contracts',
      icon: IconUsers,
      color: 'blue'
    },
    {
      title: 'Quality Score',
      value: '83%',
      trend: 5,
      description: 'Average across all contracts',
      icon: IconStethoscope,
      color: 'green'
    },
    {
      title: 'RAF Score',
      value: '1.21',
      trend: 8,
      description: 'Risk adjustment factor',
      icon: IconReportMedical,
      color: 'violet'
    },
    {
      title: 'Shared Savings',
      value: '$1.2M',
      trend: 15,
      description: 'Projected annual savings',
      icon: IconCoin,
      color: 'yellow'
    }
  ];

  return (
    <Container size="xl" py="xl">
      <Group position="apart" mb="xl">
        <Title order={2}>Performance Dashboard</Title>
        <Select
          value={selectedContract}
          onChange={setSelectedContract}
          data={contracts}
          w={300}
        />
      </Group>

      <Grid mb="xl">
        {overallMetrics.map((metric, index) => (
          <Grid.Col key={index} span={3}>
            <MetricCard {...metric} />
          </Grid.Col>
        ))}
      </Grid>

      <Title order={3} mb="lg">Contract Performance</Title>
      <Grid>
        {Object.entries(contractData).map(([key, data], index) => (
          <Grid.Col key={key} span={6}>
            <ContractScoreCard 
              contract={contracts.find(c => c.value === key)?.label}
              score={data.score}
              metrics={data.metrics}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default Performance; 