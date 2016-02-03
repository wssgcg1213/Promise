/**
 * Created at 16/2/3.
 * @Author Ling.
 * @Email i@zeroling.com
 */
//pending => resolved / rejected
function isFunction (func) {
    return Object.prototype.toString.call(func) === '[object Function]';
}
const PENDING = Symbol('pending');
const RESOLVED = Symbol('resolved');
const REJECTED = Symbol('rejected');

let privateVals = new WeakMap();

export default class Promise {
    constructor (fn) {
        this.state = PENDING;
        this.val = null;
        this.callback = isFunction(fn) ? fn : (o => o);
        this.onFulfilleds = [];
        this.onRejecteds = [];
        this.callback(this.resolve.bind(this), this.reject.bind(this));
    }

    then (onFulfilled, onRejected) {
        //if (!isFunction(onFulfilled)) {
        //    this.resolve(onFulfilled);
        //    return this;
        //}
        //if (arguments.length > 1 && !isFunction(onRejected)) {
        //    throw new Error("Uncaught value in Promise");
        //}
        return new Promise((resolve, reject) => {
            if (this.state === PENDING) {
                if (isFunction(onFulfilled)) {
                    this.onFulfilleds.push(val => {
                        this.val = onFulfilled(val);
                        resolve(this.val);
                    });
                }
                if (isFunction(onRejected)) {
                    this.onRejecteds.push(val => {
                        this.val = onRejected(val);
                        reject(this.val);
                    });
                }
            } else if (this.state === RESOLVED) {
                if (isFunction(onFulfilled)) {
                    let val = onFulfilled.call(this, this.val);
                    resolve(val);
                    return val;
                }

            } else if (this.state === REJECTED) {
                if (isFunction(onRejected)) {
                    let err = onRejected.call(this, this.val);
                    reject(err);
                    return err;
                }
            }
        });
    }

    catch (onRejected) {
        return this.then.bind(this, () => {})(onRejected);
    }

    resolve (val) {
        if (this.state === PENDING) {
            this.state = RESOLVED;
            this.val = val;
            for (let cb of this.onFulfilleds) {
                cb.call(this, val);
            }
        }
    }

    reject (val) {
        if (this.state === PENDING) {
            this.state = REJECTED;
            this.val = val;
            for (let cb of this.onRejecteds) {
                cb.call(this, val);
            }
        }
    }

    static isPromise (obj) {
        return obj instanceof Promise;
    }
    static all (...args) {}
    static race () {}
    static resolve (val) {
        return new Promise(resolve => resolve(val));
    }
    static reject (err) {
        return new Promise((resolve, reject) => reject(err));
    }
}