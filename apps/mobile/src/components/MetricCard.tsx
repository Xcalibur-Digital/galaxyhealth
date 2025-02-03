import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const MetricCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  color,
  trend,
  onPress 
}) => {
  const { colors } = useTheme();

  return (
    <Card onPress={onPress} style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <IconButton
            icon={icon}
            size={24}
            iconColor={color}
            style={[styles.icon, { backgroundColor: `${color}20` }]}
          />
          {trend && (
            <View style={styles.trend}>
              <MaterialCommunityIcons
                name={`arrow-${trend.direction}`}
                size={16}
                color={trend.color}
              />
              <Text style={[styles.trendValue, { color: trend.color }]}>
                {trend.value}
              </Text>
            </View>
          )}
        </View>

        <Text variant="displaySmall" style={styles.value}>
          {value}
        </Text>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        {description && (
          <Text variant="bodySmall" style={styles.description}>
            {description}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    margin: 0,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    marginLeft: 4,
    fontWeight: '500',
  },
  value: {
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    opacity: 0.7,
  },
}); 