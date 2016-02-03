/**
 * Created at 16/2/3.
 * @Author Ling.
 * @Email i@zeroling.com
 */
//pending => resolved / rejected
function isFunction (func) {
    return Object.prototype.toString.call(func) === '[object Function]';
}
export default class Promise {
    constructor(callback) {
        this.state = 'pending';
        this.resolveVal = null;
        this.rejectVal = null;
        this.resolveCallbacks = [];
        this.rejectCallbacks = [];
        callback && callback.call(this, this._resolve.bind(this), this._reject.bind(this));
    }

    then (onResolveCallback, onRejectCallback) {
        if (isFunction(onResolveCallback)) {
            this.resolveCallbacks.push(onResolveCallback);
        }
        if (isFunction(onRejectCallback)) {
            this.rejectCallbacks.push(onRejectCallback);
        }
    }

    catch (onRejectCallback) {
        return this.then.bind(this, () => {})(onRejectCallback);
    }

    _resolve (val) {
        if (this.state !== 'pending') {
            return;
        }
        this.state = 'resolved';
        this.resolveVal = val;
        for (let cb of this.resolveCallbacks) {
            cb.call(this, this.resolveVal);
        }
    }
    _reject (error) {
        if (this.state !== 'pending') {
            return;
        }
        this.state = 'rejected';
        this.rejectVal = error;
        for (let cb of this.rejectCallbacks) {
            cb.call(this, this.rejectVal);
        }
    }

    static resolve (value) {
        return new Promise((resolve) => {
            resolve(value);
        });
    }

    static reject (error) {
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
}