import React, { Component } from 'react'
import { ScrollView, Image, Dimensions, Text, Button, Alert } from 'react-native'
import { AsyncStorage } from "react-native"

const SCREEN_WIDTH = Dimensions.get('screen').width

export default class Detalhe extends React.Component {

    constructor(props){
        super(props);
        this.state = {
          btnText: "Adicionar aos Favoritos",
          color: "blue",
        }
      }

    componentDidMount() {
        
        AsyncStorage.getItem('DeputadosFavoritos', (err, result) => {
            var favDeputados = [];

            if(result !== null){
                favDeputados = JSON.parse(result);

                var filteredArray = favDeputados.filter(item => item.id == this.props.navigation.state.params.hero.id)

                if(filteredArray.length > 0){
                    this.setState({
                        btnText: "Remover dos Favoritos",
                        color:"red"
                      })
                }else{
                    this.setState({
                        btnText: "Adicionar aos Favoritos",
                        color:"blue"
                     })
                }    
            }

        });

    }

    static navigationOptions = {
        title: 'Detalhes'
    }

    render() {
        const { hero } = this.props.navigation.state.params
        return (
           <ScrollView>
               <Image source={{uri: hero.fotoURL}} style={{width:SCREEN_WIDTH, height:SCREEN_WIDTH}}/>
                <Text style={{padding:10, fontSize:20}}>{hero.nomeParlamentar}</Text>
                <Text style={{padding:5}}>{hero.nomeCompleto}</Text>
                <Text style={{padding:5}}>{hero.partido}</Text>
                <Text style={{padding:5}}>{hero.mandato}</Text>
                <Text style={{padding:5}}>{hero.uf}</Text>
                <Button title={this.state.btnText} color={this.state.color}
                onPress={() => {
                                if(this.state.btnText == "Adicionar aos Favoritos"){                                    

                                        AsyncStorage.getItem('DeputadosFavoritos', (err, result) => {
                                            var favDeputados = [];

                                            if(result !== null){
                                                favDeputados = JSON.parse(result)
                                            }

                                            favDeputados.push(this.props.navigation.state.params.hero)
                                            AsyncStorage.setItem('DeputadosFavoritos', JSON.stringify(favDeputados));
                                        });

                                    this.setState({
                                        btnText: "Remover dos Favoritos",
                                        color:"red"
                                      })

                                }else{

                                        AsyncStorage.getItem('DeputadosFavoritos', (err, result) => {
                                            var favDeputados = [];

                                            if(result !== null){
                                                favDeputados = JSON.parse(result)
                                            }

                                            let filteredArray = favDeputados.filter(item => item.id !== this.props.navigation.state.params.hero.id)

                                            AsyncStorage.setItem('DeputadosFavoritos', JSON.stringify(filteredArray));
                                        });

                                    this.setState({
                                        btnText: "Adicionar aos Favoritos",
                                        color:"blue"
                                      })
                                }
                  }}
                />                
           </ScrollView> 
        )
    }
}