
import { Platform } from 'react-native';
import store from '../Stores/orderStore';
//General Color Settings
export const nav_header_color = store.settings === null? 'black' : store.settings.data.navbar_clr ;
export const drawer_color = store.settings.data.sidebar_clr;
export const btn_color = store.settings.data.main_clr;

//Text Sizes are here
export const S25 = 2.5;
export const S21 = 2.1;
export const S2 = 2;
export const S18 = 1.8;
export const S17 = 1.7;
export const S16 = 1.6;
export const S15 = 1.5;
export const S14 = 1.4;
export const S13 = 1.3;
export const S12 = 1.2;
export const S11 = 1.1;
// Colors are here
export const COLOR_RED = 'red';
export const COLOR_GRAY = 'gray'; //#acacac
export const COLO_DARK_GRAY = '#a9a9a9';
export const COLOR_ORANGE = '#ffc400';
export const COLOR_PRIMARY = '#ffffff';
export const COLOR_SECONDARY = 'black';
export const COLOR_BROWN = '#d28a00';
export const COLOR_YELLOW = '#ffd100';
export const COLOR_PINK = '#f08f90';
export const COLOR_LIGHT_PINK = '#fadddd';
export const COLOR_LIGHT_BLUE = '#cf57fe';
export const COLOR_TRANSPARENT_BLACK = 'rgba(0,0,0,0.9)';
export const COLOR_BACKGROUND = '#f9f9f9'
export const COLOR_LIME_GREEN = 'rgb(50,205,50)';
//font families are here
export const FONT_NORMAL = Platform.select({
  ios: "Open Sans",
  android: "OpenSans"
});
export const FONT_BOLD = "Montserrat-SemiBold";
//spinner preloader and activity indicator settings
export const INDICATOR_COLOR = '#000000';
export const INDICATOR_SIZE = 'large';   //normal , small , large
export const TEXT_COLOR = '#000000';
export const TEXT_SIZE = 1.8;
export const OVERLAY_COLOR = 'transparent';
export const INDICATOR_VISIBILITY = true;
export const ANIMATION = 'slide';   //fade , slide ,none
//API_KEYS
export const GOOGLE_MAP_API_KEY = '';
export const YOUTUBE_API_KEY = 'AIzaSyBJbsTKNgd7yPAdIQ4Lo7ju50zK9An0z68';
export const GEOCODING_API_KEY = '';
//functions
export const Button = () => (
  <TouchableHighlight style={styles.container}>
    <Text style={styles.button}>Click Me</Text>
  </TouchableHighlight>
)
export const test = () => {
  console.warn('tested func');
}
