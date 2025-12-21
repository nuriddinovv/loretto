import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { ChartOfAccount, colors, Button } from '@/shared';
import { useCurrency } from '@/entities';
import { AccountSelectorModal } from './AccountSelectorModal';
import { useExchangeCurrencyMutation } from '../model/useExchangeCurrencyMutation';

type ExchangeType = 'from_uzs' | 'to_uzs';

export function ExchangeForm() {
  const { rate } = useCurrency();
  const [exchangeType, setExchangeType] = useState<ExchangeType>('from_uzs');

  // Accounts
  const [fromAccount, setFromAccount] = useState<ChartOfAccount | null>(null);
  const [toAccount, setToAccount] = useState<ChartOfAccount | null>(null);

  // Amounts (stored as raw numbers without formatting)
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');

  // Format number with spaces (toLocaleString)
  const formatNumber = (value: string): string => {
    if (!value) return '';
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    // Convert to number and format with spaces
    return Number(numbers).toLocaleString('ru-RU', {
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Handle amount change - store only numbers
  const handleFromAmountChange = (text: string) => {
    // Remove all non-digit characters
    const numbers = text.replace(/\D/g, '');
    setFromAmount(numbers);
  };

  const handleToAmountChange = (text: string) => {
    // Remove all non-digit characters
    const numbers = text.replace(/\D/g, '');
    setToAmount(numbers);
  };

  // Modals
  const [modalFromVisible, setModalFromVisible] = useState(false);
  const [modalToVisible, setModalToVisible] = useState(false);

  const mutation = useExchangeCurrencyMutation();

  const isButtonDisabled =
    !fromAccount ||
    !fromAmount ||
    !toAccount ||
    !toAmount ||
    mutation.isPending;

  const clearData = () => {
    setFromAccount(null);
    setToAccount(null);
    setFromAmount('');
    setToAmount('');
  };

  useEffect(() => {
    clearData();
  }, [exchangeType]);

  const handleSubmit = async () => {
    if (!fromAccount || !toAccount) return;

    try {
      const result = await mutation.mutateAsync({
        type: exchangeType,
        fromAccount: fromAccount.acctCode,
        fromAmount: Number(fromAmount),
        toAccount: toAccount.acctCode,
        toAmount: Number(toAmount),
        transitAccount: null,
      });

      // Only clear data if the operation was actually successful
      if (result.status === 'success') {
        clearData();
      }
    } catch (error) {
      // Error is handled by mutation onError
    }
  };

  return (
    <View style={s.container}>
      <View style={s.content}>
        {/* Exchange Type Buttons */}
        <View style={s.buttonWrap}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setExchangeType('from_uzs')}
            style={[
              s.button,
              exchangeType === 'from_uzs'
                ? { backgroundColor: colors.primary }
                : {
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
            ]}
          >
            <Text
              style={[
                s.buttonText,
                exchangeType === 'from_uzs'
                  ? { color: '#fff' }
                  : { color: 'rgba(255, 0, 0, 0.5)' },
              ]}
            >
              UZS-{'>'}USD
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setExchangeType('to_uzs')}
            style={[
              s.button,
              exchangeType === 'to_uzs'
                ? { backgroundColor: colors.primary }
                : {
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
            ]}
          >
            <Text
              style={[
                s.buttonText,
                exchangeType === 'to_uzs'
                  ? { color: '#fff' }
                  : { color: 'rgba(255, 0, 0, 0.5)' },
              ]}
            >
              USD-{'>'}UZS
            </Text>
          </TouchableOpacity>
        </View>

        {/* Exchange Rate Display */}
        <View style={s.rateContainer}>
          <Text style={s.rateText}>Bugungi kurs: {rate}</Text>
        </View>

        {/* From Account Section */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            Qaysi schetdan: {fromAccount ? fromAccount.acctName : ''}
          </Text>
          <View style={s.inputContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={s.inputBtn}
              onPress={() => setModalFromVisible(true)}
            >
              <Text style={s.inputBtnText}>
                {fromAccount === null
                  ? 'Schetni tanlang'
                  : fromAccount.acctCode}
              </Text>
            </TouchableOpacity>
            <View style={s.amountInput}>
              <TextInput
                value={formatNumber(fromAmount)}
                editable={fromAccount !== null}
                keyboardType="numeric"
                style={s.amountInputText}
                onChangeText={handleFromAmountChange}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={s.currencyText}>
                {exchangeType === 'from_uzs' ? 'UZS' : 'USD'}
              </Text>
            </View>
          </View>
        </View>

        {/* To Account Section */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>
            Qaysi schetga: {toAccount ? toAccount.acctName : ''}
          </Text>
          <View style={s.inputContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={s.inputBtn}
              onPress={() => setModalToVisible(true)}
            >
              <Text style={s.inputBtnText}>
                {toAccount === null ? 'Schetni tanlang' : toAccount.acctCode}
              </Text>
            </TouchableOpacity>
            <View style={s.amountInput}>
              <TextInput
                value={formatNumber(toAmount)}
                editable={toAccount !== null}
                keyboardType="numeric"
                style={s.amountInputText}
                onChangeText={handleToAmountChange}
                placeholder="0"
                placeholderTextColor={colors.textMuted}
              />
              <Text style={s.currencyText}>
                {exchangeType !== 'from_uzs' ? 'UZS' : 'USD'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <Button
        title="Valyuta almashish"
        loading={mutation.isPending}
        isDisabled={isButtonDisabled}
        isFullWidth
        onPress={handleSubmit}
      />

      {/* Modals */}
      <AccountSelectorModal
        visible={modalFromVisible}
        onClose={() => setModalFromVisible(false)}
        onSelect={account => {
          setFromAccount(account);
          setModalFromVisible(false);
        }}
        title="Schetlar"
      />

      <AccountSelectorModal
        visible={modalToVisible}
        onClose={() => setModalToVisible(false)}
        onSelect={account => {
          setToAccount(account);
          setModalToVisible(false);
        }}
        title="Schetlar"
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
  },
  buttonWrap: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 700,
  },
  rateContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
  },
  rateText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textPrimary,
    fontWeight: 600,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginVertical: 15,
    color: colors.textPrimary,
  },
  inputContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  inputBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
  },
  inputBtnText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: 500,
  },
  amountInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 48,
  },
  amountInputText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  currencyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: 8,
  },
});
