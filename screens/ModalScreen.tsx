// import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Image, Pressable } from 'react-native';
import { Text, View } from '../components/Themed';
import tw from 'twrnc';
import logoKKNT from '../assets/images/logo-kknt.png';
import logoUPN from '../assets/images/logo-upn.png';
import logoDestana from '../assets/images/logo-destana.png';
import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import axios from 'axios';
import config from '../utils/config';

export default function ModalScreen() {
  const [ serverStatus, setServerStatus ] = useState<number>(1);

  useEffect(() => {
    axios.get(`${config.host}`)
    .then((_e) => {
      setServerStatus(2);
    })
    .catch((_e) => {
      setServerStatus(0);
    })
  })

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Sistem Peringatan Dini Gempa Bumi</Text>
        <Text>v{config.version}</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      </View>
      

      <View style={styles.container}>
        <View style={tw`px-3 flex items-center`}>
          <View style={tw`flex flex-row`}>
            <Pressable onPress={()=> {
              Linking.openURL("https://www.upnjatim.ac.id")
            }}>
              <Image source={logoUPN} style={tw`w-24 h-24 mb-8 mx-2`} />
            </Pressable>
            <Image source={logoDestana} style={tw`w-24 h-24 mb-8 mx-2`} />
            <Image source={logoKKNT} style={tw`w-24 h-24 mb-8 mx-2`} />
          </View>
          <Text style={tw`flex flex-wrap text-center`}>
            Aplikasi Sistem Peringatan Dini Gempa Bumi ini dipersembahkan oleh Kelompok KKN Tematik 122 Universitas Pembangunan Nasional "Veteran" Jawa Timur dengan 
            dukungan pengurus Destana Desa Selok Awar-Awar.
          </Text>
          <View style={tw`flex flex-row justify-center items-center my-5`}>
            <Text>Status Server: </Text>
            {
              serverStatus === 0 ? <Text style={tw`px-2 py-1 bg-red-500 text-white rounded`}>OFFLINE</Text>
              : serverStatus === 2 ? <Text style={tw`px-2 py-1 bg-green-600 text-white rounded`}>ONLINE</Text>
              : <Text>Menghubungkan...</Text>
            }
          </View>
          <Text style={tw`text-center mt-3`}>Copyright © 2022 Kelompok KKN Tematik 122 UPN "Veteran" Jawa Timur</Text>
        </View>
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      {/* <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginTop: 20,
    marginBottom: -25,
    height: 2,
    width: '80%',
  },
});
