import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { getMap } from '../../services/map';

type OutageMapProps = {
  height?: number;
};

export default function OutageMap({ height }: OutageMapProps) {
  const [mapHtml, setMapHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getMap()
      .then((html) => {
        if (isMounted) setMapHtml(html);
      })
      .catch((loadError) => {
        console.error('Map load error:', loadError);
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const containerStyle: ViewStyle = height ? { height } : { flex: 1 };

  return (
    <View style={[styles.container, containerStyle]}>
      {mapHtml ? (
        <WebView
          style={styles.map}
          source={{ html: mapHtml }}
          javaScriptEnabled
          originWhitelist={['*']}
          scrollEnabled={!height}
          onError={(event) => {
            console.error('WebView map error:', event.nativeEvent);
            setError(true);
          }}
        />
      ) : (
        <View style={styles.message}>
          {error ? (
            <Text style={styles.errorText}>The outage map could not be loaded.</Text>
          ) : (
            <>
              <ActivityIndicator color="#2563eb" />
              <Text style={styles.loadingText}>Loading live outage map...</Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
  },
  map: {
    flex: 1,
  },
  message: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 13,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    textAlign: 'center',
  },
});
