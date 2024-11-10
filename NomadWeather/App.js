import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet , View ,Text , ScrollView , Dimensions , pagingEnabled , ActivityIndicator} from 'react-native';
import {Fontisto} from '@expo/vector-icons'

const {width : SCREEN_WIDTH} = Dimensions.get("window");

export default function App() {
  const [city,setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok,setOk] = useState(true);

  const API_KEY = "31b15af45df290e62a0525945ee6d423";
  const icons = {
    "Clouds" : "cloudy",
    "Clear" : "day-sunny",
    Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
  }

  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
      return;
    }
    const {coords : {latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude,longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
    const respon = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await respon.json();
    setDays(json.list); // 'list'로 수정하여 예보 데이터를 설정
  }
  
  useEffect(() => {
    getWeather();
  }, [])
  
  return (
    <View style = {styles.container}>
      <View style={styles.city}>
        <Text style = {styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        showsHorizontalScrollIndicator = {false}
        pagingEnabled
        horizontal 
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style = {styles.day}>
            <ActivityIndicator color ="white" style = {{marginTop : 10}} size = "large"/> 
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style = {styles.day}>
              <View style = {{flexDirection : "row", alignItems : "center",width : "100%", justifyContent : "space-between", }}>
                <Text style = {styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
              </View>
              <Text style = {styles.description}>{day.weather[0].main}</Text>
              <Text style = {styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1.2,
    backgroundColor :"tomato",
  },
  city :{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  },
  cityName :{
    fontSize : 68,
    fontWeight:"500",
    color : "white",
  },
  weather:{
    
  },
  day:{
    width:SCREEN_WIDTH,
    alignItems:"flex-start",
    paddingHorizontal : 20,
  },
  temp:{
    marginTop:50,
    fontSize:130,
    color : "white",
  },
  description : {
    marginTop:-30,
    fontSize:60,
    color : "white",
  },
  tinyText : {
    fontSize : 20,
    color : "white",
  }
})
