import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { X, Heart } from 'lucide-react-native';
import { JobCard } from '../components/JobCard';
import { useAppContext } from '../context/AppContext';
import { Job } from '../data/jobs';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export const JobseekerSwipeScreen = () => {
  const { jobs, likeJob, swipedJobIds, addSwipedJob } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    const currentJob = availableJobs[currentIndex];
    if (currentJob) {
      addSwipedJob(currentJob.id);
      if (direction === 'right') {
        likeJob(currentJob);
      }
    }
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex((prev) => prev + 1);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
            useNativeDriver: true,
          }).start(() => handleSwipeComplete('right'));
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
            useNativeDriver: true,
          }).start(() => handleSwipeComplete('left'));
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleButtonPress = (direction: 'left' | 'right') => {
    const toValue = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
    Animated.spring(position, {
      toValue: { x: toValue, y: 0 },
      useNativeDriver: true,
    }).start(() => handleSwipeComplete(direction));
  };

  const availableJobs = jobs.filter((job) => !swipedJobIds.includes(job.id));
  const currentJob = availableJobs[currentIndex];

  if (!currentJob) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No More Jobs</Text>
          <Text style={styles.emptySubtitle}>
            Check back later for new opportunities!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { rotate },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Jobs</Text>
        <Text style={styles.subtitle}>
          {availableJobs.length} opportunities available
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View
          style={[styles.card, cardStyle]}
          {...panResponder.panHandlers}
        >
          <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
            <Text style={styles.likeLabelText}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
            <Text style={styles.nopeLabelText}>SKIP</Text>
          </Animated.View>
          <JobCard job={currentJob} />
        </Animated.View>

        {availableJobs[currentIndex + 1] && (
          <View style={[styles.card, styles.nextCard]}>
            <JobCard job={availableJobs[currentIndex + 1]} />
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={() => handleButtonPress('left')}
        >
          <X size={32} color="#FF3B30" strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => handleButtonPress('right')}
        >
          <Heart size={32} color="#34C759" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    position: 'absolute',
    width: SCREEN_WIDTH - 40,
  },
  nextCard: {
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
  },
  likeLabel: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 1000,
    borderWidth: 4,
    borderColor: '#34C759',
    borderRadius: 8,
    padding: 8,
    transform: [{ rotate: '20deg' }],
  },
  likeLabelText: {
    color: '#34C759',
    fontSize: 32,
    fontWeight: '800',
  },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    left: 30,
    zIndex: 1000,
    borderWidth: 4,
    borderColor: '#FF3B30',
    borderRadius: 8,
    padding: 8,
    transform: [{ rotate: '-20deg' }],
  },
  nopeLabelText: {
    color: '#FF3B30',
    fontSize: 32,
    fontWeight: '800',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 40,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  dislikeButton: {
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  likeButton: {
    borderWidth: 2,
    borderColor: '#34C759',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
