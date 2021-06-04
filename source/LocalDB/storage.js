import { AsyncStorage } from 'react-native'

export default {
    getItem(key) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(key, (error, result) => {
                if (error) {
                    reject(error)
                    return
                }
                if (result != null)
                    var response = JSON.parse(result);
                else
                    var response = null;
                resolve(response);
            })
        })
    },
    setItem(key, value) {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(key, JSON.stringify(value), error => {
                if (error) {
                    reject(error);
                    return
                }
                resolve("Saved in DB");
            })
        })
    },
    removeItem(key) {
        return new Promise((resolve, reject) => {
            AsyncStorage.removeItem(key, error => {
                if (error) {
                    reject(error);
                    return
                }
                resolve()
            })
        })
    }
}
