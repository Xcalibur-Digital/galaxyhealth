import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Grid, 
  Card, 
  Text, 
  Select, 
  Group, 
  RingProgress,
  Stack,
  Badge,
  List,
  Tabs
} from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconMinus, IconChartBar, IconCoin } from '@tabler/icons-react';

// Separate Progress import to avoid conflicts
import { Progress as MantineProgress } from '@mantine/core';

const contracts = [
  { value: 'cigna-ma', label: 'Cigna Medicare Advantage' },
  { value: 'humana-ma', label: 'Humana Medicare Advantage' },
  { value: 'aetna-ma', label: 'Aetna Medicare Advantage' },
  { value: 'uhc-ma', label: 'UnitedHealthcare Medicare Advantage' }
];

const MetricCard = ({ title, value, benchmark, trend, description }) => {
  const getTrendIcon = () => {
    if (trend === 'up') return <IconTrendingUp size={20} color="green" />;
    if (trend === 'down') return <IconTrendingDown size={20} color="red" />;
    return <IconMinus size={20} color="gray" />;
  };

  return (
    <Card shadow="sm" p="lg">
      <Stack spacing="xs">
        <Group position="apart">
          <Text size="sm" color="dimmed">{title}</Text>
          {getTrendIcon()}
        </Group>
        <Text size="xl" weight={700}>{value}</Text>
        {benchmark && (
          <Text size="xs" color="dimmed">Benchmark: {benchmark}</Text>
        )}
        {description && (
          <Text size="xs" color="dimmed">{description}</Text>
        )}
      </Stack>
    </Card>
  );
};

const Performance = () => {
  const [selectedContract, setSelectedContract] = useState('cigna-ma');
  const [activeTab, setActiveTab] = useState('metrics');

  return (
    <Container size="xl" py="xl">
      <Stack spacing="xl">
        <Title order={2}>Performance & Incentives</Title>

        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="metrics" icon={<IconChartBar size={14} />}>
              Performance Metrics
            </Tabs.Tab>
            <Tabs.Tab value="incentives" icon={<IconCoin size={14} />}>
              Incentives
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="metrics" pt="xl">
            <Group position="apart">
              <Title order={4}>Value-Based Performance</Title>
              <Select
                value={selectedContract}
                onChange={setSelectedContract}
                data={contracts}
                placeholder="Select Contract"
                style={{ width: 300 }}
              />
            </Group>

            <Grid>
              <Grid.Col span={6}>
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Care Gap Closure Rate</Title>
                  <RingProgress
                    sections={[{ value: 72, color: 'blue' }]}
                    label={
                      <Text size="xl" align="center">72%</Text>
                    }
                    size={200}
                    mx="auto"
                  />
                  <Text align="center" mt="md" color="dimmed">Regional Benchmark: 65%</Text>
                  <Badge color="green" variant="light" mt="sm" fullWidth>
                    7% Above Benchmark
                  </Badge>
                </Card>
              </Grid.Col>

              <Grid.Col span={6}>
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Risk Adjustment Performance</Title>
                  <MantineProgress
                    value={85}
                    color="green"
                    size="xl"
                    label="Current RAF: 1.25"
                    mt={40}
                  />
                  <Text align="center" mt="md" color="dimmed">Regional RAF: 1.15</Text>
                  <List size="sm" mt="md">
                    <List.Item>Suspected HCC Gaps: 145</List.Item>
                    <List.Item>Recapture Rate: 82%</List.Item>
                  </List>
                </Card>
              </Grid.Col>

              <Grid.Col span={4}>
                <MetricCard
                  title="AWV Forms Completed"
                  value="385/500"
                  benchmark="Target: 500"
                  trend="up"
                  description="77% Complete"
                />
              </Grid.Col>

              <Grid.Col span={4}>
                <MetricCard
                  title="Patients with Open Gaps"
                  value="234"
                  trend="down"
                  description="↓12% from last month"
                />
              </Grid.Col>

              <Grid.Col span={4}>
                <MetricCard
                  title="Quality Score"
                  value="4.2/5.0"
                  benchmark="Network: 3.8"
                  trend="up"
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Top Care Gaps</Title>
                  <List spacing="xs" size="sm">
                    <List.Item>Annual Wellness Visit (125 patients)</List.Item>
                    <List.Item>Diabetes A1C Testing (98 patients)</List.Item>
                    <List.Item>Colorectal Cancer Screening (87 patients)</List.Item>
                    <List.Item>Mammography (76 patients)</List.Item>
                    <List.Item>Fall Risk Assessment (65 patients)</List.Item>
                  </List>
                </Card>
              </Grid.Col>

              <Grid.Col span={6}>
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Financial Performance</Title>
                  <List spacing="xs" size="sm">
                    <List.Item>Shared Savings: $245,000</List.Item>
                    <List.Item>MLR: 82% (Target: 85%)</List.Item>
                    <List.Item>Per Member Per Month: $825</List.Item>
                    <List.Item>ED Utilization: 155 per 1000</List.Item>
                    <List.Item>Readmission Rate: 12.5%</List.Item>
                  </List>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="incentives" pt="xl">
            <Grid>
              {/* Earnings Overview */}
              <Grid.Col span={12}>
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Earnings Overview</Title>
                  <Grid>
                    <Grid.Col span={4}>
                      <Stack>
                        <Text size="sm" color="dimmed">Total Earned YTD</Text>
                        <Text size="xl" weight={700} color="green">$24,750</Text>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Stack>
                        <Text size="sm" color="dimmed">Potential Additional</Text>
                        <Text size="xl" weight={700} color="blue">$12,500</Text>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <Stack>
                        <Text size="sm" color="dimmed">Performance Score</Text>
                        <Text size="xl" weight={700}>85/100</Text>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                </Card>
              </Grid.Col>

              {/* Incentive Categories */}
              <Grid.Col span={6}>
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Quality Measures</Title>
                  <List spacing="md">
                    <List.Item>
                      <Group position="apart">
                        <Text>Care Gap Closure</Text>
                        <Badge color="green">$8,500 Earned</Badge>
                      </Group>
                      <Text size="sm" color="dimmed">72% closure rate (Target: 65%)</Text>
                    </List.Item>
                    <List.Item>
                      <Group position="apart">
                        <Text>AWV Completion</Text>
                        <Badge color="green">$6,250 Earned</Badge>
                      </Group>
                      <Text size="sm" color="dimmed">385/500 completed</Text>
                    </List.Item>
                    <List.Item>
                      <Group position="apart">
                        <Text>Quality Metrics</Text>
                        <Badge color="green">$5,000 Earned</Badge>
                      </Group>
                      <Text size="sm" color="dimmed">4.2/5.0 score</Text>
                    </List.Item>
                  </List>
                </Card>
              </Grid.Col>

              <Grid.Col span={6}>
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Risk Adjustment</Title>
                  <List spacing="md">
                    <List.Item>
                      <Group position="apart">
                        <Text>HCC Recapture</Text>
                        <Badge color="green">$3,500 Earned</Badge>
                      </Group>
                      <Text size="sm" color="dimmed">82% recapture rate</Text>
                    </List.Item>
                    <List.Item>
                      <Group position="apart">
                        <Text>RAF Score Improvement</Text>
                        <Badge color="green">$1,500 Earned</Badge>
                      </Group>
                      <Text size="sm" color="dimmed">1.25 current (Target: 1.15)</Text>
                    </List.Item>
                  </List>
                </Card>
              </Grid.Col>

              {/* Upcoming Opportunities */}
              <Grid.Col span={12}>
                <Card shadow="sm" p="lg">
                  <Title order={4} mb="md">Upcoming Opportunities</Title>
                  <Grid>
                    <Grid.Col span={4}>
                      <MetricCard
                        title="Quality Bonus"
                        value="$5,000"
                        description="15 more care gaps to reach next tier"
                        trend="up"
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <MetricCard
                        title="RAF Bonus"
                        value="$2,500"
                        description="25 suspected HCC opportunities"
                        trend="up"
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <MetricCard
                        title="AWV Campaign"
                        value="$2,500"
                        description="Complete 50 more AWVs by EOY"
                        trend="up"
                      />
                    </Grid.Col>
                  </Grid>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
};

export default Performance; 