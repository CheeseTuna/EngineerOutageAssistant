import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TabBar, TabView } from 'react-native-tab-view';
import { getJobs } from '../../services/api';

type Job = {
  id: string | number;
  title?: string;
  location?: string;
};

type Route = {
  key: string;
  title: string;
};

function FirstRoute({ job }: { job: Job }) {
  return (
    <ScrollView className="flex-1" contentContainerClassName="p-4 pb-8">
      <View className="mb-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          Site notes · Job #{job.id}
        </Text>
        <Text className="text-2xl font-bold text-gray-900">
          {job.title || 'Job site'}
        </Text>
        {!!job.location && (
          <View className="mt-3 flex-row items-start">
            <Ionicons name="location-outline" size={17} color="#6b7280" />
            <Text className="ml-2 flex-1 flex-shrink text-sm text-gray-600">
              {job.location}
            </Text>
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
      <View className="mt-4">
        <Pressable className="items-center rounded-xl bg-blue-600 px-4 py-4">
          <Text className="text-base font-semibold text-white">Save Notes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function SecondRoute() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the camera is required.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View className=''>
      <Pressable>
        <View className="items-center">
          <Image style={{ width: 300, height: 300 }}
            source={require('@/assets/images/image-upload.png')} />
        </View>
      </Pressable>
      <View className="gap-3 p-4">
        <Pressable
          accessibilityRole="button"
          onPress={pickImage}
          className="items-center rounded-xl bg-blue-600 px-4 py-4"
        >
          <Text className="text-base font-semibold text-white">Pick an image from camera roll</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={takePhoto}
          className="items-center rounded-xl bg-blue-600 px-4 py-4"
        >
          <Text className="text-base font-semibold text-white">Take a photo</Text>
        </Pressable>
        {image !== null && <Image source={{ uri: image }} style={styles.image} />}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  tabBar: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 0,
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
  image: {
    width: 200,
    height: 200,
  },
});

const routes: Route[] = [
  { key: 'first', title: 'Site Notes' },
  { key: 'second', title: 'Photo' },
];

export default function SiteNotesScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [index, setIndex] = React.useState(0);

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
    <View className="flex-1 bg-gray-100 p-4">
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        className="mb-4 self-start rounded-full border border-gray-200 bg-white px-4 py-2.5"
      >
        <Text className="text-sm font-semibold text-blue-700">‹ Back to job</Text>
      </Pressable>

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
            style={styles.tabBar}
            indicatorStyle={styles.tabIndicator}
          />
        )}
        renderScene={({ route }) => {
          if (route.key === 'first') {
            return <FirstRoute job={job} />;
          }

          return <SecondRoute />;
        }}
      />
    </View>
  );
}
