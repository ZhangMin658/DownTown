import { StyleSheet , I18nManager } from 'react-native';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_BACKGROUND, S25, S2, S18, S17, S16, S15, S14, S13, S12, S11 } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
const buttonTxt = 1.8;
const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_BACKGROUND
    },
    TextInputCon: {
        height: height(6),
        width: width(95),
        flexDirection: 'row',
        marginTop: 20,
        borderRadius: 5,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'gray',
        alignSelf: 'center',
        backgroundColor: COLOR_PRIMARY
    },
    TextInput: {
        alignSelf: 'stretch',
        paddingHorizontal: 10,
        width: width(85),
        fontSize: totalSize(S16),
        textAlign:'left'
    },
    searchIcon: {
        height: height(2.8),
        width: width(6),
        resizeMode: 'contain',
        marginHorizontal: 5
    },
    cate_strip: {
        height: height(8),
        width: width(95),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginHorizontal: 10,
        borderBottomWidth: 0.5,
        borderColor: '#cccccc'
    },
    icon: {
        height: height(5.5),
        width: width(10),
        resizeMode: 'contain'
    },
    cate_text: {
        flex: 1,
        fontSize: totalSize(S16),
        color: COLOR_SECONDARY,
        marginHorizontal: 15,
        // textAlign: 'left'
    },
    rightIcon: {
        height: height(2.2),
        width: width(5),
        resizeMode: 'contain',
        transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
    },

});

export default styles;
