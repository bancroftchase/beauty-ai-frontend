import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';

// ===== CONFIGURATION =====
const API_BASE_URL = 'https://beauty-ai-backend.onrender.com';

export default function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`);
      const data = await res.json();
      setResponse(`✅ Backend Connected!\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResponse(`❌ Connection Error:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testClaude = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context: 'test' })
      });
      const data = await res.json();
      
      if (data.success) {
        setResponse(`🤖 Claude AI Response:\n${data.response}`);
      } else {
        setResponse(`❌ Claude Error:\n${data.error}`);
      }
    } catch (error) {
      setResponse(`❌ Network Error:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Beauty AI Test</Text>
        <Text style={styles.subtitle}>Testing Backend Connection</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={testBackendConnection} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? '🔄 Testing...' : '🔗 Test Backend Connection'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Ask Claude AI something..."
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={testClaude} disabled={loading}>
          <Text style={styles.buttonText}>
            {loading ? '🔄 Asking...' : '🤖 Ask Claude AI'}
          </Text>
        </TouchableOpacity>

        <View style={styles.responseContainer}>
          <Text style={styles.responseText}>{response || 'No response yet...'}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#B8860B',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#B8860B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 15,
    height: 80,
    textAlignVertical: 'top',
  },
  responseContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  responseText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});