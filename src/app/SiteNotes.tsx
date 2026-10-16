import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { getJobs } from '../../services/api';

type Job = {
  id: string | number;
  title?: string;
  location?: string;
};

export default function SiteNotesScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadJob() {
      try {
        if (!jobId) {
          throw new Error('No job ID was provided.');
        }

        const data = await getJobs();
        const selectedJob = data.jobs?.find(
          (item: Job) => String(item.id) === jobId
        );

        if (!selectedJob) {
          throw new Error(`Job ${jobId} was not found.`);
        }

        if (isMounted) setJob(selectedJob);
      } catch (loadError) {
        console.error('Error loading site notes job:', loadError);
        if (isMounted) setError('Unable to load this job.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadJob();

    return () => {
      isMounted = false;
    };
  }, [jobId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-3 text-sm text-gray-500">Loading job...</Text>
      </View>
    );
  }

  if (error || !job) {
    return (
      <View className="flex-1 bg-gray-100 p-5">
        <Text className="text-base font-medium text-red-700">
          {error || 'Job not found.'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerClassName="p-4 pb-8">
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        className="mb-5 self-start rounded-full border border-gray-200 bg-white px-4 py-2.5"
      >
        <Text className="text-sm font-semibold text-blue-700">‹ Back to job</Text>
      </Pressable>

      <View className="mb-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          Site notes · Job #{job.id}
        </Text>
        <Text className="text-2xl font-bold text-gray-900">
          {job.title || 'Job site'}
        </Text>
        {!!job.location && (
          <View className="mt-3 flex-row items-center">
            <Ionicons name="location-outline" size={17} color="#6b7280" />
            <Text className="ml-2 text-sm text-gray-600">{job.location}</Text>
          </View>
        )}
      </View>

      <View className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <Text className="mb-3 text-base font-bold text-gray-900">Work notes</Text>
        <TextInput
          multiline
          textAlignVertical="top"
          placeholder="Record observations, work completed, and follow-up actions..."
          placeholderTextColor="#9ca3af"
          className="min-h-48 rounded-xl border border-gray-200 bg-gray-50 p-4 text-base leading-6 text-gray-800"
        />
      </View>
      <View>
        <Pressable className="items-center rounded-xl bg-blue-600 px-4 py-4">
          <Text className="text-base font-semibold text-white" >Save Notes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}