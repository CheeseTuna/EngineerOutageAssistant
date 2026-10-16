import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { getJobs } from '../../../services/api';

type Job = {
  id: string | number;
  title?: string;
  location?: string;
  status?: string;
  priority?: string;
};

type JobFilter = 'All' | 'Not Started' | 'In Progress' | 'Completed';

type JobTab = {
  key: string;
  title: string;
  status: JobFilter;
};

const routes: JobTab[] = [
  { key: 'all', title: 'All', status: 'All' },
  { key: 'not-started', title: 'Not Started', status: 'Not Started' },
  { key: 'in-progress', title: 'In Progress', status: 'In Progress' },
  { key: 'completed', title: 'Completed', status: 'Completed' },
];

const statusBackground: Record<string, string> = {
  Completed: 'bg-green-100',
  'In Progress': 'bg-blue-100',
  'Not Started': 'bg-gray-100',
};

const statusText: Record<string, string> = {
  Completed: 'text-green-700',
  'In Progress': 'text-blue-700',
  'Not Started': 'text-gray-700',
};

const priorityStyles: Record<string, { background: string; text: string }> = {
  High: { background: 'bg-red-100', text: 'text-red-700' },
  Medium: { background: 'bg-amber-100', text: 'text-amber-700' },
  Low: { background: 'bg-green-100', text: 'text-green-700' },
};

function JobList({ jobs, status }: { jobs: Job[]; status: JobFilter }) {
  const filteredJobs =
    status === 'All' ? jobs : jobs.filter((job) => job.status === status);

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-3 p-4 pb-8">
      {filteredJobs.length > 0 ? (
        filteredJobs.map((job) => (
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
            <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
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

              <View className="mb-3 flex-row items-start">
                <Ionicons name="location-outline" size={16} color="#6b7280" />
                <Text className="ml-1.5 flex-1 flex-shrink text-sm text-gray-600">
                  {job.location || 'Location not specified'}
                </Text>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {!!job.status && (
                  <View
                    className={`rounded-full px-3 py-1.5 ${statusBackground[job.status] ?? 'bg-gray-100'}`}
                  >
                    <Text
                      className={`text-xs font-semibold ${statusText[job.status] ?? 'text-gray-700'}`}
                    >
                      {job.status}
                    </Text>
                  </View>
                )}
                {!!job.priority && (
                  <View
                    className={`rounded-full px-3 py-1.5 ${priorityStyles[job.priority]?.background ?? 'bg-gray-100'}`}
                  >
                    <Text
                      className={`text-xs font-semibold ${priorityStyles[job.priority]?.text ?? 'text-gray-700'}`}
                    >
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
    </ScrollView>
  );
}

export default function JobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs();
        setJobs(data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    }

    void loadJobs();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
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
      </View>

      <TabView
        style={{ flex: 1 }}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        commonOptions={{ labelStyle: styles.tabLabel }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            activeColor="#1d4ed8"
            inactiveColor="#6b7280"
            pressColor="#dbeafe"
            scrollEnabled
            tabStyle={styles.tab}
            style={styles.tabBar}
            indicatorStyle={styles.tabIndicator}
          />
        )}
        renderScene={({ route }) => (
          <JobList jobs={jobs} status={route.status} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 0,
  },
  tab: {
    width: 'auto',
  },
  tabIndicator: {
    height: 3,
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  tabLabel: {
    fontWeight: '600',
    textTransform: 'none',
  },
});
