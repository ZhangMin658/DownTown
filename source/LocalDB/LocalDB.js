import { AsyncStorage, Alert } from "react-native"

class LocalDB {

    static async saveProfile(email, password, data) {
        console.warn('data==>>', email+"  "+password);
        try {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('password', password);
            await AsyncStorage.setItem('profile', JSON.stringify(data));
            return true;
        } catch (error) {
            // Error retrieving data
            console.warn(error.message);
            return false;
        }
    }

    static async saveHomepage(number) {
        console.log('homepage==>>', number);
        try {
            await AsyncStorage.setItem('homepage', JSON.stringify(number));
            return true;
        } catch (error) {
            // Error retrieving data
            console.log('error is ',error.message);
            return false;
        }
    }

    static  getHomepage() {
        
        try {
           
           AsyncStorage.getItem('homepage').then((value)=>{
            console.log('here here')
            return value

           });
            // if(homepagenumber!=null){
                // console.log('here here')
                // const number = JSON.parse(homepagenumber);
            // return 1;

            // }
        }
        catch (error) {
            console.log('error is', error.message);
            return null;
        }
    }



    

    static async getUserProfile() {
        let item = {};
        try {
            // var emial = await AsyncStorage.getItem('email') || null;
            // var password = await AsyncStorage.getItem('password') || null;
            item = await AsyncStorage.getItem('profile') || null;
            const userProfile = JSON.parse(item);
            return userProfile;
        }
        catch (error) {
            console.warn(error.message);
            return null;
        }
    }

    static async saveIsProfilePublic(isPublic) {
        try {
            await AsyncStorage.setItem('isPublic', isPublic);
        }
        catch (error) {
            console.warn(error.message);
        }
    }
    static async isProfilePublic() {

        const isPublic = await AsyncStorage.getItem('isPublic') || null;
        if (isPublic === '1')
            return true;
        else
            return false;
    }

}

export default LocalDB; 