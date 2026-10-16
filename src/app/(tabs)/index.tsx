import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { getJobs } from '../../../services/api';

export default function HomeScreen() {
  const [panels, setDashboard] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    loadJobs();
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getJobs();
      setDashboard(data.dashboard);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data.jobs);
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  };

  const statusBackground = {
    Completed: 'bg-green-100',
    'In Progress': 'bg-blue-100',
    'Not Started': 'bg-gray-100',
  };

  const statusText = {
    Completed: 'text-green-700',
    'In Progress': 'text-blue-700',
    'Not Started': 'text-gray-700',
  };
  const priorityStyles = {
    High: { background: 'bg-red-100', text: 'text-red-700' },
    Medium: { background: 'bg-amber-100', text: 'text-amber-700' },
    Low: { background: 'bg-green-100', text: 'text-green-700' },
  };

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerClassName="p-4 pb-8">
      <View className="mb-6 pt-2">
        <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
          Field operations
        </Text>
        <Text className="text-3xl font-bold text-gray-900">Good morning,</Text>
        <Text className="mt-1 text-base text-gray-500">
          Here’s what’s happening today.
        </Text>
      </View>

      {panels.map((panel) => (
        <View key={panel.id} className="mb-7 flex-row gap-3">
          <View className="flex-1 rounded-2xl border border-red-100 bg-red-50 p-3 shadow-sm">
            <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-red-100">
              <Ionicons name="flash-outline" size={19} color="#ef4444" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">{panel.assigned}</Text>
            <Text className="mt-1 text-xs leading-4 text-gray-500">Assigned jobs</Text>
          </View>

          <View className="flex-1 rounded-2xl border border-blue-100 bg-blue-50 p-3 shadow-sm">
            <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-blue-100">
              <Ionicons name="grid-outline" size={19} color="#2563eb" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">{panel.outages}</Text>
            <Text className="mt-1 text-xs leading-4 text-gray-500">Open outages</Text>
          </View>

          <View className="flex-1 rounded-2xl border border-green-100 bg-green-50 p-3 shadow-sm">
            <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-green-100">
              <Ionicons name="people-outline" size={19} color="#16a34a" />
            </View>
            <Text className="text-2xl font-bold text-gray-900">{panel.affected}</Text>
            <Text className="mt-1 text-xs leading-4 text-gray-500">Customers affected</Text>
          </View>
        </View>
      ))}

      <View className="mb-4 flex-row items-center justify-between">
        <View className="mr-2 flex-1">
          <Text className="text-xl font-bold text-gray-900">Recent jobs</Text>
          <Text className="mt-1 flex-shrink text-sm text-gray-500">
            Your latest assignments
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/Jobs')}
          className="flex-row items-center rounded-full bg-blue-50 px-3 py-2"
        >
          <Text className="text-sm font-semibold text-blue-700">View all</Text>
          <Ionicons name="chevron-forward" size={16} color="#1d4ed8" />
        </Pressable>
      </View>

      <View className="gap-3">
        {jobs.length > 0 ? jobs.map((job) => {
          const priority = priorityStyles[job.priority as keyof typeof priorityStyles];

          return (
            <Pressable
              key={job.id}
              accessibilityRole="button"
              accessibilityLabel={`View job ${job.id}${job.title ? `, ${job.title}` : ''}`}
              onPress={() =>
                router.push({
                  pathname: '/[JobDetails]',
                  params: { JobDetails: String(job.id) },
                })
              }
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm active:bg-gray-50"
            >
              <View className="mb-3 flex-row items-start justify-between">
                <View className="mr-3 flex-1">
                  <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Job #{job.id}
                  </Text>
                  <Text className="text-base font-bold text-gray-900">
                    {job.title || 'Job assignment'}
                  </Text>
                </View>
                <View className="mt-1 h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Ionicons name="chevron-forward" size={18} color="#6b7280" />
                </View>
              </View>

              <View className="mb-3 flex-row items-start">
                <Ionicons name="location-outline" size={16} color="#6b7280" />
                <Text className="ml-1.5 flex-1 flex-shrink text-sm text-gray-600">
                  {job.location || 'Location not specified'}
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {!!job.status && (
                  <View className={`rounded-full px-3 py-1.5 ${statusBackground[job.status as keyof typeof statusBackground] ?? 'bg-gray-100'}`}>
                    <Text className={`text-xs font-semibold ${statusText[job.status as keyof typeof statusText] ?? 'text-gray-700'}`}>
                      {job.status}
                    </Text>
                  </View>
                )}
                {!!job.priority && (
                  <View className={`rounded-full px-3 py-1.5 ${priority?.background ?? 'bg-gray-100'}`}>
                    <Text className={`text-xs font-semibold ${priority?.text ?? 'text-gray-700'}`}>
                      {job.priority} priority
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        }) : (
          <View className="items-center rounded-2xl border border-gray-200 bg-white px-5 py-8">
            <View className="mb-3 h-11 w-11 items-center justify-center rounded-full bg-blue-50">
              <Ionicons name="briefcase-outline" size={22} color="#2563eb" />
            </View>
            <Text className="text-base font-semibold text-gray-900">No recent jobs</Text>
            <Text className="mt-1 text-center text-sm text-gray-500">
              New assignments will appear here.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
