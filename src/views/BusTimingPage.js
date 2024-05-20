import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import { DataTable } from 'react-native-paper';

export default function BusTimingPage() {

  const [items] = React.useState([
    {
      key: 1,
      busNumber: '883M',
      arrivalTime: 10,
      nextArrivalTime: 12,
    },
    {
      key: 2,
      busNumber: '883',
      arrivalTime: 3,
      nextArrivalTime: 10,
    },
    {
      key: 3,
      busNumber: '169',
      arrivalTime: 1,
      nextArrivalTime: 5,
    },
    {
      key: 4,
      busNumber: '117',
      arrivalTime: 2,
      nextArrivalTime: 6,
    },
  ])

  return (
    <ScrollView>
      <DataTable>
          <DataTable.Header>
            <DataTable.Title>Bus No.</DataTable.Title>
            <DataTable.Title numeric>Arrival Time(mins)</DataTable.Title>
            <DataTable.Title numeric>Next Arrival Time(mins)</DataTable.Title>
          </DataTable.Header>

          {items.map(item => (
            <DataTable.Row key={item.key}>
              <DataTable.Cell>{item.busNumber}</DataTable.Cell>
              <DataTable.Cell numeric>{item.arrivalTime}</DataTable.Cell>
              <DataTable.Cell numeric>{item.nextArrivalTime}</DataTable.Cell>
            </DataTable.Row>
          ))}

        </DataTable>
    </ScrollView>
  );
}