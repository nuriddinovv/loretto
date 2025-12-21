import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {
  Button,
  colors,
  DatePickerModal,
  formatDate,
  JournalEntries,
  type JournalEntriesLine,
} from '@/shared';
import { AccountSelectorModal } from '@/features/currencyExchange';
import { Trash } from 'lucide-react-native';
import {
  useDelJournalEntryMutation,
  useJournalEntriesQuery,
} from '@/entities/journalEntries';

export function JournalEntriesForm() {
  // ISO string formatida saqlayapmiz (sizdagi logika saqlanadi)
  const [fromDate, setFromDate] = useState<string>(new Date().toISOString());
  const [toDate, setToDate] = useState<string>(new Date().toISOString());

  const [fromDateModal, setFromDateModal] = useState(false);
  const [toDateModal, setToDateModal] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedActCode, setSelectedActCode] = useState<string | null>(null);
  const [selectedActName, setSelectedActName] = useState<string | null>(null);

  // delete modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(true);
  const [selectedJdtNum, setSelectedJdtNum] = useState<number | null>(null);
  const delMut = useDelJournalEntryMutation();

  // ISO -> YYYY-MM-DD (backend paramlar uchun)
  const dateFromParam = useMemo(() => fromDate.slice(0, 10), [fromDate]);
  const dateToParam = useMemo(() => toDate.slice(0, 10), [toDate]);

  // canFetch: API chaqirish sharti
  const canFetch = !!selectedActCode && !!dateFromParam && !!dateToParam;

  const { data, isLoading } = useJournalEntriesQuery(
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

  const renderJournalLine = useCallback(
    ({
      line,
      type,
    }: {
      line: JournalEntriesLine;
      type: 'debit' | 'credit';
    }) => {
      const amount = type === 'debit' ? line.debit : line.credit;
      const fcAmount = type === 'debit' ? line.fcdebit : line.fccredit;

      if (!amount || amount === 0) return null;

      return (
        <View style={s.lineCard}>
          <Text style={s.lineTitle}>
            {line.accountCode} - {line.accountName}
          </Text>

          <View style={s.lineAmounts}>
            <Text style={s.amountText}>{amount.toLocaleString()} USD</Text>
            <Text style={s.amountText}>{fcAmount.toLocaleString()} UZS</Text>
          </View>
        </View>
      );
    },
    [],
  );
  const renderItem = useCallback(
    ({ item }: { item: JournalEntries }) => (
      <View style={s.entryCard}>
        <View style={s.entryHeader}>
          <Text style={s.entryHeaderText}>#{item.jdtNum}</Text>
          <Text style={s.entryHeaderText}>
            {formatDate(item.referenceDate)}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setSelectedJdtNum(item.jdtNum)}
          >
            <Trash color={colors.primary} size={24} />
          </TouchableOpacity>
        </View>

        {/* DEBIT */}
        <View style={s.sectionRow}>
          <Text style={[s.sectionBadge, s.badgeDebit]}>DEBIT</Text>
        </View>
        <View style={s.linesWrap}>
          {item.journalEntryLines?.map((line, idx) => (
            <React.Fragment key={`d-${item.jdtNum}-${idx}`}>
              {renderJournalLine({ line, type: 'debit' })}
            </React.Fragment>
          ))}
        </View>

        {/* CREDIT */}
        <View style={s.sectionRow}>
          <Text style={[s.sectionBadge, s.badgeCredit]}>KREDIT</Text>
        </View>
        <View style={s.linesWrap}>
          {item.journalEntryLines?.map((line, idx) => (
            <React.Fragment key={`c-${item.jdtNum}-${idx}`}>
              {renderJournalLine({ line, type: 'credit' })}
            </React.Fragment>
          ))}
        </View>

        <Text style={s.memoText}>IZOH: {item.memo ?? '-'}</Text>
      </View>
    ),
    [renderJournalLine],
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
          {data.data?.length ? (
            <FlatList
              data={data.data}
              renderItem={renderItem}
              keyExtractor={item => String(item.jdtNum)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={s.listContent}
              style={s.list}
            />
          ) : (
            <View style={s.emptyContainer}>
              <Text style={s.emptyText}>Ma'lumot yo'q</Text>
            </View>
          )}
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
      <Modal
        visible={selectedJdtNum !== null}
        animationType="fade"
        transparent
        statusBarTranslucent
        onRequestClose={() => setSelectedJdtNum(null)}
      >
        <View style={s.confirmBackdrop}>
          <View style={s.confirmCard}>
            <Text style={s.confirmTitle}>
              Siz rostdan ham #{selectedJdtNum} amaliyotni o'chirmoqchimisiz?
            </Text>

            <View style={s.confirmActions}>
              {delMut.isPending ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={s.confirmBtn}
                    onPress={async () => {
                      if (!selectedJdtNum) return;

                      try {
                        await delMut.mutateAsync(selectedJdtNum);
                        setSelectedJdtNum(null);
                      } catch (e) {
                        // xohlasangiz Alert ham qo'shamiz
                      }
                    }}
                  >
                    <Text style={[s.confirmBtnText, { color: 'red' }]}>Ha</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={s.confirmBtn}
                    onPress={() => setSelectedJdtNum(null)}
                  >
                    <Text style={s.confirmBtnText}>Yo'q</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { gap: 10, marginBottom: 10 },

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
    justifyContent: 'space-between',
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
  entryCard: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  entryHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  sectionRow: { marginTop: 6, marginBottom: 6 },
  sectionBadge: {
    fontSize: 14,
    fontWeight: '800',
    marginRight: 'auto',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    color: colors.textPrimary,
  },
  badgeDebit: { backgroundColor: 'rgba(0, 255, 17, 0.6)' },
  badgeCredit: { backgroundColor: 'rgba(255, 0, 0, 0.53)' },

  linesWrap: { gap: 8 },

  lineCard: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: colors.border,
  },
  lineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  lineAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  memoText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  confirmBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  confirmCard: {
    width: '100%',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.border,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    alignItems: 'center',
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 110,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
