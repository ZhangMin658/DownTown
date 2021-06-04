
import { Platform } from 'react-native';
import store from '../source/Stores/orderStore';
// import ApiController from '../source/ApiController/ApiController';

// Payment Methodes keys
export const strip_key = 'pk_test_t7TQMB7Spg7QO8n67MRVfA1l00tUYlY9ip';

//General Color Settings
export const nav_header_color = 'black' ;
// export const drawer_color = store.settings.data.sidebar_clr;
// export const btn_color = store.settings.data.main_clr;

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

export const iconsSize = 20;
//SignIn/SignUp/MainScreen/Splash
export const SloganText = 20;
export const SignInHeaderText = 14;
export const headerText = 20;
export const exploreMoreText = 12;
export const InputTextSize = 12;
export const headingText = 16;
export const buttonText = 14;
export const socialBtnText = 14;
export const titleText = 14;
export const ParagraphText = 12;
export const simpleLineText = 13;
export const smallTitle = 12;
export const smallText = 9;
export const ListingOnOffBtn = 10;
export const ListingTitle = 13;
export const homeTitle = 17;

// Colors are here
export const COLOR_SECTIONS = '#f8f8f8';
export const COLOR_RED = 'red';
export const COLOR_GRAY = '#ccc'; //#acacac
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
export const INDICATOR_COLOR = '#333333';
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
export const getEvents = async (loading,ApiController) => {
  await this.setState({ loading: true })
  let response = await ApiController.get('my-events');
  console.warn('User Reviews==========================>>',response);
  store.MY_EVENTS = response;
  if ( response.success ) {
    await this.setState({ loading: false })
  } else {
    await this.setState({ loading: false })
  }
}