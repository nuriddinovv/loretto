import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

import { useSetExchangeRateMutation } from '../model/useSetExchangeRateMutation';
import { todayDate } from '@/shared/lib/TodayDate';
import { colors } from '@/shared/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  mode: 'calendar' | 'today';
  onSaved?: () => void;
  title?: string;
  initialRate?: number;
  initialDate?: string;
};

type MarkedDates = { [key: string]: { selected: boolean } };

function toRateDate(dateYYYYMMDD: string) {
  return `${dateYYYYMMDD} 00:00:00.000000000`;
}

function toYYYYMMDD(date?: string | null) {
  if (!date) return '';
  return String(date).split(' ')[0]; // "YYYY-MM-DD"
}

export function SetRateModal({
  visible,
  onClose,
  mode = 'today',
  title,
  initialDate,
  initialRate,
  onSaved,
}: Props) {
  const mut = useSetExchangeRateMutation();

  const [rateText, setRateText] = useState('');
  const [pickedDate, setPickedDate] = useState<string>(''); // YYYY-MM-DD
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});

  useEffect(() => {
    if (!visible) return;

    setRateText(initialRate != null ? String(initialRate) : '');

    if (mode === 'calendar') {
      const d = toYYYYMMDD(initialDate);
      setPickedDate(d);
      setMarkedDates(d ? { [d]: { selected: true } } : {});
    } else {
      setPickedDate('');
      setMarkedDates({});
    }
  }, [visible, mode, initialRate, initialDate]);

  const canSave = useMemo(() => {
    const n = Number(rateText);
    if (!Number.isFinite(n) || n <= 0) return false;
    if (mut.isPending) return false;
    if (mode === 'calendar' && !pickedDate) return false;
    return true;
  }, [rateText, mut.isPending, mode, pickedDate]);

  const onDayPress = useCallback((day: { dateString: string }) => {
    setPickedDate(day.dateString);
    setMarkedDates({ [day.dateString]: { selected: true } });
  }, []);

  const onSave = () => {
    if (!canSave) return;

    const rate = Number(rateText);

    const rateDate = mode === 'today' ? todayDate() : toRateDate(pickedDate);

    mut.mutate(
      { Currency: 'UZS', Rate: rate, RateDate: rateDate },
      {
        onSuccess: () => {
          setRateText('');
          setPickedDate('');
          setMarkedDates({});
          onClose();
          onSaved?.();
        },
      },
    );
  };

  const modalTitle =
    title ??
    (mode === 'today' ? 'Bugungi kursni kiriting' : 'Yangi kurs kiritish');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={s.backdrop}>
            <View style={s.card}>
              <Text style={s.title}>{modalTitle}</Text>

              {mode === 'calendar' && (
                <Calendar
                  markedDates={markedDates}
                  onDayPress={onDayPress}
                  theme={{
                    selectedDayBackgroundColor: colors.primary,
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: colors.textPrimary,
                    arrowColor: colors.primary,
                  }}
                />
              )}

              <TextInput
                style={s.input}
                placeholder="Kurs..."
                placeholderTextColor={'#000'}
                keyboardType="numeric"
                value={rateText}
                onChangeText={setRateText}
                returnKeyType="done"
              />

              <View style={s.btnWrapper}>
                <TouchableOpacity
                  style={[s.btn, !canSave && s.btnDisabled]}
                  onPress={onSave}
                  disabled={!canSave}
                >
                  {mut.isPending ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                  ) : (
                    <Text style={[s.btnText, { color: colors.primary }]}>
                      Saqlash
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={s.btn} onPress={onClose}>
                  <Text style={s.btnText}>Bekor qilish</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },

  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },

  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginTop: 12,
    marginBottom: 14,
  },

  btnWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  btn: {
    width: '47%',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 16, fontWeight: '700' },
});
