import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  Alert, 
  SafeAreaView, 
  ScrollView, 
  ActivityIndicator, 
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const API_URL = 'http://172.28.144.1:3000';

const backArrowImage = require('../assets/src/seta.png'); 
const profileImage = require('../assets/src/perfil.png');
const roboImage = require('../assets/src/robo.png');

const ProfileScreen = ({ navigation }) => {
    const [userId, setUserId] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userPhone, setUserPhone] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const getUserId = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId) {
                setUserId(storedUserId);
                return storedUserId;
            } else {
                Alert.alert('Erro de Sessão', 'Sua sessão expirou. Faça login novamente.');
                navigation.navigate('Login');
                return null;
            }
        } catch (error) {
            console.error('Erro ao ler userId:', error);
            return null;
        }
    };

    const fetchProfileData = useCallback(async (id) => {
        if (!id) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/user/${id}`);
            if (!response.ok) {
                throw new Error('Falha ao carregar os dados do perfil.');
            }
            const data = await response.json();

            setUserName(data.username);
            setUserEmail(data.email);
            setUserPhone(data.emergency_phone || '');
            setUserPassword('');
        } catch (error) {
            console.error('Erro ao buscar dados do perfil:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                const id = await getUserId();
                if (id) {
                    fetchProfileData(id);
                } else {
                    setLoading(false);
                }
            };
            loadData();
            
            return () => {
            };
        }, [fetchProfileData])
    );

    const handleSaveProfile = async () => {
        if (userEmail.trim() === '' || userName.trim() === '') {
            Alert.alert('Atenção', 'Nome e e-mail não podem ficar vazios.');
            return;
        }
        
        const currentUserId = await getUserId();
        if (!currentUserId) return;

        const updatedProfile = {
            username: userName,
            email: userEmail,
            password: userPassword,
            emergency_phone: userPhone,
        };

        if (userPassword === '') {
            delete updatedProfile.password;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/user/${currentUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProfile),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao salvar as alterações.');
            }

            Alert.alert('Sucesso!', 'Perfil atualizado com sucesso!');
            fetchProfileData(currentUserId); 
            setUserPassword('');
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            Alert.alert('Erro', 'Não foi possível salvar as alterações. Verifique o email ou tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditPress = () => {
        if (isEditing) {
            handleSaveProfile();
        } else {
            setIsEditing(true);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0e458c" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#b9d2ff', '#d9e7ff', '#eaf3ff']}
                style={styles.background}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image 
                            source={backArrowImage} 
                            style={styles.backimage}
                        />
                    </TouchableOpacity>

                    <Text style={styles.title}>SERENE</Text>

                    <TouchableOpacity style={styles.profileButton}>
                        <Image 
                            source={profileImage} 
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* SAUDAÇÃO */}
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greetingText}>OLÁ, {userName ? userName.toUpperCase() : 'USUÁRIO'}</Text>
                    </View>

                    {/* FORMULÁRIO */}
                    <View style={styles.formContainer}>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={userEmail}
                                    onChangeText={setUserEmail}
                                    placeholder="email@exemplo.com"
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    keyboardType="email-address"
                                />
                            ) : (
                                <View style={styles.valueContainer}>
                                    <Text style={styles.valueText}>{userEmail}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>SENHA</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={userPassword}
                                    onChangeText={setUserPassword}
                                    placeholder="Sua senha"
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    secureTextEntry
                                />
                            ) : (
                                <View style={styles.valueContainer}>
                                    <Text style={styles.valueText}>••••••••</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>TELEFONE DE EMERGÊNCIA</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.input}
                                    value={userPhone}
                                    onChangeText={setUserPhone}
                                    placeholder="(00) 00000-0000"
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    keyboardType="phone-pad"
                                />
                            ) : (
                                <View style={styles.valueContainer}>
                                    <Text style={styles.valueText}>{userPhone}</Text>
                                </View>
                            )}
                        </View>

                        {/* BOTÃO */}
                        <TouchableOpacity 
                            style={styles.editButton}
                            onPress={handleEditPress}
                        >
                            <LinearGradient
                                colors={['#0e458c', '#1a5bb5']}
                                style={styles.editButtonGradient}
                            >
                                <Text style={styles.editButtonText}>
                                    {isEditing ? 'SALVAR' : 'EDITAR'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomSpacer} />
                </ScrollView>

                {/* MENU INFERIOR FLUTUANTE */}
                <View style={styles.floatingMenuContainer}>
                    <TouchableOpacity 
                        style={styles.floatingMenuButton}
                        onPress={() => navigation.navigate('ChatScreen')} 
                    >
                        <Image 
                            source={roboImage} 
                            style={styles.floatingMenuIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.floatingMenuButton}
                        onPress={() => navigation.navigate('DiarioScreen')} 
                    >
                        <Ionicons 
                            name="add-outline" 
                            size={screenWidth > 400 ? (screenWidth > 500 ? 36 : 32) : 28} 
                            color="#0e458c" 
                        />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#b9d2ff',
    },
    background: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: screenWidth > 400 ? 18 : 16,
        color: '#0e458c',
        fontFamily: 'Bree-Serif',
    },
    
    // HEADER - RESPONSIVO
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: screenWidth > 400 ? 15 : 10,
        paddingBottom: screenWidth > 400 ? 10 : 5,
        paddingHorizontal: screenWidth > 400 ? 25 : 20,
    },
    title: {
        fontSize: screenWidth > 400 ? (screenWidth > 500 ? 44 : 40) : 32,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'Bree-Serif',
    },
    backButton: {
        padding: 5,
    },
    backimage: {
        width: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
        height: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
        resizeMode: 'contain',
        tintColor: 'white',
        transform: [{ scaleX: -1 }],
    },
    profileButton: {
        padding: 5,
    },
    profileImage: {
        width: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
        height: screenWidth > 400 ? (screenWidth > 500 ? 60 : 55) : 45,
        resizeMode: 'contain',
        tintColor: 'white',
    },

    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: screenWidth > 400 ? 100 : 80,
        alignItems: 'center',
    },
    bottomSpacer: {
        height: 20,
    },

    // SAUDAÇÃO - RESPONSIVA
    greetingContainer: {
        alignItems: 'center',
        marginVertical: screenWidth > 400 ? 25 : 20,
        marginTop: screenWidth > 400 ? 30 : 25,
    },
    greetingText: {
        fontSize: screenWidth > 400 ? (screenWidth > 500 ? 28 : 26) : 22,
        color: '#0e458c',
        fontFamily: 'Bree-Serif',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // FORMULÁRIO - RESPONSIVO
    formContainer: {
        width: screenWidth > 400 ? '85%' : '90%',
        maxWidth: 450,
        alignItems: 'center',
    },
    inputGroup: {
        width: '100%',
        marginBottom: screenWidth > 400 ? 20 : 15,
    },
    label: {
        fontSize: screenWidth > 400 ? (screenWidth > 500 ? 18 : 17) : 15,
        color: '#0e458c',
        marginBottom: screenWidth > 400 ? 8 : 6,
        fontFamily: 'Bree-Serif',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    valueContainer: {
        backgroundColor: '#84a9da',
        paddingVertical: screenWidth > 400 ? 16 : 14,
        paddingHorizontal: screenWidth > 400 ? 20 : 16,
        borderRadius: screenWidth > 400 ? 14 : 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    valueText: {
        fontSize: screenWidth > 400 ? (screenWidth > 500 ? 18 : 17) : 15,
        color: 'white',
        fontFamily: 'Bree-Serif',
        fontWeight: 'bold',
    },
    input: {
        fontSize: screenWidth > 400 ? (screenWidth > 500 ? 18 : 17) : 15,
        color: 'white',
        fontFamily: 'Bree-Serif',
        fontWeight: 'bold',
        backgroundColor: '#84a9da',
        paddingVertical: screenWidth > 400 ? 16 : 14,
        paddingHorizontal: screenWidth > 400 ? 20 : 16,
        borderRadius: screenWidth > 400 ? 14 : 12,
        width: '100%',
        textAlign: 'center',
        borderWidth: screenWidth > 400 ? 3 : 2,
        borderColor: '#5691de',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },

    // BOTÃO - RESPONSIVO
    editButton: {
        borderRadius: screenWidth > 400 ? 28 : 25,
        overflow: 'hidden',
        marginTop: screenWidth > 400 ? 25 : 20,
        width: screenWidth > 400 ? '70%' : '75%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    editButtonGradient: {
        paddingVertical: screenWidth > 400 ? 16 : 14,
        borderRadius: screenWidth > 400 ? 28 : 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: screenWidth > 400 ? (screenWidth > 500 ? 20 : 18) : 16,
        fontFamily: 'Bree-Serif',
        fontWeight: 'bold',
    },

    // MENU INFERIOR FLUTUANTE - RESPONSIVO
    floatingMenuContainer: {
        position: 'absolute',
        bottom: screenWidth > 400 ? 25 : 20,
        left: screenWidth > 400 ? 25 : 20,
        right: screenWidth > 400 ? 25 : 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        zIndex: 1000,
    },
    floatingMenuButton: {
        width: screenWidth > 400 ? (screenWidth > 500 ? 70 : 65) : 55,
        height: screenWidth > 400 ? (screenWidth > 500 ? 70 : 65) : 55,
        borderRadius: screenWidth > 400 ? 35 : 28,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: screenWidth > 400 ? 5 : 4 },
        shadowOpacity: 0.25,
        shadowRadius: screenWidth > 400 ? 7 : 5,
        elevation: 8,
        borderWidth: screenWidth > 400 ? 4 : 3,
        borderColor: 'rgba(170, 199, 255, 0.8)',
    },
    floatingMenuIcon: {
        width: screenWidth > 400 ? (screenWidth > 500 ? 45 : 40) : 32,
        height: screenWidth > 400 ? (screenWidth > 500 ? 45 : 40) : 32,
        resizeMode: 'contain',
        tintColor: '#0e458c',
    },
});

export default ProfileScreen;
