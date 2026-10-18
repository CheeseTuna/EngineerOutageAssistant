
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getJobs } from '../../services/api';
import OutageMap from '../components/OutageMap';


type Job = {
  id: string | number;
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  location?: string;
};

export default function JobDetailsScreen() {
  const { JobDetails } = useLocalSearchParams<{ JobDetails: string }>();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true);
        setError('');

        const data = await getJobs();
        const selectedJob = data.jobs?.find(
          (item: { id: string | number }) =>
            String(item.id) === JobDetails
        );

        if (!selectedJob) {
          throw new Error(`Job ${JobDetails} was not found`);
        }

        setJob(selectedJob);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError('Unable to load job details.');
      } finally {
        setLoading(false);
      }
    }

    if (JobDetails) {
      void fetchJob();
    } else {
      setLoading(false);
      setError('No job ID was provided.');
    }
  }, [JobDetails]);

  if (loading) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center bg-gray-100">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text className="mt-3 text-sm text-gray-500">Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
        <View className="flex-1 bg-gray-100 p-5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="mb-6 h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </Pressable>
          <View className="rounded-2xl border border-gray-200 bg-white p-5">
            <View className="mb-3 h-11 w-11 items-center justify-center rounded-full bg-red-100">
              <Ionicons name="alert-circle-outline" size={23} color="#dc2626" />
            </View>
            <Text className="text-lg font-bold text-gray-900">Couldn’t load this job</Text>
            <Text className="mt-2 text-sm leading-5 text-gray-500">
              {error || 'Job not found.'}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const statusBackground = {
    Completed: 'bg-green-100',
    'In Progress': 'bg-blue-100',
    'Not Started': 'bg-gray-100',
  }[job.status ?? ''] ?? 'bg-gray-100';
  const statusText = {
    Completed: 'text-green-700',
    'In Progress': 'text-blue-700',
    'Not Started': 'text-gray-700',
  }[job.status ?? ''] ?? 'text-gray-700';
  const priorityBackground = {
    High: 'bg-red-100',
    Medium: 'bg-amber-100',
    Low: 'bg-green-100',
  }[job.priority ?? ''] ?? 'bg-gray-100';
  const priorityText = {
    High: 'text-red-700',
    Medium: 'text-amber-700',
    Low: 'text-green-700',
  }[job.priority ?? ''] ?? 'text-gray-700';

  return (
    <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <ScrollView className="flex-1" contentContainerClassName="p-4 pb-8">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          className="mb-5 h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </Pressable>

      <View className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <View className="mb-3 flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <Ionicons name="location-outline" size={21} color="#2563eb" />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-medium uppercase tracking-wide text-gray-500">Location</Text>
            <Text className="mt-1 text-base font-semibold text-gray-900">
              {job.location || 'Location not specified'}
            </Text>
          </View>
        </View>
        <OutageMap height={220} />
      </View>

      <View className="mb-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          Job #{job.id}
        </Text>
        <Text className="text-2xl font-bold leading-8 text-gray-900">
          {job.title || 'Job details'}
        </Text>

        <View className="mt-4 flex-row flex-wrap gap-2">
          {!!job.status && (
            <View className={`rounded-full px-3 py-1.5 ${statusBackground}`}>
              <Text className={`text-xs font-semibold ${statusText}`}>{job.status}</Text>
            </View>
          )}
          {!!job.priority && (
            <View className={`rounded-full px-3 py-1.5 ${priorityBackground}`}>
              <Text className={`text-xs font-semibold ${priorityText}`}>{job.priority} priority</Text>
            </View>
          )}
        </View>
      </View>


      <View className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <View className="mb-3 flex-row items-center">
          <Ionicons name="document-text-outline" size={19} color="#2563eb" />
          <Text className="ml-2 text-base font-bold text-gray-900">Description</Text>
        </View>
        <Text className="text-base leading-6 text-gray-600">
          {job.description || 'No description has been provided for this job.'}
        </Text>
      </View>
      <View className="mb-4 gap-3">
        <Pressable
          accessibilityRole="button"
          className="items-center rounded-xl bg-blue-600 px-4 py-4"
          onPress={() =>
            router.push({
              pathname: '/SiteNotes',
              params: { jobId: String(job.id) },
            })
          }
        >
          <View className='flex-row justify-center'>
            <Ionicons name="caret-forward-outline" size={20} color="white"></Ionicons>
            <Text className="text-base font-semibold text-white">Start Work</Text>
          </View>
        </Pressable>
        <Pressable className="items-center rounded-xl border border-blue-500 px-4 py-4">
          <Text className="text-base text-black font-semibold text-blue-600">Complete Job</Text>
        </Pressable>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
