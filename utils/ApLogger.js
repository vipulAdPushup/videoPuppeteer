function logDataToLoggerService(eventName, data) {
    var endPoint = "https://aplogger.adpushup.com/log?pxRes=false&detectGeo=true";
    var strigifiedData = JSON.stringify({ event: eventName, data: data });
    if (strigifiedData === "{}") {
      strigifiedData = JSON.stringify(
        data,
        Object.getOwnPropertyNames({ event: eventName, data: data })
      );
    }
    var beaconResponse =
      window.navigator.sendBeacon &&
      window.navigator.sendBeacon(endPoint, strigifiedData);
    if (!beaconResponse) {
      var encodedPayload = window.btoa(JSON.stringify(data));
      const pixel = document.createElement("img");
      pixel.src = `https://aplogger.adpushup.com/log?detectGeo=true&event=${eventName}&data=${encodedPayload}`;
    }
}

module.exports = {logDataToLoggerService}