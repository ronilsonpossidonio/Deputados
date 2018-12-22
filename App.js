import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Image } from 'react-native';
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import Detalhe from './Detalhe';
import Favorite from './Favorite';
import Icon from "react-native-vector-icons/MaterialIcons";
import { AsyncStorage } from "react-native"

class HomeScreen extends React.Component {

static navigationOptions = {
    title: 'Deputados'
}

constructor(props){
  super(props);
  this.state = {
    isLoading: true,
    dataSource: null,
    dataSourceFavorites: null,
    tela:"Home"
  }
}

componentDidMount(){
      
  this.props.navigation.addListener('willFocus', (playload)=>{
    AsyncStorage.getItem('DeputadosFavoritos', (err, result) => {
        var favDeputados = [];

        if(result !== null){
            favDeputados = JSON.parse(result);
            this.setState({
              dataSourceFavorites: favDeputados,
            })
        }

    });
  });

  return fetch('http://meucongressonacional.com/api/001/deputado')
  .then ( (response) => response.json())
  .then ( (responseJson ) => {
    this.setState({
      isLoading: false,
      dataSource: responseJson,
    })
  })
  .catch ((error) =>{
    console.log(error);
  });     

}

_onItemPress = (item) => {
  this.props.navigation.navigate('Detalhe', {hero: item})
} 

_renderItem = ({item}) => {

  var filteredArray = this.state.dataSourceFavorites.filter(it => it.id == item.id)
  if(filteredArray.length > 0){
    return  (
      <TouchableOpacity onPress={()=>this._onItemPress(item)} style={{flexDirection:'row', padding: 10, alignItems:'center'}}>
          <Image style={{height: 50, width: 50, borderRadius: 25}} source={{uri: item.fotoURL}} />
          <View>
            <Text style={{marginLeft: 10, fontWeight: 'bold'}}>{item.nomeParlamentar}</Text>
            <Text style={{marginLeft: 10}}>{item.partido}</Text>
          </View>
          <View style={{flex: 1}}>
            <Icon style={{marginRight: 20, textAlign: 'right', alignItems:'center'}} size={25} 
                  name="star"
                  color="orange"/>
          </View> 
      </TouchableOpacity>
    )
}

return  (
            <TouchableOpacity onPress={()=>this._onItemPress(item)} style={{flexDirection:'row', padding: 10, alignItems:'center'}}>
                <Image style={{height: 50, width: 50, borderRadius: 25}} source={{uri: item.fotoURL}} />
                <View>
                    <Text style={{marginLeft: 10, fontWeight: 'bold'}}>{item.nomeParlamentar}</Text>
                    <Text style={{marginLeft: 10}}>{item.partido}</Text>
                </View>
            </TouchableOpacity>
        )
}

render() {

    if(this.state.isLoading){
      return (
          <View style={styles.container}>
            <ActivityIndicator/>
          </View>
      )
    }else{

      return (
                <FlatList 
                    data={this.state.dataSource}
                    renderItem={this._renderItem}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={()=><View style={{height:1, backgroundColor: '#f7f7f7'}} />}
                />
            )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item:{
    flex: 1,
    alignSelf: 'stretch',
  }
});


const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Detalhe: Detalhe
});

const FavoriteStack = createStackNavigator({
  Favorito: Favorite,
  Detalhe: Detalhe
});

const TabNavigator = createBottomTabNavigator({
  Home: {
          screen: HomeStack,
          navigationOptions: {
            tabBarLabel: "Todos",
            tabBarIcon: ({ tintColor }) => (
              <Icon name="people" size={25} color="blue"/>
            )
          },
        },
  Favorites: {
          screen: FavoriteStack,
          navigationOptions: {
            tabBarLabel: "Favoritos",
            tabBarIcon: ({ tintColor }) => (
              <Icon name="star" size={25} color="orange"/>
            )
          },          
        },
},
);

export default createAppContainer(TabNavigator);