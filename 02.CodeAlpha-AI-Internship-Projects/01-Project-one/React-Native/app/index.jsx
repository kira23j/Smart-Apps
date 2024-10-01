import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Dimensions, Modal, FlatList } from 'react-native';
import axios from 'axios';

const App = () => {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [languages, setLanguages] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTargetLang, setIsTargetLang] = useState(false); 

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('https://lantai-deploy.onrender.com/languages');
        setLanguages(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch languages');
      }
    };
    fetchLanguages();
  }, []);

  const handleTranslate = async () => {
    try {
      const response = await axios.post('https://lantai-deploy.onrender.com/translate', {
        source_language: sourceLang,
        target_language: targetLang,
        text: text,
      });
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      Alert.alert('Error', 'Translation failed');
    }
  };

  const openModal = (isTarget) => {
    setIsTargetLang(isTarget);
    setIsModalVisible(true);
  };

  const selectLanguage = (lang) => {
    if (isTargetLang) {
      setTargetLang(lang);
    } else {
      setSourceLang(lang);
    }
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>lan<Text style={styles.titleAccent}>TAI</Text></Text>
        <Text style={styles.subtitle}>Simple Language Translation app for CodeAlpha AI Internship</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter text"
          value={text}
          onChangeText={setText}
          placeholderTextColor="#aaa"
        />
        <View style={styles.languageSelector}>
          <View style={styles.langInputContainer}>
            <Text style={styles.label}>From:</Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => openModal(false)}>
              <Text style={styles.pickerButtonText}>{languages[sourceLang] || 'Select Language'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.langInputContainer}>
            <Text style={styles.label}>To:</Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => openModal(true)}>
              <Text style={styles.pickerButtonText}>{languages[targetLang] || 'Select Language'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.translateButton} onPress={handleTranslate}>
          <Text style={styles.translateButtonText}>Translate</Text>
        </TouchableOpacity>
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Translated Text:</Text>
          <Text style={styles.result}>{translatedText}</Text>
        </ScrollView>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <FlatList
              data={Object.keys(languages)}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => selectLanguage(item)}
                >
                  <Text style={styles.modalItemText}>{languages[item]}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: 20,
  },
  card: {
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: '#34495e',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#ecf0f1',
  },
  titleAccent: {
    color: '#e74c3c',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#bdc3c7',
  },
  input: {
    height: 45,
    borderColor: '#95a5a6',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    color: '#ecf0f1',
    backgroundColor: '#2c3e50',
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  langInputContainer: {
    width: '48%',
  },
  pickerButton: {
    backgroundColor: '#34495e',
    borderRadius: 10,
    padding: 10,
    borderColor: '#e74c3c',
    borderWidth: 1,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  translateButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 15,
  },
  translateButtonText: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ecf0f1',
    marginBottom: 10,
  },
  result: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#34495e',
    borderRadius: 15,
    padding: 20,
    maxHeight: '60%',
  },
  modalItem: {
    padding: 15,
    borderBottomColor: '#e74c3c',
    borderBottomWidth: 1,
  },
  modalItemText: {
    fontSize: 18,
    color: '#ecf0f1',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ecf0f1',
    fontSize: 16,
  },
});

export default App;
