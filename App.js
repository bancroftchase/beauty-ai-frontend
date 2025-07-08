// App.js - UPGRADED Beauty AI Mobile App with Full Features
import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, SafeAreaView, 
  StatusBar, Alert, ScrollView, Modal, Image, ActivityIndicator
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const Tab = createBottomTabNavigator();

// ===== CONFIGURATION =====
const API_BASE_URL = 'https://your-beauty-api.onrender.com'; // Replace with your Render URL

// ===== STYLES =====
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2C2C2C' },
  header: { backgroundColor: '#B8860B', padding: 20, paddingTop: 60, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  content: { flex: 1, backgroundColor: '#F8F8F8', padding: 16 },
  
  // Search Components
  searchContainer: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  searchInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 12 },
  filterContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  filterButton: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  filterButtonActive: { backgroundColor: '#B8860B' },
  filterButtonText: { fontSize: 12, color: '#333' },
  filterButtonTextActive: { color: 'white', fontWeight: '600' },
  searchButton: { backgroundColor: '#B8860B', padding: 12, borderRadius: 8, alignItems: 'center' },
  searchButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  // Product Components
  productCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  productImage: { width: '100%', height: 80, backgroundColor: '#B8860B', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  productImageText: { fontSize: 24, color: 'white' },
  productBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#ff4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  productBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#B8860B', marginBottom: 4 },
  productBrand: { fontSize: 12, color: '#666', marginBottom: 4 },
  productPrice: { fontSize: 18, fontWeight: 'bold', color: '#B8860B', marginBottom: 8 },
  productDescription: { fontSize: 12, color: '#666', marginBottom: 12 },
  productRating: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stars: { color: '#ffd700', fontSize: 12 },
  reviewCount: { fontSize: 10, color: '#666', marginLeft: 4 },
  addToCartButton: { backgroundColor: '#B8860B', padding: 10, borderRadius: 8, alignItems: 'center' },
  addToCartButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  
  // Chat Components
  chatContainer: { flex: 1 },
  chatMessages: { flex: 1, padding: 16 },
  chatInputContainer: { flexDirection: 'row', padding: 16, backgroundColor: 'white', alignItems: 'center' },
  chatInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 12 },
  sendButton: { backgroundColor: '#B8860B', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  sendButtonText: { color: 'white', fontWeight: 'bold' },
  message: { marginBottom: 12, padding: 12, borderRadius: 12, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#B8860B' },
  assistantMessage: { alignSelf: 'flex-start', backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  messageText: { fontSize: 14 },
  userMessageText: { color: 'white' },
  assistantMessageText: { color: '#333' },
  
  // Category Components
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: { width: '48%', backgroundColor: 'white', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  categoryIcon: { fontSize: 32, marginBottom: 8 },
  categoryName: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  
  // Facial Analysis Components
  facialContainer: { alignItems: 'center', padding: 20 },
  scanArea: { width: 200, height: 200, borderRadius: 100, borderWidth: 3, borderColor: '#B8860B', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  scanIcon: { fontSize: 48 },
  cameraButton: { backgroundColor: '#B8860B', padding: 16, borderRadius: 12, marginTop: 20 },
  cameraButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  analysisResult: { backgroundColor: 'white', borderRadius: 12, padding: 20, marginTop: 20, width: '100%' },
  analysisTitle: { fontSize: 18, fontWeight: 'bold', color: '#B8860B', marginBottom: 12 },
  analysisText: { fontSize: 14, color: '#333', lineHeight: 20, marginBottom: 8 },
  
  // Trends Components
  trendCard: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  trendHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  trendIcon: { fontSize: 24, marginRight: 12 },
  trendTitle: { fontSize: 16, fontWeight: 'bold', color: '#B8860B', flex: 1 },
  trendPlatform: { fontSize: 12, color: '#666', backgroundColor: '#f0f0f0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  trendDescription: { fontSize: 14, color: '#666', marginBottom: 8 },
  trendStats: { fontSize: 12, color: '#B8860B', fontWeight: 'bold' },
  
  // Utility Components
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
  errorText: { color: '#ff4444', fontSize: 14, textAlign: 'center', marginTop: 10 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 40 },
  
  // Modal Components
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 20, width: '100%', maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#B8860B', marginBottom: 16, textAlign: 'center' },
  closeButton: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  closeButtonText: { color: '#333', fontWeight: 'bold' },
});

// ===== API FUNCTIONS =====
const api = {
  async searchProducts(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await response.json();
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  },

  async chatWithClaude(message) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/claude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context: 'comprehensive beauty mobile app' })
      });
      return await response.json();
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  },

  async getTrends() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/trends`);
      return await response.json();
    } catch (error) {
      console.error('Trends API error:', error);
      throw error;
    }
  },

  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/categories`);
      return await response.json();
    } catch (error) {
      console.error('Categories API error:', error);
      throw error;
    }
  },

  async analyzeFace(imageData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/facial-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData })
      });
      return await response.json();
    } catch (error) {
      console.error('Facial analysis API error:', error);
      throw error;
    }
  }
};

// ===== ENHANCED SEARCH SCREEN =====
function SearchScreen({ cart, setCart }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    trending: false
  });
  const [error, setError] = useState('');

  const searchProducts = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await api.searchProducts({
        query: searchQuery,
        ...filters,
        limit: 50
      });
      
      if (result.success) {
        setProducts(result.products);
      } else {
        setError(result.error || 'Search failed');
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1, addedAt: new Date().toISOString() }];
    }

    setCart(newCart);
    await AsyncStorage.setItem('beautyCart', JSON.stringify(newCart));
    Alert.alert('Success', `Added ${product.name} to cart! 🛒`);
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      {item.trending && (
        <View style={styles.productBadge}>
          <Text style={styles.productBadgeText}>TRENDING</Text>
        </View>
      )}
      
      <View style={styles.productImage}>
        <Text style={styles.productImageText}>✨</Text>
      </View>
      
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productBrand}>{item.brand}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      
      <View style={styles.productRating}>
        <Text style={styles.stars}>★★★★☆</Text>
        <Text style={styles.reviewCount}>({item.reviews})</Text>
      </View>
      
      <Text style={styles.productDescription}>{item.description}</Text>
      
      <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
        <Text style={styles.addToCartButtonText}>🛒 Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✨ Beauty AI</Text>
        <Text style={styles.headerSubtitle}>Search Thousands of Global Products</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search beauty products, brands, ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Category:</Text>
          <View style={styles.filterContainer}>
            {['all', 'skincare', 'makeup', 'haircare', 'nails', 'tools', 'fragrance'].map(category => (
              <TouchableOpacity
                key={category}
                style={[styles.filterButton, filters.category === category && styles.filterButtonActive]}
                onPress={() => setFilters(prev => ({ ...prev, category }))}
              >
                <Text style={[styles.filterButtonText, filters.category === category && styles.filterButtonTextActive]}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Price Range:</Text>
          <View style={styles.filterContainer}>
            {[
              { key: 'all', label: 'All' },
              { key: 'budget', label: 'Under $25' },
              { key: 'mid', label: '$25-$75' },
              { key: 'luxury', label: '$75+' }
            ].map(price => (
              <TouchableOpacity
                key={price.key}
                style={[styles.filterButton, filters.priceRange === price.key && styles.filterButtonActive]}
                onPress={() => setFilters(prev => ({ ...prev, priceRange: price.key }))}
              >
                <Text style={[styles.filterButtonText, filters.priceRange === price.key && styles.filterButtonTextActive]}>
                  {price.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={[styles.filterButton, filters.trending && styles.filterButtonActive]}
            onPress={() => setFilters(prev => ({ ...prev, trending: !prev.trending }))}
          >
            <Text style={[styles.filterButtonText, filters.trending && styles.filterButtonTextActive]}>
              🔥 Trending Only
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.searchButton} onPress={searchProducts}>
            <Text style={styles.searchButtonText}>🔍 Search Products</Text>
          </TouchableOpacity>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#B8860B" />
            <Text style={styles.loadingText}>Searching thousands of products...</Text>
          </View>
        ) : products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>Search for beauty products to get started!</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ===== ENHANCED CHAT SCREEN WITH CLAUDE AI =====
function ChatScreen() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Beauty AI assistant powered by Claude AI. I can help you with:\n\n💄 Product recommendations\n🧴 Skincare routines\n✨ Makeup techniques\n🌟 Beauty trends\n💅 Nail art ideas\n\nWhat beauty question can I help you with today?",
      isUser: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = { id: Date.now(), text: inputText.trim(), isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const result = await api.chatWithClaude(userMessage.text);
      
      if (result.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          text: result.response,
          isUser: false
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again. 🤖",
        isUser: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.message, item.isUser ? styles.userMessage : styles.assistantMessage]}>
      <Text style={[styles.messageText, item.isUser ? styles.userMessageText : styles.assistantMessageText]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💬 Beauty AI Chat</Text>
        <Text style={styles.headerSubtitle}>Powered by Claude AI</Text>
      </View>
      
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          style={styles.chatMessages}
          showsVerticalScrollIndicator={false}
        />
        
        {loading && (
          <View style={{ padding: 16, alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#B8860B" />
            <Text style={{ color: '#666', fontSize: 12, marginTop: 4 }}>Beauty AI is thinking...</Text>
          </View>
        )}
        
        <View style={styles.chatInputContainer}>
          <TextInput
            style={styles.chatInput}
            placeholder="Ask about skincare, makeup, trends, routines..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            multiline
            editable={!loading}
          />
          <TouchableOpacity 
            style={[styles.sendButton, loading && { opacity: 0.5 }]} 
            onPress={sendMessage}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ===== ENHANCED CATEGORIES WITH API =====
function CategoriesScreen() {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const result = await api.getCategories();
      if (result.success) {
        setCategories(result.categories);
      }
    } catch (error) {
      console.error('Categories error:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectCategory = (categoryKey) => {
    Alert.alert('Category Selected', `Searching ${categories[categoryKey].name} products...`);
    // Navigate to search with category filter
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📂 Categories</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B8860B" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📂 Categories</Text>
        <Text style={styles.headerSubtitle}>Browse All Beauty Categories</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.categoryGrid}>
          {Object.entries(categories).map(([key, category]) => (
            <TouchableOpacity
              key={key}
              style={styles.categoryCard}
              onPress={() => selectCategory(key)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={{ fontSize: 10, color: '#666', textAlign: 'center', marginTop: 4 }}>
                {category.subCategories.length} subcategories
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ===== FACIAL ANALYSIS SCREEN =====
function FacialAnalysisScreen() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const startFacialScan = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required for facial analysis');
      return;
    }

    setLoading(true);

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        // Simulate sending image to facial analysis API
        const analysisData = await api.analyzeFace(result.assets[0].uri);
        
        if (analysisData.success) {
          setAnalysisResult(analysisData.analysis);
        } else {
          Alert.alert('Analysis Failed', 'Unable to analyze image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to access camera');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📸 Facial Analysis</Text>
        <Text style={styles.headerSubtitle}>AI-Powered Beauty Recommendations</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.facialContainer}>
          <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 14, color: '#666' }}>
            Get personalized beauty recommendations based on your skin tone, hair color, and facial features using advanced AI analysis.
          </Text>
          
          <TouchableOpacity style={styles.scanArea} onPress={startFacialScan} disabled={loading}>
            <Text style={styles.scanIcon}>📷</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.cameraButton, loading && { opacity: 0.5 }]} 
            onPress={startFacialScan}
            disabled={loading}
          >
            <Text style={styles.cameraButtonText}>
              {loading ? 'Analyzing...' : '📸 Start Facial Analysis'}
            </Text>
          </TouchableOpacity>

          {loading && (
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#B8860B" />
              <Text style={styles.loadingText}>Analyzing your facial features...</Text>
            </View>
          )}

          {analysisResult && (
            <View style={styles.analysisResult}>
              <Text style={styles.analysisTitle}>Analysis Results:</Text>
              <Text style={styles.analysisText}>
                <Text style={{ fontWeight: 'bold' }}>Skin Tone:</Text> {analysisResult.skinTone}
              </Text>
              <Text style={styles.analysisText}>
                <Text style={{ fontWeight: 'bold' }}>Skin Type:</Text> {analysisResult.skinType}
              </Text>
              
              <Text style={[styles.analysisTitle, { marginTop: 16 }]}>Recommendations:</Text>
              <Text style={styles.analysisText}>
                <Text style={{ fontWeight: 'bold' }}>Foundation:</Text> {analysisResult.recommendations.foundation}
              </Text>
              
              <Text style={styles.analysisText}>
                <Text style={{ fontWeight: 'bold' }}>Skincare Routine:</Text>
              </Text>
              {analysisResult.recommendations.routine.map((step, index) => (
                <Text key={index} style={styles.analysisText}>• {step}</Text>
              ))}
              
              <TouchableOpacity style={styles.cameraButton} onPress={() => Alert.alert('Feature Coming Soon', 'Product recommendations based on analysis coming soon!')}>
                <Text style={styles.cameraButtonText}>🛍️ Shop Recommended Products</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ===== TRENDS SCREEN =====
function TrendsScreen() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    try {
      const result = await api.getTrends();
      if (result.success) {
        setTrends(result.trends);
      }
    } catch (error) {
      console.error('Trends error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTrend = ({ item }) => (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendIcon}>{item.icon}</Text>
        <Text style={styles.trendTitle}>{item.title}</Text>
        <Text style={styles.trendPlatform}>{item.platform}</Text>
      </View>
      <Text style={styles.trendDescription}>{item.description}</Text>
      <Text style={styles.trendStats}>{item.hashtag} • {item.views}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📱 Beauty Trends</Text>
        <Text style={styles.headerSubtitle}>Viral on TikTok, Instagram & More</Text>
      </View>
      
      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#B8860B" />
            <Text style={styles.loadingText}>Loading latest trends...</Text>
          </View>
        ) : (
          <FlatList
            data={trends}
            renderItem={renderTrend}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ===== ENHANCED CART SCREEN =====
function CartScreen({ cart, setCart }) {
  const total = cart.reduce((sum, item) => {
    const price = parseFloat(item.price?.replace(/[^0-9.]/g, '') || '0');
    return sum + (price * (item.quantity || 1));
  }, 0);

  const removeFromCart = async (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    setCart(newCart);
    await AsyncStorage.setItem('beautyCart', JSON.stringify(newCart));
    Alert.alert('Removed', 'Item removed from cart');
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(newCart);
    await AsyncStorage.setItem('beautyCart', JSON.stringify(newCart));
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productBrand}>{item.brand}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
        <TouchableOpacity 
          onPress={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
          style={{ backgroundColor: '#f0f0f0', padding: 8, borderRadius: 4 }}
        >
          <Text style={{ fontWeight: 'bold' }}>−</Text>
        </TouchableOpacity>
        
        <Text style={{ marginHorizontal: 16, fontSize: 16, fontWeight: 'bold' }}>
          Qty: {item.quantity || 1}
        </Text>
        
        <TouchableOpacity 
          onPress={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
          style={{ backgroundColor: '#f0f0f0', padding: 8, borderRadius: 4 }}
        >
          <Text style={{ fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.addToCartButton, { backgroundColor: '#f44336' }]}
        onPress={() => removeFromCart(item.id)}
      >
        <Text style={styles.addToCartButtonText}>Remove from Cart</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Shopping Cart</Text>
        <Text style={styles.headerSubtitle}>{cart.length} items - ${total.toFixed(2)}</Text>
      </View>
      
      <View style={styles.content}>
        {cart.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginTop: 8 }}>
              Browse products and add them to your cart to get started!
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
            <View style={{ padding: 16, backgroundColor: 'white', borderRadius: 12, marginTop: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
                Total: ${total.toFixed(2)}
              </Text>
              <TouchableOpacity 
                style={styles.searchButton}
                onPress={() => Alert.alert('Checkout', 'Checkout functionality coming soon! 💳')}
              >
                <Text style={styles.searchButtonText}>💳 Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// ===== MAIN APP WITH 5 TABS =====
export default function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('beautyCart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#B8860B" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#B8860B',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: { backgroundColor: 'white', borderTopColor: '#ddd' },
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Search" 
          options={{ tabBarIcon: () => <Text style={{fontSize: 18}}>🔍</Text> }}
        >
          {() => <SearchScreen cart={cart} setCart={setCart} />}
        </Tab.Screen>
        
        <Tab.Screen 
          name="Categories" 
          component={CategoriesScreen}
          options={{ tabBarIcon: () => <Text style={{fontSize: 18}}>📂</Text> }}
        />
        
        <Tab.Screen 
          name="Trends" 
          component={TrendsScreen}
          options={{ tabBarIcon: () => <Text style={{fontSize: 18}}>📱</Text> }}
        />
        
        <Tab.Screen 
          name="Facial" 
          component={FacialAnalysisScreen}
          options={{ tabBarIcon: () => <Text style={{fontSize: 18}}>📸</Text> }}
        />
        
        <Tab.Screen 
          name="Chat" 
          component={ChatScreen}
          options={{ tabBarIcon: () => <Text style={{fontSize: 18}}>💬</Text> }}
        />
        
        <Tab.Screen 
          name="Cart" 
          options={{ 
            tabBarIcon: () => (
              <View>
                <Text style={{fontSize: 18}}>🛒</Text>
                {cart.length > 0 && (
                  <View style={{
                    position: 'absolute', top: -5, right: -5, backgroundColor: '#ff4444',
                    borderRadius: 10, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center'
                  }}>
                    <Text style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>{cart.length}</Text>
                  </View>
                )}
              </View>
            )
          }}
        >
          {() => <CartScreen cart={cart} setCart={setCart} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
