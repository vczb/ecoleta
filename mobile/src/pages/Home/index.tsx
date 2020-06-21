import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import api from '../../services/api';


interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse{
  nome: string;
}

const Home = () => {

    const [ufs,     setUfs]     = useState<string[]>([]);
    const [cities, setCities]   = useState<string[]>([]);
    const [selectedUf,setSelectedUf]      = useState<string>('');
    const [selectedCity,setSelectedCity]  = useState<string>('');
    const navigation = useNavigation();

    useEffect(()=>{
      const ibgeUF = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome';

      axios.get<IBGEUFResponse[]>(ibgeUF).then(response => {
          const ufInitials = response.data.map(uf => uf.sigla)
          setUfs(ufInitials);
      })
          
    }, []);
    
    useEffect(()=>{

      if(selectedUf === '0'){
          return;
      }

      const ibgeCity = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`

      axios.get<IBGECityResponse[]>(ibgeCity).then(response => {
          const cityNames = response.data.map(city => city.nome)
          setCities(cityNames);
      })

      
    }, [selectedUf]);

    function handleNavigationToPoints(){

      if( selectedUf == '' || selectedCity == '' ){
        return;
      }

      navigation.navigate('Points', { uf: selectedUf, city: selectedCity })
    }

    return (
    <ImageBackground 
              source={require('../../assets/home-background.png')} 
              style={styles.container}
              imageStyle={{width: 274, height: 368}}
    >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <Text style={styles.title} >Seu marketplace de coleta de resíduos. </Text>
          <Text style={styles.description} >Ajudamos pessoas a encontrarem pontos de coletas de forma eficiente </Text>
        </View>
        <View style={styles.footer}>
            <RNPickerSelect
                placeholder={
                  {
                    label: 'Escolha seu estado',
                    value: null,
                  }
                }
                onValueChange={(value) => setSelectedUf(value)}
                items={
                  ufs.map(uf => (
                    {
                      key:   uf,
                      label: uf,
                      value: uf,
                    }
                  ))
                }
            />

            <RNPickerSelect
                placeholder={
                  {
                    label: 'Escolha sua cidade',
                    value: null,
                  }
                }
                onValueChange={(value) => setSelectedCity(value)}
                items={
                  cities.map(city => (
                    {
                      key:   city,
                      label: city,
                      value: city,
                    }
                  ))
                }
            />

            <RectButton style={styles.button} onPress={handleNavigationToPoints} >
              <View style={styles.buttonIcon}>
                  <Text>
                    <Icon name="arrow-right" color="#FFF" size={24} />
                  </Text>
              </View>
              <Text style={styles.buttonText}>
                Entrar
              </Text>
            </RectButton>
        </View>
    </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {
      backgroundColor: 'red',
      marginBottom: 10,
    },
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;