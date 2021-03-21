import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function App() {
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  });
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    // permission check
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("No permission to access location");
    } else {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      let lat = location.coords.latitude;
      let lon = location.coords.longitude;
      setRegion({
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221,
      });
    }
  };

  const findDestination = () => {
    const url = `http://www.mapquestapi.com/geocoding/v1/address?key=JCydjBLIApW9OdqKbYBN6yCJpMrQeFil&location=${address}`;
    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        const lat = responseData.results[0].locations[0].latLng.lat;
        const lon = responseData.results[0].locations[0].latLng.lng;
        setRegion({
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
        });
      });
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <Marker coordinate={region} title="Haaga-helia" />
      </MapView>
      <Text>MIS MUN KARTTA ON ?</Text>
      <StatusBar style="auto" />
      <TextInput
        style={{ fontSize: 18, width: 200 }}
        placeholder="syötä sijainti"
        onChangeText={(address) => setAddress(address)}
      />
      <Button onPress={findDestination} title="Hae" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
