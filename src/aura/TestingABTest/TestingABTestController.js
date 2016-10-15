/**
 * @author Scott Covert
 * @date 10/14/16
 * @description Enter description here
 */
({
    handleABTestRun: function(component, event, helper) {
        component.set("v.test", event.getParam("Results"));
    }
})