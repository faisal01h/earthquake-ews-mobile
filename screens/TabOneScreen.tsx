import { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, useColorScheme, Pressable } from 'react-native';
import * as Linking from 'expo-linking';
// import MapView, { Marker } from 'react-native-maps';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { QuakeData, month, twoDigits } from '../utils/index'

import tw from 'twrnc';
import axios from 'axios';

import config from '../utils/config';
import { FontAwesome } from '@expo/vector-icons';
import WebView from 'react-native-webview';

export default function TabThreeScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [ isLive, setIsLive ] = useState(true);
  const [ quakeNow, setQuakeNow ] = useState<QuakeData|null>(null);
  const [ connError, setConnError ] = useState<null|string>(null);
  const [ update, setUpdate ] = useState<any>(null);
  const colorScheme = useColorScheme();

  function getQuakeData() {
    axios.get(`${config.host}/autogempa.php`)
    .then((e) => {
      if(e.data.Coordinates) {
        let coords = e.data.Coordinates.split(",");
        coords[0] = Number.parseFloat(coords[0]);
        coords[1] = Number.parseFloat(coords[1]);
        setQuakeNow({
          time: new Date(e.data.DateTime),
          magnitude: e.data.Magnitude,
          coordinate: coords,
          text: e.data.Wilayah,
          depth: e.data.Kedalaman,
          tsunami: e.data.Tsunami,
          Shakemap: e.data.Shakemap
        });
        setConnError(null);
        setIsLive(true);
      } else if(e.data.status !== 200) {
        setConnError("Terjadi kesalahan jaringan!");
        setIsLive(false);
      } else throw Error("NE-NQK");
    })
    .catch((e) => {
        if(e.message != "NE-NQK") {
          setIsLive(false);
          console.log(e.message != "NE-NQK")
        } else {
          setQuakeNow(null)
          setIsLive(true)
        }
        // console.warn(e);
    })
  }

  function getUpdate() {
    axios.get(`${config.host}/update.php`)
    .then((e) => {
      if(e.data) {
        setUpdate(e.data);
      } else setUpdate(null);
    })
    .catch(_e => {
      console.error(_e);
      setUpdate(null);
    })
  }

  function handleClickUpdateButton() {
    Linking.openURL(update?.updateInfo.updateLink);
  }

  useEffect(() => {
    getQuakeData();
    getUpdate();
    setInterval(() => {
      getQuakeData();
    }, 5000)
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        {
          update && update.updateInfo.lastBuild > config.build ?
          <Pressable onPress={() => handleClickUpdateButton()} style={tw.style(`mx-4 px-3 mt-1 py-1 bg-blue-600 rounded-lg flex flex-col text-white`)}>
            <Text style={tw`text-white font-bold py-1 text-lg`}>Versi baru tersedia!</Text>
            <View style={tw`flex flex-row bg-transparent pb-2`}>
              <View style={tw`mr-2 bg-transparent`}>
                <FontAwesome name="arrow-up" color="#2665ec" size={16} style={tw`bg-white p-1 rounded-md`} />
              </View>
              <Text style={tw`text-white`}>Versi baru ({update?.updateInfo?.lastVersion}) tersedia. Saat ini anda menggunakan versi {config.version}. Klik tombol ini untuk melakukan pembaruan aplikasi.</Text>
            </View>
          </Pressable>
          : null
        }
        <Text style={tw`flex items-center justify-center w-full text-center text-xl font-bold mt-8`}>Sistem Peringatan Dini Gempa Bumi</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        
        <View style={styles.flex}>
          {
            isLive ? 
            <Text style={tw`mx-3 px-2 py-1 bg-red-600 rounded font-bold text-white`}>LIVE</Text>
            : false
          }
          
          {
            !quakeNow ?
            <Text>Tidak ada peringatan gempa.</Text>
            : <Text style={tw`font-bold`}>Peringatan Gempa</Text>
          }
        </View>
      </View>

      {
        quakeNow ?
        <View style={tw`flex flex-row items-center ${colorScheme === 'dark' ? 'bg-transparent' : 'bg-white'} mt-2 p-1 rounded-lg mx-5 ${quakeNow.magnitude > 7 ? "bg-red-700" : quakeNow.magnitude > 4 ? "bg-yellow-600" : "bg-yellow-400"}`}>
            <Text style={tw`font-bold text-4xl bg-white p-2 rounded-lg ml-2 ${quakeNow.magnitude > 7 ? "text-red-600" : quakeNow.magnitude > 4 ? "text-yellow-600" : "text-yellow-400"}`}>
              {quakeNow.magnitude}
            </Text>
            <View style={tw`px-2 flex flex-col bg-transparent text-white`}>
              <Text style={tw`flex flex-wrap w-56 font-bold text-white`}>{quakeNow.text}</Text>
              <Text style={tw`text-white`}>Kedalaman: {quakeNow.depth}</Text>
              <Text style={tw`text-white`}>Koordinat: {quakeNow.coordinate[0]}, {quakeNow.coordinate[1]}</Text>
              <Text style={tw`text-white`}>
                {quakeNow.time.getDate()} {month[quakeNow.time.getMonth()]} {quakeNow.time.getFullYear()} pukul {twoDigits(quakeNow.time.getHours())}:{twoDigits(quakeNow.time.getMinutes())}
              </Text>
            </View>
          </View> : false
      }
      {
        quakeNow ?
          quakeNow.Shakemap ?
            <View style={tw`flex items-center mt-2`}>
              <Image source={{ uri: quakeNow.Shakemap }} style={tw`w-72 h-80 rounded`} />
            </View>
          :
           quakeNow.coordinate.length === 2 ?
            <View style={tw`flex items-center mt-2`}>
              <WebView style={tw`w-72 h-80 rounded`} source={{ uri:`https://www.openstreetmap.org/export/embed.html?bbox=${quakeNow.coordinate[1]-0.2}%2C${quakeNow.coordinate[0]+0.2}%2C${quakeNow.coordinate[1]+0.2}%2C${quakeNow.coordinate[0]-0.2}&amp;layer=mapnik&amp;marker=${quakeNow.coordinate[0]}%2C${quakeNow.coordinate[1]}`}} />
              {/* <MapView 
                style={tw`flex w-72 h-80 rounded`}
                showsCompass={true} 
                showsScale={true}
                region={{
                  latitude: Number.parseFloat(quakeNow.coordinate[0]),
                  longitude: Number.parseFloat(quakeNow.coordinate[1]),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421
                }}
              >
                <Marker 
                  coordinate={{
                    latitude:  Number.parseFloat(quakeNow.coordinate[0]),
                    longitude:  Number.parseFloat(quakeNow.coordinate[1]),
                  }} 
                  pinColor={'red'}
                />
              </MapView> */}
            </View>
          : null
        : null
      }
      {
        connError ? <Text>{connError}</Text> : null
      }
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
});
