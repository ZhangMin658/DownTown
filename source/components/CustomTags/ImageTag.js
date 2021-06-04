import React, { Component } from 'react';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

class CustomTags extends Component<Props> {
    render() {
        let source = this.props.source; 
        let style = this.props.style;
        return (
            <Image indicator={null} source={source} style={style} />    
        );
    }
}
export default CustomTags;
