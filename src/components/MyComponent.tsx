import React, {
  useState,
  useEffect,
  useRef,
  PropsWithChildren,
  useCallback,
} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';

import type {Item} from '../types/data';

type Props = PropsWithChildren<{
  data: Array<Item>;
}>;
const MyComponent = ({data}: Props) => {
  const [selectedItems, setSelectedItems] = useState<Array<Item>>([]);
  const [dataSource, setDataSource] = useState<Array<Item>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setDataSource(data);
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDataSource(
        data.filter(item =>
          item.name?.toLowerCase().includes(searchTerm?.toLowerCase()),
        ),
      );
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [data, searchTerm]);

  const handleSelect = useCallback(
    (item: Item) => {
      if (selectedItems.find(selectedItem => selectedItem.id === item.id)) {
        return setSelectedItems(prevState =>
          prevState.filter(prevItem => prevItem.id !== item.id),
        );
      }
      return setSelectedItems(currentSelectedItems => [
        ...currentSelectedItems,
        item,
      ]);
    },
    [selectedItems],
  );

  const handleClear = useCallback(() => {
    setSearchTerm('');
  }, []);

  return (
    <View>
      <View style={styles.row}>
        <TextInput
          ref={inputRef}
          placeholder="Search......."
          onChangeText={setSearchTerm}
          value={searchTerm}
        />
        <TouchableOpacity onPress={handleClear}>
          <Text>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={dataSource}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleSelect(item)}>
            <Text>{item.name}</Text>
            <Text>
              {selectedItems.includes(item) ? 'Selected' : 'Not selected'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    paddingVertical: 6,
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
});

export default MyComponent;
