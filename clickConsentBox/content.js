(function () {

    function buffer_full(event) {
        console.log("WARNING: Resource Timing Buffer is FULL!");
        var entries = performance.getEntriesByType('resource')
        performance.setResourceTimingBufferSize(entries.length + 250);
        console.log(entries.length)
    }
    function init() {
        // Set a callback if the resource buffer becomes filled
        performance.onresourcetimingbufferfull = buffer_full;
        scrollWithDist(100);
    }
    
    init();
    function test(){
        const allData = ["gamData"]
        const data = performance.getEntriesByType("resource");
        for(var i=0; i<data.length; i++){
            console.log("@extension=>",data[i].initiatorType);
            if(data[i].initiatorType == 'xmlhttprequest'){
                const url = window.location.href;
                if(data[i].name && data[i].name.includes('ads?')){
                    allData.push(`${data[i].name}@requestInitiator=${url}`);
                    console.log("@extension=>", data[i].name);
                }
            }   
        }
        window.top.postMessage(JSON.stringify(allData),  "*");
    }
    setInterval(test, 15000);
}());

function scrollWithDist(distance) {

    const delay = 100;
    const timeOut = 15000;
    window.scrollDirection = 1;

    setInterval(() => {
        document.scrollingElement.scrollBy(0, window.scrollDirection * distance);

        if ((document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) || (document.scrollingElement.scrollTop == 0 && window.scrollDirection == -1)) {
            window.scrollDirection *= -1;
        }
    }, delay);

    setInterval(() => {
        window.scrollDirection *= -1;
    }, timeOut)

}


