/**
 * @author Scott Covert
 * @date 10/13/16
 * @description A/B Test Helper
 */
({
    runABTest: function(component) {
        let action = component.get("c.runABTest");
        action.setParams({
            "experiment": component.get("v.Experiment"),
            "alternatives": component.get("v.Alternatives"),
            "forcedResult": component.get("v.ForcedResult"),
            "trafficFraction": component.get("v.TrafficFraction"),
            "clientId": component.get("v.ClientId")!=null ? component.get("v.ClientId") : (this.getClientCookie()!="" ? this.getClientCookie() : this.setClientCookie(this.getClientCookie)),
            "userAgent": this.getUserAgent()
        });
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS")
            {
                let abTestEvent = $A.get("e.c:ABTestRun");
                abTestEvent.setParams({ "Results" : response.getReturnValue() });
                abTestEvent.fire();
            }
            else if (state === "ERROR")
            {
                let errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    convertABTest: function(component, event) {
        let action = component.get("c.convertABTest");
        action.setParams({
            "experiment": event.getParam("Experiment"),
            "clientId": component.get("v.ClientId")!=null ? component.get("v.ClientId") : getCookie("ABTestClientId")
        });
        $A.enqueueAction(action);
    },
    getUserAgent: function() {
        return navigator.UserAgent;
    },
    generateClientId: function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },
    getClientCookie: function() {
        return this.getCookie("ABTestClientId");
    },
    setClientCookie: function(callback) {
        let clientId = this.generateClientId();
        this.setCookie("ABTestClientId",clientId,365);
        return callback;
    },
    getCookie: function(name) {
        let cName = name + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cName) == 0) {
                return c.substring(cName.length,c.length);
            }
        }
        return "";
    },
    setCookie: function(name,value,expDays) {
        let d = new Date();
        d.setTime(d.getTime() + (expDays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }
})