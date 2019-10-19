var gIOSNativeResultMap = {};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function iosNativeCaller(msgName, param) {
    gIOSNativeResultMap[msgName] = null;
    webkit.messageHandlers[msgName].postMessage(param);
    for(var i=0; gIOSNativeResultMap[msgName]==null; i++) {
        await sleep(100);
        if(i==50) throw Error('api reponse not comming');
    }
    return gIOSNativeResultMap[msgName];
}

async function NativeCall(method, param) {
    if(isAndroid())  {
        return window.Pedometer[method](param);
    } else if(isIOS()) {
        return await iosNativeCaller(method, param);
    } else {
        throw Error('unhandled agent');
    }
}
