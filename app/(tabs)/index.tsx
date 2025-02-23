import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Import map components conditionally based on platform
let MapView, Marker, PROVIDER_GOOGLE;
if (Platform.OS === 'web') {
  const { default: GoogleMapReact } = require('google-map-react');
  MapView = GoogleMapReact;
  Marker = ({ children }) => children;
} else {
  const RNMaps = require('react-native-maps');
  MapView = RNMaps.default;
  Marker = RNMaps.Marker;
  PROVIDER_GOOGLE = RNMaps.PROVIDER_GOOGLE;
}

// Mock data for water points
const MOCK_WATER_POINTS = [
  {
    id: '1',
    title: 'Water Point 1',
    description: 'Clean drinking water available 24/7',
    coordinate: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
  },
  {
    id: '2',
    title: 'Water Point 2',
    description: 'Public water fountain',
    coordinate: {
      latitude: 40.7580,
      longitude: -73.9855,
    },
  },
];

const MapMarker = ({ text }) => (
  <div style={{
    color: 'white',
    background: '#2563eb',
    padding: '8px 16px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transform: 'translate(-50%, -50%)',
  }}>
    <Ionicons name="water" size={16} color="white" style={{ marginRight: 4 }} />
    {text}
  </div>
);

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleGetDirections = (point) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.coordinate.latitude},${point.coordinate.longitude}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  const defaultLocation = {
    latitude: 40.7128,
    longitude: -74.0060,
  };

  const currentLocation = location?.coords || defaultLocation;

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          bootstrapURLKeys={{ key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY }}
          defaultCenter={{
            lat: currentLocation.latitude,
            lng: currentLocation.longitude,
          }}
          defaultZoom={12}
          onClick={() => setSelectedPoint(null)}
        >
          {MOCK_WATER_POINTS.map((point) => (
            <Marker
              key={point.id}
              lat={point.coordinate.latitude}
              lng={point.coordinate.longitude}
              onClick={() => setSelectedPoint(point)}
            >
              <MapMarker text={point.title} />
            </Marker>
          ))}
          {location && (
            <Marker
              lat={location.coords.latitude}
              lng={location.coords.longitude}
            >
              <div style={{
                color: 'white',
                background: '#4B5563',
                padding: '8px 16px',
                borderRadius: '4px',
                transform: 'translate(-50%, -50%)',
              }}>
                You are here
              </div>
            </Marker>
          )}
        </MapView>
        
        {selectedPoint && (
          <View style={styles.pointDetails}>
            <View style={styles.pointInfo}>
              <Text style={styles.pointTitle}>{selectedPoint.title}</Text>
              <Text style={styles.pointDescription}>{selectedPoint.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.directionsButton}
              onPress={() => handleGetDirections(selectedPoint)}>
              <Ionicons name="navigate" size={24} color="white" />
              <Text style={styles.directionsText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === 'ios' || Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {MOCK_WATER_POINTS.map((point) => (
          <Marker
            key={point.id}
            coordinate={point.coordinate}
            title={point.title}
            description={point.description}
            onPress={() => setSelectedPoint(point)}
          />
        ))}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            pinColor="blue"
          />
        )}
      </MapView>
      
      {selectedPoint && (
        <View style={styles.pointDetails}>
          <View style={styles.pointInfo}>
            <Text style={styles.pointTitle}>{selectedPoint.title}</Text>
            <Text style={styles.pointDescription}>{selectedPoint.description}</Text>
          </View>
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => handleGetDirections(selectedPoint)}>
            <Ionicons name="navigate" size={24} color="white" />
            <Text style={styles.directionsText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  pointDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pointInfo: {
    marginBottom: 15,
  },
  pointTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pointDescription: {
    fontSize: 14,
    color: '#666',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 10,
  },
  directionsText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});