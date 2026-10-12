import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getJobs } from '../../../services/api';


export default function HomeScreen() {
  const [panels, setDashboard] = useState<any[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setDashboard(data.dashboard);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  return (
    <View className="p-4">
      <Text className="text-3xl">Good morning,</Text>
      <Text className="text-base text-gray-500">Here's what's happening today.</Text>
      <View>
        {panels.map((panel) => (
          <View>
            <Ionicons name="flash-outline" />
            <Text>{panel.assigned}</Text>
            <Text>My Assigned Jobs</Text>
          </View>
        ))}
      </View>
    </View>

  );
}
