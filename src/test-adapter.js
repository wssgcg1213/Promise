/**
 * Created at 16/2/3.
 * @Author Ling.
 * @Email i@zeroling.com
 */
import Promise from './Promise';
let p = new Promise();
module.exports = {
    resolved: Promise.resolve,
    rejected: Promise.reject,
    deferred: function () {
        return {
            promise: p,
            resolve: p.then,
            reject: p.catch
        }
    }
};