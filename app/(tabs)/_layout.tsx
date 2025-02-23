import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
      headerShown: true,
      tabBarActiveTintColor: '#2563eb',
      }}>
      <Tabs.Screen
      name="index"
      options={{
        title: 'Trouver de l\'eau',
        tabBarIcon: ({ size, color }) => (
        <MaterialCommunityIcons name="water-pump" size={30} color={color} />
        ),
        headerTitle: () => (
        <MaterialCommunityIcons name="water-pump" size={30} color="#2563eb" />
        ),
      }}
      />
      <Tabs.Screen
      name="add"
      options={{
        title: 'Ajouter un point d\'eau',
        tabBarIcon: ({ size, color }) => (
        <Ionicons name="add-circle" size={30} color={color} />
        ),
        headerTitle: () => (
        <Ionicons name="add-circle" size={30} color="#2563eb" />
        ),
      }}
      />
    </Tabs>
  );
}