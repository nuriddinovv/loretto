import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { ChartOfAccount, colors, debouncedValue, SafeArea } from '@/shared';
import { useChartOfAccountsQuery } from '@/entities';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (account: ChartOfAccount) => void;
  title: string;
};

export function AccountSelectorModal({
  visible,
  onClose,
  onSelect,
  title,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = debouncedValue(searchQuery, 400);

  const { data: accounts = [], isFetching } =
    useChartOfAccountsQuery(debouncedQuery);

  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
    }
  }, [visible]);

  return (
    <Modal
      statusBarTranslucent
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
    >
      <TouchableOpacity
        style={s.modalWrapper}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={e => e.stopPropagation()}
          style={s.modalContent}
        >
          <Text style={s.modalTitle}>{title}</Text>

          <TextInput
            style={s.searchInput}
            placeholder="Qidirish..."
            placeholderTextColor={'#000'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
          />

          {isFetching ? (
            <View style={s.loading}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <FlatList
              data={accounts}
              keyExtractor={item => item.acctCode}
              style={s.list}
              contentContainerStyle={s.listContent}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={s.listItem}
                  onPress={() => onSelect(item)}
                >
                  <Text style={s.listItemText}>
                    {item.acctCode} - {item.acctName}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const s = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.85,
    minHeight: SCREEN_HEIGHT * 0.8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: colors.textPrimary,
  },
  searchInput: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 10,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});
