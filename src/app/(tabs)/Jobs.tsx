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

  const priorityStyle = {
    High: 'text-red-500',
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <View className="mb-4 flex-row justify-evenly flex-nowrap gap-2">
          {filters.map(item => {
            const isActive = filter === item;

            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                className={`rounded-2xl px-4 py-3 ${isActive ? 'bg-blue-600' : 'bg-white border border-gray-300'
                  }`}
              >
                <Text
                  className={`text-base font-semibold ${isActive ? 'text-white' : 'text-gray-700'
                    }`}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="gap-3">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <View
                key={job.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <Text className="mb-2 text-lg font-bold text-gray-900">
                  Job #{job.id}
                </Text>

                <Text className={`mb-1 text-sm text-gray-600 ${priorityStyle[job.priority as keyof typeof priorityStyle] ?? 'text-grey-600'}`}>
                  Priority: {job.priority}
                </Text>

                <Text className="mb-3 text-sm text-gray-600">
                  Location: {job.location}
                </Text>

                <View
                  className={`self-start rounded-full px-3 py-1 ${statusBackground[job.status as keyof typeof statusBackground] ??
                    'bg-gray-100'
                    }`}>
                  <Text className="text-sm font-semibold text-gray-700">
                    {job.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center rounded-xl bg-white p-6">
              <Text className="text-base font-medium text-gray-500">
                No jobs found.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}