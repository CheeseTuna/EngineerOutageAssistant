import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { getJobs } from '../../../services/api';

export default function JobsScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const filteredJobs =
    filter === 'All' ? jobs : jobs.filter(job => job.status === filter);

  const filters = ['All', 'Not Started', 'In Progress', 'Completed'];

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
    <ScrollView className="flex-1 bg-gray-100" contentContainerClassName="pb-8">
      <View className="px-4 pt-6">
        <View className="mb-5">
          <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-600">
            Field operations
          </Text>
          <Text className="text-3xl font-bold text-gray-900">Jobs</Text>
          <Text className="mt-1 text-base text-gray-500">
            Review and track your assignments.
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-5"
          contentContainerClassName="gap-2"
        >
          {filters.map(item => {
            const isActive = filter === item;

            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                className={`rounded-full border px-4 py-2.5 ${isActive ? 'border-blue-600 bg-blue-600' : 'border-gray-200 bg-white'
                  }`}
              >
                <Text
                  className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-700'
                    }`}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View className="gap-3">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
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
                className="rounded-2xl active:bg-gray-50"
              >
                <View
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <View className="mb-3 flex-row items-start justify-between">
                    <View className="mr-3 flex-1">
                      <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
                        Job #{job.id}
                      </Text>
                      <Text className="text-base font-bold text-gray-900">
                        {job.title || 'Job assignment'}
                      </Text>
                    </View>
                    <View className="h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                      <Ionicons name="briefcase-outline" size={19} color="#2563eb" />
                    </View>
                  </View>

                  <View className="mb-3 flex-row items-center">
                    <Ionicons name="location-outline" size={16} color="#6b7280" />
                    <Text className="ml-1.5 text-sm text-gray-600">
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
                      <View className={`rounded-full px-3 py-1.5 ${priorityStyles[job.priority as keyof typeof priorityStyles]?.background ?? 'bg-gray-100'}`}>
                        <Text className={`text-xs font-semibold ${priorityStyles[job.priority as keyof typeof priorityStyles]?.text ?? 'text-gray-700'}`}>
                          {job.priority} priority
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            <View className="items-center rounded-2xl border border-gray-200 bg-white px-5 py-8">
              <View className="mb-3 h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                <Ionicons name="briefcase-outline" size={22} color="#2563eb" />
              </View>
              <Text className="text-base font-semibold text-gray-900">No jobs found</Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Try another status filter to see more assignments.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}