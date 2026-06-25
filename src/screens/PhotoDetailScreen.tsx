import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store/AppContext';
import { useNavigation } from '../navigation/NavigationContext';
import { useTheme } from '../hooks/useTheme';
import { useFadeIn } from '../hooks/useFadeIn';
import { Text } from '../components/ui/Text';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { palette, spacing, radius, shadow } from '../theme';

const { width, height } = Dimensions.get('window');

export function PhotoDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { state, toggleLike, toggleSave } = useApp();
  const { currentRoute, goBack } = useNavigation();

  const photoId = currentRoute.params?.photoId as string;
  const photo = state.photos.find(p => p.id === photoId);

  const { opacity, translateY } = useFadeIn(100);

  if (!photo) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text variant="h3" color={theme.text.secondary}>Photo not found</Text>
        <Button label="Go Back" onPress={goBack} variant="outline" style={{ marginTop: spacing.md }} />
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out "${photo.title}" on FotoOwl AI!\n${photo.uri}`,
        title: photo.title,
      });
    } catch {
      
    }
  };

  const imageHeight = (width / photo.width) * photo.height;
  const clampedHeight = Math.min(Math.max(imageHeight, 250), height * 0.55);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} bounces>
        
        <View style={[styles.imageContainer, { height: clampedHeight }]}>
          <Image
            source={{ uri: photo.uri }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            accessibilityLabel={photo.title}
          />
          <View style={styles.imageOverlay} />

          {/* Back button */}
          <TouchableOpacity
            onPress={goBack}
            style={[styles.backBtn, { top: insets.top + spacing.sm }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Top right actions */}
          <View style={[styles.topActions, { top: insets.top + spacing.sm }]}>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.actionBtn}
              accessibilityRole="button"
              accessibilityLabel="Share photo"
            >
              <Text style={styles.actionIcon}>📤</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleSave(photo.id)}
              style={[styles.actionBtn, photo.isSaved && { backgroundColor: palette.primary }]}
              accessibilityRole="button"
              accessibilityLabel={photo.isSaved ? 'Remove from saved' : 'Save photo'}
            >
              <Text style={styles.actionIcon}>{photo.isSaved ? '🔖' : '🏷️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Category badge */}
          <View style={styles.imageBadge}>
            <Badge label={photo.category} variant="primary" />
          </View>
        </View>

    
        <Animated.View
          style={[
            styles.content,
            { opacity, transform: [{ translateY }] },
          ]}
        >
         
          <View style={styles.titleRow}>
            <Text variant="h2" color={theme.text.primary} style={{ flex: 1, marginRight: spacing.md }}>
              {photo.title}
            </Text>
            <TouchableOpacity
              onPress={() => toggleLike(photo.id)}
              style={[styles.likeBtn, photo.isLiked && { backgroundColor: `${palette.secondary}20` }]}
              accessibilityRole="button"
              accessibilityLabel={photo.isLiked ? 'Unlike' : 'Like this photo'}
            >
              <Text style={styles.likeIcon}>{photo.isLiked ? '❤️' : '🤍'}</Text>
              <Text variant="label" color={photo.isLiked ? palette.secondary : theme.text.muted}>
                {photo.likes}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Author row */}
          <View style={styles.authorRow}>
            <Avatar initials={photo.author.split(' ').map(w => w[0]).join('')} size={40} />
            <View style={{ marginLeft: spacing.sm }}>
              <Text variant="label" color={theme.text.primary}>{photo.author}</Text>
              <Text variant="caption" color={theme.text.muted}>📅 {photo.uploadedAt}</Text>
            </View>
          </View>

          {/* Description */}
          <Text variant="body" color={theme.text.secondary} style={styles.description}>
            {photo.description}
          </Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {photo.tags.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, { backgroundColor: theme.input.background }]}
                accessibilityRole="button"
                accessibilityLabel={`Tag: ${tag}`}
              >
                <Text variant="caption" color={palette.primary}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Photo Metadata */}
          <View style={[styles.metaGrid, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {[
              { label: 'Category', value: photo.category },
              { label: 'Dimensions', value: `${photo.width} × ${photo.height}` },
              { label: 'Uploaded', value: photo.uploadedAt },
              { label: 'Total Likes', value: String(photo.likes) },
            ].map(m => (
              <View key={m.label} style={styles.metaItem}>
                <Text variant="caption" color={theme.text.muted}>{m.label}</Text>
                <Text variant="label" color={theme.text.primary}>{m.value}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <Button
              label={photo.isLiked ? '❤️  Liked' : '🤍  Like'}
              onPress={() => toggleLike(photo.id)}
              variant={photo.isLiked ? 'secondary' : 'outline'}
              style={{ flex: 1 }}
            />
            <Button
              label="📤  Share"
              onPress={handleShare}
              variant="outline"
              style={{ flex: 1 }}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: {
    width,
    position: 'relative',
    backgroundColor: palette.grey300,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  backBtn: {
    position: 'absolute',
    left: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { color: palette.white, fontSize: 18, fontWeight: '700' },
  topActions: {
    position: 'absolute',
    right: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: { fontSize: 18 },
  imageBadge: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.lg,
  },
  content: {
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  likeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: palette.grey300,
  },
  likeIcon: { fontSize: 18 },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  description: {
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  metaItem: {
    width: '50%',
    padding: spacing.md,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: palette.grey200,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
