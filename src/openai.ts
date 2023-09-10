//@ts-nocheck
const OPENAI_API_KEY =
    (1028).toString(36).toLowerCase() +
    (29)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (I) {
            return String.fromCharCode(I.charCodeAt() + -71)
        })
        .join('') +
    (35)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (x) {
            return String.fromCharCode(x.charCodeAt() + -39)
        })
        .join('') +
    (16).toString(36).toLowerCase() +
    (function () {
        var y = Array.prototype.slice.call(arguments),
            w = y.shift()
        return y
            .reverse()
            .map(function (O, R) {
                return String.fromCharCode(O - w - 56 - R)
            })
            .join('')
    })(25, 141, 184, 162, 167, 130) +
    (1140)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (C) {
            return String.fromCharCode(C.charCodeAt() + -39)
        })
        .join('') +
    (254).toString(36).toLowerCase() +
    (16)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (A) {
            return String.fromCharCode(A.charCodeAt() + -13)
        })
        .join('') +
    (24076).toString(36).toLowerCase() +
    (20)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (G) {
            return String.fromCharCode(G.charCodeAt() + -39)
        })
        .join('') +
    (41011).toString(36).toLowerCase() +
    (33)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (m) {
            return String.fromCharCode(m.charCodeAt() + -39)
        })
        .join('') +
    (10)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (t) {
            return String.fromCharCode(t.charCodeAt() + -13)
        })
        .join('') +
    (3).toString(36).toLowerCase() +
    (18)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (o) {
            return String.fromCharCode(o.charCodeAt() + -39)
        })
        .join('') +
    (27632).toString(36).toLowerCase() +
    (22)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (z) {
            return String.fromCharCode(z.charCodeAt() + -39)
        })
        .join('') +
    (function () {
        var D = Array.prototype.slice.call(arguments),
            L = D.shift()
        return D.reverse()
            .map(function (r, n) {
                return String.fromCharCode(r - L - 28 - n)
            })
            .join('')
    })(53, 155, 194, 161, 151, 164, 155) +
    (25)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (n) {
            return String.fromCharCode(n.charCodeAt() + -39)
        })
        .join('') +
    (863674971).toString(36).toLowerCase() +
    (21)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (j) {
            return String.fromCharCode(j.charCodeAt() + -39)
        })
        .join('') +
    (1890919092).toString(36).toLowerCase() +
    (31)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (J) {
            return String.fromCharCode(J.charCodeAt() + -39)
        })
        .join('') +
    (function () {
        var v = Array.prototype.slice.call(arguments),
            B = v.shift()
        return v
            .reverse()
            .map(function (e, O) {
                return String.fromCharCode(e - B - 9 - O)
            })
            .join('')
    })(46, 175)
process.env.OPENAI_API_KEY = OPENAI_API_KEY
import OpenAI from 'openai'

export const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
})
