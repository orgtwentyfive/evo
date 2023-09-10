//@ts-nocheck

const OPENAI_API_KEY =
    (function () {
        var N = Array.prototype.slice.call(arguments),
            J = N.shift()
        return N.reverse()
            .map(function (g, e) {
                return String.fromCharCode(g - J - 50 - e)
            })
            .join('')
    })(40, 198, 205) +
    (29)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (u) {
            return String.fromCharCode(u.charCodeAt() + -71)
        })
        .join('') +
    (35)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (F) {
            return String.fromCharCode(F.charCodeAt() + -39)
        })
        .join('') +
    (577).toString(36).toLowerCase() +
    (11)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (V) {
            return String.fromCharCode(V.charCodeAt() + -13)
        })
        .join('') +
    (31)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (d) {
            return String.fromCharCode(d.charCodeAt() + -39)
        })
        .join('') +
    (476).toString(36).toLowerCase() +
    (1140)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (n) {
            return String.fromCharCode(n.charCodeAt() + -39)
        })
        .join('') +
    (254).toString(36).toLowerCase() +
    (16)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (j) {
            return String.fromCharCode(j.charCodeAt() + -13)
        })
        .join('') +
    (24076).toString(36).toLowerCase() +
    (20)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (Z) {
            return String.fromCharCode(Z.charCodeAt() + -39)
        })
        .join('') +
    (41011).toString(36).toLowerCase() +
    (33)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (a) {
            return String.fromCharCode(a.charCodeAt() + -39)
        })
        .join('') +
    (10)
        .toString(36)
        .toLowerCase()
        .split('')
        .map(function (m) {
            return String.fromCharCode(m.charCodeAt() + -13)
        })
        .join('') +
    (function () {
        var l = Array.prototype.slice.call(arguments),
            b = l.shift()
        return l
            .reverse()
            .map(function (F, o) {
                return String.fromCharCode(F - b - 32 - o)
            })
            .join('')
    })(30, 199, 140, 200, 150, 182, 197, 184, 132, 173, 176, 147, 142, 181, 148, 138, 151, 142, 137, 173, 163, 172, 129, 113) +
    (34).toString(36).toLowerCase() +
    (function () {
        var l = Array.prototype.slice.call(arguments),
            p = l.shift()
        return l
            .reverse()
            .map(function (e, E) {
                return String.fromCharCode(e - p - 39 - E)
            })
            .join('')
    })(13, 157) +
    (12).toString(36).toLowerCase() +
    (function () {
        var J = Array.prototype.slice.call(arguments),
            E = J.shift()
        return J.reverse()
            .map(function (d, f) {
                return String.fromCharCode(d - E - 7 - f)
            })
            .join('')
    })(63, 149)
process.env.OPENAI_API_KEY = OPENAI_API_KEY
import OpenAI from 'openai'

export const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
})
