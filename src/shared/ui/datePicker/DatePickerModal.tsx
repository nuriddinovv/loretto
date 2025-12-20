import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors } from '@/shared/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (day: { dateString: string }) => void;
  onClear: () => void;
  title: string;
};

export function DatePickerModal({
  visible,
  onClose,
  onDateSelect,
  onClear,
  title,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={s.modalContainer}>
        <View style={s.modalContent}>
          <Text style={s.modalTitle}>{title}</Text>
          <Calendar
            onDayPress={onDateSelect}
            theme={{
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: colors.primary,
              arrowColor: colors.primary,
              monthTextColor: colors.textPrimary,
              textMonthFontWeight: '600',
              textDayFontSize: 18,
              textMonthFontSize: 18,
            }}
          />
          <TouchableOpacity
            style={s.clearButton}
            onPress={onClear}
            activeOpacity={0.7}
          >
            <Text style={s.clearButtonText}>Tozalash</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.textPrimary,
  },
  clearButton: {
    marginHorizontal: 100,
    marginTop: 16,
  },
  clearButtonText: {
    textAlign: 'center',
    fontSize: 18,
    color: colors.primary,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    fontWeight: '500',
  },
});

