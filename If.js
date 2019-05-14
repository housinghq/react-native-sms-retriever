import React, { Children } from 'react'
import PropTypes from 'prop-types'
import bind from 'ramda/src/bind'
import ifElse from 'ramda/src/ifElse'
import propSatisfies from 'ramda/src/propSatisfies'
import converge from 'ramda/src/converge'
import prop from 'ramda/src/prop'
import pipe from 'ramda/src/pipe'
import is from 'ramda/src/is'
import equals from 'ramda/src/equals'
import always from 'ramda/src/always'
import call from 'ramda/src/call'
import { View } from 'react-native'


const count = bind(Children.count, Children)

const If = ifElse(
  // TODO: Evaluate predicate function with props
  /*
    If predicate is function, evaluate it, otherwise, return as is (will be either truthy ot falsy).
   */
  ifElse(
    propSatisfies(is(Function), 'predicate'),
    converge(call, [prop('predicate')]),
    prop('predicate')
  ),
  /*
    If predicate is truthy, evaulate this block with props.
    If single child, return as is, otherwise wrap in a view.
   */
  ifElse(
    propSatisfies(pipe(count, equals(1)), 'children'),
    prop('children'),
    pipe(prop('children'), children => <View>{children}</View>)
  ),
  /*
    If predicate is falsy, always return null
   */
  always(null)
)

If.propTypes = {
  predicate: PropTypes.any
}

If.defaultProps = {
  predicate: false
}

export default If
