import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OfflineItem {
  id: string;
  name: string;
  size: string;
  downloaded: boolean;
  downloading: boolean;
  progress?: number;
}

export default function OfflineContent() {
  const router = useRouter();
  const [items, setItems] = useState<OfflineItem[]>([
    { id: '1', name: 'Festival Map', size: '2.5 MB', downloaded: false, downloading: false },
    { id: '2', name: 'Event Schedule', size: '1.2 MB', downloaded: true, downloading: false },
    { id: '3', name: 'Artist Information', size: '3.8 MB', downloaded: false, downloading: false },
    { id: '4', name: 'Venue Details', size: '0.8 MB', downloaded: true, downloading: false },
    { id: '5', name: 'Emergency Contacts', size: '0.3 MB', downloaded: true, downloading: false },
  ]);

  const handleDownload = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, downloading: true, progress: 0 };
      }
      return item;
    }));

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setItems(currentItems => currentItems.map(item => {
        if (item.id === id) {
          if (progress >= 100) {
            clearInterval(interval);
            return { ...item, downloading: false, downloaded: true, progress: 100 };
          }
          return { ...item, progress };
        }
        return item;
      }));
    }, 200);
  };

  const handleDelete = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, downloaded: false, progress: 0 };
      }
      return item;
    }));
  };

  const handleDownloadAll = () => {
    items.forEach(item => {
      if (!item.downloaded && !item.downloading) {
        handleDownload(item.id);
      }
    });
  };

  const handleDeleteAll = () => {
    setItems(items.map(item => ({
      ...item,
      downloaded: false,
      progress: 0,
    })));
  };

  const downloadedCount = items.filter(item => item.downloaded).length;
  const totalSize = items.reduce((sum, item) => {
    const sizeNum = parseFloat(item.size);
    return sum + sizeNum;
  }, 0);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Offline Content', 
          headerBackTitle: 'Settings', 
          headerStyle: { backgroundColor: '#000' }, 
          headerTintColor: '#fff', 
          headerTitleStyle: { color: '#fff' }, 
          headerShadowVisible: false 
        }} 
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Offline Content</Text>
          <Text style={styles.description}>
            Download content to access it without an internet connection during the festival.
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{downloadedCount}/{items.length}</Text>
              <Text style={styles.statLabel}>Downloaded</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalSize.toFixed(1)} MB</Text>
              <Text style={styles.statLabel}>Total Size</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.downloadAllButton]}
              onPress={handleDownloadAll}
            >
              <Text style={styles.actionButtonText}>Download All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteAllButton]}
              onPress={handleDeleteAll}
            >
              <Text style={styles.actionButtonText}>Delete All</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.listTitle}>Available Content</Text>

          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSize}>{item.size}</Text>
                </View>
                {item.downloaded && (
                  <View style={styles.downloadedBadge}>
                    <Text style={styles.downloadedBadgeText}>✓ Downloaded</Text>
                  </View>
                )}
              </View>

              {item.downloading && item.progress !== undefined && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{item.progress}%</Text>
                </View>
              )}

              <View style={styles.itemActions}>
                {!item.downloaded && !item.downloading ? (
                  <TouchableOpacity 
                    style={[styles.itemButton, styles.downloadButton]}
                    onPress={() => handleDownload(item.id)}
                  >
                    <Text style={styles.itemButtonText}>Download</Text>
                  </TouchableOpacity>
                ) : item.downloading ? (
                  <View style={[styles.itemButton, styles.downloadingButton]}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={[styles.itemButtonText, { marginLeft: 8 }]}>Downloading...</Text>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={[styles.itemButton, styles.deleteButton]}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.itemButtonText}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>💡 Tips</Text>
            <Text style={styles.infoText}>
              • Download content before arriving at the festival{'\n'}
              • Maps and schedules work best offline{'\n'}
              • Delete content after the festival to free up space{'\n'}
              • Keep your phone charged to access offline content
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#e0e0e0',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#2e2e2e',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  downloadAllButton: {
    backgroundColor: '#4CAF50',
  },
  deleteAllButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#2e2e2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 14,
    color: '#888',
  },
  downloadedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  downloadedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#1a1a1a',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  itemActions: {
    marginTop: 8,
  },
  itemButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  downloadButton: {
    backgroundColor: '#4CAF50',
  },
  downloadingButton: {
    backgroundColor: '#666',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  itemButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#e0e0e0',
  },
});
