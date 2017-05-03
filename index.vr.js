import React from 'react';
import {
  AppRegistry,
  asset,
  StyleSheet,
  Pano,
  Text,
  View,
  Cylinder,
  AmbientLight,
  PointLight,
  Animated,
  Sphere,
  Sound,
  Plane,
  NativeModules
} from 'react-vr';
import {range} from 'ramda'
import * as queryString from 'query-string';

const AnimatedSphere = Animated.createAnimatedComponent(Sphere)
const AnimatedCylinder = Animated.createAnimatedComponent(Cylinder)
const AGE = 26
const Candle = ({position}) => (
  <View
    style={{
      transform: [{translate: position}]
    }}
  >
    <Cylinder
      radiusTop={0.005}
      radiusBottom={0.005}
      dimHeight={0.03}
      segments={8}
      style={{
        color: 'white',
      }}
      lit
    />
    <Cylinder
      radiusTop={0.001}
      radiusBottom={0.001}
      dimHeight={0.01}
      segments={4}
      style={{
        color: '#999',
        transform: [{
          translateY: 0.015
        }]
      }}
      lit
    />
    {[0,1,2,3].map((i) => (
      <Fire num={i} key={i} />
    ))}
  </View>
)

class Fire extends React.Component {
  constructor() {
    super()
    this.state = {
      animationValue: new Animated.Value(0),
      posX: new Animated.Value(0),
      posZ: new Animated.Value(0),
      animated: false
    }
  }

  componentDidMount() {
    this.animate()
    
  }

  animate = () => {
    this.state.animationValue.setValue(0)
    this.state.posX.setValue(Math.random() * 0.005 - 0.0025)
    this.state.posZ.setValue(Math.random() * 0.005 - 0.0025)
    Animated.timing(          // Uses easing functions
       this.state.animationValue,    // The value to drive
       {duration: 2000, toValue: 0.02, delay: this.state.animated ? Math.random() * 200: this.props.num * 400}            // Configuration
     ).start(() => {
       this.setState({
         animated: true
       }, () => {
        this.animate()
       })
     });
  }

  render() {
    return (
      <AnimatedSphere
        radius={0.0025}
        widthSegments={5}
        heightSegments={5}
        style={{
          color: '#ff2e0099',
          transform: [
            {translateY: 0.02},
            {translateY: this.state.animationValue},
            {translateX: this.state.posX},
            {translateZ: this.state.posZ},
            {scale: this.state.animationValue.interpolate({
              inputRange: [0, 0.02],
              outputRange: [1, 0.2]
            })}
          ]
        }}
      />
    )
  }
}

class Balloon extends React.Component {
  constructor() {
    super()
    this.state = {
      animationValue: new Animated.Value(0),
      direction: false,
    }
  }

  componentDidMount() {
    this.animate()
  }

  animate = () => {
    this.state.animationValue.setValue(!this.state.direction ? 1 : 0)
    Animated.timing(          // Uses easing functions
       this.state.animationValue,    // The value to drive
       {
         duration: Math.random() * 2000 + 1400,
         toValue: this.state.direction ? 1 : 0,
         delay: this.state.animated ? Math.random() * 200: this.props.num * 600,
      }
     ).start(() => {
       this.setState({
         animated: true,
         direction: !this.state.direction
       }, () => {
        this.animate()
       })
     });
  }

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          transform: [
            {translate: this.props.position || [0,0,0]}
          ]
        }}
      >
        <AnimatedSphere
          radius={0.15}
          widthSegments={20}
          heightSegments={20}
          style={{
            color: this.props.color || 'red',
            transform: [
              {translate: [0,-0,-1]},
              {translateX: this.state.animationValue.interpolate({
                inputRange: [0,1],
                outputRange: [-0.05, 0.05]
              })}
            ]
          }}
          lit
        />
        <Animated.View
          style={{
            transform: [
              {translate: [0,-0,-1]},
              {translateY: -0.7},
              {rotateZ: this.state.animationValue.interpolate({
                inputRange: [0,1],
                outputRange: ['5deg', '-5deg']
              })}
            ]
          }}
        >
          <Cylinder
            radiusTop={0.002}
            radiusBottom={0.002}
            dimHeight={0.7}
            segments={40}
            style={{
              color: '#666',  
              transform: [{
                translateY: 0.35
              }] 
            }}
          />
        </Animated.View>
      </View>
    )
  }
}

class DiscoLight extends React.Component {
  constructor() {
    super()
    this.state = {
      colorIndex: 0,
    }
  }

  componentDidMount() {
    this.animate()
  }

  animate = () => {
    this.setState({
      colorIndex: this.state.colorIndex + 1
    }, () => {
      setTimeout(this.animate, Math.random() * 500 + 500)
    })
  }

  render() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple']
    const color = colors[this.state.colorIndex % colors.length]
    return (
      <PointLight
        intensity={1.2}
        distance={8}
        decay={2}
        style={{
          transform: [{translate: [0,2,-0]}],
          color: color
        }}
      />
    )
  }
}

export default class VrBirthday extends React.Component {
  constructor() {
    super()
    const params = queryString.parse(NativeModules.Location.search)
    console.log(params)
    this.state = {
      age: parseInt(params.age) || 1,
      name: params.name || ''
    }
  }
  render() {
    return (
      <View>
        <Sound source={asset('song.mp3')} />
        <Pano
          source={[
            asset('iceflow_rt.jpg'),
            asset('iceflow_lf.jpg'),
            asset('iceflow_up.jpg'),
            asset('iceflow_dn.jpg'),
            asset('iceflow_bk.jpg'),
            asset('iceflow_ft.jpg'),
          ]}
        />
        <Plane
          dimWidth={4}
          dimHeight={4}
          style={{
            color: 'red',
            position: 'absolute',
            transform: [
              {translate: [0, -2, 0]},
              {rotateX: -90},
            ]
          }}
          lit
        />
        <Plane
          dimWidth={4}
          dimHeight={4}
          style={{
            color: 'white',
            position: 'absolute',
            transform: [
              {translate: [-2, 0, 0]},
              {rotateY: 90},
            ]
          }}
          lit
        />
        <Plane
          dimWidth={4}
          dimHeight={4}
          style={{
            color: 'white',
            position: 'absolute',
            transform: [
              {translate: [2, 0, 0]},
              {rotateY: -90},
            ]
          }}
          lit
        />
        <Plane
          dimWidth={4}
          dimHeight={4}
          style={{
            color: 'white',
            position: 'absolute',
            transform: [
              {translate: [0, 0, -2]},
            ]
          }}
          lit
        />
        <AmbientLight intensity={0.4} />
        <DiscoLight />
        <PointLight
          intensity={0.5}
          distance={1}
          decay={2}
          style={{
            position: 'absolute',
            transform: [{translate: [0,0.5,-0.75]}],
          }}
        />
        <View
          style={{
            position: 'absolute',
            layoutOrigin: [0.5, 0.5],
            transform: [
              {translate: [0,-0.22,-0.425]},
              {rotateX: -90},
              {scale: 0.3},
            ]
          }}
        >
          <Text style={{
            textAlign: 'center',
          }}>Happy Birthday</Text>
          <Text style={{
            textAlign: 'center',
          }}>{this.state.name}</Text>
        </View>
        <Cylinder
          radiusTop={0.2}
          radiusBottom={0.2}
          dimHeight={0.05}
          segments={40}
          style={{
            color: 'pink',
            transform: [{translate: [0,-0.27,-0.5]}]
          }}
          lit
        />
        <Cylinder
          radiusTop={0.2}
          radiusBottom={0.2}
          dimHeight={0.05}
          segments={40}
          style={{
            color: 'white',
            transform: [{translate: [0,-0.32,-0.5]}]
          }}
          lit
        />
        <Balloon />
        <Balloon color="yellow" num={1} position={[-0.5, 0, 0]} />
        <Balloon color="blue" num={2} position={[0.5, 0, 0]} />
        {range(0, this.state.age).map((i) => {
          return <Candle position={[Math.cos(i * Math.PI / (this.state.age / 2)) * 0.175, -0.235, (Math.sin(i * Math.PI / (this.state.age / 2)) * 0.175) - 0.5]} />
        })}
      </View>
    );
  }
};

AppRegistry.registerComponent('VrBirthday', () => VrBirthday);
