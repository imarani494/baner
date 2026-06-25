import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';
import { useNavigation } from '../navigation/NavigationContext';
import { useTheme } from '../hooks/useTheme';
import { useFadeIn } from '../hooks/useFadeIn';
import { Text } from '../components/ui/Text';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { palette, spacing, radius, shadow } from '../theme';
import { Photo, PhotoCategory } from '../types';

const { width } = Dimensions.get('window');
const GRID_PADDING = spacing.lg;
const GRID_GAP = spacing.sm;
const ITEM_WIDTH = (width - GRID_PADDING * 2 - GRID_GAP) / 2;

const ALL_CATEGORIES: (PhotoCategory | 'All')[] = [
  'All',
  'Nature',
  'Portrait',
  'Architecture',
  'Street',
  'Abstract',
];

const SORT_OPTIONS = ['Recent', 'Popular', 'Saved'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function FilterChip({ label, isActive, onPress }: FilterChipProps) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: isActive ? palette.primary : theme.surface,
          borderColor: isActive ? palette.primary : theme.border,
        },
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={label}
    >
      <Text
        variant="label"
        color={isActive ? palette.white : theme.text.secondary}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface PhotoItemProps {
  photo: Photo;
  index: number;
  onPress: () => void;
  onLike: () => void;
  onSave: () => void;
}

function PhotoItem({ photo, index, onPress, onLike, onSave }: PhotoItemProps) {
  const theme = useTheme();
  const { opacity, translateY } = useFadeIn(index * 60);
  const isPortrait = photo.height > photo.width;

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.photoItem, shadow.sm]}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={`Photo: ${photo.title}`}
      >
        <Image
          source={{ uri: photo.uri }}
          style={[
            styles.photoImage,
            { height: isPortrait ? ITEM_WIDTH * 1.3 : ITEM_WIDTH * 0.75 },
          ]}
          resizeMode="cover"
          accessibilityLabel={photo.title}
        />
        {/* Gradient overlay */}
        <View style={styles.photoOverlay} />

        {/* Top row — category + save */}
        <View style={styles.photoTop}>
          <Badge label={photo.category} variant="primary" />
          <TouchableOpacity
            onPress={onSave}
            style={styles.saveBtn}
            accessibilityRole="button"
            accessibilityLabel={
              photo.isSaved ? 'Remove from saved' : 'Save photo'
            }
          >
            <Text style={styles.saveIcon}>{photo.isSaved ? '🔖' : '🏷️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom — title + likes */}
        <View style={styles.photoBottom}>
          <Text
            variant="label"
            color={palette.white}
            numberOfLines={2}
            style={styles.photoTitle}
          >
            {photo.title}
          </Text>
          <TouchableOpacity
            onPress={onLike}
            style={styles.likeRow}
            accessibilityRole="button"
            accessibilityLabel={photo.isLiked ? 'Unlike' : 'Like'}
          >
            <Text style={{ fontSize: 14 }}>{photo.isLiked ? '❤️' : '🤍'}</Text>
            <Text
              variant="caption"
              color="rgba(255,255,255,0.9)"
              style={{ marginLeft: 3 }}
            >
              {photo.likes}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function GalleryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { state, toggleLike, toggleSave } = useApp();
  const { navigate } = useNavigation();

  const [category, setCategory] = useState<PhotoCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Recent');
  const [searchQuery, setSearchQuery] = useState('');

  const { opacity, translateY } = useFadeIn(0);

  const filtered = useMemo(() => {
    let photos = [...state.photos];

    if (category !== 'All') {
      photos = photos.filter(p => p.category === category);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      photos = photos.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.tags.some(t => t.includes(q)) ||
          p.author.toLowerCase().includes(q),
      );
    }

    switch (sortBy) {
      case 'Popular':
        photos.sort((a, b) => b.likes - a.likes);
        break;
      case 'Saved':
        photos = photos.filter(p => p.isSaved);
        break;
      case 'Recent':
      default:
        photos.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
        );
    }

    return photos;
  }, [state.photos, category, sortBy, searchQuery]);

  const renderItem = ({ item, index }: { item: Photo; index: number }) => (
    <PhotoItem
      photo={item}
      index={index}
      onPress={() => navigate('PhotoDetail', { photoId: item.id })}
      onLike={() => toggleLike(item.id)}
      onSave={() => toggleSave(item.id)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: insets.top + spacing.md,
            backgroundColor: theme.surface,
            opacity,
            transform: [{ translateY }],
          },
          shadow.sm,
        ]}
      >
        <Text variant="h2" color={theme.text.primary}>
          Gallery
        </Text>
        <Text variant="bodySmall" color={theme.text.secondary}>
          {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
        </Text>

        {/* Search bar */}
        <TouchableOpacity
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.input.background,
              borderColor: theme.border,
            },
          ]}
          activeOpacity={0.7}
          accessibilityRole="search"
          accessibilityLabel="Search photos"
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text variant="body" color={theme.input.placeholder}>
            Search photos, tags, authors…
          </Text>
        </TouchableOpacity>

        {/* Sort Tabs */}
        <View style={styles.sortRow}>
          {SORT_OPTIONS.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setSortBy(s)}
              style={[
                styles.sortTab,
                sortBy === s && {
                  borderBottomColor: palette.primary,
                  borderBottomWidth: 2,
                },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: sortBy === s }}
            >
              <Text
                variant="label"
                color={sortBy === s ? palette.primary : theme.text.muted}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      <Animated.FlatList
        data={ALL_CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        contentContainerStyle={styles.categoryList}
        style={{ maxHeight: 52, backgroundColor: theme.surface }}
        renderItem={({ item }) => (
          <FilterChip
            label={item}
            isActive={category === item}
            onPress={() => setCategory(item as PhotoCategory | 'All')}
          />
        )}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="📷"
          title="No photos found"
          subtitle="Try a different filter or search term"
        />
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.gridRow}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 44,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  searchIcon: { fontSize: 16 },
  sortRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  sortTab: {
    paddingBottom: spacing.sm,
    paddingHorizontal: 2,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryList: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  grid: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: GRID_GAP,
  },
  photoItem: {
    width: ITEM_WIDTH,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: palette.grey300,
  },
  photoImage: {
    width: '100%',
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  photoTop: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  saveBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: { fontSize: 14 },
  photoBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
  },
  photoTitle: { marginBottom: 4 },
  likeRow: { flexDirection: 'row', alignItems: 'center' },
});
