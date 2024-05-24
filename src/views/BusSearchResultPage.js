import axios from 'axios';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native';
import { DataTable, Searchbar } from 'react-native-paper';
import { config } from '../services/LTAServices';
import { useIsFocused } from '@react-navigation/native';

export default function BusSearchResultPage({ navigation }) {
  const [busServices, setBusServices] = React.useState(null);
  const [busNumber, onChangeBusNumber] = React.useState('');
  const [results, setResults] = React.useState(null);

  removeDuplicate = (arr) => {
    let newArr = arr.map((value, index, self) => {
      let newObj = {};

      if (index !== self.findIndex((t) => (t.ServiceNo === value.ServiceNo))) {
        let originIndex = self.findIndex((t) => (t.ServiceNo === value.ServiceNo));
        newObj.ServiceNo = arr[originIndex].ServiceNo;
        newObj.Category = arr[originIndex].Category;
        newObj.OriginCode = arr[originIndex].OriginCode;
        newObj.DestinationCode = arr[originIndex].DestinationCode;
        newObj.AltOriginCode = value.AltOriginCode;
        newObj.AltDestinationCode = value.AltDestinationCode;
      } else if (index === self.findIndex((t) => (t.ServiceNo === value.ServiceNo)) && self.filter((item) => item.ServiceNo === value.ServiceNo).length === 1) {
        newObj.ServiceNo = value.ServiceNo;
        newObj.Category = value.Category;
        newObj.OriginCode = value.OriginCode;
      }
      return (newObj)
    })

    return (newArr)
  }

  async function loadAllBusServices() {
    try {
      let api1 = 'http://datamall2.mytransport.sg/ltaodataservice/BusServices';
      let api2 = 'http://datamall2.mytransport.sg/ltaodataservice/BusServices?$skip=500';

      const promise1 = axios.get(api1, config)
      const promise2 = axios.get(api2, config);
      let newData = [];
      let busDetails = [];

      const res = await Promise.all([promise1, promise2])

      const data = res.map((res) => res.data.value)
      //setBusServices(removeDuplicate(data.flat()))

      newData = data.flat().map((item) => {
        let obj = {};

        switch (item.Direction) {
          case 1:
            obj.ServiceNo = item.ServiceNo;
            obj.Category = item.Category;
            obj.OriginCode = item.OriginCode;
            obj.DestinationCode = item.DestinationCode;
            break;
          case 2:
            obj.ServiceNo = item.ServiceNo;
            obj.Category = item.Category;
            obj.AltOriginCode = item.OriginCode;
            obj.AltDestinationCode = item.DestinationCode;
            break;
          default:
            break;
        }

        return (obj)

      })
      busDetails = removeDuplicate(newData).filter((item) => Object.keys(item).length !== 0);
      busDetails.sort((a, b) => {
        const bus1 = a.ServiceNo.toUpperCase(); // ignore upper and lowercase
        const bus2 = b.ServiceNo.toUpperCase(); // ignore upper and lowercase

        if (bus1 < bus2) {
          return -1;
        }
        if (bus1 > bus2) {
          return 1;
        }
        // ServiceNo must be equal
        return 0;
      })
      setBusServices(busDetails)

    } catch (error) {
      console.error(error)
    }
  }

  // const isFocused = navigation.isFocused();


  React.useEffect(() => {
    loadAllBusServices();

  }, []);

  return (
    <ScrollView>
      <View>
        <Searchbar
          placeholder="Enter the bus no."
          onChangeText={newValue => {
            onChangeBusNumber(newValue);
            setResults(busServices.filter((item) => item.ServiceNo.includes(newValue)))
          }}
          value={busNumber}
        />
      </View>
      <View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Bus Services</DataTable.Title>
          </DataTable.Header>

          {results ? results.map((item, index) => (
            <DataTable.Row key={index} onPress={() => { navigation.navigate('Bus Route', { busNumber: item.ServiceNo, destinationCode: item.DestinationCode, altDestinationCode: item.AltDestinationCode }) }}>
              <DataTable.Cell>{item.ServiceNo}</DataTable.Cell>
            </DataTable.Row>
          )) : <DataTable.Row></DataTable.Row>}

        </DataTable>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}></View>
    </ScrollView>
  );
}
