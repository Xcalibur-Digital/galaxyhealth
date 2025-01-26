import React from 'react';
import { Container, Grid, Card, Text, Group, Button, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconUsers, IconCalendar, IconChartBar } from '@tabler/icons-react';
import PatientList from '../components/patients/PatientList';

const DashboardCard = ({ icon: Icon, title, value, link }) => (
  <Card shadow="sm" p="lg">
    <Group position="apart">
      <div>
        <Text size="xs" color="dimmed" transform="uppercase">
          {title}
        </Text>
        <Text size="xl" weight={700}>
          {value}
        </Text>
      </div>
      <Icon size={30} stroke={1.5} />
    </Group>
    {link && (
      <Button
        component={Link}
        to={link}
        variant="light"
        fullWidth
        mt="md"
      >
        View Details
      </Button>
    )}
  </Card>
);

const Dashboard = () => {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Dashboard</Title>
      
      <Grid mb="xl">
        <Grid.Col span={4}>
          <DashboardCard
            icon={IconUsers}
            title="Total Patients"
            value="5"
            link="/patients"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <DashboardCard
            icon={IconCalendar}
            title="Today's Appointments"
            value="Coming Soon"
            link="/appointments"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <DashboardCard
            icon={IconChartBar}
            title="Analytics"
            value="Coming Soon"
            link="/analytics"
          />
        </Grid.Col>
      </Grid>

      <PatientList />
    </Container>
  );
};

export default Dashboard; 