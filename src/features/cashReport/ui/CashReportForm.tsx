import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {
  colors,
  DatePickerModal,
  formatDate,
  type CashReportLine,
} from '@/shared';
import { useCashReportQuery } from '@/entities';
import { AccountSelectorModal } from '@/features/currencyExchange';

export function CashReportForm() {
  // ISO string formatida saqlayapmiz (sizdagi logika saqlanadi)
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString());
  const [toDate, setToDate] = useState<string>(new Date().toISOString());

  const [fromDateModal, setFromDateModal] = useState(false);
  const [toDateModal, setToDateModal] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedActCode, setSelectedActCode] = useState<string | null>(null);
  const [selectedActName, setSelectedActName] = useState<string | null>(null);

  // ISO -> YYYY-MM-DD (backend paramlar uchun)
  const dateFromParam = useMemo(() => fromDate.slice(0, 10), [fromDate]);
  const dateToParam = useMemo(() => toDate.slice(0, 10), [toDate]);

  // canFetch: API chaqirish sharti
  const canFetch = !!selectedActCode && !!dateFromParam && !!dateToParam;

  const { data, isLoading } = useCashReportQuery(
    canFetch
      ? {
          accountCode: selectedActCode!,
          dateFrom: dateFromParam,
          dateTo: dateToParam,
        }
      : undefined,
  );
  console.log(data);

  const handleDatePress = useCallback(
    (
      day: { dateString: string }, // YYYY-MM-DD
      setDate: (date: string) => void,
      setModal: (visible: boolean) => void,
    ) => {
      const isoDate = new Date(day.dateString).toISOString();
      setDate(isoDate);
      setModal(false);
    },
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: CashReportLine }) => (
      <View style={s.box}>
        <View style={s.boxHeader}>
          <Text
            style={[
              s.boxTitle,
              item.type === 'Приход' ? s.incomeBadge : s.expenseBadge,
            ]}
          >
            {item.type}
          </Text>
          <Text style={s.boxTitle}> - {item.acctName}</Text>
        </View>

        <View style={s.boxAmountWrapper}>
          <Text style={s.amountText}>
            {item.amountUSD.toLocaleString()} USD
          </Text>
          <Text style={s.amountText}>
            {item.amountUZS.toLocaleString()} UZS
          </Text>
        </View>

        <Text style={s.boxTitle}>IZOH: {item.memo ?? '-'}</Text>
      </View>
    ),
    [],
  );

  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={s.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={s.buttonText}>
            {selectedActCode
              ? `${selectedActCode} - ${selectedActName ?? ''}`
              : 'SCHETNI TANLANG'}
          </Text>
        </TouchableOpacity>

        <View style={s.switchContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.switchButton}
            onPress={() => setFromDateModal(true)}
          >
            <Text style={s.switchText}>{formatDate(dateFromParam)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={s.switchButton}
            onPress={() => setToDateModal(true)}
          >
            <Text style={s.switchText}>{formatDate(dateToParam)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : data?.data ? (
        <>
          <View style={s.balanceWrapper}>
            <Text style={s.balanceTitle}>Boshiga</Text>
            <View style={s.balance}>
              <Text style={s.balanceText}>
                {data.data.openingBalanceUSD.toLocaleString()} USD
              </Text>
              <Text style={s.balanceText}>
                {data.data.openingBalanceUZS.toLocaleString()} UZS
              </Text>
            </View>
          </View>

          {data.data.lines?.length ? (
            <FlatList
              data={data.data.lines}
              renderItem={renderItem}
              keyExtractor={(item, index) => String(index)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.listContent}
              style={s.list}
            />
          ) : (
            <View style={s.emptyContainer}>
              <Text style={s.emptyText}>Ma'lumot yo'q</Text>
            </View>
          )}

          <View style={s.balanceWrapper}>
            <Text style={s.balanceTitle}>Oxiriga</Text>
            <View style={s.balance}>
              <Text style={s.balanceText}>
                {data.data.closingBalanceUSD.toLocaleString()} USD
              </Text>
              <Text style={s.balanceText}>
                {data.data.closingBalanceUZS.toLocaleString()} UZS
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={s.emptyContainer}>
          <Text style={s.emptyText}>
            {canFetch ? "Ma'lumot yo'q" : 'Schet va sanani tanlang'}
          </Text>
        </View>
      )}

      {/* Modals */}
      <DatePickerModal
        visible={fromDateModal}
        onClose={() => setFromDateModal(false)}
        onDateSelect={day =>
          handleDatePress(day, setFromDate, setFromDateModal)
        }
        onClear={() => {
          setFromDate(new Date().toISOString());
          setFromDateModal(false);
        }}
        title="Qaysi sanadan:"
      />

      <DatePickerModal
        visible={toDateModal}
        onClose={() => setToDateModal(false)}
        onDateSelect={day => handleDatePress(day, setToDate, setToDateModal)}
        onClear={() => {
          setToDate(new Date().toISOString());
          setToDateModal(false);
        }}
        title="Qaysi sanagacha:"
      />

      <AccountSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={account => {
          setSelectedActCode(account.acctCode);
          setSelectedActName(account.acctName);
          setModalVisible(false);
        }}
        title="SCHETNI TANLANG"
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { gap: 10 },

  button: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },

  switchContainer: { flexDirection: 'row', gap: 10 },
  switchButton: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchText: { fontSize: 16, fontWeight: '500', color: colors.textPrimary },

  balanceWrapper: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  balance: { flexDirection: 'row', justifyContent: 'space-between' },
  balanceText: { fontSize: 16, fontWeight: '500', color: colors.textPrimary },

  box: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  boxTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },

  incomeBadge: {
    backgroundColor: 'rgba(0, 255, 17, 0.5)',
    padding: 4,
    borderRadius: 5,
    marginRight: 4,
  },
  expenseBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    padding: 4,
    borderRadius: 5,
    marginRight: 4,
  },

  boxAmountWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  amountText: { fontSize: 16, fontWeight: '500', color: colors.textPrimary },

  list: { flex: 1 },
  listContent: { paddingTop: 8 },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, color: colors.textSecondary },
});
