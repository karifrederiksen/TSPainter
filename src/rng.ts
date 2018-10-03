import { T2, T3, T4 } from "./util"

namespace Pcg {
    /*
     * Port of Elm's PCG RNG implementation
     * https://github.com/elm/random/blob/1.0.0/src/Random.elm
     * http://www.pcg-random.org/
     */
    export type Seed = T2<number, number>

    export function seed(x: number) {
        const [state, incr] = step([0, 1013904223])
        return step([(state + x) >>> 0, incr])
    }

    function step([state, incr]: Seed): Seed {
        return [(state * 1664525 + incr) >>> 0, incr]
    }

    function output([state]: Seed): number {
        const word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737
        return ((word >>> 22) ^ word) >>> 0
    }

    export function nextInt(s: Seed): T2<number, Seed> {
        return [output(s), step(s)]
    }
}

namespace Xorshift {
    /*
     * Implementation of Xorshift 128
     * https://en.wikipedia.org/wiki/Xorshift
     */

    export type Seed = T4<number, number, number, number>

    export function seed(n: number): Seed {
        let seed_: Seed = [n, 0, 0, 0]
        for (let i = 0; i < 32; i++) {
            const [_, nextSeed] = nextInt(seed_)
            seed_ = nextSeed
        }
        return seed_
    }

    export function nextInt(state: Seed): T2<number, Seed> {
        const s = state[0]
        let t = state[3]
        t ^= t << 11
        t ^= t >>> 8
        t ^= s
        t ^= s >>> 19
        return [t, [t, s, state[1], state[2]]]
    }
}

export type Seed = Pcg.Seed

export const seed = Pcg.seed

export const nextInt = Pcg.nextInt

export function next(state: Seed): T2<number, Seed> {
    const [result, nextState] = nextInt(state)
    const floatResult = (result >>> 0) / 4294967295
    return [floatResult, nextState]
}

export function next2(state: Seed): T3<number, number, Seed> {
    const [first, state2] = next(state)
    const [second, state3] = next(state2)
    return [first, second, state3]
}

export function next3(state: Seed): T4<number, number, number, Seed> {
    const [first, state2] = next(state)
    const [second, state3] = next(state2)
    const [third, state4] = next(state3)
    return [first, second, third, state4]
}

export class StatefulWrapper {
    private __state: Seed

    get state(): Seed {
        return this.__state
    }

    constructor(state: Seed) {
        this.__state = state
    }

    next(): number {
        const [result, nextState] = next(this.__state)
        this.__state = nextState
        return result
    }

    nextInt(): number {
        const [result, nextState] = nextInt(this.__state)
        this.__state = nextState
        return result
    }
}
