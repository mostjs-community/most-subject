import assert from 'power-assert'

import {holdSubject} from '../lib/index'

describe('holdSubject', () => {
  it('should throw if given a bufferSize less than 0', () => {
    assert.throws(() => {
      holdSubject(-1)
    })
  })

  it('should buffer with consumer and replay last value', () => {
    const stream = holdSubject()

    stream.observe(() => {})

    stream.next(1)
    stream.next(2)

    setTimeout(() => stream.complete())

    return stream
      .reduce((x, y) => x.concat(y), [])
      .then(x => assert.deepEqual(x, [ 2 ]))
  })

  it('should buffer without consumer and replay last value', () => {
    const stream = holdSubject()

    stream.next(1)
    stream.next(2)

    setTimeout(() => stream.complete())

    return stream
      .reduce((x, y) => x.concat(y), [])
      .then(x => assert.deepEqual(x, [ 2 ]))
  })

  it('should allow for adjusting bufferSize of stream', () => {
    const stream = holdSubject(3)

    stream.next(1)
    stream.next(2)
    stream.next(3)
    stream.next(4)

    setTimeout(() => stream.complete())

    return stream
      .reduce((x, y) => x.concat(y), [])
      .then(x => {
        assert.deepEqual(x, [2, 3, 4])
      })
  })
})
