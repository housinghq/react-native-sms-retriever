import React, { Children } from 'react'
import PropTypes from 'prop-types'
import R from 'ramda'
import { View } from 'react-native'

const count = R.bind(Children.count, Children)

const If = R.ifElse(
  // TODO: Evaluate predicate function with props
  /*
    If predicate is function, evaluate it, otherwise, return as is (will be either truthy ot falsy).
   */
  R.ifElse(
    R.propSatisfies(R.is(Function), 'predicate'),
    R.converge(R.call, [R.prop('predicate')]),
    R.prop('predicate')
  ),
  /*
    If predicate is truthy, evaulate this block with props.
    If single child, return as is, otherwise wrap in a view.
   */
  R.ifElse(
    R.propSatisfies(R.pipe(count, R.equals(1)), 'children'),
    R.prop('children'),
    R.pipe(R.prop('children'), children => <View>{children}</View>)
  ),
  /*
    If predicate is falsy, always return null
   */
  R.always(null)
)

If.propTypes = {
  predicate: PropTypes.any
}

If.defaultProps = {
  predicate: false
}

export default If
