import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import { AsyncStorage } from "react-native"

export default class Favorite extends React.Component {

static navigationOptions = {
    title: 'Favoritos'
}

constructor(props){
    super(props);
    this.state = {
      isLoading: false,
      dataSource: null
    }
  }

  componentDidMount() {
      this.props.navigation.addListener('willFocus', (playload)=>{

      AsyncStorage.getItem('DeputadosFavoritos', (err, result) => {
          var favDeputados = [];

          if(result !== null){
              favDeputados = JSON.parse(result);

              this.setState({
                isLoading: false,
                dataSource: favDeputados,
              })
          }

      });

    });
  }

_onItemPress = (item) => {
    this.props.navigation.navigate('Detalhe', {hero: item})
} 
  
_renderItem = ({item}) => {
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
