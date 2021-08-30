import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Switch, Button,
   TouchableOpacity, TextInput, FlatList, ScrollView} from 'react-native';
import Parse from "parse/react-native.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = ()=>{
  const [saldo, setSaldo] = useState(0);
  const [valorUsuario, setValorusuario] = useState('');
  const [visible, setVisible] = useState(true);
  const [transacao,setTransacao] = useState(new Parse.Object('Transacao'));
  
  Parse.setAsyncStorage(AsyncStorage);
  
  async function fetchTransacao(){
    let query = new Parse.Query('Transacao');
    let queryResult = await query.findAll();
    setTransacao(queryResult);
    setSaldo(transacao[0].get('saldo'));
    console.log(transacao[0].get('acao'));
  }

  useEffect(()=>{
    fetchTransacao();  
  },[]);

  Parse.initialize('GkqIA2Pbc4d4F9uAw48o81wF8CTWmMMLbIfwNZqD',
                  'bV0nW8Bc474fD46w2iRV4el8B9ddBJeQt4jTkFto');
  Parse.serverURL = 'https://parseapi.back4app.com/';
  
  async function addHistorico(acao,saldo,saldoAcao) {
    try {
      //create a new Parse Object instance
      const newTransacao = new Parse.Object('Transacao');
      //define the attributes you want for your Object
      newTransacao.set('saldo', saldo);
      newTransacao.set('acao', acao);
      newTransacao.set('saldoAcao',saldoAcao);
      //save it on Back4App Data Store
      await newTransacao.save();
      fetchTransacao();
    } catch (error) {
      console.log('Error saving new person: ', error);
    }
  }

  const add = () =>{
    if(valorUsuario){
      const temp = parseFloat(valorUsuario);
      setSaldo(saldo + temp);
      addHistorico(true,saldo,temp);
      setValorusuario('');
    }else{
      alert('Digite um valor');
    }

  }

  const remove = () =>{
    if(valorUsuario){
      const temp = parseFloat(valorUsuario);
      setSaldo(saldo - temp);
      addHistorico(false,saldo,temp);
      setValorusuario('');
    }else{
      alert('Digite um valor');
    }
  }

  return (
    <ScrollView style={{marginVertical: 10}}>
      <Text style={{marginBottom: 10}}>Carteira Digital</Text>
      <View style={style.view1}>
        <View style={style.cartao}>
            <Text style={style.texto}>Seu saldo</Text>
            <Switch style={{color: '#fff'}} value={visible} onValueChange={()=> setVisible(!visible)}></Switch>
        </View>
        {visible ?( <Text style={style.saldo}>R$ {saldo}</Text>) : (<Text style={style.saldo}>R$ --</Text>)}
        


        <TextInput value={valorUsuario} style={style.input} onChangeText={(value) => setValorusuario(value)}/>
        <View style={style.viewbtn}>
            <TouchableOpacity style={style.button} onPress={add}>
              <Text style={style.txtbtn}>Adicionar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={style.button} onPress={remove}>
              <Text style={style.txtbtn}>Remover</Text>
            </TouchableOpacity>
        </View>
      </View>
      <FlatList
         
          style={{padding: 20}}
          data={transacao}
          renderItem={({item})=>(
            <View style={{padding: 10, backgroundColor: '#cacaca'}}>
              <Text>Saldo: {item.get('saldo')}</Text>
              <Text>Valor Operação: {item.get('saldoAcao')}</Text>
              <Text>Operação: ({item.get('acao') ? 'Soma' : 'Subtração' })</Text>
            </View>
          )}
        />
      
    </ScrollView>
  );
}

export default App;

const style = StyleSheet.create({
    view1 :{
      backgroundColor :'blue',
      margin: 10,
      borderRadius: 5,
      padding: 10

    }, 
      txtbtn: {
        color: '#fff', 
        fontWeight: 'bold',
        fontSize: 16
    },
    saldo : {
      color : 'white',
      fontSize: 30,
      textAlign: 'center',
      marginTop: 10,
    },
    cartao : {
      flexDirection : 'row',
      justifyContent: 'space-between',
      paddingRight: 10
      
    },
    texto : {
      color : 'white',
      fontSize: 30,
      padding: 10
    },
    input :{
      backgroundColor: 'white',
      marginVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 10
    },
    viewbtn :{
       flexDirection: 'row',
       justifyContent : 'space-evenly'

    },
    button :{
      height : 40,
      justifyContent: 'center',
      marginVertical: 10,
      color: 'white',
      fontWeight : 'bold'
    }
  })