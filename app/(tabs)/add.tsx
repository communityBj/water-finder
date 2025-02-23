import { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function AddPointScreen() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleMapPress = (event) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  const handleSubmit = () => {
    if (!selectedLocation || !title || !description) {
      Alert.alert('Erreur', 'S\'il vous plaît remplir tous les champs');
      return;
    }

    // Here you would typically send the data to your backend
    Alert.alert(
      'Success',
      'Water point added successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedLocation(null);
            setTitle('');
            setDescription('');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 40.7128,
          longitude: -74.0060,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}>
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Nouveau point d\'eau"
          />
        )}
      </MapView>

      <View style={styles.form}>
        <Text style={styles.instruction}>
          Taper sur la carte pour ajouter un point d'eau
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nom du point d'eau"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Indications supplémentaires"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedLocation || !title || !description) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!selectedLocation || !title || !description}>
          <Ionicons name="water" size={24} color="white" />
          <Text style={styles.submitButtonText}>Ajouter point d\'eau</Text>
        </TouchableOpacity>
      </View>
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
  form: {
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
  instruction: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});