import React from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  useWindowDimensions 
} from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  Title, 
  useTheme 
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MetricCard } from '../components/MetricCard';
import { useNavigation } from '@react-navigation/native';
import { SAVED_VIEWS } from '@shared/constants';

export const Dashboard = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const metrics = [
    {
      title: 'High Risk Patients',
      value: '5',
      description: 'Patients requiring attention',
      icon: 'alert',
      color: colors.error,
      trend: {
        value: '+12%',
        color: colors.error,
        direction: 'up'
      },
      view: SAVED_VIEWS.HIGH_RISK
    },
    // ... other metrics
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View>
            <Title>Dashboard</Title>
            <Text variant="bodyMedium">
              Overview of your value-based care performance
            </Text>
          </View>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Performance')}
          >
            View Performance
          </Button>
        </View>

        <View style={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <View 
              key={index} 
              style={[
                styles.metricCol,
                { width: width > 768 ? '25%' : '50%' }
              ]}
            >
              <MetricCard
                {...metric}
                onPress={() => metric.view && 
                  navigation.navigate('Patients', { view: metric.view })}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Card>
            <Card.Title title="Recent Activity" />
            <Card.Content>
              {/* Recent activity content */}
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <Card>
            <Card.Title title="Care Gaps" />
            <Card.Content>
              {/* Care gaps content */}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  metricCol: {
    padding: 8,
  },
  section: {
    padding: 16,
  },
}); 