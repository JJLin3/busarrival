import axios from 'axios';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import { config } from '../services/LTAServices';

function compare(a, b) {
  if (a.StopSequence > b.StopSequence) return 1;
  if (b.StopSequence > a.StopSequence) return -1;

  return 0;
}

export default function BusRoutePage({ route, navigation }) {
  const [routes, setRoutes] = React.useState(null);
  const [direction, setDirection] = React.useState(1);
  const { busNumber, destinationCode, altDestinationCode } = route.params;

  let routeRecordNumber = 0
  let busStopRecordNumber = 0
  let busStopCodes = [];
  let lastDestinationCode = altDestinationCode ? altDestinationCode : destinationCode;

  async function getBusRoute(routeRecordNumber) {
    let api = '';
    if (routeRecordNumber === 0) {
      api = 'http://datamall2.mytransport.sg/ltaodataservice/BusRoutes'
    } else {
      api = `http://datamall2.mytransport.sg/ltaodataservice/BusRoutes?$skip=${routeRecordNumber}`
    }
    const res = await axios.get(api, config);
    const data = res.data.value;
    return await data;
  }

  async function getBusStopName(busStopRecordNumbers) {
    const promises = [];
    let api = '';

    busStopRecordNumbers.forEach((recordNumber) => {
      if (recordNumber === 0) {
        api = 'http://datamall2.mytransport.sg/ltaodataservice/BusStops';
      } else {
        api = `http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip=${recordNumber}`
      }

      const res = axios.get(api, config);
      promises.push(res);
    })

    const routes = await Promise.all(promises);
    const actualDatas = routes.map((result) => result.data.value);

    return await actualDatas;
  }

  function getBusStopRecordNumbers(newAvailableValue) {
    let recordNumbers = newAvailableValue.map((busstopcode) => {
      switch (busstopcode) { // Estimated record number depending on the bus stop code
        case 2:
          busStopRecordNumber = 500;
          break;

        case 3:
          busStopRecordNumber = 1500;
          break;

        case 4:
          busStopRecordNumber = 1500;
          break;

        case 5:
          busStopRecordNumber = 2500;
          break;

        case 6:
          busStopRecordNumber = 3000;
          break;

        case 7:
          busStopRecordNumber = 4000;
          break;

        case 8:
          busStopRecordNumber = 4000;
          break;

        case 9:
          busStopRecordNumber = 4500;
          break;
        default:
          busStopRecordNumber = 0;
          break;
      }
      return (busStopRecordNumber)
    })
    return (recordNumbers)
  }

  async function searchForBusStopName(newresults, addition) {
    let availableValue = [];
    newresults.filter((item) => !item.BusStopName).forEach((item) => {
      if (!availableValue) {
        availableValue.push(parseInt(item.BusStopCode.split('')[0]))
      } else {
        if (!availableValue.includes(item.BusStopCode.split('')[0])) {
          availableValue.push(parseInt(item.BusStopCode.split('')[0]))
        }
      }
    })

    let newAvailableValues = [...new Set(availableValue)]
    newRecordNumbers = getBusStopRecordNumbers(newAvailableValues);
    const numb = newRecordNumbers.map((item) => item += addition)
    let newData = await getBusStopName(numb)


    newData.flat().forEach((item) => {

      if (newresults.filter((busstop) => busstop.BusStopCode === item.BusStopCode).length !== 0) {
        if (newresults.filter((busstop) => ((busstop.BusStopCode === item.BusStopCode))).length === 2) { //for bus route with 2 same bus stops 
          newresults[newresults.findLastIndex((busstop) => ((busstop.BusStopCode === item.BusStopCode)))].BusStopName = item.Description;
        }
        newresults[newresults.findIndex((busstop) => ((busstop.BusStopCode === item.BusStopCode)))].BusStopName = item.Description;
      }
    })

    return await newresults;
  }

  async function loadAllBusRoutes(routeRecordNumber) {
    try {
      let busStopRoutes = []
      //set algorithm for guessing the bus route record number using the first digit of bus number
      if (busNumber.split('')[0] !== "1") {
        switch (parseInt(busNumber.split('')[0])) { // Estimated record number depending on the bus number
          case 2:
            routeRecordNumber = 9000;
            break;

          case 3:
            routeRecordNumber = 11500;
            break;

          case 4:
            routeRecordNumber = 13000;
            break;

          case 5:
            routeRecordNumber = 14000;
            break;

          case 6:
            routeRecordNumber = 15500;
            break;

          case 7:
            routeRecordNumber = 17000;
            break;

          case 8:
            routeRecordNumber = 18500;
            break;

          case 9:
            routeRecordNumber = 21000;
            break;

          default:
            routeRecordNumber = 0;
            break;
        }
      } else {
        switch (parseInt(busNumber.split('')[1])) { // Estimated record number depending on the bus number
          case 1:
            routeRecordNumber = 1000;
            break;

          case 2:
            routeRecordNumber = 1500;
            break;

          case 3:
            routeRecordNumber = 2000;
            break;

          case 4:
            routeRecordNumber = 3000;
            break;

          case 5:
            routeRecordNumber = 4000;
            break;

          case 6:
            routeRecordNumber = 5000;
            break;

          case 7:
            routeRecordNumber = 6000;
            break;

          case 8:
            routeRecordNumber = 7500;
            break;

          case 9:
            routeRecordNumber = 8000;
            break;

          default:
            routeRecordNumber = 0;
            break;
        }
      }

      let data = await getBusRoute(routeRecordNumber);
      let data1 = []

      if (data.some((item) => item.ServiceNo !== busNumber)) {// if request data doesn't contain the data required then loop until the data required is found

        if (lastDestinationCode) {//don't have the destination code or direction 2 destination code as the last element in current bus record
          for (let i = routeRecordNumber; i <= (routeRecordNumber + 500 * 5); i += 500) {
            data1[i / 500] = await getBusRoute(i);
            let newData = data1[i / 500].filter((item) => item.ServiceNo === busNumber)
            if (data1[i / 500].some((item) => item.ServiceNo === busNumber)) {
              busStopCodes = busStopCodes.concat(newData);
              if (newData[newData.length - 1].BusStopCode === lastDestinationCode && newData[newData.length - 1].StopSequence !== 1) { //it mean is the last entry but it isn't the first bus stop number
                break;
              };
            };
          };
          busStopRoutes = busStopCodes.flat().map((item) => {
            let obj = {};

            obj.BusStopCode = item.BusStopCode;
            obj.Direction = item.Direction;
            obj.StopSequence = item.StopSequence;

            return (obj);
          })

        };
        busStopRoutes.sort(compare);

      } else {
        if (data[data.length - 1].BusStopCode !== lastDestinationCode) { //don't have the destination code or direction 2 destination code as the last element in current bus record
          routeRecordNumber += 500;

          data1 = await getBusRoute(routeRecordNumber);
          busStopCodes = data.concat(data1)
          busStopRoutes = busStopCodes.map((item) => {
            let obj = {};

            obj.BusStopCode = item.BusStopCode;
            obj.Direction = item.Direction;
            obj.StopSequence = item.StopSequence;

            return (obj);
          });

        } else {
          busStopRoutes = data.map((item) => {
            let obj = {};

            obj.BusStopCode = item.BusStopCode;
            obj.Direction = item.Direction;
            obj.StopSequence = item.StopSequence;

            return (obj);
          });
        };
      }
      console.log('here: ' + JSON.stringify(busStopRoutes) + " \n\n " + routeRecordNumber)
      return (busStopRoutes)

    } catch (error) {
      console.error(error)
    }
  };

  async function loadAllBusStop(busRoute) {
    try {
      let newroutes = busRoute.map(a => Object.assign({}, a)); //copy of array of object 

      newroutes = await searchForBusStopName(newroutes, 0)

      if (newroutes.filter((busstop) => !busstop.BusStopName).length > 0) {
        newroutes = await searchForBusStopName(newroutes, 500)
        if (newroutes.filter((busstop) => !busstop.BusStopName).length > 0) {
          newroutes = await searchForBusStopName(newroutes, 1000)
        }
      }
      setRoutes(newroutes)
    } catch (error) {
      console.error(error)
    }
  }

  React.useEffect(() => {

    loadAllBusRoutes(routeRecordNumber).then((busRoute) => {
      loadAllBusStop(busRoute);
    })
  }, []);

  return (
    <ScrollView>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Bus Stops</DataTable.Title>
          <View>
            <IconButton
              icon="swap-horizontal"
              mode="contained-tonal"
              size={20}
              onPress={() => {
                switch (direction) {
                  case 1:
                    setDirection(2);
                    break;
                  case 2:
                    setDirection(1);
                    break;
                  default:
                    break;
                }
              }} />
          </View>
        </DataTable.Header>

        {routes !== null ? routes.filter((item) => item.Direction === direction).map((item, index) => (
          <DataTable.Row key={index} onPress={() => { navigation.navigate('Bus Timing', { busStopCode: item.BusStopCode }) }} >
            <DataTable.Cell>{item.BusStopName}</DataTable.Cell>
          </DataTable.Row>
        )) : <DataTable.Row></DataTable.Row>}
      </DataTable>
    </ScrollView>
  );
}
