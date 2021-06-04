import React, { Component } from 'react';
import { Platform, Text, View, TextInput,I18nManager, TouchableOpacity, Picker, ScrollView, ActivityIndicator, Image, ImageBackground } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import Icons from 'react-native-vector-icons/AntDesign';
import Email from 'react-native-vector-icons/Zocial'
import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import styles from '../../../styles/Events/CreateEventStyleSheet';
import { Avatar, Icon } from 'react-native-elements';
import { COLOR_PRIMARY, COLOR_GRAY } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import Tags from "react-native-tags";
import ApiController from '../../ApiController/ApiController';
import Toast from 'react-native-simple-toast';
import { withNavigation } from 'react-navigation';
const inputSize = totalSize(1.5);

@observer class DescriptionListing extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            is_picker: false,
            postImages: false,
            category: 'select category',
            emails: [],
            images: [],
            avatorSources: [],
            desc: '',
            vaideURL: '',
            email: '',
            brand_name: '',
            avatarSource: null,
            image: null,
            progress: 0,
            listID: ''
        }
    }
    renderAsset(image) {
        if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
            return this.renderVideo(image);
        }
        return this.renderImage(image);
    }
    renderImage(image) {
        return (
            <ImageBackground source={image} style={{ height: height(10), width: width(20) }}>
                <TouchableOpacity style={{ height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-end' }} onPress={() => this.removeLocalImage(image)}>
                    <Text style={{ fontSize: totalSize(2), color: 'red' }}>X</Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    }
    static navigationOptions = {
        header: null,
    };
    componentWillMount = async () => {
        let data = store.GET_LISTING.data.create_listing;
        if (data.gallery.has_gallery) {
            data.gallery.dropdown.forEach(item => {
                item.checkStatus = false;
                item.added = false;
            })
        }
        if ( data.tags.value !== "" ) {
            store.TAGS = data.tags.value.split(",")
        }
        await this.setState({
            desc: data.desc.value,
            vaideURL: data.video_link.value,
            email: data.email.value,
            brand_name: data.brandname.value,

        })
    }
    tagsController = async (tags) => {
        store.TAGS = tags;
    }

    imagePicker = () => {
        ImagePicker.openPicker({
            multiple: false,
            waitAnimationEnd: true,
            compressImageQuality: 0.5
        }).then(async (image) => {
            var fileName = image.path.substring(image.path.lastIndexOf('/') + 1, image.path.length);
            await this.setState({
                avatarSource: { uri: image.path, type: image.mime, name: Platform.OS === 'ios' ? image.filename : fileName },
                image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
                pickerImage: true
            })
            await this.brandLogoUploading()
        }).catch((error) => {
            console.log('error:', error);
        });
    }
    brandLogoUploading = async () => {
        this.setState({ is_brandLogo: true })
        let formData = new FormData();
        if (this.state.avatarSource !== null) {
            formData.append('c-cover-brand', this.state.avatarSource);
        } 
        if ( store.LISTING_UPDATE ) {
            formData.append('is_update', store.LIST_ID);
        }else{
            formData.append('is_update', '');
        }
        console.log(formData);
        let config = {
            onUploadProgress: async function (progressEvent) {
                await this.setState({ progress: progressEvent.loaded / progressEvent.total })
                // console.log('uploading', this.state.progress);
            }.bind(this)
        }
        let response = await ApiController.axios('brand-img', formData, config);
        console.log('brand logo===>>',response.data);
        if (response.data.success) {
            this.setState({ is_brandLogo: false, progress: 0 })
        } else {
            this.setState({ is_brandLogo: false, progress: 0 })
        }
    }
    multiImagePicker() {
        ImagePicker.openPicker({
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
            forceJpg: true,
            minFiles: 1,
            maxFiles: 5,
            compressImageQuality: 0.5
        }).then(async (images) => {
            images.forEach(i => {
                var fileName = i.path.substring(i.path.lastIndexOf('/') + 1, i.path.length);
                this.state.avatorSources.push({ uri: i.path, type: i.mime, name: Platform.OS === 'ios' ? i.filename : fileName })
                this.state.images.push({ uri: i.path, width: i.width, height: i.height, mime: i.mime })
                this.setState({ sizeImage: this.state.sizeImage + i.size })
            })
            await this.uploadImages()
        }).catch((error) => {
            console.log('error:', error);
        });
    }
    uploadImages = async () => {
        let data = store.GET_LISTING.data.create_listing;
        this.setState({ loading: true })
        let formData = new FormData();
        if (this.state.avatorSources.length > 0) {
            for (let i = 0; i < this.state.avatorSources.length; i++) {
                formData.append('multi_images[]', this.state.avatorSources[i]);
            }
        }
        if ( store.LISTING_UPDATE ) {
            formData.append('is_update', store.LIST_ID);
        }else{
            formData.append('is_update', '');
        }
        let config = {
            onUploadProgress: async function (progressEvent) {
                await this.setState({ progress: progressEvent.loaded / progressEvent.total })
                if (this.state.progress === 1) {
                    await this.setState({ postImages: true })
                }
                // console.log('uploading', this.state.progress);
            }.bind(this)
        }
        try {
            ApiController.postAxios('listing-images', formData, config)
                .then(async (response) => {
                    if (response.data.success) {
                        data.gallery = response.data.data.gallery;
                        if (response.data.message) {
                            Toast.show(response.data.message)
                        }
                        await this.setState({ loading: false, postImages: false, avatorSources: [], images: [], progress: 0 })
                    } else {
                        Toast.show(response.data.message)
                        this.setState({ loading: false, postImages: false, progress: 0 })
                    }
                }).catch((error) => {
                    this.setState({ loading: false, postImages: false, progress: 0 })
                })
        } catch (error) {
            this.setState({ loading: false, postImages: false, progress: 0 })
            //console.log('trycatch error==>>', error);
        }
    }
    deleteCloudImage = async (img) => {
        let data = store.GET_LISTING.data.create_listing;
        let parameters = {
            listing_id: img.listing_id,
            image_id: img.image_id
        };
        data.gallery.dropdown.forEach(item => {
            if (item.image_id === img.image_id && img.checkStatus === false) {
                item.checkStatus = true;
                this.setState({ loading: false })
            } else {
                item.checkStatus = false;
            }
        })
        // await this.setState({ editImages: data.gallery.dropdown })
        try {
            let response = await ApiController.post('listing-images-delete', parameters);
            if (response.success) {
                if (response.data.gallery.has_gallery) {
                    response.data.gallery.dropdown.forEach(item => {
                        item.checkStatus = false;
                    })
                    data.gallery = response.data.gallery;
                    await this.setState({ loading: false })
                } else {
                    data.gallery = response.data.gallery;
                    await this.setState({ loading: false })
                }
                // Toast.show(response.message)
            } else {
                Toast.show(response.message)
                data.gallery.dropdown.forEach(item => {
                    item.checkStatus = false;
                })
                this.setState({ loading: false })
            }
        } catch (error) {
            console.log('error:', error);
        }
    }
    createListing = async () => {
        store.LISTING_OBJ.desc = this.state.desc;
        store.LISTING_OBJ.videolink = this.state.vaideURL;
        store.LISTING_OBJ.email = this.state.email;
        store.LISTING_OBJ.tags = store.TAGS.join();
        store.LISTING_OBJ.brandname = this.state.brand_name;

        // console.log('storePrice', store.LISTING_OBJ);
    }

    render() {
        this.createListing()
        let main_clr = store.settings.data.main_clr;
        let data = store.GET_LISTING.data.create_listing;

        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}>
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10,alignItems:'flex-start' }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.desc.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                        <TextInput
                            onChangeText={(value) => { this.setState({ desc: value }) }}
                            placeholder={data.desc.placeholder}
                            value={this.state.desc}
                            multiline={true}
                            placeholderTextColor='gray'
                            underlineColorAndroid='transparent'
                            autoCorrect={true}
                            style={[{ height: height(15), width: width(90), fontSize: totalSize(1.7), backgroundColor: 'transparent', paddingHorizontal: 10, borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                        />
                    </View>
                    {
                        store.GET_LISTING.data.is_videolink ?
                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10,alignItems:'flex-start' }}>
                                <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.video_link.main_title}</Text>
                                <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                    <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                        <Icons name="youtube" size={22} color="#c4c4c4" />
                                    </View>
                                    <TextInput
                                        onChangeText={(value) => { this.setState({ vaideURL: value }) }}
                                        placeholder={data.video_link.placeholder}
                                        value={this.state.vaideURL}
                                        placeholderTextColor='gray'
                                        underlineColorAndroid='transparent'
                                        autoCorrect={true}
                                        style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                                    />
                                </View>
                            </View>
                            :
                            null
                    }

                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems:'flex-start' }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.email.main_title}</Text>
                        <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                            <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                <Email name="email" size={22} color="#c4c4c4" />
                            </View>
                            <TextInput
                                onChangeText={(value) => { this.setState({ email: value }) }}
                                placeholder={data.email.placeholder}
                                value={this.state.email}
                                placeholderTextColor='gray'
                                underlineColorAndroid='transparent'
                                autoCorrect={true}
                                style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                            />
                        </View>
                    </View>
                    {
                        store.GET_LISTING.data.is_videolink ?
                            <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems:'flex-start' }}>
                                <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.tags.main_title}</Text>
                                <View style={{ width: width(90), backgroundColor: '#c4c4c4', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                                    <Tags
                                        initialText=""
                                        textInputProps={{
                                            placeholder: data.tags.placeholder
                                        }}
                                        initialTags={store.TAGS}
                                        onChangeTags={(tags) => { this.tagsController(tags) }}
                                        onTagPress={(index, tagLabel, event, deleted) => {
                                            console.log(index, tagLabel, event, deleted ? "deleted" : "not deleted")
                                        }}
                                        containerStyle={{ justifyContent: "center" }}
                                        // tagContainerStyle={{ height: 20, width: 20,backgroundColor:'orange' }}
                                        // tagTextStyle={{ fontSize: 18, color:'green' }}
                                        inputStyle={{ backgroundColor: "white" }}
                                        renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                                            <TouchableOpacity style={{ backgroundColor: main_clr, marginHorizontal: 3, marginVertical: 2, borderRadius: 10 }} key={`${tag}-${index}`} onPress={onPress}>
                                                <Text style={{ marginHorizontal: 5, marginVertical: 2, color: 'white' }}>{tag}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </View>
                            :
                            null
                    }
                    <View style={{ marginHorizontal: 15, marginVertical: 0, alignItems:'flex-start' }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.gallery.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                        <View style={{ height: height(15), width: width(90), flexDirection: 'row', borderRadius: 5, borderColor: '#c4c4c4', borderWidth: 0.5 }}>
                            <TouchableOpacity style={{ height: height(15), width: width(60), borderRightWidth: 0.5, borderColor: '#c4c4c4', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.multiImagePicker()}>
                                <Image source={require('../../images/camera.png')} style={{ height: height(4), width: width(15), resizeMode: 'contain', alignSelf: 'center' }} />
                                <Text style={styles.cameraBtnTxt}>{data.gallery.placeholder}</Text>
                            </TouchableOpacity>
                            <View style={{ height: height(15), width: width(30), justifyContent: 'center', alignItems: 'center' }}>
                                {
                                    this.state.loading ?
                                        <View style={{ marginHorizontal: 20, marginTop: 5 }}>
                                            <Progress.Pie size={100} indeterminate={false} showsText={true} textStyle={{ fontSize: 10 }} progress={this.state.progress} color={main_clr} />
                                        </View>
                                        :
                                        this.state.images.length === 0 ?
                                            <Image source={require('../../images/success.png')} style={{ height: height(10), width: width(20), resizeMode: 'contain' }} />
                                            :
                                            <Image source={require('../../images/successChecked.png')} style={{ height: height(10), width: width(20), resizeMode: 'contain' }} />
                                }
                            </View>
                        </View>
                        {
                            data.gallery.has_gallery && data.gallery.dropdown !== null ?
                                <ScrollView
                                    style={{ marginVertical: 5 }}
                                    horizontal={true}>
                                    {
                                        data.gallery.dropdown.map((item, key) => {
                                            return (
                                                <View key={key} style={{ height: height(10), width: width(23), marginVertical: 5, marginTop: 10,marginRight: 5 }}>
                                                    <ImageBackground source={{ uri: item.url }} style={{ height: height(10), width: width(23) }}>
                                                        <View style={{ height: height(10), width: width(23), alignItems: 'flex-end', position: 'absolute' }}>
                                                            {
                                                                item.checkStatus ?
                                                                    <View style={{ height: height(10), width: width(23), backgroundColor: item.checkStatus ? 'rgba(0,0,0,0.7)' : null, justifyContent: 'center', alignItems: 'center' }}>
                                                                        <ActivityIndicator size='large' animating={true} color={COLOR_PRIMARY} />
                                                                    </View>
                                                                    :
                                                                    <TouchableOpacity style={{ height: 20, width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-end' }} onPress={() => { this.deleteCloudImage(item) }}>
                                                                        <Text style={{ fontSize: 14, color: 'red' }}>X</Text>
                                                                    </TouchableOpacity>
                                                            }
                                                        </View>

                                                    </ImageBackground>
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                                :
                                null
                        }
                    </View>
                    <View style={{ marginHorizontal: 10, marginVertical: 5, alignItems:'flex-start' }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.brandname.main_title}</Text>
                        <View style={{ height: height(6), width: width(90), flexDirection: 'row', borderColor: '#c4c4c4', borderRadius: 3, borderWidth: 0.6 }}>
                            <View style={{ height: height(6), width: width(12), justifyContent: 'center', alignItems: 'center', borderRightWidth: 0.6, borderRightColor: '#c4c4c4' }}>
                                <Icons name="infocirlceo" size={24} color="#c4c4c4" />
                            </View>
                            <TextInput
                                onChangeText={(value) => { this.setState({ brand_name: value }) }}
                                placeholder={data.brandname.placeholder}
                                value={this.state.brand_name}
                                placeholderTextColor='gray'
                                underlineColorAndroid='transparent'
                                autoCorrect={true}
                                style={[{ height: height(6), width: width(77), fontSize: inputSize, alignSelf: 'stretch', backgroundColor: 'transparent', paddingHorizontal: 10 },I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 10, marginVertical: 5, marginTop: 10, alignItems:'flex-start' }}>
                        <Text style={{ marginVertical: 7, fontSize: 14, fontWeight: 'bold', color: 'black' }}>{data.brand_logo.main_title}</Text>
                        <View style={{ width: width(90), flexDirection: 'row' }}>
                            {
                                this.state.is_brandLogo ?
                                    <View style={{ marginHorizontal: 20, marginTop: 5 }}>
                                        <Progress.Pie size={150} indeterminate={false} showsText={true} textStyle={{ fontSize: 10 }} progress={this.state.progress} color={main_clr} />
                                    </View>
                                    :
                                    <Avatar
                                        size="xlarge"
                                        rounded
                                        source={!this.state.image ? { uri: data.brand_logo.value } : this.state.image}
                                        // onPress={() => console.warn("Works!")}
                                        activeOpacity={1}
                                        containerStyle={{ marginHorizontal: 20, marginTop: 5 }}
                                    />
                            }
                            <Icon
                                raised //reverse
                                size={16}
                                name='camerao'
                                type='antdesign'
                                color='#c4c4c4'
                                containerStyle={{ position: 'absolute', marginHorizontal: 150, marginRight: 5 }}
                                onPress={() => this.imagePicker()}
                                underlayColor='transparent'
                            />
                        </View>
                    </View>
                </ScrollView>
                {
                    this.state.postImages ?
                        <View style={{ height: height(90), width: width(100), position: 'absolute', backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                        </View>
                        :
                        null
                }
            </View>
        );
    }
}

export default withNavigation(DescriptionListing)