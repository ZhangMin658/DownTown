import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { INDICATOR_COLOR, COLOR_PRIMARY, S25, SloganText, S18, S17, S16, S15, S14, S13, S12, S11 } from './common';
import { width, height, totalSize } from 'react-native-dimension';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgCon: {
        flex: 1,
        alignSelf: 'stretch',
    },
    imgConShadow: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center'
    },
    instructions: {
        textAlign: 'center',
        color: INDICATOR_COLOR,
        marginBottom: 5,
    },
    LogoCon: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    slogoTitle: {
        fontSize: SloganText,
        color: COLOR_PRIMARY,
        textAlign: 'center',
        marginHorizontal: 70,
        marginVertical: 25,
        lineHeight: 20,
    },
    IndicatorCon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default styles;
