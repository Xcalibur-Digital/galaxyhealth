import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Grid, 
  Card, 
  Text, 
  Select, 
  Group, 
  Stack,
  RingProgress,
  List,
  ThemeIcon,
  Paper,
  Divider,
  Button
} from '@mantine/core';
import { 
  IconCoin, 
  IconCheckbox, 
  IconNotes, 
  IconStethoscope,
  IconArrowUpRight,
  IconArrowDownRight,
  IconCalendarStats
} from '@tabler/icons-react';

const timeframes = [
  { value: 'ytd', label: 'Year to Date' },
  { value: 'q4-2023', label: 'Q4 2023' },
  { value: 'q3-2023', label: 'Q3 2023' },
  { value: 'q2-2023', label: 'Q2 2023' }
];

const EarningsCard = ({ title, amount, trend, description }) => (
  <Card shadow="sm" p="lg">
    <Group position="apart" mb="xs">
      <Text size="sm" color="dimmed">{title}</Text>
      <ThemeIcon 
        color={trend === 'up' ? 'green' : 'red'} 
        variant="light"
      >
        {trend === 'up' ? <IconArrowUpRight size={18} /> : <IconArrowDownRight size={18} />}
      </ThemeIcon>
    </Group>
    <Text size="xl" weight={700}>${amount.toLocaleString()}</Text>
    <Text size="xs" color="dimmed" mt="xs">{description}</Text>
  </Card>
);

const MetricCard = ({ icon: Icon, title, value, subtext }) => (
  <Card shadow="sm" p="lg">
    <Group position="apart" mb="xs">
      <Text size="sm" color="dimmed">{title}</Text>
      <ThemeIcon size="lg" variant="light">
        <Icon size={20} />
      </ThemeIcon>
    </Group>
    <Text size="xl" weight={700}>{value}</Text>
    <Text size="xs" color="dimmed" mt="xs">{subtext}</Text>
  </Card>
);

const Incentives = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('ytd');

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Group position="apart">
          <Title order={2}>Provider Incentives</Title>
          <Select
            value={selectedTimeframe}
            onChange={setSelectedTimeframe}
            data={timeframes}
            style={{ width: 200 }}
          />
        </Group>

        <Paper p="md" radius="md" withBorder>
          <Stack>
            <Title order={4}>Total Earnings</Title>
            <Grid>
              <Grid.Col span={3}>
                <EarningsCard
                  title="Net Shared Savings"
                  amount={145000}
                  trend="up"
                  description="15% above target"
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <EarningsCard
                  title="Quality Bonus"
                  amount={28500}
                  trend="up"
                  description="Based on gap closure rate"
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <EarningsCard
                  title="RAF Adjustment"
                  amount={32000}
                  trend="up"
                  description="HCC recapture bonus"
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <EarningsCard
                  title="AWV Completion"
                  amount={12500}
                  trend="down"
                  description="5% below target"
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        <Grid>
          <Grid.Col span={6}>
            <Card shadow="sm" p="lg">
              <Title order={4} mb="xl">Performance Metrics</Title>
              <Grid>
                <Grid.Col span={6}>
                  <MetricCard
                    icon={IconCheckbox}
                    title="Care Gaps Closed"
                    value="385"
                    subtext="$75 per gap"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <MetricCard
                    icon={IconNotes}
                    title="AWV Forms Completed"
                    value="245"
                    subtext="$50 per form"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <MetricCard
                    icon={IconStethoscope}
                    title="Point of Care Tools"
                    value="892"
                    subtext="Usage bonus eligible"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <MetricCard
                    icon={IconCalendarStats}
                    title="Risk Assessments"
                    value="156"
                    subtext="$100 per assessment"
                  />
                </Grid.Col>
              </Grid>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card shadow="sm" p="lg">
              <Title order={4} mb="md">Upcoming Opportunities</Title>
              <List spacing="md">
                <List.Item icon={
                  <ThemeIcon color="blue" size={24} radius="xl">
                    <IconCoin size={16} />
                  </ThemeIcon>
                }>
                  <Text weight={500}>Quality Bonus Threshold</Text>
                  <Text size="sm" color="dimmed">15 more care gaps to reach next bonus tier ($5,000)</Text>
                </List.Item>
                <List.Item icon={
                  <ThemeIcon color="green" size={24} radius="xl">
                    <IconCoin size={16} />
                  </ThemeIcon>
                }>
                  <Text weight={500}>RAF Bonus Program</Text>
                  <Text size="sm" color="dimmed">Review 25 suspected HCC opportunities ($2,500)</Text>
                </List.Item>
                <List.Item icon={
                  <ThemeIcon color="violet" size={24} radius="xl">
                    <IconCoin size={16} />
                  </ThemeIcon>
                }>
                  <Text weight={500}>AWV Campaign</Text>
                  <Text size="sm" color="dimmed">Complete 50 more AWVs by EOY ($2,500)</Text>
                </List.Item>
              </List>

              <Divider my="xl" />

              <Button fullWidth variant="light">View All Incentive Programs</Button>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};

export default Incentives; 