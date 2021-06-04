
import React, { Component } from 'react';
import {
    Text, View, Image, TouchableOpacity, ActivityIndicator, TextInput, FlatList, Platform, Alert
} from 'react-native';
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
} from 'react-native-admob';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import Toast from 'react-native-simple-toast';
import ProgressImage from '../CustomTags/ImageTag';
import { NavigationActions } from 'react-navigation';
import ApiController from '../../ApiController/ApiController';
import styles from '../../../styles/Categories/CategoriesStyleSheet';
import { widthPercentageToDP as wp } from '../../helpers/Responsive';
import Storage from '../../LocalDB/storage'
import RNRestart from 'react-native-restart'

@observer class Themes extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            searchCate: [],
            name: '',
            themes:[
                {
                    name:'Theme 1',
                    image:require('../../images/themes/01.png'),
                    id:1 
                },
                {
                    name:'Theme 2',
                    image:require('../../images/themes/02.png'),
                    id:2 
                },
                {
                    name:'Theme 3',
                    image:require('../../images/themes/03.png'),
                    id:3 
                },
                {
                    name:'Theme 4',
                    image:require('../../images/themes/04.png'),
                    id:4 
                },
                {
                    name:'Theme 5',
                    image:require('../../images/themes/05.png'),
                    id:5 
                },
                {
                    name:'Theme 6',
                    image:require('../../images/themes/06.png'),
                    id:6 
                },
                {
                    name:'Theme 7',
                    image:require('../../images/themes/07.png'),
                    id:7 
                },
                {
                    name:'Theme 8',
                    image:require('../../images/themes/08.png'),
                    id:8 
                },
                {
                    name:'Theme 9',
                    image:require('../../images/themes/09.png'),
                    id:9 
                },
                {
                    name:'Theme 10',
                    image:require('../../images/themes/10.png'),
                    id:10 
                },
                {
                    name:'Theme 11',
                    image:require('../../images/themes/099.png'),
                    id:11 
                }
            ]
        }
    }
    static navigationOptions = { header: null };
    componentWillMount() {
        let { orderStore } = Store;
        // calling homeData func
        this.getCategories()
    }
    componentDidMount = async () => {
        await this.interstitial()
    }
    interstitial = () => {
        let data = store.settings.data;
        try {
            if (data.has_admob && data.admob.interstitial !== '') {
                AdMobInterstitial.setAdUnitID(data.admob.interstitial); //ca-app-pub-3940256099942544/1033173712
                AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
            }
            // InterstitialAdManager.showAd('636005723573957_636012803573249')
            //   .then(didClick => console.log('response===>>>',didClick))
            //   .catch(error => console.log('error===>>>',error)); 
        } catch (error) {
            console.log('catch===>>>', error);
        }
    }
    // Getting home data func 
    getCategories = async () => {
        let { orderStore } = Store;
        try {
            this.setState({ loading: true })
            //API calling
            let response = await ApiController.post('categories');
            orderStore.categories = response.data.categories;
            console.log('responsecategory=', response);
            if (response.success === true) {
                this.setState({ loading: false })
            } else {
                this.setState({ loading: false })
            }
        } catch (error) {
            this.setState({ loading: false })
            // console.log('error',error);
        }
    }
    searchCate() {
        let { orderStore } = Store;
        if (this.state.name.length !== 0) {
            for (let i = 0; i < orderStore.categories.length; i++) {
                if (orderStore.categories[i].name.includes(this.state.name)) {
                    this.state.searchCate.push(orderStore.categories[i]);
                    this.setState({ loading: false })
                }
            }
        } else {
            Toast.show('enter any category name')
            this.setState({ searchCate: [] })
        }
    }
    navigateToScreen = (route, title) => {
        const navigateAction = NavigationActions.navigate({
            routeName: route
        });
        this.props.navigation.setParams({ otherParam: title });
        this.props.navigation.dispatch(navigateAction);
    }

    selectTheme=(id)=>{
        Alert.alert('Restart required','Changing the theme requires application restart',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
            {text: 'Yes Restart', onPress: ()=> this.onContinue(id)},
          ]
        )


    }
    onCancel=()=>{

    }
    onContinue=(id)=>{
        Storage.setItem('homepage',id)
        RNRestart.Restart();

    }



    render() {
        let { orderStore } = Store;
        let data = orderStore.settings.data;

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {
                    this.state.loading ?
                        <ActivityIndicator color={data.main_clr} size='large' animating={true} />
                        :
                      

                        <View style={{ marginVertical: 10 }}>
                            <FlatList
                                indicatorStyle='black'
                                numColumns={2}
                                data={this.state.themes}
                                renderItem={({ item }) =>
                                    <TouchableOpacity style={[{alignContent:'center',alignItems:'center',width:wp('42'),flexDirection: 'column',marginBottom:wp('4')}]}
                                    onPress={()=>this.selectTheme(item.id)}
                                    >
                                        <Image source={item.image} style={[styles.icon,{height:wp('60'),width:wp('38')}]} resizeMode="contain"  />
                                        <Text style={[styles.cate_text,{marginTop:wp('2'),fontWeight:'bold'}]}>{item.name}</Text>
                                        {/* <Image source={require('../../images/next.png')} style={styles.rightIcon} /> */}
                                    </TouchableOpacity>
                                }
                            />
                        </View>
        
        }
      </View>
    );
  }
}
export default Themes;
