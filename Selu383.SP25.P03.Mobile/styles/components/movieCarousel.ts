import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius } from '../theme/spacing';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.33;

export const movieCarouselStyles = StyleSheet.create({
  container: {
    marginVertical: Spacing.m,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: Spacing.s,
    marginBottom: Spacing.s,
  },
  list: {
    paddingHorizontal: Spacing.s,
  },
  movieItem: {
    width: ITEM_WIDTH,
    marginRight: Spacing.m,
  },
  poster: {
    width: '100%',
    height: ITEM_WIDTH * 1.5,
    borderRadius: BorderRadius.s,
  },
  title: {
    marginTop: Spacing.xs,
    fontSize: 14,
    fontWeight: '600',
  },
  runtime: {
    fontSize: 12,
    marginTop: 2,
  },
});