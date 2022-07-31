import { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, useColorScheme, Pressable, BackHandler, ImageBackground, Dimensions } from 'react-native';
import * as Linking from 'expo-linking';
import { WebView } from 'react-native-webview';
import { Video } from 'expo-av';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { QuakeData, month, twoDigits } from '../utils/index'

import tw from 'twrnc';
import axios from 'axios';

import { help as h } from '../utils/infoStr';
import { Feather, Entypo, Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import config from '../utils/config';

import bgImage from '../assets/images/evac.jpg';

export default function TabThreeScreen({ navigation }: RootTabScreenProps<'TabThree'>) {

  const [ help, setHelp ] = useState<Array<any>>(h);
  const [ contact, setContact ] =useState<Array<any>>([
    {
      type: "tel",
      content: "0812-3457-0077"
    },
    {
      type: "tel",
      content: "0334-882613"
    },
    {
      type: "tel",
      content: "031-88554893"
    },
    {
      type: "email",
      content: "pusdalopsbpbdjatim@gmail.com"
    },
    {
      type: "web",
      content: "https://bpbd.lumajangkab.go.id"
    },
    {
      type: "web",
      content: "https://bpbd.jatimprov.go.id"
    }
  ]);
  const [ menuToggle, setMenuToggle ] = useState<string>('');
  const colorScheme = useColorScheme();

  const backAction = () => {
    setMenuToggle('');
    if(menuToggle !== "") {
      setMenuToggle('');
      return true;
    } else return false;
    
  }

  function getOnlineHelp() {
    axios.get(`${config.host}/helpstring.php`)
    .then((e) => {
      setHelp(e.data.v2);
    })
    .catch((e) => {
      console.error(e)
    })
  }

  function getContactInformation() {
    axios.get(`${config.host}/contact.php`)
    .then((e) => {
      setContact(e.data.contact)
    })
    .catch((e) => {
      console.error(e)
    })
  }

  useEffect(() => {
    getOnlineHelp();
    getContactInformation();

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [])

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={bgImage} style={styles.image}>
      {
        menuToggle === '' ?
        <ScrollView>
          <Pressable onPress={()=>setMenuToggle('contact')} style={({ pressed }) => {
            return tw`flex flex-row items-center px-3 py-3 ${colorScheme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg mx-3 my-2 ${pressed ? "bg-opacity-100 bg-gray-300" : "bg-opacity-75"}`
          }}>
            <Feather name="phone" size={16} color={ colorScheme === 'dark' ? 'white' : 'black' } />
            <Text style={tw`text-lg ml-3`}>Ayo Hubungi Kami</Text>
          </Pressable>
          <Pressable onPress={()=>setMenuToggle('videos')} style={({ pressed }) => {
            return tw`flex flex-row items-center px-3 py-3 ${colorScheme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg mx-3 my-2 ${pressed ? "bg-opacity-100 bg-gray-300" : "bg-opacity-75"}`
          }}>
            <MaterialIcons name="ondemand-video" size={16} color={ colorScheme === 'dark' ? 'white' : 'black' } />
            <Text style={tw`text-lg ml-3`}>Video Penanggulangan Bencana</Text>
          </Pressable>
          <Pressable onPress={()=>setMenuToggle('materi')} style={({ pressed }) => {
            return tw`flex flex-row items-center px-3 py-3 ${colorScheme === "dark" ? "bg-gray-800" : "bg-white"} rounded-lg mx-3 my-2 ${pressed ? "bg-opacity-100 bg-gray-300" : "bg-opacity-75"}`
          }}>
            <Ionicons name="document-text-outline" size={16} color={ colorScheme === 'dark' ? 'white' : 'black' } />
            <Text style={tw`text-lg ml-3`}>Materi Belajar Bencana</Text>
          </Pressable>
        </ScrollView>
        : menuToggle === 'contact' ?
        <ScrollView style={tw`px-3 pt-2`}>
          <Pressable style={tw`bg-gray-500 rounded flex flex-row items-center px-2 py-1`} onPress={()=>setMenuToggle('')}>
            <AntDesign name="arrowleft" size={16} color="white" />
            <Text style={tw`ml-2 text-lg text-white`}>Kembali</Text>
          </Pressable>

          <View style={tw`mt-3 pt-2 rounded-lg`}>
          {
            contact ?
            contact.map((e, i) => {
              return (
                <Pressable onPress={()=> {
                  if(e.type === "tel") Linking.openURL(`tel:${e.content}`)
                  else if(e.type === "email") Linking.openURL(`mailto:${e.content}`)
                  else if(e.type === "web") Linking.openURL(e.content)
                }} key={i} style={({ pressed }) => {
                  return tw`flex flex-row mb-3 items-center py-2 px-5 ${pressed ? "opacity-50" : ""}`
                }}>
                  {
                    e.type === "tel" ? <Feather name="phone" size={18} color={ colorScheme === 'dark' ? 'white' : 'black' } />
                    : e.type === "email" ? <Feather name="mail" size={18} color={ colorScheme === 'dark' ? 'white' : 'black' } />
                    : e.type === "web" ? <Ionicons name="earth" size={18} color={ colorScheme === 'dark' ? 'white' : 'black' } />
                    : <Entypo name="dots-three-horizontal" size={18} color={ colorScheme === 'dark' ? 'white' : 'black' } />
                  }
                  <Text style={tw`ml-2 text-lg`}>{e.content}</Text>
                </Pressable>
              )
            })
            : <View>
              <Text>Hubungkan ke internet...</Text>
            </View> 
          }
          </View>
        </ScrollView>
        : menuToggle === 'videos' ?
        <ScrollView style={tw`px-3 pt-2`}>
          <Pressable style={tw`bg-gray-500 rounded flex flex-row items-center px-2 py-1`} onPress={()=>setMenuToggle('')}>
            <AntDesign name="arrowleft" size={16} color="white" />
            <Text style={tw`ml-2 text-lg text-white`}>Kembali</Text>
          </Pressable>

          <View style={tw`flex w-full h-56 mt-5 rounded-lg`}>
            <WebView
                  style={tw`flex w-full h-full rounded-lg`}
                  javaScriptEnabled={true}
                  source={{uri: 'https://www.youtube.com/embed/nk38uvgEWkM?rel=0&autoplay=0&showinfo=0&controls=1'}}
            />
          </View>
        </ScrollView>
        : menuToggle === 'materi' ?
        <ScrollView style={tw`px-3 pt-2`}>
          <Pressable style={tw`bg-gray-500 rounded flex flex-row items-center px-2 py-1 mb-2`} onPress={()=>setMenuToggle('')}>
            <AntDesign name="arrowleft" size={16} color="white" />
            <Text style={tw`ml-2 text-lg text-white`}>Kembali</Text>
          </Pressable>

          {
        
        help.map((e, i) => {
          return (
            <View key={i} style={tw.style(`flex w-full px-5 pb-5 my-2 rounded-lg`)}>
              <Text style={tw`flex flex-wrap w-full text-left text-xl font-bold mt-5 mb-4`}>{e.title}</Text>
              <ScrollView style={tw`flex flex-col w-full text-left rounded-lg`}>
                {
                  Array.isArray(e.body)?
                    e.body.map((f:string, j:number) => {
                      return (
                        <Text key={j} style={tw`w-full mb-1`}>-
                      {f}</Text>
                      )
                    })
                  : <Text style={tw`w-full`}>{e.body}</Text>
                }
                
                {
                  e.media?
                  <View style={tw`flex w-full h-full my-2`}>
                    {
                    e.media.type === "image" ?
                      <Image source={{ uri: e.media.url }} style={tw.style(``, {height: undefined, aspectRatio: .8, resizeMode: 'contain'})} />
                    : e.media.type === "video" ?
                      <Video source={{ uri: e.media.url }} style={tw`w-full`} />
                    : e.media.type === "youtube" ?
                      <WebView 
                        style={tw`flex w-full h-48 p-0`}
                        javaScriptEnabled={true}
                        source={{uri: e.media.url}} 
                      />
                    : null
                    }
                    </View>
                  : null
                }
                
              </ScrollView>
            </View>
          )
        })
        
      }
        </ScrollView>
        : null
      }
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    
  },
  image: {
    width: '100%',
    minHeight: Dimensions.get('window').height - 105
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '100%',

  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  }
});
