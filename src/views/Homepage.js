import {RefreshControl, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ScrollView, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DataTable, Searchbar, TextInput } from 'react-native-paper';

export default function HomePage({navigation}) {
  const [busNumber, onChangeBusNumber] = React.useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [items] = React.useState([
    {
      key: 1,
      busNumber: '883M',
      arrivalTime: 10,
    },
    {
      key: 2,
      busNumber: '883',
      arrivalTime: 3,
    },
    {
      key: 3,
      busNumber: '169',
      arrivalTime: 1,
    },
    {
      key: 4,
      busNumber: '117',
      arrivalTime: 2,
    },
   ]);

   const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, []);
   })

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <TouchableOpacity onPress={()=> {navigation.navigate('Bus Search Result',{})}}>
      <View pointerEvents="none">
        <Searchbar
          disabled
          placeholder="Enter the bus no."
          onChangeText={() => {
            navigation.navigate('Bus Details',{})
          }}
          value={busNumber}
        />
        </View>
      </TouchableOpacity>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Bus No.</DataTable.Title>
            <DataTable.Title numeric>Arrival Time(mins)</DataTable.Title>
          </DataTable.Header>

          {items.map(item => (
            <DataTable.Row key={item.key}>
              <DataTable.Cell>{item.busNumber}</DataTable.Cell>
              <DataTable.Cell numeric>{item.arrivalTime}</DataTable.Cell>
            </DataTable.Row>
          ))}

        </DataTable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
