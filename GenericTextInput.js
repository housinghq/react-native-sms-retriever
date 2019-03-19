import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Animated,
  Easing,
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
  InteractionManager,
  Platform
} from 'react-native'
import R from 'ramda'
import colors from './colors'
import If from './If'

const isEmpty = R.anyPass([R.isNil, R.isEmpty])

const styles = StyleSheet.create({
  box: {
    height: 52,
    alignSelf: 'stretch'
  },
  labelContainer: {
    position: 'absolute',
    left: 0,
    right: 0
  },
  inputContainer: {
    position: 'absolute',
    bottom: 11,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  errorContainer: {
    marginTop: 0
  },
  countryCodeContainer: {
    flexDirection: 'row'
  },
  countryCode: {
    fontSize: 16,
    color: colors.black,
    bottom: 1,
    paddingRight: 4
  },
  downButton: {
    height: 24,
    width: 24
  },
  error: {
    color: colors.red,
    fontSize: 12,
    marginTop: 4,
    padding: 0
  },
  input: {
    flexGrow: 1,
    height: 21,
    fontSize: 16,
    padding: 0
  },
  passwordToggle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.purple2,
    padding: 0
  },
  underline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  resendButton: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.purple,
    padding: 0
  }
})

const interpolate = R.curry((animatedValue,
  inputRange = [0, 1], outputRange = [0, 1]) => animatedValue.interpolate({
  inputRange,
  outputRange
}))

const isNotNil = R.compose(
  R.not,
  R.isNil
)

const animationConfig = {
  duration: 200,
  easing: Easing.inOut(Easing.ease)
}

const createAnimation = R.curry((animatedValue,
  config = {}) => Animated.timing(animatedValue, Object.assign({}, animationConfig, config)))

const { test } = RegExp.prototype

const validationMap = type => ({
  otp: test.bind(RegExp('^[0-9]{3,}$')),
  numeric: test.bind(RegExp('^[0-9]+$')),
  mail: test.bind(RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z-]+)+$')),
  name: test.bind(RegExp('(.*[^\\s]+.*)+$')),
  password: test.bind(RegExp('^([a-zA-Z0-9$@$!%*?&]){1,}$')),
  tel: (value, countryCode) => {
    const val = isEmpty(value) ? value : value.trim()
    if (countryCode === '+91') {
      return test.bind(RegExp('^[1-9]{1}[0-9]{9}$'))(val) && val.length === 10
    }
    return test.bind(RegExp('^[0-9]{3,}$'))(val)
  },
  date: test.bind(RegExp('^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$')),
  generic: R.T
}[type])

const keyboardType = R.cond([
  [R.equals('numeric'), R.always('numeric')],
  [R.equals('otp'), R.always('numeric')],
  [R.equals('mail'), R.always('email-address')],
  [R.equals('tel'), R.always('phone-pad')],
  [R.T, R.always('default')]
])

export default class GenericTextInput extends PureComponent {
  static propTypes = {
    ...TextInput.propTypes,
    testID: PropTypes.string,
    accentColor: PropTypes.string,
    underlineColor: PropTypes.string,
    autoFocus: PropTypes.bool,
    autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
    errorText: PropTypes.string,
    showPasswordToggle: PropTypes.bool,
    countryCode: PropTypes.string,
    onDidUpdate: PropTypes.func,
    type: PropTypes.string,
    editable: PropTypes.bool,
    showResendOtp: PropTypes.bool,
    showExtraView: PropTypes.bool,
    showWithoutFocus: PropTypes.bool,
    viewOnPress: PropTypes.func,
    extraView: PropTypes.element,
    keyboardType: PropTypes.string,
    shouldShowError: PropTypes.bool,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    secureTextEntry: PropTypes.bool,
    value: PropTypes.string
  }

  static defaultProps = {
    onFocus: () => {},
    onBlur: () => {},
    onChangeText: () => {},
    onSubmitEditing: () => {},
    onDidUpdate: () => {},
    type: 'generic',
    accentColor: colors.purple,
    underlineColor: colors.black,
    autoFocus: false,
    autoCapitalize: 'sentences',
    errorText: 'Error',
    secureTextEntry: false,
    showPasswordToggle: false,
    countryCode: '+91',
    value: null,
    editable: true,
    showResendOtp: null,
    showExtraView: null,
    showWithoutFocus: null,
    viewOnPress: null,
    extraView: null,
    testID: '',
    keyboardType: null,
    shouldShowError: false
  }

  constructor(props) {
    super(props)
    this.state = {
      focused: false,
      value: props.value,
      valid: true,
      countryCode: props.countryCode,
      secureTextEntry: props.secureTextEntry || props.type === 'password'
    }
    this.input = null
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.focus()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    InteractionManager.runAfterInteractions(() => {
      if (prevState.focused !== this.state.focused) {
        if (isNotNil(this.state.value)) {
          Animated.parallel([
            createAnimation(this.underlineAnimValue, { toValue: this.state.focused ? 1 : 0 }),
            createAnimation(this.labelColorAnimValue, { toValue: this.state.focused ? 1 : 0 })
          ]).start(() => this.state.focused ? this.input
          && this.input.focus() : this.input && this.input.blur())
        } else {
          Animated.parallel([
            createAnimation(this.underlineAnimValue, { toValue: this.state.focused ? 1 : 0 }),
            createAnimation(this.labelColorAnimValue, { toValue: this.state.focused ? 1 : 0 }),
            createAnimation(this.labelTransformAnimValue, { toValue: this.state.focused ? 1 : 0 }),
            createAnimation(this.countryCodeAnimValue, { toValue: this.state.focused ? 1 : 0 })
          ]).start(() => this.state.focused ? this.input
          && this.input.focus() : this.input && this.input.blur())
        }
      }
    })
    this.props.onDidUpdate(this.state)
  }

  onChangeText = (value) => {
    if (this.props.type === 'otp') {
      this.setState((prevState, props) => ({
        value,
        // eslint-disable-next-line
        valid: this.state.focused ? true : validationMap(props.type)(value)
      }), this.props.onChangeText(value))
    }
  }

  onEndEditing = () => {
    this.setState((prevState, props) => ({
      // eslint-disable-next-line
      valid: validationMap(props.type)(this.state.value, prevState.countryCode)
    }))
  }

  onFocus = (event) => {
    if (!this.state.focused) {
      this.setState({ focused: true })
    }
    if (this.input) {
      this.input.focus()
    }
    this.props.onFocus(event)
  }

  setValue = (otpValue) => {
    this.setState({
      value: otpValue
    })
  }

  onBlur = (event) => {
    if (this.state.focused) {
      this.setState({ focused: false })
    }
    if (this.input) {
      this.input.blur()
    }
    this.props.onBlur(event)
  }

  onSubmitEditing = (event) => {
    if (this.state.value === '') {
      this.setState({ value: null })
    }
    this.onBlur()
    this.setState((prevState, props) => ({
      valid: validationMap(props.type)(prevState.value, prevState.countryCode)
    }))
    this.props.onSubmitEditing(event)
  }

  setRef = (ref) => {
    this.input = ref
  }

  get value() {
    return this.state.value
  }

  get isValid() {
    return validationMap(this.props.type)(this.state.value, this.state.countryCode)
  }

  get isFocused() {
    return this.input && this.input.isFocused()
  }

  toggleSecureText = () => (
    this.setState(({ secureTextEntry }) => ({ secureTextEntry: !secureTextEntry })))

  clear = () => {
    if (this.input) {
      this.setState({ value: null })
      this.input.setNativeProps({ text: null })
    }
  }
  // eslint-disable-next-line
  labelColorAnimValue = new Animated.Value(0)

  // eslint-disable-next-line
  labelTransformAnimValue = new Animated.Value(0)

  // eslint-disable-next-line
  underlineAnimValue = new Animated.Value(0)

  // eslint-disable-next-line
  countryCodeAnimValue = new Animated.Value(0)

  focus = this.onFocus

  blur = this.onBlur

  render() {
    const {
      props: {
        accentColor,
        underlineColor,
        autoCapitalize,
        placeholder,
        type,
        showPasswordToggle,
        errorText,
        editable,
        showResendOtp,
        resendOtp,
        showExtraView,
        showWithoutFocus,
        viewOnPress,
        extraView,
        testID,
        shouldShowError,
        maxLength
      },
      state: {
        value, focused, valid, countryCode, secureTextEntry
      },
      labelColorAnimValue,
      labelTransformAnimValue,
      underlineAnimValue,
      countryCodeAnimValue
    } = this
    const color = focused ? accentColor : underlineColor
    const placeholderColor = focused ? accentColor : colors.black50
    return (
      <TouchableWithoutFeedback testID={testID} onPress={this.onFocus}>
        <View style={{ marginBottom: 14 }}>
          <View style={styles.box}>
            <Animated.View
              style={[
                styles.labelContainer,
                {
                  bottom: isNotNil(value)
                    ? 38
                    : interpolate(labelTransformAnimValue, [0, 1], [14, 38])
                }
              ]}
            >
              <Animated.Text
                style={{
                  fontSize: isNotNil(value)
                    ? 14
                    : interpolate(labelTransformAnimValue, [0, 1], [16, 14]),
                  color:
                    valid && !shouldShowError
                      ? interpolate(labelColorAnimValue, [0, 1], [colors.black54, placeholderColor])
                      : colors.red
                }}
              >
                {placeholder}
              </Animated.Text>
            </Animated.View>
            <If
              predicate={
                !focused
                && !isNotNil(value)
                && showWithoutFocus
                && showExtraView
                && extraView
                && R.is(Function)(viewOnPress)
              }
            >
              <View style={{ position: 'absolute', right: 0, bottom: 11 }}>
                <TouchableWithoutFeedback onPress={viewOnPress}>
                  {extraView}
                </TouchableWithoutFeedback>
              </View>
            </If>
            <Animated.View
              style={[
                styles.underline,
                {
                  backgroundColor: valid
                    ? interpolate(underlineAnimValue, [0, 1], [colors.black10, color])
                    : colors.red,
                  height: valid ? interpolate(underlineAnimValue, [0, 1], [1, 2]) : 2
                }
              ]}
            />
            <If predicate={focused || isNotNil(value)}>
              <View style={styles.inputContainer}>
                <If predicate={type === 'tel'}>
                  <Animated.View
                    style={[
                      styles.countryCodeContainer,
                      {
                        opacity: isNotNil(value)
                          ? 1
                          : interpolate(countryCodeAnimValue, [0, 1], [0, 1])
                      }
                    ]}
                  >
                    <Text style={styles.countryCode} allowFontScaling={Platform.OS === 'android'}>
                      {countryCode}
                    </Text>
                  </Animated.View>
                </If>
                <TextInput
                  ref={this.setRef}
                  style={styles.input}
                  underlineColorAndroid="transparent"
                  blurOnSubmit
                  autoCapitalize={autoCapitalize}
                  autoCorrect={false}
                  keyboardType={
                    isEmpty(this.props.keyboardType) ? keyboardType(type) : this.props.keyboardType
                  }
                  secureTextEntry={secureTextEntry}
                  value={value}
                  onBlur={this.onBlur}
                  editable={editable}
                  onChangeText={this.onChangeText}
                  onSubmitEditing={this.onSubmitEditing}
                  allowFontScaling={Platform.OS === 'android'}
                  maxLength={maxLength}
                  onEndEditing={this.onEndEditing}
                />
                <If predicate={showPasswordToggle}>
                  <TouchableWithoutFeedback
                    onPress={
                      isEmpty(this.props.onToggleClick)
                        ? this.toggleSecureText
                        : this.props.onToggleClick
                    }
                  >
                    <View>
                      <Text style={styles.passwordToggle}>{secureTextEntry ? 'Show' : 'Hide'}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </If>
                <If predicate={showResendOtp && R.is(Function)(resendOtp)}>
                  <TouchableWithoutFeedback onPress={resendOtp}>
                    <View>
                      <Text style={styles.resendButton}>Resend</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </If>
                <If predicate={showExtraView && extraView && R.is(Function)(viewOnPress)}>
                  <TouchableWithoutFeedback onPress={viewOnPress}>
                    {extraView}
                  </TouchableWithoutFeedback>
                </If>
              </View>
            </If>
          </View>
          <If predicate={!valid || shouldShowError}>
            <View style={styles.errorContainer}>
              <Text style={styles.error}>{errorText}</Text>
            </View>
          </If>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
