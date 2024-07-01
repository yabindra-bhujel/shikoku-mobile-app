import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { updateEvent } from '@/src/api/PutServices';

const EventModal = ({ visible, event, onClose, onDelete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [startTime, setStartTime] = useState('');
  const [end, setEnd] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setStart(event.startDate || '');
      setStartTime(event.startTime || '');
      setEnd(event.endDate || '');
      setEndTime(event.endTime || '');
    }
  }, [event]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('start', start);
    formData.append('end', end);

    try{
      const res = await updateEvent(event.id, formData)
    }catch(error){
      console.log('error')
    }
    
  };

  if (!event) {
    return null;
  }

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.label}>Start Date</Text>
        <TextInput
          style={styles.input}
          value={start}
          onChangeText={setStart}
        />
        <Text style={styles.label}>Start Time</Text>
        <TextInput
          style={styles.input}
          value={startTime}
          onChangeText={setStartTime}
        />
        <Text style={styles.label}>End Date</Text>
        <TextInput
          style={styles.input}
          value={end}
          onChangeText={setEnd}
        />
        <Text style={styles.label}>End Time</Text>
        <TextInput
          style={styles.input}
          value={endTime}
          onChangeText={setEndTime}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => onDelete(event)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 5,
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#40AAFF',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default EventModal;
