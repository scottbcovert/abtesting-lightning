/**
 * @author Scott Covert
 * @date 10/13/16
 * @description A/B Test Controller
 */
({
    doInit: function(component, event, helper) {
        // Run A/B test
        helper.runABTest(component);
    },
    handleABTestConversion: function(component, event, helper) {
        // Mark A/B test experiment(s) as converted
        helper.convertABTest(component, event);
    }
})