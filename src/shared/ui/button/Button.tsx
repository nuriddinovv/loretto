import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { colors } from '../../theme';

type ButtonProps = {
  title: string;
  loading?: boolean;
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onPress: () => void;
};

export default function Button({
  title,
  loading,
  isDisabled,
  isFullWidth,
  onPress,
}: ButtonProps) {
  const disabled = isDisabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, isFullWidth && styles.fullWidth]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.textOnPrimary} />
      ) : (
        <Text style={[styles.text]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },

  fullWidth: {
    alignSelf: 'stretch',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },
});
