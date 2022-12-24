import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import tw from 'twrnc';
import { Text, View } from '../components/Themed';
import { QuakeData, month, twoDigits } from '../utils';
import config from '../utils/config';

export default function TabTwoScreen() {

  const [ record, setRecord ] = useState<Array<QuakeData>>([]);
  const [ pressed, setPressed ] = useState<boolean>(false);
  const [ imUri, setImUri ] = useState<string>("");
  const [ depth, setDepth ] = useState<string>('tidak diketahui');

  function getRecords() {
    axios.get(`${config.host}/gempahistory.php`)
    .then((e) => {
      if(record.length === 0) {
        let i = 0;
        e.data.record.forEach((f:QuakeData) => {
          f.coordinate = e.data.record[i].coordinate.split(",");
          f.datetime = new Date(f.datetime)
          i++;
        })
        setRecord(e.data.record.reverse());
      }
    })
    .catch((e) => {
      console.error(e)
    })
  }

  useEffect(() => {
    getRecords();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>

      <View>
        {
          pressed && imUri !== "" ? 
          <View style={tw`flex flex-col items-center pb-5`}>
            <Text style={tw`text-center font-bold text-xl mb-1`}>Informasi Gempa</Text>
            <Image source={{ uri: imUri }} style={tw`w-72 h-80 rounded`} /> 
            <Text>Kedalaman { depth }</Text>
          </View>
          : null
        }
      </View>
      
      <ScrollView style={tw`flex`}>
        { record.length === 0 ? <Text style={tw`text-center`}>Tidak ada riwayat gempa bumi yang tersimpan.</Text> : null }
        {
          record.map((e, i) => {
            return (
              <Pressable key={i} onPress={ () => {
                setPressed(!pressed);
                setImUri(e.shakemap);
                setDepth(e.depth);
              } } style={({ pressed }) => {
                return tw`flex flex-row px-3 mb-2 pt-1 pb-2 w-full ${pressed ? "opacity-50 bg-gray-300":""}`
              }}>
                <Text style={tw`font-bold text-4xl ${e.magnitude > 7 ? "text-red-600" : e.magnitude > 4 ? "text-yellow-500" : "text-yellow-200"}`}>
                  {
                    e.magnitude.toPrecision(2)
                  }
                </Text>
                <View style={tw`px-3 bg-transparent`}>
                  <Text>{e.datetime.getDate()} {month[e.datetime.getMonth()]} {e.datetime.getFullYear()} pukul {twoDigits(e.datetime.getHours())}:{twoDigits(e.datetime.getMinutes())}</Text>
                  <Text style={tw`flex w-3/4 flex-wrap`}>{`${e.wilayah}`}</Text>
                  <Text>Kedalaman {e.depth}</Text>
                  <Text>{e.coordinate[0]}, {e.coordinate[1]}</Text>
                </View>
              </Pressable>
            )
          })
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
