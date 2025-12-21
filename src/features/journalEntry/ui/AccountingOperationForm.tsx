import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import {
  ChartOfAccount,
  Client,
  colors,
  Button,
  type InvoiceData,
} from '@/shared';
import { useCurrency } from '@/entities';
import { AccountSelectorModal } from '@/features/currencyExchange';
import { ClientSelectorModal } from './ClientSelectorModal';
import { useJournalEntriesMutation } from '../model/useJournalEntriesMutation';

// Get current date in ISO format (2024-12-08T00:00:00Z)
const getReferenceDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00Z`;
};

type OperationType = 'PRIXOD' | 'RASXOD';

export function AccountingOperationForm() {
  const { rate } = useCurrency();
  const [selectedType, setSelectedType] = useState<OperationType>('PRIXOD');

  // Main invoice (contra account)
  const [mainInvoice, setMainInvoice] = useState<InvoiceData | undefined>();

  // Invoice items
  const [invoice, setInvoice] = useState<InvoiceData[]>([]);

  // Comment
  const [comment, setComment] = useState('');

  // Input values for controlled inputs
  const [inputValues, setInputValues] = useState<
    Record<number, { usd: string; uzs: string }>
  >({});

  // Modals
  const [modalMainVisible, setModalMainVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [clientsModalVisible, setClientsModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);

  const mutation = useJournalEntriesMutation({
    onSuccess: () => {
      setComment('');
      setInvoice([]);
      setMainInvoice(undefined);
      setInputValues({});
      setCommentModalVisible(false);
    },
    onError: () => {
      setCommentModalVisible(false);
    },
  });

  // Calculate totals
  const { totalUSD, totalUZS } = useMemo(() => {
    if (!invoice.length) {
      return { totalUSD: 0, totalUZS: 0 };
    }

    const usdTotal = invoice.reduce(
      (sum, item) =>
        sum +
        (Number(selectedType === 'PRIXOD' ? item.credit : item.debit) || 0),
      0,
    );

    const uzsTotal = invoice.reduce(
      (sum, item) =>
        sum +
        (Number(selectedType === 'PRIXOD' ? item.fccredit : item.fcdebit) || 0),
      0,
    );

    return {
      totalUSD: Number(usdTotal.toFixed(2)),
      totalUZS: Number(uzsTotal.toFixed(2)),
    };
  }, [invoice, selectedType]);

  // Clear data when type changes
  useEffect(() => {
    setMainInvoice(undefined);
    setInvoice([]);
    setInputValues({});
  }, [selectedType]);

  const handleAddMainInvoice = useCallback((item: ChartOfAccount) => {
    const newMainInvoice: InvoiceData = {
      accountCode: item.acctCode,
      bplid: 1,
      credit: 0.0,
      contraAccount: null,
      debit: 0,
      fccredit: 0.0,
      fccurrency: 'UZS',
      fcdebit: 0,
      shortName: item.acctCode,
      name: item.acctName,
    };
    setMainInvoice(newMainInvoice);
    setModalMainVisible(false);
  }, []);

  const handleAddInvoice = useCallback(
    (item: ChartOfAccount) => {
      const newInvoice: InvoiceData = {
        accountCode: item.acctCode,
        bplid: 1,
        credit: 0.0,
        contraAccount: mainInvoice?.accountCode || null,
        debit: 0,
        fccredit: 0.0,
        fccurrency: 'UZS',
        fcdebit: 0,
        shortName: item.acctCode,
        name: item.acctName,
      };

      if (!invoice.some(acct => acct.accountCode === newInvoice.accountCode)) {
        setInvoice(prev => [...prev, newInvoice]);
        setModalVisible(false);
      }
    },
    [mainInvoice?.accountCode, invoice],
  );

  const handleAddClient = useCallback(
    (item: Client) => {
      const newClient: InvoiceData = {
        accountCode: null,
        bplid: 1,
        credit: 0.0,
        contraAccount: mainInvoice?.accountCode || null,
        debit: 0,
        fccredit: 0.0,
        fccurrency: 'UZS',
        fcdebit: 0,
        shortName: item.cardCode,
        name: item.cardName,
      };

      if (!invoice.some(acct => acct.shortName === newClient.shortName)) {
        setInvoice(prev => [...prev, newClient]);
        setClientsModalVisible(false);
      }
    },
    [mainInvoice?.accountCode, invoice],
  );

  const updateInvoiceItem = useCallback(
    (index: number, updates: Partial<InvoiceData>) => {
      setInvoice(prev =>
        prev.map((item, idx) => {
          if (idx === index) {
            const updated = { ...item, ...updates };
            if (selectedType === 'PRIXOD') {
              updated.credit = Number(updated.credit) || 0;
              updated.fccredit = Number(updated.fccredit) || 0;
            } else {
              updated.debit = Number(updated.debit) || 0;
              updated.fcdebit = Number(updated.fcdebit) || 0;
            }
            return updated;
          }
          return item;
        }),
      );
    },
    [selectedType],
  );

  const handleInputChange = (
    index: number,
    type: 'usd' | 'uzs',
    value: string,
  ) => {
    // Input qiymatini saqlash
    setInputValues(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [type]: value,
      },
    }));

    // Bo'sh string bo'lsa
    if (value === '' || value === '.') {
      if (type === 'uzs') {
        updateInvoiceItem(index, {
          [selectedType === 'PRIXOD' ? 'fccredit' : 'fcdebit']: 0,
          [selectedType === 'PRIXOD' ? 'credit' : 'debit']: 0,
        });
      } else {
        updateInvoiceItem(index, {
          [selectedType === 'PRIXOD' ? 'credit' : 'debit']: 0,
        });
      }
      return;
    }

    // Raqamni parse qilish
    const numValue =
      parseFloat(value.replace(/,/g, '').replace(/\s/g, '')) || 0;

    if (type === 'uzs') {
      // UZS o'zgartirilsa - USD ni avtomatik hisoblash
      const currentRate = rate && rate > 0 ? rate : 1;
      const calculatedUSD = numValue / currentRate;

      // USD inputValues ni tozalash
      setInputValues(prev => {
        const newValues = { ...prev };
        if (newValues[index]) {
          delete newValues[index].usd;
        }
        return newValues;
      });

      updateInvoiceItem(index, {
        [selectedType === 'PRIXOD' ? 'fccredit' : 'fcdebit']: numValue,
        [selectedType === 'PRIXOD' ? 'credit' : 'debit']: Number(
          calculatedUSD.toFixed(2),
        ),
      });
    } else {
      // USD o'zgartirilsa - faqat USD ni yangilash
      updateInvoiceItem(index, {
        [selectedType === 'PRIXOD' ? 'credit' : 'debit']: numValue,
      });
    }
  };

  const getInputValue = (index: number, type: 'usd' | 'uzs'): string => {
    // Agar inputValues da mavjud bo'lsa, uni qaytarish (user yozayotgan qiymat)
    if (inputValues[index]?.[type] !== undefined) {
      return inputValues[index][type];
    }

    // Aks holda, invoice dan qiymatni qaytarish
    const item = invoice[index];
    if (!item) return '';

    if (type === 'usd') {
      const value = selectedType === 'PRIXOD' ? item.credit : item.debit;
      return value && value !== 0 ? String(value) : '';
    } else {
      const value = selectedType === 'PRIXOD' ? item.fccredit : item.fcdebit;
      return value && value !== 0 ? String(value) : '';
    }
  };

  const handleSubmit = async () => {
    if (mutation.isPending || !mainInvoice) return;

    try {
      const finalMainInvoice = {
        ...mainInvoice,
        ...(selectedType === 'PRIXOD'
          ? { debit: totalUSD, fcdebit: totalUZS }
          : { credit: totalUSD, fccredit: totalUZS }),
      };

      const journalEntryLines = [...invoice, finalMainInvoice];

      await mutation.mutateAsync({
        memo: comment.trim(),
        referenceDate: getReferenceDate(),
        journalEntryLines,
      });
      // onSuccess callback orqali modal yopiladi
    } catch (error) {
      setCommentModalVisible(false);
    }
  };

  const formatNumber = (value: string | number, isUSD = false): string => {
    if (!value && value !== 0) return '';
    const numValue = typeof value === 'string' ? Number(value) : value;
    if (isNaN(numValue)) return '';

    // Agar 0 bo'lsa, bo'sh string qaytarish (foydalanuvchi o'chirgan bo'lsa)
    if (numValue === 0) return '';

    if (isUSD) {
      // USD uchun kasr qismni faqat mavjud bo'lsa ko'rsatish
      // Agar butun son bo'lsa, kasr qismni ko'rsatmaslik
      const hasDecimal = numValue % 1 !== 0;
      return numValue.toLocaleString('ru-RU', {
        useGrouping: true,
        minimumFractionDigits: hasDecimal ? 2 : 0,
        maximumFractionDigits: 2,
      });
    } else {
      // UZS uchun butun son
      return Math.round(numValue).toLocaleString('ru-RU', {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={s.container}
    >
      <View style={s.content}>
        {/* Type Selection */}
        <View style={s.switchContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              s.switchButton,
              selectedType === 'PRIXOD' && s.selectedButton,
            ]}
            onPress={() => setSelectedType('PRIXOD')}
          >
            <Text
              style={[
                s.switchText,
                selectedType === 'PRIXOD' && s.selectedText,
              ]}
            >
              PRIXOD
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              s.switchButton,
              selectedType === 'RASXOD' && s.selectedButton,
            ]}
            onPress={() => setSelectedType('RASXOD')}
          >
            <Text
              style={[
                s.switchText,
                selectedType === 'RASXOD' && s.selectedText,
              ]}
            >
              RASXOD
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Invoice Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={s.mainButton}
          onPress={() => setModalMainVisible(true)}
        >
          <Text style={s.mainButtonText}>
            {mainInvoice
              ? `${mainInvoice.shortName} - ${mainInvoice.name}`
              : `${selectedType} SCHET TANLANG`}
          </Text>
        </TouchableOpacity>

        {/* Invoice Items */}
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.scrollContent}
        >
          {invoice.map((item, index) => (
            <View key={index} style={s.accountOption}>
              <Text style={s.accountName}>
                {item.shortName} - {item.name}
              </Text>
              <View style={s.accountOptionWrap}>
                <View style={s.accountOptionInputWrap}>
                  <TextInput
                    style={s.accountOptionInput}
                    keyboardType="decimal-pad"
                    placeholder="USD"
                    value={getInputValue(index, 'usd')}
                    onChangeText={value =>
                      handleInputChange(index, 'usd', value)
                    }
                    placeholderTextColor={colors.textMuted}
                  />
                  <Text style={s.currencyText}>$</Text>
                </View>
                <View style={s.accountOptionInputWrap}>
                  <TextInput
                    style={s.accountOptionInput}
                    keyboardType="decimal-pad"
                    placeholder="UZS"
                    value={getInputValue(index, 'uzs')}
                    onChangeText={value =>
                      handleInputChange(index, 'uzs', value)
                    }
                    placeholderTextColor={colors.textMuted}
                  />
                  <Text style={s.currencyText}>SUM</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Action Buttons */}
        {mainInvoice && (
          <View style={s.actionButtons}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={s.actionButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={s.actionButtonText}>Schet tanlash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={s.actionButton}
              onPress={() => setClientsModalVisible(true)}
            >
              <Text style={s.actionButtonText}>Klient tanlash</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Totals and Submit */}
        <View style={s.totalContainer}>
          <View style={s.totalTextContainer}>
            <Text style={s.totalText}>
              USD:{' '}
              {totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
            <Text style={s.totalText}>
              UZS:{' '}
              {totalUZS.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <Button
            title="QO'SHISH"
            loading={mutation.isPending}
            isDisabled={!mainInvoice || invoice.length === 0}
            isFullWidth
            onPress={() => setCommentModalVisible(true)}
          />
        </View>
      </View>

      {/* Modals */}
      <AccountSelectorModal
        visible={modalMainVisible}
        onClose={() => setModalMainVisible(false)}
        onSelect={handleAddMainInvoice}
        title={`${selectedType} uchun schet`}
      />

      <AccountSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleAddInvoice}
        title={`${selectedType} uchun schetlar`}
      />

      <ClientSelectorModal
        visible={clientsModalVisible}
        onClose={() => setClientsModalVisible(false)}
        onSelect={handleAddClient}
        title={`${selectedType} uchun klientlar`}
      />

      {/* Comment Modal */}
      <Modal
        statusBarTranslucent
        visible={commentModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <TouchableOpacity
          style={s.commentModalContainer}
          activeOpacity={1}
          onPress={() => setCommentModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={e => e.stopPropagation()}
            style={s.commentModal}
          >
            <View style={s.commentModalHeader}>
              <Text style={s.commentModalHeaderText}>Izoh</Text>
            </View>
            <TextInput
              multiline
              style={s.commentModalInput}
              placeholder="Izoh..."
              value={comment}
              onChangeText={setComment}
              placeholderTextColor={colors.textMuted}
            />
            <View style={s.commentModalButton}>
              <Button
                title="QO'SHISH"
                loading={mutation.isPending}
                isDisabled={!comment.trim()}
                isFullWidth
                onPress={handleSubmit}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  switchButton: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  switchText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 0, 0, 0.5)',
  },
  selectedText: {
    color: '#fff',
  },
  mainButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mainButtonText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.textPrimary,
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  accountOption: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountName: {
    fontSize: 16,
    marginBottom: 10,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  accountOptionWrap: {
    flexDirection: 'row',
    gap: 10,
  },
  accountOptionInputWrap: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 48,
  },
  accountOptionInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  currencyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalContainer: {
    gap: 10,
    paddingTop: 10,
  },
  totalTextContainer: {
    gap: 5,
  },
  totalText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  commentModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  commentModal: {
    borderRadius: 12,
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
  },
  commentModalHeader: {
    marginBottom: 15,
  },
  commentModalHeaderText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  commentModalInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    fontSize: 16,
    paddingVertical: 10,
    color: colors.textPrimary,
    minHeight: 50,
  },
  commentModalButton: {
    marginTop: 20,
  },
});
