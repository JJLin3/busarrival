import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import { DataTable } from 'react-native-paper';
import { config } from '../services/LTAServices';
import axios from 'axios';

export default function BusTimingPage({route}) {

  const [ busTiming, setBusTiming ] = React.useState([]);
  const { busStopCode } = route.params;

  function compareTime(timing){
    const time1 = new Date();
    const time2 = new Date(timing);
    
    var timeDiff = Math.abs(time2.getMinutes() - time1.getMinutes());
    // console.log('the minutes: ' +timing)
    // console.log('the minutes: ' +time2.getMinutes() + " _ " + time1.getMinutes() + " _ " + timeDiff)
    return(timeDiff)
  }

  async function getBusArrivalTime(busStop) {
    console.log('start')
  let firstInterval = 0;
  let secondInterval = 0;
  let thirdInterval = 0;
  
  api = `http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=${busStop}`;
  
  const res = await axios.get(api, config)
  //.then(response => console.log(response.data))
  const test = new Date(res.data.Services[0].NextBus.EstimatedArrival)
  
  //console.log(Object.keys(res.data.Services[0]).filter((item, index) => item === ))
  //for(let i = 0; i < 3; i ++){}
  return(res.data.Services)
  
  }

  async function loadAllBusTiming(){
    let data = await getBusArrivalTime(busStopCode);
    let newData = [];
    console.log(JSON.stringify(newData))
    newData = data.map((busstop) => {
      let obj = {};
      obj.ServiceNo = busstop.ServiceNo;
      obj.arrivalTime = compareTime(busstop.NextBus.EstimatedArrival);
      obj.nextArrivalTime = compareTime(busstop.NextBus2.EstimatedArrival);
      return(obj);
    });


    setBusTiming(newData);
  }

  React.useEffect(()=>{
    loadAllBusTiming(busStopCode)
  },[])

  return (
    <ScrollView>
      <DataTable>
          <DataTable.Header>
            <DataTable.Title>Bus No.</DataTable.Title>
            <DataTable.Title numeric>Arrival Time(mins)</DataTable.Title>
            <DataTable.Title numeric>Next Arrival Time(mins)</DataTable.Title>
          </DataTable.Header>

          {busTiming.map((item,index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{item.ServiceNo}</DataTable.Cell>
              <DataTable.Cell numeric>{item.arrivalTime}</DataTable.Cell>
              <DataTable.Cell numeric>{item.nextArrivalTime}</DataTable.Cell>
            </DataTable.Row>
          ))}

        </DataTable>
    </ScrollView>
  );
}